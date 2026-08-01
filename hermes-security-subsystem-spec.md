# Hermes Security Subsystem — Enterprise Architecture Specification (Part 4)

---

## 19. PostgreSQL Schema (continued)

```sql
-- Rotation policies (continued)
CREATE TABLE rotation_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'time_based',
    schedule VARCHAR(255),
    trigger_events JSONB NOT NULL DEFAULT '[]',
    grace_period VARCHAR(50) NOT NULL DEFAULT '24h',
    max_versions INTEGER NOT NULL DEFAULT 10,
    notify_before TEXT[] DEFAULT '{}',
    notification_channels JSONB NOT NULL DEFAULT '[]',
    auto_rotate BOOLEAN NOT NULL DEFAULT TRUE,
    rotation_function JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE INDEX idx_rotation_policies_tenant ON rotation_policies(tenant_id);
CREATE INDEX idx_rotation_policies_workspace ON rotation_policies(workspace_id);

-- Lease policies
CREATE TABLE lease_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    default_ttl VARCHAR(50) NOT NULL DEFAULT '1h',
    max_ttl VARCHAR(50) NOT NULL DEFAULT '24h',
    renewable BOOLEAN NOT NULL DEFAULT TRUE,
    renew_before_expiry VARCHAR(50) NOT NULL DEFAULT '15m',
    revoke_on_renewal_failure BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_lease_policies_tenant ON lease_policies(tenant_id);
CREATE INDEX idx_lease_policies_workspace ON lease_policies(workspace_id);

-- Leases
CREATE TABLE leases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_id UUID NOT NULL REFERENCES secrets(id) ON DELETE CASCADE,
    secret_version INTEGER NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    client_type VARCHAR(20) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    renewable BOOLEAN NOT NULL DEFAULT TRUE,
    renewed_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(255),
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_leases_secret ON leases(secret_id);
CREATE INDEX idx_leases_client ON leases(client_id, client_type);
CREATE INDEX idx_leases_expires ON leases(expires_at) WHERE revoked_at IS NULL;

-- Dynamic secrets
CREATE TABLE dynamic_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    lease_policy_id UUID NOT NULL REFERENCES lease_policies(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dynamic_secrets_tenant ON dynamic_secrets(tenant_id);
CREATE INDEX idx_dynamic_secrets_workspace ON dynamic_secrets(workspace_id);
CREATE INDEX idx_dynamic_secrets_vault ON dynamic_secrets(vault_id);

-- CAs
CREATE TABLE cas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'intermediate',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    certificate_id UUID NOT NULL,
    private_key_ref JSONB NOT NULL DEFAULT '{}',
    parent_ca_id UUID REFERENCES cas(id) ON DELETE SET NULL,
    path_length INTEGER,
    permitted_key_types TEXT[] DEFAULT '{}',
    permitted_ekus TEXT[] DEFAULT '{}',
    max_validity VARCHAR(50) NOT NULL DEFAULT '1y',
    ocsp_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    crl_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    crl_distribution_points TEXT[] DEFAULT '{}',
    ocsp_responders TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_cas_tenant ON cas(tenant_id);
CREATE INDEX idx_cas_workspace ON cas(workspace_id);
CREATE INDEX idx_cas_parent ON cas(parent_ca_id);

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ca_id UUID NOT NULL REFERENCES cas(id) ON DELETE CASCADE,
    serial_number VARCHAR(100) NOT NULL,
    subject JSONB NOT NULL DEFAULT '{}',
    issuer JSONB NOT NULL DEFAULT '{}',
    not_before TIMESTAMPTZ NOT NULL,
    not_after TIMESTAMPTZ NOT NULL,
    public_key JSONB NOT NULL DEFAULT '{}',
    signature_algorithm VARCHAR(50) NOT NULL,
    key_usage TEXT[] DEFAULT '{}',
    extended_key_usage TEXT[] DEFAULT '{}',
    san JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'valid',
    revoked_at TIMESTAMPTZ,
    revocation_reason VARCHAR(50),
    spiffe_id VARCHAR(500),
    private_key_ref JSONB,
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_certificates_ca_serial ON certificates(ca_id, serial_number);
CREATE INDEX idx_certificates_tenant ON certificates(tenant_id);
CREATE INDEX idx_certificates_workspace ON certificates(workspace_id);
CREATE INDEX idx_certificates_status ON certificates(status);
CREATE INDEX idx_certificates_expires ON certificates(not_after) WHERE status = 'valid';
CREATE INDEX idx_certificates_spiffe ON certificates(spiffe_id) WHERE spiffe_id IS NOT NULL;

-- Trust bundles
CREATE TABLE trust_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    certificates UUID[] DEFAULT '{}',
    spiffe_trust_domain VARCHAR(255),
    format VARCHAR(20) NOT NULL DEFAULT 'pem',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    checksum VARCHAR(64) NOT NULL
);

CREATE INDEX idx_trust_bundles_tenant ON trust_bundles(tenant_id);
CREATE INDEX idx_trust_bundles_workspace ON trust_bundles(workspace_id);

-- Revocation lists
CREATE TABLE revocation_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ca_id UUID NOT NULL REFERENCES cas(id) ON DELETE CASCADE,
    serial_numbers JSONB NOT NULL DEFAULT '[]',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_update TIMESTAMPTZ NOT NULL,
    signature TEXT NOT NULL,
    format VARCHAR(20) NOT NULL DEFAULT 'crl'
);

CREATE INDEX idx_revocation_lists_ca ON revocation_lists(ca_id);
CREATE INDEX idx_revocation_lists_next_update ON revocation_lists(next_update);

-- SPIFFE identities
CREATE TABLE spiffe_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    trust_domain VARCHAR(255) NOT NULL,
    workload_selector JSONB NOT NULL DEFAULT '{}',
    spiffe_id VARCHAR(500) NOT NULL UNIQUE,
    certificates UUID[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    rotated_at TIMESTAMPTZ,
    rotation_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_spiffe_identities_tenant ON spiffe_identities(tenant_id);
CREATE INDEX idx_spiffe_identities_workspace ON spiffe_identities(workspace_id);
CREATE INDEX idx_spiffe_identities_trust_domain ON spiffe_identities(trust_domain);

-- mTLS configs
CREATE TABLE mtls_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'permissive',
    client_validation VARCHAR(20) NOT NULL DEFAULT 'request',
    trust_bundles UUID[] DEFAULT '{}',
    cert_rotation_policy_id UUID REFERENCES rotation_policies(id),
    cipher_suites TEXT[] DEFAULT '{}',
    min_tls_version VARCHAR(10) NOT NULL DEFAULT '1.2',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mtls_configs_tenant ON mtls_configs(tenant_id);
CREATE INDEX idx_mtls_configs_workspace ON mtls_configs(workspace_id);

-- KMS keys
CREATE TABLE kms_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    provider VARCHAR(20) NOT NULL,
    provider_key_id VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'symmetric',
    algorithm VARCHAR(50) NOT NULL,
    usage TEXT[] DEFAULT '{}',
    origin VARCHAR(20) NOT NULL DEFAULT 'kms',
    status VARCHAR(20) NOT NULL DEFAULT 'enabled',
    deletion_date TIMESTAMPTZ,
    rotation_policy_id UUID REFERENCES key_rotation_policies(id),
    key_hierarchy_id UUID,
    tags JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_kms_keys_tenant ON kms_keys(tenant_id);
CREATE INDEX idx_kms_keys_workspace ON kms_keys(workspace_id);
CREATE INDEX idx_kms_keys_provider ON kms_keys(provider);
CREATE INDEX idx_kms_keys_status ON kms_keys(status);

-- Key rotation policies
CREATE TABLE key_rotation_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    schedule VARCHAR(255) NOT NULL,
    auto_rotate BOOLEAN NOT NULL DEFAULT TRUE,
    notify_before TEXT[] DEFAULT '{}',
    notification_channels JSONB NOT NULL DEFAULT '[]',
    key_types TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_key_rotation_policies_tenant ON key_rotation_policies(tenant_id);
CREATE INDEX idx_key_rotation_policies_workspace ON key_rotation_policies(workspace_id);

-- Encryption keys
CREATE TABLE encryption_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kms_key_id UUID NOT NULL REFERENCES kms_keys(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'data',
    algorithm VARCHAR(50) NOT NULL,
    key_spec JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_encryption_keys_tenant ON encryption_keys(tenant_id);
CREATE INDEX idx_encryption_keys_workspace ON encryption_keys(workspace_id);
CREATE INDEX idx_encryption_keys_kms ON encryption_keys(kms_key_id);

-- Key versions
CREATE TABLE key_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id UUID NOT NULL,
    key_type VARCHAR(20) NOT NULL,
    version INTEGER NOT NULL,
    material JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'current',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    destroyed_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX idx_key_versions_unique ON key_versions(key_id, key_type, version);
CREATE INDEX idx_key_versions_key ON key_versions(key_id, key_type);

-- Signing keys
CREATE TABLE signing_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kms_key_id UUID NOT NULL REFERENCES kms_keys(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose VARCHAR(20) NOT NULL DEFAULT 'jwt',
    algorithm VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_signing_keys_tenant ON signing_keys(tenant_id);
CREATE INDEX idx_signing_keys_workspace ON signing_keys(workspace_id);
CREATE INDEX idx_signing_keys_kms ON signing_keys(kms_key_id);

-- Access tokens
CREATE TABLE access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scopes TEXT[] DEFAULT '{}',
    claims JSONB NOT NULL DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(255),
    revocation_reason TEXT,
    token_type VARCHAR(10) NOT NULL DEFAULT 'Bearer',
    dpop_proof JSONB
);

CREATE INDEX idx_access_tokens_tenant ON access_tokens(tenant_id);
CREATE INDEX idx_access_tokens_workspace ON access_tokens(workspace_id);
CREATE INDEX idx_access_tokens_subject ON access_tokens(subject_type, subject_id);
CREATE INDEX idx_access_tokens_expires ON access_tokens(expires_at) WHERE revoked_at IS NULL;

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    access_token_id UUID NOT NULL REFERENCES access_tokens(id) ON DELETE CASCADE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scopes TEXT[] DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(255),
    revocation_reason TEXT,
    rotation_count INTEGER NOT NULL DEFAULT 0,
    parent_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    device_id VARCHAR(255)
);

CREATE INDEX idx_refresh_tokens_access_token ON refresh_tokens(access_token_id);
CREATE INDEX idx_refresh_tokens_subject ON refresh_tokens(subject_type, subject_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE revoked_at IS NULL;

-- ID tokens
CREATE TABLE id_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    claims JSONB NOT NULL DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    nonce VARCHAR(255),
    at_hash VARCHAR(64),
    c_hash VARCHAR(64)
);

CREATE INDEX idx_id_tokens_tenant ON id_tokens(tenant_id);
CREATE INDEX idx_id_tokens_subject ON id_tokens(subject_type, subject_id);
CREATE INDEX idx_id_tokens_expires ON id_tokens(expires_at);

-- Audit events (partitioned by time)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    principal_id VARCHAR(255) NOT NULL,
    principal_type VARCHAR(20) NOT NULL,
    action VARCHAR(255) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id UUID NOT NULL,
    resource_type VARCHAR(50),
    before JSONB,
    after JSONB,
    outcome VARCHAR(20) NOT NULL DEFAULT 'success',
    error TEXT,
    trace_id UUID NOT NULL DEFAULT gen_random_uuid(),
    span_id UUID,
    ip_address INET,
    user_agent TEXT,
    geo_location JSONB,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
    compliance_tags TEXT[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    integrity_hash CHAR(64) NOT NULL,
    previous_hash CHAR(64) NOT NULL
) PARTITION BY RANGE (timestamp);

CREATE TABLE audit_events_2024_01 PARTITION OF audit_events FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE audit_events_2024_02 PARTITION OF audit_events FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE INDEX idx_audit_events_tenant ON audit_events(tenant_id);
CREATE INDEX idx_audit_events_workspace ON audit_events(workspace_id);
CREATE INDEX idx_audit_events_principal ON audit_events(principal_id);
CREATE INDEX idx_audit_events_resource ON audit_events(resource, resource_id);
CREATE INDEX idx_audit_events_timestamp ON audit_events(timestamp DESC);
CREATE INDEX idx_audit_events_action ON audit_events(action);
CREATE INDEX idx_audit_events_trace ON audit_events(trace_id);
CREATE INDEX idx_audit_events_risk ON audit_events(risk_level);

-- Integrity chains
CREATE TABLE integrity_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE SET NULL,
    start_event_id UUID NOT NULL REFERENCES audit_events(id),
    end_event_id UUID NOT NULL REFERENCES audit_events(id),
    start_hash CHAR(64) NOT NULL,
    end_hash CHAR(64) NOT NULL,
    event_count BIGINT NOT NULL DEFAULT 0,
    merkle_root CHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_integrity_chains_tenant ON integrity_chains(tenant_id);
CREATE INDEX idx_integrity_chains_workspace ON integrity_chains(workspace_id);

-- Compliance frameworks
CREATE TABLE compliance_frameworks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    controls JSONB NOT NULL DEFAULT '[]',
    required BOOLEAN NOT NULL DEFAULT FALSE,
    scope VARCHAR(20) NOT NULL DEFAULT 'global',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_compliance_frameworks_tenant ON compliance_frameworks(tenant_id);

-- Controls
CREATE TABLE controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    identifier VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    requirement TEXT NOT NULL,
    test_procedure TEXT NOT NULL,
    evidence_types TEXT[] DEFAULT '{}',
    automated BOOLEAN NOT NULL DEFAULT FALSE,
    frequency VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium'
);

CREATE INDEX idx_controls_framework ON controls(framework_id);

-- Evidence
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    source VARCHAR(500) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    collected_by VARCHAR(255) NOT NULL,
    integrity_hash CHAR(64) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_evidence_control ON evidence(control_id);
CREATE INDEX idx_evidence_type ON evidence(type);

-- Assessments
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'planned',
    scope JSONB NOT NULL DEFAULT '{}',
    findings JSONB NOT NULL DEFAULT '[]',
    overall_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL
);

CREATE INDEX idx_assessments_tenant ON assessments(tenant_id);
CREATE INDEX idx_assessments_framework ON assessments(framework_id);
CREATE INDEX idx_assessments_status ON assessments(status);

-- Compliance reports
CREATE TABLE compliance_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    period JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'draft',
    summary JSONB NOT NULL DEFAULT '{}',
    sections JSONB NOT NULL DEFAULT '[]',
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    generated_by UUID NOT NULL,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ
);

CREATE INDEX idx_compliance_reports_tenant ON compliance_reports(tenant_id);
CREATE INDEX idx_compliance_reports_assessment ON compliance_reports(assessment_id);

-- Threats
CREATE TABLE threats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    title VARCHAR(500) NOT NULL,
    description TEXT,
    source JSONB NOT NULL DEFAULT '{}',
    indicators JSONB NOT NULL DEFAULT '[]',
    mitre_attack JSONB NOT NULL DEFAULT '[]',
    affected_entities JSONB NOT NULL DEFAULT '[]',
    risk_score NUMERIC(5,2) NOT NULL DEFAULT 0,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    assigned_to UUID REFERENCES users(id),
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_threats_tenant ON threats(tenant_id);
CREATE INDEX idx_threats_workspace ON threats(workspace_id);
CREATE INDEX idx_threats_status ON threats(status);
CREATE INDEX idx_threats_severity ON threats(severity);
CREATE INDEX idx_threats_detected ON threats(detected_at DESC);

-- Anomalies
CREATE TABLE anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT,
    baseline JSONB NOT NULL DEFAULT '{}',
    observed JSONB NOT NULL DEFAULT '{}',
    deviation NUMERIC(10,4) NOT NULL,
    confidence NUMERIC(5,2) NOT NULL,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    related_entities UUID[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_anomalies_tenant ON anomalies(tenant_id);
CREATE INDEX idx_anomalies_workspace ON anomalies(workspace_id);
CREATE INDEX idx_anomalies_type ON anomalies(type);
CREATE INDEX idx_anomalies_detected ON anomalies(detected_at DESC);

-- Security alerts
CREATE TABLE security_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    threat_id UUID REFERENCES threats(id) ON DELETE SET NULL,
    anomaly_id UUID REFERENCES anomalies(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'firing',
    source VARCHAR(20) NOT NULL DEFAULT 'threat_detection',
    rule_id VARCHAR(255),
    labels JSONB NOT NULL DEFAULT '{}',
    annotations JSONB NOT NULL DEFAULT '{}',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    fingerprint CHAR(64) NOT NULL
);

CREATE INDEX idx_security_alerts_tenant ON security_alerts(tenant_id);
CREATE INDEX idx_security_alerts_workspace ON security_alerts(workspace_id);
CREATE INDEX idx_security_alerts_status ON security_alerts(status);
CREATE INDEX idx_security_alerts_fingerprint ON security_alerts(fingerprint);
CREATE INDEX idx_security_alerts_starts ON security_alerts(starts_at DESC);

-- Security incidents
CREATE TABLE security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    alert_ids UUID[] DEFAULT '{}',
    threat_ids UUID[] DEFAULT '{}',
    title VARCHAR(500) NOT NULL,
    description TEXT,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    phase VARCHAR(20) NOT NULL DEFAULT 'detection',
    commander UUID REFERENCES users(id),
    responders UUID[] DEFAULT '{}',
    timeline JSONB NOT NULL DEFAULT '[]',
    impact JSONB NOT NULL DEFAULT '{}',
    root_cause TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE INDEX idx_security_incidents_tenant ON security_incidents(tenant_id);
CREATE INDEX idx_security_incidents_workspace ON security_incidents(workspace_id);
CREATE INDEX idx_security_incidents_status ON security_incidents(status);

-- Approval requests
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    requester UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    steps JSONB NOT NULL DEFAULT '[]',
    current_step INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    decided_at TIMESTAMPTZ,
    decided_by UUID REFERENCES users(id),
    decision VARCHAR(20),
    comments JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approval_requests_tenant ON approval_requests(tenant_id);
CREATE INDEX idx_approval_requests_workspace ON approval_requests(workspace_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_requester ON approval_requests(requester);

-- Recertifications
CREATE TABLE recertifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    scope JSONB NOT NULL DEFAULT '{}',
    schedule JSONB NOT NULL DEFAULT '{}',
    reviewers UUID[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ
);

CREATE INDEX idx_recertifications_tenant ON recertifications(tenant_id);
CREATE INDEX idx_recertifications_workspace ON recertifications(workspace_id);
CREATE INDEX idx_recertifications_status ON recertifications(status);

-- Identity providers
CREATE TABLE identity_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'testing',
    configuration JSONB NOT NULL DEFAULT '{}',
    attribute_mapping JSONB NOT NULL DEFAULT '{}',
    provisioning JSONB NOT NULL DEFAULT '{}',
    domains TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ,
    last_sync_status VARCHAR(20)
);

CREATE INDEX idx_identity_providers_tenant ON identity_providers(tenant_id);
CREATE INDEX idx_identity_providers_workspace ON identity_providers(workspace_id);
CREATE INDEX idx_identity_providers_type ON identity_providers(type);

-- Sync jobs
CREATE TABLE sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_provider_id UUID NOT NULL REFERENCES identity_providers(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'incremental',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    stats JSONB NOT NULL DEFAULT '{}',
    errors JSONB NOT NULL DEFAULT '[]',
    triggered_by VARCHAR(20) NOT NULL DEFAULT 'schedule'
);

CREATE INDEX idx_sync_jobs_idp ON sync_jobs(identity_provider_id);
CREATE INDEX idx_sync_jobs_status ON sync_jobs(status);

-- Rate limit rules
CREATE TABLE rate_limit_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope JSONB NOT NULL DEFAULT '{}',
    algorithm VARCHAR(20) NOT NULL DEFAULT 'sliding_window',
    limit BIGINT NOT NULL,
    window VARCHAR(50) NOT NULL,
    key_extractor JSONB NOT NULL DEFAULT '{}',
    action VARCHAR(20) NOT NULL DEFAULT 'reject',
    response_headers BOOLEAN NOT NULL DEFAULT TRUE,
    bypass_conditions JSONB NOT NULL DEFAULT '[]',
    priority INTEGER NOT NULL DEFAULT 0,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rate_limit_rules_tenant ON rate_limit_rules(tenant_id);
CREATE INDEX idx_rate_limit_rules_workspace ON rate_limit_rules(workspace_id);
CREATE INDEX idx_rate_limit_rules_enabled ON rate_limit_rules(enabled) WHERE enabled = TRUE;

-- Quotas
CREATE TABLE quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource VARCHAR(255) NOT NULL,
    limit BIGINT NOT NULL,
    period VARCHAR(20) NOT NULL DEFAULT 'monthly',
    current_usage BIGINT NOT NULL DEFAULT 0,
    reset_at TIMESTAMPTZ NOT NULL,
    warning_threshold NUMERIC(5,2) NOT NULL DEFAULT 80,
    critical_threshold NUMERIC(5,2) NOT NULL DEFAULT 95,
    actions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotas_tenant ON quotas(tenant_id);
CREATE INDEX idx_quotas_workspace ON quotas(workspace_id);
CREATE INDEX idx_quotas_reset ON quotas(reset_at);

-- Updated at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_identities_updated_at BEFORE UPDATE ON identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_accounts_updated_at BEFORE UPDATE ON service_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machine_identities_updated_at BEFORE UPDATE ON machine_identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mfa_devices_updated_at BEFORE UPDATE ON mfa_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policy_bindings_updated_at BEFORE UPDATE ON policy_bindings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_role_bindings_updated_at BEFORE UPDATE ON role_bindings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delegations_updated_at BEFORE UPDATE ON delegations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_reviews_updated_at BEFORE UPDATE ON access_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recertifications_updated_at BEFORE UPDATE ON recertifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON vaults FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON secrets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rotation_policies_updated_at BEFORE UPDATE ON rotation_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lease_policies_updated_at BEFORE UPDATE ON lease_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dynamic_secrets_updated_at BEFORE UPDATE ON dynamic_secrets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cas_updated_at BEFORE UPDATE ON cas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_bundles_updated_at BEFORE UPDATE ON trust_bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mtls_configs_updated_at BEFORE UPDATE ON mtls_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kms_keys_updated_at BEFORE UPDATE ON kms_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_rotation_policies_updated_at BEFORE UPDATE ON key_rotation_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_encryption_keys_updated_at BEFORE UPDATE ON encryption_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signing_keys_updated_at BEFORE UPDATE ON signing_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_tokens_updated_at BEFORE UPDATE ON access_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_refresh_tokens_updated_at BEFORE UPDATE ON refresh_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_id_tokens_updated_at BEFORE UPDATE ON id_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_identity_providers_updated_at BEFORE UPDATE ON identity_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sync_jobs_updated_at BEFORE UPDATE ON sync_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_limit_rules_updated_at BEFORE UPDATE ON rate_limit_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotas_updated_at BEFORE UPDATE ON quotas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON compliance_frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_reports_updated_at BEFORE UPDATE ON compliance_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_threats_updated_at BEFORE UPDATE ON threats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_anomalies_updated_at BEFORE UPDATE ON anomalies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_alerts_updated_at BEFORE UPDATE ON security_alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_security_incidents_updated_at BEFORE UPDATE ON security_incidents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_requests_updated_at BEFORE UPDATE ON approval_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recertifications_updated_at BEFORE UPDATE ON recertifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hermes_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hermes_app;
GRANT USAGE ON SCHEMA public TO hermes_app;
```

---

## 20. Background Workers

| Worker | Schedule | Purpose |
|--------|----------|---------|
| **Provisioner** | Continuous | JIT user provisioning from IdPs |
| **Syncer** | Every 5m | Full/incremental IdP synchronization |
| **Deprovisioner** | On event | User offboarding, access revocation |
| **SessionManager** | Continuous | Session creation, extension, revocation |
| **RiskScorer** | Per auth | Real-time risk assessment |
| **MFAManager** | Continuous | MFA device lifecycle, challenges |
| **PermissionResolver** | Continuous | AuthZ decision caching, invalidation |
| **RoleManager** | On change | Role hierarchy, inheritance updates |
| **PolicyCompiler** | On change | Policy compilation, optimization |
| **PolicySimulator** | On request | Pre-deployment simulation |
| **PolicyTester** | CI/CD | Automated policy testing |
| **RotationWorker** | Per schedule | Secret/key/cert rotation |
| **LeaseManager** | Every 1m | Lease renewal, expiry, revocation |
| **DynamicSecretGenerator** | On demand | Dynamic secret credential generation |
| **CAManager** | Continuous | CA lifecycle, health monitoring |
| **RenewalWorker** | 6h before expiry | Certificate renewal |
| **RevocationWorker** | On event | Certificate revocation, CRL/OCSP publishing |
| **TrustBundleBuilder** | On change | Trust bundle generation, distribution |
| **KeyRotationWorker** | Per schedule | KMS key rotation |
| **KeyDerivationWorker** | On demand | Data key derivation from hierarchy |
| **SigningWorker** | On request | Signing operations |
| **TokenIssuer** | Continuous | JWT issuance |
| **TokenValidator** | Continuous | JWT validation, introspection |
| **JWKSManager** | On rotation | JWKS generation, rotation |
| **SessionCleaner** | Every 5m | Expired/idle session cleanup |
| **DeviceTracker** | Continuous | Device fingerprinting, trust |
| **RiskEvaluator** | Continuous | Session risk reassessment |
| **AuditLogger** | Continuous | Immutable audit event writing |
| **IntegrityVerifier** | Hourly | Integrity chain verification |
| **ComplianceExporter** | Daily | Compliance report generation |
| **AnomalyDetector** | Continuous | Behavioral anomaly detection |
| **RiskScorer** | Continuous | Entity risk scoring |
| **CorrelationEngine** | Continuous | Event correlation, threat building |
| **AlertGenerator** | Continuous | Alert firing, grouping, routing |
| **EvidenceCollector** | On assessment | Automated evidence gathering |
| **ReportGenerator** | On assessment | Compliance report generation |
| **FrameworkMapper** | Continuous | Control-to-evidence mapping |
| **ApprovalCoordinator** | Continuous | Approval workflow orchestration |
| **ReviewScheduler** | Per schedule | Access review scheduling |
| **EscalationEngine** | Continuous | Approval/incident escalation |
| **WorkloadProvisioner** | On deploy | Machine identity provisioning |
| **SPIFFEManager** | Continuous | SPIFFE ID lifecycle |
| **mTLSConfigurator** | On change | mTLS config distribution |
| **IdPManager** | Continuous | IdP config, health monitoring |
| **IdentityLinker** | On auth | External identity linking |
| **JITProvisioner** | On first auth | Just-in-time user creation |
| **QuotaEnforcer** | Continuous | Quota tracking, enforcement |
| **AbuseDetector** | Every 5m | Credential stuffing, scraping detection |
| **LimitAdjuster** | On anomaly | Dynamic rate limit adjustment |

---

## 21. Repository Structure

```
hermes-security/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd.yml
│   │   ├── security.yml
│   │   ├── dependency-update.yml
│   │   └── release.yml
│   ├── ISSUE_TEMPLATE/
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .vscode/
│   ├── settings.json
│   ├── launch.json
│   └── extensions.json
│
├── .husky/
│   ├── pre-commit
│   └── commit-msg
│
├── scripts/
│   ├── build.sh
│   ├── test.sh
│   ├── lint.sh
│   ├── migrate.sh
│   ├── deploy.sh
│   ├── benchmark.sh
│   └── chaos.sh
│
├── docker/
│   ├── docker-compose.yml
│   ├── docker-compose.prod.yml
│   ├── docker-compose.dev.yml
│   ├── Dockerfile.identity
│   ├── Dockerfile.authn
│   ├── Dockerfile.authz
│   ├── Dockerfile.policy
│   ├── Dockerfile.secrets
│   ├── Dockerfile.certs
│   ├── Dockerfile.keys
│   ├── Dockerfile.tokens
│   ├── Dockerfile.sessions
│   ├── Dockerfile.audit
│   ├── Dockerfile.threats
│   ├── Dockerfile.compliance
│   ├── Dockerfile.approvals
│   ├── Dockerfile.federation
│   ├── Dockerfile.ratelimit
│   ├── Dockerfile.gateway
│   ├── nginx.conf
│   └── k8s/
│       ├── base/
│       ├── overlays/
│       │   ├── dev/
│       │   ├── staging/
│       │   └── prod/
│       ├── helm/
│       └── kustomization.yaml
│
├── packages/
│   ├── core/
│   │   ├── domain/
│   │   ├── events/
│   │   ├── value-objects/
│   │   ├── policies/
│   │   └── exceptions/
│   │
│   ├── identity/
│   │   ├── user/
│   │   ├── group/
│   │   ├── service-account/
│   │   ├── machine-identity/
│   │   ├── provisioning/
│   │   ├── federation/
│   │   └── handlers/
│   │
│   ├── authentication/
│   │   ├── password/
│   │   ├── oidc/
│   │   ├── saml/
│   │   ├── ldap/
│   │   ├── webauthn/
│   │   ├── magic-link/
│   │   ├── mfa/
│   │   ├── session/
│   │   ├── device/
│   │   ├── risk/
│   │   └── handlers/
│   │
│   ├── authorization/
│   │   ├── rbac/
│   │   ├── abac/
│   │   ├── pbac/
│   │   ├── permissions/
│   │   ├── roles/
│   │   ├── bindings/
│   │   ├── delegations/
│   │   ├── reviews/
│   │   ├── recertification/
│   │   └── handlers/
│   │
│   ├── policy/
│   │   ├── engine/
│   │   ├── compiler/
│   │   ├── evaluator/
│   │   ├── simulator/
│   │   ├── tester/
│   │   ├── versioning/
│   │   └── handlers/
│   │
│   ├── secrets/
│   │   ├── vault/
│   │   ├── lifecycle/
│   │   ├── rotation/
│   │   ├── leases/
│   │   ├── dynamic/
│   │   ├── access/
│   │   └── handlers/
│   │
│   ├── certificates/
│   │   ├── pki/
│   │   ├── ca/
│   │   ├── issuance/
│   │   ├── renewal/
│   │   ├── revocation/
│   │   ├── trust-bundles/
│   │   ├── spiffe/
│   │   ├── mtls/
│   │   └── handlers/
│   │
│   ├── keys/
│   │   ├── kms/
│   │   ├── encryption/
│   │   ├── signing/
│   │   ├── hierarchy/
│   │   ├── rotation/
│   │   ├── envelope/
│   │   └── handlers/
│   │
│   ├── tokens/
│   │   ├── issuance/
│   │   ├── validation/
│   │   ├── jwks/
│   │   ├── exchange/
│   │   ├── introspection/
│   │   ├── dpop/
│   │   └── handlers/
│   │
│   ├── sessions/
│   │   ├── lifecycle/
│   │   ├── device/
│   │   ├── concurrent/
│   │   ├── risk/
│   │   └── handlers/
│   │
│   ├── audit/
│   │   ├── logging/
│   │   ├── integrity/
│   │   ├── export/
│   │   ├── retention/
│   │   └── handlers/
│   │
│   ├── threats/
│   │   ├── detection/
│   │   ├── anomalies/
│   │   ├── risk/
│   │   ├── alerts/
│   │   ├── incidents/
│   │   ├── correlation/
│   │   ├── intel/
│   │   └── handlers/
│   │
│   ├── compliance/
│   │   ├── frameworks/
│   │   ├── controls/
│   │   ├── assessments/
│   │   ├── evidence/
│   │   ├── reports/
│   │   ├── continuous/
│   │   └── handlers/
│   │
│   ├── approvals/
│   │   ├── requests/
│   │   ├── delegations/
│   │   ├── recertification/
│   │   ├── escalation/
│   │   └── handlers/
│   │
│   ├── federation/
│   │   ├── idp/
│   │   ├── saml/
│   │   ├── oidc/
│   │   ├── ldap/
│   │   ├── scim/
│   │   ├── jit/
│   │   └── handlers/
│   │
│   ├── ratelimit/
│   │   ├── rules/
│   │   ├── quotas/
│   │   ├── enforcement/
│   │   ├── abuse/
│   │   └── handlers/
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── cache/
│   │   ├── queue/
│   │   ├── storage/
│   │   ├── kms/
│   │   ├── vault/
│   │   ├── hsm/
│   │   ├── config/
│   │   ├── observability/
│   │   ├── security/
│   │   └── migrations/
│   │
│   ├── api/
│   │   ├── grpc/
│   │   ├── rest/
│   │   ├── websocket/
│   │   ├── validation/
│   │   └── middleware/
│   │
│   ├── admin/
│   │   ├── tenants/
│   │   ├── workspaces/
│   │   ├── policies/
│   │   ├── backups/
│   │   ├── monitoring/
│   │   ├── migrations/
│   │   └── cli/
│   │
│   ├── integrations/
│   │   ├── oidc/
│   │   ├── saml/
│   │   ├── ldap/
│   │   ├── scim/
│   │   ├── aws-kms/
│   │   ├── gcp-kms/
│   │   ├── azure-kv/
│   │   ├── hashicorp-vault/
│   │   ├── thales-hsm/
│   │   ├── splunk/
│   │   ├── elastic/
│   │   ├── sentinel/
│   │   ├── datadog/
│   │   ├── crowdstrike/
│   │   └── ct-logs/
│   │
│   ├── testing/
│   │   ├── fixtures/
│   │   ├── mocks/
│   │   ├── contracts/
│   │   ├── property/
│   │   ├── chaos/
│   │   └── load/
│   │
│   └── shared/
│       ├── types/
│       ├── utils/
│       ├── constants/
│       ├── errors/
│       └── validation/
│
├── apps/
│   ├── identity-service/
│   ├── authentication-service/
│   ├── authorization-service/
│   ├── policy-engine/
│   ├── secrets-service/
│   ├── certificate-service/
│   ├── key-service/
│   ├── token-service/
│   ├── session-service/
│   ├── audit-service/
│   ├── threat-detection-service/
│   ├── compliance-service/
│   ├── approval-service/
│   ├── federation-service/
│   ├── rate-limit-service/
│   ├── machine-identity-service/
│   └── api-gateway/
│
├── workers/
│   ├── provisioner/
│   ├── syncer/
│   ├── deprovisioner/
│   ├── session-manager/
│   ├── risk-scorer/
│   ├── mfa-manager/
│   ├── permission-resolver/
│   ├── role-manager/
│   ├── policy-compiler/
│   ├── policy-simulator/
│   ├── policy-tester/
│   ├── rotation-worker/
│   ├── lease-manager/
│   ├── dynamic-secret-generator/
│   ├── ca-manager/
│   ├── renewal-worker/
│   ├── revocation-worker/
│   ├── trust-bundle-builder/
│   ├── key-rotation-worker/
│   ├── key-derivation-worker/
│   ├── signing-worker/
│   ├── token-issuer/
│   ├── token-validator/
│   ├── jwks-manager/
│   ├── session-cleaner/
│   ├── device-tracker/
│   ├── risk-evaluator/
│   ├── audit-logger/
│   ├── integrity-verifier/
│   ├── compliance-exporter/
│   ├── anomaly-detector/
│   ├── risk-scorer/
│   ├── correlation-engine/
│   ├── alert-generator/
│   ├── evidence-collector/
│   ├── report-generator/
│   ├── framework-mapper/
│   ├── approval-coordinator/
│   ├── review-scheduler/
│   ├── escalation-engine/
│   ├── workload-provisioner/
│   ├── spiffe-manager/
│   ├── mtls-configurator/
│   ├── idp-manager/
│   ├── identity-linker/
│   ├── jit-provisioner/
│   ├── quota-enforcer/
│   ├── abuse-detector/
│   └── limit-adjuster/
│
├── sdk/
│   ├── typescript/
│   ├── python/
│   ├── go/
│   └── rust/
│
├── deployment/
│   ├── kubernetes/
│   ├── docker/
│   ├── terraform/
│   ├── ansible/
│   └── helm/
│
├── turbo.json
├── package.json
├── tsconfig.base.json
├── nx.json
├── .eslintrc.js
├── .prettierrc
├── jest.config.ts
├── README.md
├── CONTRIBUTING.md
├── LICENSE
└── CHANGELOG.md
```

---

## 22. Performance

### 22.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **AuthN Latency (P99)** | < 100ms | Password, OIDC, SAML |
| **AuthZ Latency (P99)** | < 10ms | Policy decision |
| **Token Validation (P99)** | < 5ms | JWT validation |
| **Session Lookup (P99)** | < 2ms | Redis cache hit |
| **Secret Read (P99)** | < 50ms | Vault read |
| **Cert Issuance (P99)** | < 500ms | Intermediate CA |
| **Key Encryption (P99)** | < 20ms | KMS/HSM |
| **Audit Write (P99)** | < 10ms | Async batch |
| **Policy Compile (P99)** | < 1s | Complex policies |
| **Sync Job (full)** | < 30min | 100k users |

### 22.2 Caching Strategy

| Cache | Technology | TTL | Invalidation |
|-------|------------|-----|--------------|
| **AuthZ Decisions** | Redis Cluster | 30s | Event-driven |
| **JWKS** | Redis Cluster | 1h | Key rotation |
| **Session Data** | Redis Cluster | Session TTL | Revocation event |
| **Policy Compiled** | In-memory | 1h | Policy change |
| **User/Group** | Redis Cluster | 5m | Identity change |
| **Rate Limit Counters** | Redis Cluster | Window TTL | Window expiry |
| **Risk Scores** | Redis Cluster | 15m | Risk recalculation |
| **Certificate Chain** | Redis Cluster | 24h | Cert renewal/revocation |

### 22.3 Horizontal Scaling

```typescript
interface ScalingStrategy {
  // Stateless services (scale by CPU/latency)
  stateless: {
    identity: { min: 3, max: 50, metric: 'cpu' };
    authn: { min: 3, max: 100, metric: 'latency' };
    authz: { min: 3, max: 50, metric: 'cpu' };
    policy: { min: 2, max: 20, metric: 'queue' };
    tokens: { min: 3, max: 50, metric: 'cpu' };
    sessions: { min: 3, max: 50, metric: 'cpu' };
    threats: { min: 3, max: 30, metric: 'cpu' };
    approvals: { min: 2, max: 20, metric: 'cpu' };
    federation: { min: 2, max: 20, metric: 'cpu' };
    ratelimit: { min: 3, max: 50, metric: 'cpu' };
  };
  
  // Stateful services (scale with care)
  stateful: {
    secrets: { replicas: 3, ha: true };
    certificates: { replicas: 3, ha: true };
    keys: { replicas: 3, ha: true };
    audit: { replicas: 3, ha: true };
  };
  
  // Workers (scale by queue depth)
  workers: {
    rotation: { min: 2, max: 20, metric: 'queue' };
    renewal: { min: 2, max: 10, metric: 'queue' };
    sync: { min: 1, max: 10, metric: 'queue' };
    anomaly: { min: 3, max: 30, metric: 'cpu' };
    correlation: { min: 2, max: 20, metric: 'queue' };
    evidence: { min: 2, max: 10, metric: 'queue' };
    escalation: { min: 2, max: 20, metric: 'queue' };
    provisioner: { min: 2, max: 20, metric: 'queue' };
    abuse: { min: 2, max: 20, metric: 'queue' };
  };
}
```

### 22.4 High Availability

| Component | HA Strategy | RTO | RPO |
|-----------|-------------|-----|-----|
| **PostgreSQL** | Multi-AZ, synchronous replication, Patroni | < 30s | 0 |
| **Redis** | Cluster mode, 3 masters, replicas | < 10s | < 1s |
| **Kafka** | ISR, min.insync.replicas=2 | < 30s | 0 |
| **Vault** | Integrated storage, HA mode | < 30s | 0 |
| **KMS/HSM** | Multi-AZ, active-active | < 1m | 0 |
| **Object Storage** | Multi-region, versioning | < 1m | 0 |

### 22.5 Disaster Recovery

| Scenario | Recovery Plan | Validation |
|----------|---------------|------------|
| **Region Failure** | Failover to secondary region, DNS update | Monthly DR test |
| **Database Corruption** | Point-in-time recovery from WAL | Weekly PITR test |
| **Key Compromise** | Emergency key rotation, re-encryption | Quarterly key ceremony |
| **CA Compromise** | Root CA offline, intermediate revocation | Annual CA exercise |
| **Ransomware** | Immutable backups, air-gapped recovery | Quarterly restore test |

---

## 23. Integration Points

### 23.1 Subsystem Integration Matrix

| Subsystem | Consumes From Security | Provides To Security |
|-----------|------------------------|---------------------|
| **Hermes Core** | Tenant/workspace context, feature flags | AuthN/AuthZ for platform APIs |
| **Automation** | Workflow execution identity, secrets, certs | Workflow authZ, approval requests |
| **Agents** | Agent identity, tool permissions, session | Agent authN, tool authZ |
| **Models** | Model inference identity, API keys | Model access control |
| **Memory & Knowledge** | Query identity, index permissions | Search authZ |
| **MCP** | Server identity, tool permissions | MCP authZ, mTLS |
| **Plugins** | Plugin identity, execution permissions | Plugin sandbox authZ |
| **Skills** | Skill identity, execution permissions | Skill execution authZ |
| **Observability** | All security events, audit logs | Security dashboards, alerts |
| **Machine Control** | System identity, deployment permissions | Deployment authZ |
| **Chat** | User identity, session management | Chat authN/AuthZ |
| **Organization** | Tenant/workspace hierarchy | Org-level policies |

### 23.2 Security SDK Usage

```typescript
// Every subsystem uses the Security SDK
import { SecurityClient } from '@hermes/security-sdk';

const security = new SecurityClient({
  endpoint: 'https://security.hermes.io',
  tenantId: 'tenant-uuid',
  workspaceId: 'workspace-uuid',
  credentials: process.env.SERVICE_ACCOUNT_KEY
});

// Authentication
const tokens = await security.authenticate.password(email, password);
const tokens = await security.authenticate.oidc(provider, code);
const tokens = await security.authenticate.webauthn(credential);
const tokens = await security.authenticate.serviceAccount(keyId, keySecret);

// Authorization
const allowed = await security.authorize.check({
  subject: { type: 'user', id: userId },
  resource: { type: 'workflow', id: workflowId },
  action: 'execute'
});

// Secrets
const secret = await security.secrets.read('db-password');
const creds = await security.secrets.generateDynamic('database', 'readonly');

// Certificates
const cert = await security.certificates.issue({
  profile: 'workload-mtls',
  spiffeId: 'spiffe://hermes.prod/workflow/order-processing'
});

// Keys
const encrypted = await security.keys.envelopeEncrypt(data, {
  tenantId: 'tenant-uuid',
  resourceType: 'workflow',
  resourceId: 'workflow-uuid'
});

// Audit
await security.audit.log({
  action: 'workflow.execute',
  resource: 'workflow',
  resourceId: workflowId,
  outcome: 'success'
});
```

---

## 24. Production Readiness

### 24.1 Checklist

| Category | Item | Status |
|----------|------|--------|
| **Architecture** | Layered architecture documented | ✅ |
| **Architecture** | Service boundaries defined | ✅ |
| **Architecture** | Event-driven, CQRS/ES patterns | ✅ |
| **Architecture** | Multi-provider abstractions | ✅ |
| **Domain Model** | All entities with branded IDs | ✅ |
| **Domain Model** | ER diagrams complete | ✅ |
| **Domain Model** | Aggregates & value objects | ✅ |
| **Domain Model** | Domain events catalogued | ✅ |
| **Services** | 16 core services defined | ✅ |
| **Services** | 50+ workers catalogued | ✅ |
| **Services** | Dependency graph documented | ✅ |
| **Authentication** | All protocols (OIDC/SAML/LDAP/WebAuthn) | ✅ |
| **Authentication** | MFA (TOTP/WebAuthn/Push/SMS/Email) | ✅ |
| **Authentication** | Risk-based auth, device trust | ✅ |
| **Authorization** | RBAC/ABAC/PBAC | ✅ |
| **Authorization** | Hierarchical roles, inheritance | ✅ |
| **Authorization** | Delegation, access reviews | ✅ |
| **Policy Engine** | OPA/Cedar, compilation, simulation | ✅ |
| **Policy Engine** | Decision caching, testing | ✅ |
| **Secrets** | Vault integration, dynamic secrets | ✅ |
| **Secrets** | Rotation, leases, versioning | ✅ |
| **Certificates** | Full PKI, SPIFFE, mTLS | ✅ |
| **Certificates** | Renewal, revocation, trust bundles | ✅ |
| **Keys** | KMS/HSM, envelope encryption | ✅ |
| **Keys** | Rotation, hierarchy, signing | ✅ |
| **Tokens** | JWT/JWKS, DPoP, exchange | ✅ |
| **Sessions** | Device trust, concurrent limits | ✅ |
| **Audit** | Immutable logs, integrity chains | ✅ |
| **Audit** | Compliance frameworks, evidence | ✅ |
| **Threats** | MITRE ATT&CK, anomaly detection | ✅ |
| **Threats** | Correlation, automated response | ✅ |
| **Approvals** | Workflows, recertification | ✅ |
| **Federation** | OIDC/SAML/LDAP/SCIM, JIT | ✅ |
| **Rate Limiting** | Multi-algorithm, abuse detection | ✅ |
| **APIs** | REST, WebSocket, streaming | ✅ |
| **TypeScript** | Complete interfaces, branded IDs | ✅ |
| **PostgreSQL** | Normalized schema, partitions | ✅ |
| **Background** | 50+ workers, schedules | ✅ |
| **Repository** | Nx monorepo structure | ✅ |
| **Performance** | Caching, scaling, HA | ✅ |
| **Integrations** | All Hermes subsystems | ✅ |
| **Production** | Runbooks, DR, chaos testing | ⏳ |

### 24.2 Deferred Items

| Item | Reason | Target |
|------|--------|--------|
| **FIDO2 Enterprise Attestation** | Hardware key procurement | v1.2 |
| **Confidential Computing (TEE)** | Hardware availability | v1.3 |
| **Post-Quantum Cryptography** | Standards not finalized | v2.0 |
| **AI-Driven Threat Hunting** | Requires ML platform | v1.3 |
| **Cross-Region Active-Active IdP** | IdP provider support | v1.3 |
| **Zero-Knowledge Proof Auth** | Research phase | v2.0 |

---

## Summary

This specification defines a **production-grade Security Subsystem** for Hermes with:

- **16 core services** covering the full security lifecycle
- **50+ background workers** for provisioning, rotation, detection, compliance
- **Complete domain model** with 60+ entities and branded identifiers
- **PostgreSQL schema** with 70+ tables, partitioned time-series tables
- **Full authentication stack** (OIDC, SAML, LDAP, WebAuthn, MFA, risk-based)
- **Advanced authorization** (RBAC, ABAC, PBAC, delegation, reviews, recertification)
- **Policy engine** (OPA/Cedar, compilation, simulation, testing, versioning)
- **Secrets management** (Vault integration, dynamic secrets, rotation, leases)
- **Certificate management** (PKI, SPIFFE, mTLS, trust bundles, automation)
- **Key management** (KMS/HSM, envelope encryption, hierarchy, rotation)
- **Token service** (JWT, JWKS, DPoP, exchange, introspection)
- **Session management** (device trust, concurrent limits, risk scoring)
- **Audit & compliance** (immutable logs, integrity chains, 6 frameworks)
- **Threat detection** (MITRE ATT&CK, anomalies, correlation, automated response)
- **Approvals & recertification** (workflows, escalation, access reviews)
- **Identity federation** (OIDC/SAML/LDAP/SCIM, JIT provisioning, linking)
- **Rate limiting & abuse detection** (multi-algorithm, dynamic adjustment)
- **Enterprise APIs** (REST, WebSocket, streaming, SDK)
- **Horizontal scaling** to 1M+ identities, sub-10ms AuthZ
- **Zero-downtime rotation** for secrets, certs, keys
- **Compliance ready** for SOC2, ISO27001, GDPR, HIPAA, FedRAMP

The specification is **implementation-ready** and represents a unified security platform capable of securing the entire Hermes ecosystem at enterprise scale.