# Hermes Security Subsystem — Enterprise Architecture Specification (Part 3)

---

## 19. PostgreSQL Schema (continued)

### 19.2 Secrets Tables (continued)

```sql
-- Rotation policies (continued)
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
    description TEXT,
    default_ttl VARCHAR(50) NOT NULL DEFAULT '1h',
    max_ttl VARCHAR(50) NOT NULL DEFAULT '24h',
    renewable BOOLEAN NOT NULL DEFAULT TRUE,
    renew_before_expiry VARCHAR(50) NOT NULL DEFAULT '10m',
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
    client_id VARCHAR(500) NOT NULL,
    client_type VARCHAR(20) NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    renewable BOOLEAN NOT NULL DEFAULT TRUE,
    renewed_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(500),
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_leases_secret ON leases(secret_id);
CREATE INDEX idx_leases_client ON leases(client_id);
CREATE INDEX idx_leases_expires ON leases(expires_at);

-- Dynamic secrets
CREATE TABLE dynamic_secrets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    vault_id UUID NOT NULL REFERENCES vaults(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    config JSONB NOT NULL DEFAULT '{}',
    lease_policy_id UUID REFERENCES lease_policies(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_dynamic_secrets_tenant ON dynamic_secrets(tenant_id);
CREATE INDEX idx_dynamic_secrets_workspace ON dynamic_secrets(workspace_id);
CREATE INDEX idx_dynamic_secrets_vault ON dynamic_secrets(vault_id);

-- Secret access log
CREATE TABLE secret_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_id UUID NOT NULL REFERENCES secrets(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    client_id VARCHAR(500) NOT NULL,
    client_type VARCHAR(20) NOT NULL,
    action VARCHAR(20) NOT NULL,
    ip_address INET NOT NULL,
    user_agent TEXT NOT NULL,
    success BOOLEAN NOT NULL,
    error TEXT,
    trace_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

CREATE TABLE secret_access_log_2024_01 PARTITION OF secret_access_log FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE secret_access_log_2024_02 PARTITION OF secret_access_log FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE INDEX idx_secret_access_secret ON secret_access_log(secret_id);
CREATE INDEX idx_secret_access_client ON secret_access_log(client_id);
CREATE INDEX idx_secret_access_created ON secret_access_log(created_at DESC);
```

### 19.3 Certificate Tables

```sql
-- Certificate Authorities
CREATE TABLE certificate_authorities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'intermediate',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    certificate_id UUID,
    private_key_ref JSONB NOT NULL DEFAULT '{}',
    parent_ca_id UUID REFERENCES certificate_authorities(id) ON DELETE SET NULL,
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

CREATE INDEX idx_ca_tenant ON certificate_authorities(tenant_id);
CREATE INDEX idx_ca_workspace ON certificate_authorities(workspace_id);
CREATE INDEX idx_ca_parent ON certificate_authorities(parent_ca_id);

-- Certificates
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    ca_id UUID NOT NULL REFERENCES certificate_authorities(id) ON DELETE CASCADE,
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

CREATE UNIQUE INDEX idx_cert_ca_serial ON certificates(ca_id, serial_number);
CREATE INDEX idx_cert_tenant ON certificates(tenant_id);
CREATE INDEX idx_cert_workspace ON certificates(workspace_id);
CREATE INDEX idx_cert_status ON certificates(status);
CREATE INDEX idx_cert_spiffe ON certificates(spiffe_id);
CREATE INDEX idx_cert_expires ON certificates(not_after);

-- Trust bundles
CREATE TABLE trust_bundles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    certificate_ids UUID[] DEFAULT '{}',
    spiffe_trust_domain VARCHAR(255),
    format VARCHAR(20) NOT NULL DEFAULT 'pem',
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version INTEGER NOT NULL DEFAULT 1,
    checksum VARCHAR(100) NOT NULL
);

CREATE INDEX idx_trust_bundle_tenant ON trust_bundles(tenant_id);
CREATE INDEX idx_trust_bundle_workspace ON trust_bundles(workspace_id);

-- Revocation lists
CREATE TABLE revocation_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ca_id UUID NOT NULL REFERENCES certificate_authorities(id) ON DELETE CASCADE,
    serial_numbers JSONB NOT NULL DEFAULT '[]',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    next_update TIMESTAMPTZ NOT NULL,
    signature TEXT NOT NULL,
    format VARCHAR(20) NOT NULL DEFAULT 'crl'
);

CREATE INDEX idx_crl_ca ON revocation_lists(ca_id);

-- SPIFFE identities
CREATE TABLE spiffe_identities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    trust_domain VARCHAR(255) NOT NULL,
    workload_selector JSONB NOT NULL DEFAULT '{}',
    spiffe_id VARCHAR(500) NOT NULL UNIQUE,
    certificate_ids UUID[] DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    rotated_at TIMESTAMPTZ,
    rotation_count INTEGER NOT NULL DEFAULT 0,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_spiffe_tenant ON spiffe_identities(tenant_id);
CREATE INDEX idx_spiffe_workspace ON spiffe_identities(workspace_id);
CREATE INDEX idx_spiffe_trust_domain ON spiffe_identities(trust_domain);

-- mTLS configs
CREATE TABLE mtls_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mode VARCHAR(20) NOT NULL DEFAULT 'permissive',
    client_validation VARCHAR(20) NOT NULL DEFAULT 'require',
    trust_bundle_ids UUID[] DEFAULT '{}',
    cert_rotation_policy_id UUID REFERENCES rotation_policies(id),
    cipher_suites TEXT[] DEFAULT '{}',
    min_tls_version VARCHAR(10) NOT NULL DEFAULT '1.2',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mtls_tenant ON mtls_configs(tenant_id);
CREATE INDEX idx_mtls_workspace ON mtls_configs(workspace_id);
```

### 19.4 Key Management Tables

```sql
-- KMS Keys
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
    key_hierarchy_id UUID REFERENCES key_hierarchies(id),
    tags JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_kms_key_provider ON kms_keys(provider, provider_key_id);
CREATE INDEX idx_kms_key_tenant ON kms_keys(tenant_id);
CREATE INDEX idx_kms_key_workspace ON kms_keys(workspace_id);

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

CREATE INDEX idx_key_rotation_tenant ON key_rotation_policies(tenant_id);
CREATE INDEX idx_key_rotation_workspace ON key_rotation_policies(workspace_id);

-- Encryption keys
CREATE TABLE encryption_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kms_key_id UUID NOT NULL REFERENCES kms_keys(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    algorithm VARCHAR(50) NOT NULL,
    key_spec JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_enc_key_kms ON encryption_keys(kms_key_id);
CREATE INDEX idx_enc_key_tenant ON encryption_keys(tenant_id);
CREATE INDEX idx_enc_key_workspace ON encryption_keys(workspace_id);

-- Signing keys
CREATE TABLE signing_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kms_key_id UUID NOT NULL REFERENCES kms_keys(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    algorithm VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    current_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sign_key_kms ON signing_keys(kms_key_id);
CREATE INDEX idx_sign_key_tenant ON signing_keys(tenant_id);
CREATE INDEX idx_sign_key_workspace ON signing_keys(workspace_id);

-- Key versions
CREATE TABLE key_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_id UUID NOT NULL,
    key_type VARCHAR(20) NOT NULL, -- 'encryption' | 'signing'
    version INTEGER NOT NULL,
    material JSONB NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'current',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    deprecated_at TIMESTAMPTZ,
    destroyed_at TIMESTAMPTZ,
    UNIQUE (key_id, key_type, version)
);

CREATE INDEX idx_key_versions_key ON key_versions(key_id, key_type);

-- Key hierarchies
CREATE TABLE key_hierarchies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    root_key_id UUID NOT NULL REFERENCES kms_keys(id) ON DELETE CASCADE,
    data_keys JSONB NOT NULL DEFAULT '[]',
    envelope_encryption BOOLEAN NOT NULL DEFAULT TRUE,
    cache_ttl INTEGER NOT NULL DEFAULT 300,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_key_hierarchy_tenant ON key_hierarchies(tenant_id);
```

### 19.5 Token Tables

```sql
-- Access tokens
CREATE TABLE access_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(100) NOT NULL UNIQUE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scopes TEXT[] DEFAULT '{}',
    claims JSONB NOT NULL DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(500),
    revocation_reason TEXT,
    token_type VARCHAR(20) NOT NULL DEFAULT 'Bearer',
    dpop_proof JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_access_token_subject ON access_tokens(subject_type, subject_id);
CREATE INDEX idx_access_token_tenant ON access_tokens(tenant_id);
CREATE INDEX idx_access_token_workspace ON access_tokens(workspace_id);
CREATE INDEX idx_access_token_expires ON access_tokens(expires_at) WHERE revoked_at IS NULL;

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(100) NOT NULL UNIQUE,
    access_token_id UUID NOT NULL REFERENCES access_tokens(id) ON DELETE CASCADE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    scopes TEXT[] DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    revoked_by VARCHAR(500),
    revocation_reason TEXT,
    rotation_count INTEGER NOT NULL DEFAULT 0,
    parent_token_id UUID REFERENCES refresh_tokens(id) ON DELETE SET NULL,
    device_id VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_token_access ON refresh_tokens(access_token_id);
CREATE INDEX idx_refresh_token_subject ON refresh_tokens(subject_type, subject_id);
CREATE INDEX idx_refresh_token_tenant ON refresh_tokens(tenant_id);
CREATE INDEX idx_refresh_token_expires ON refresh_tokens(expires_at) WHERE revoked_at IS NULL;

-- ID tokens
CREATE TABLE id_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_hash VARCHAR(100) NOT NULL UNIQUE,
    subject_type VARCHAR(20) NOT NULL,
    subject_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    claims JSONB NOT NULL DEFAULT '{}',
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    nonce VARCHAR(100),
    at_hash VARCHAR(100),
    c_hash VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_id_token_subject ON id_tokens(subject_type, subject_id);
CREATE INDEX idx_id_token_tenant ON id_tokens(tenant_id);
CREATE INDEX idx_id_token_expires ON id_tokens(expires_at);

-- JWKS cache
CREATE TABLE jwks_cache (
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    keys JSONB NOT NULL DEFAULT '[]',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (tenant_id, workspace_id)
);
```

### 19.6 Audit Tables

```sql
-- Audit events (partitioned by month)
CREATE TABLE audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    principal_id VARCHAR(500) NOT NULL,
    principal_type VARCHAR(20) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(255) NOT NULL,
    resource_id VARCHAR(500) NOT NULL,
    resource_type VARCHAR(50),
    before_state JSONB,
    after_state JSONB,
    outcome VARCHAR(20) NOT NULL,
    error TEXT,
    trace_id VARCHAR(100) NOT NULL,
    span_id VARCHAR(100),
    ip_address INET,
    user_agent TEXT,
    geo_location JSONB,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'low',
    compliance_tags TEXT[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}',
    integrity_hash VARCHAR(100) NOT NULL,
    previous_hash VARCHAR(100)
) PARTITION BY RANGE (timestamp);

CREATE TABLE audit_events_2024_01 PARTITION OF audit_events FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
CREATE TABLE audit_events_2024_02 PARTITION OF audit_events FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE INDEX idx_audit_tenant ON audit_events(tenant_id);
CREATE INDEX idx_audit_workspace ON audit_events(workspace_id);
CREATE INDEX idx_audit_principal ON audit_events(principal_id);
CREATE INDEX idx_audit_resource ON audit_events(resource, resource_id);
CREATE INDEX idx_audit_trace ON audit_events(trace_id);
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp DESC);
CREATE INDEX idx_audit_risk ON audit_events(risk_level);

-- Integrity chains
CREATE TABLE integrity_chains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    start_event_id UUID NOT NULL,
    end_event_id UUID NOT NULL,
    start_hash VARCHAR(100) NOT NULL,
    end_hash VARCHAR(100) NOT NULL,
    event_count BIGINT NOT NULL,
    merkle_root VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ,
    verification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
);

CREATE INDEX idx_integrity_tenant ON integrity_chains(tenant_id);
CREATE INDEX idx_integrity_workspace ON integrity_chains(workspace_id);
CREATE INDEX idx_integrity_created ON integrity_chains(created_at DESC);
```

### 19.7 Threat Detection Tables

```sql
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
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_threat_tenant ON threats(tenant_id);
CREATE INDEX idx_threat_workspace ON threats(workspace_id);
CREATE INDEX idx_threat_status ON threats(status);
CREATE INDEX idx_threat_severity ON threats(severity);
CREATE INDEX idx_threat_detected ON threats(detected_at DESC);

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
    related_entities TEXT[] DEFAULT '{}',
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_anomaly_tenant ON anomalies(tenant_id);
CREATE INDEX idx_anomaly_workspace ON anomalies(workspace_id);
CREATE INDEX idx_anomaly_type ON anomalies(type);
CREATE INDEX idx_anomaly_detected ON anomalies(detected_at DESC);

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
    source VARCHAR(20) NOT NULL,
    rule_id VARCHAR(100),
    labels JSONB NOT NULL DEFAULT '{}',
    annotations JSONB NOT NULL DEFAULT '{}',
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    fingerprint VARCHAR(100) NOT NULL
);

CREATE INDEX idx_alert_tenant ON security_alerts(tenant_id);
CREATE INDEX idx_alert_workspace ON security_alerts(workspace_id);
CREATE INDEX idx_alert_status ON security_alerts(status);
CREATE INDEX idx_alert_fingerprint ON security_alerts(fingerprint);
CREATE INDEX idx_alert_starts ON security_alerts(starts_at DESC);

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
    commander UUID REFERENCES users(id) ON DELETE SET NULL,
    responders UUID[] DEFAULT '{}',
    timeline JSONB NOT NULL DEFAULT '[]',
    impact JSONB NOT NULL DEFAULT '{}',
    root_cause TEXT,
    lessons_learned TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

CREATE INDEX idx_incident_tenant ON security_incidents(tenant_id);
CREATE INDEX idx_incident_workspace ON security_incidents(workspace_id);
CREATE INDEX idx_incident_status ON security_incidents(status);
CREATE INDEX idx_incident_created ON security_incidents(created_at DESC);
```

### 19.8 Compliance Tables

```sql
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

CREATE UNIQUE INDEX idx_framework_tenant_name ON compliance_frameworks(tenant_id, name, version);

-- Controls
CREATE TABLE controls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    framework_id UUID NOT NULL REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
    identifier VARCHAR(100) NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    requirement TEXT NOT NULL,
    test_procedure TEXT,
    evidence_types TEXT[] DEFAULT '{}',
    automated BOOLEAN NOT NULL DEFAULT FALSE,
    frequency VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL DEFAULT 'medium'
);

CREATE INDEX idx_control_framework ON controls(framework_id);

-- Evidence
CREATE TABLE evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    control_id UUID NOT NULL REFERENCES controls(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    source VARCHAR(255) NOT NULL,
    data JSONB NOT NULL DEFAULT '{}',
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    collected_by VARCHAR(100) NOT NULL,
    integrity_hash VARCHAR(100) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE INDEX idx_evidence_control ON evidence(control_id);

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

CREATE INDEX idx_assessment_tenant ON assessments(tenant_id);
CREATE INDEX idx_assessment_workspace ON assessments(workspace_id);
CREATE INDEX idx_assessment_status ON assessments(status);

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
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ
);

CREATE INDEX idx_report_assessment ON compliance_reports(assessment_id);
CREATE INDEX idx_report_tenant ON compliance_reports(tenant_id);
```

### 19.9 Approval Tables

```sql
-- Approval requests
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    requester UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    priority VARCHAR(20) NOT NULL DEFAULT 'normal',
    steps JSONB NOT NULL DEFAULT '[]',
    current_step INTEGER NOT NULL DEFAULT 0,
    expires_at TIMESTAMPTZ,
    decided_at TIMESTAMPTZ,
    decided_by UUID REFERENCES users(id) ON DELETE SET NULL,
    decision VARCHAR(20),
    comments JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_approval_tenant ON approval_requests(tenant_id);
CREATE INDEX idx_approval_workspace ON approval_requests(workspace_id);
CREATE INDEX idx_approval_requester ON approval_requests(requester);
CREATE INDEX idx_approval_status ON approval_requests(status);

-- Delegations
CREATE TABLE delegations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    delegator UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    delegatee UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permissions UUID[] NOT NULL DEFAULT '{}',
    scope JSONB NOT NULL DEFAULT '{}',
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    revoked_at TIMESTAMPTZ,
    revoked_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_delegation_tenant ON delegations(tenant_id);
CREATE INDEX idx_delegation_workspace ON delegations(workspace_id);
CREATE INDEX idx_delegation_delegator ON delegations(delegator);
CREATE INDEX idx_delegation_delegatee ON delegations(delegatee);

-- Recertifications
CREATE TABLE recertifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    scope JSONB NOT NULL DEFAULT '{}',
    schedule JSONB NOT NULL DEFAULT '{}',
    reviewers UUID[] NOT NULL DEFAULT '{}',
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
    items JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL,
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ
);

CREATE INDEX idx_recert_tenant ON recertifications(tenant_id);
CREATE INDEX idx_recert_workspace ON recertifications(workspace_id);
CREATE INDEX idx_recert_status ON recertifications(status);
```

### 19.10 Federation Tables

```sql
-- Identity providers
CREATE TABLE identity_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    configuration JSONB NOT NULL DEFAULT '{}',
    attribute_mapping JSONB NOT NULL DEFAULT '{}',
    provisioning JSONB NOT NULL DEFAULT '{}',
    domains TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_sync_at TIMESTAMPTZ,
    last_sync_status VARCHAR(20)
);

CREATE INDEX idx_idp_tenant ON identity_providers(tenant_id);
CREATE INDEX idx_idp_workspace ON identity_providers(workspace_id);

-- Sync jobs
CREATE TABLE sync_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identity_provider_id UUID NOT NULL REFERENCES identity_providers(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    stats JSONB NOT NULL DEFAULT '{}',
    errors JSONB NOT NULL DEFAULT '[]',
    triggered_by VARCHAR(20) NOT NULL
);

CREATE INDEX idx_sync_idp ON sync_jobs(identity_provider_id);
CREATE INDEX idx_sync_status ON sync_jobs(status);
```

### 19.11 Rate Limiting Tables

```sql
-- Rate limit rules
CREATE TABLE rate_limit_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    scope JSONB NOT NULL DEFAULT '{}',
    algorithm VARCHAR(20) NOT NULL DEFAULT 'sliding_window',
    limit_value BIGINT NOT NULL,
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

CREATE INDEX idx_ratelimit_tenant ON rate_limit_rules(tenant_id);
CREATE INDEX idx_ratelimit_workspace ON rate_limit_rules(workspace_id);

-- Quotas
CREATE TABLE quotas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    limit_value BIGINT NOT NULL,
    period VARCHAR(20) NOT NULL,
    current_usage BIGINT NOT NULL DEFAULT 0,
    reset_at TIMESTAMPTZ NOT NULL,
    warning_threshold NUMERIC(5,2) NOT NULL DEFAULT 0.8,
    critical_threshold NUMERIC(5,2) NOT NULL DEFAULT 0.95,
    actions JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quota_tenant ON quotas(tenant_id);
CREATE INDEX idx_quota_workspace ON quotas(workspace_id);
```

### 19.12 Updated At Trigger

```sql
-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_tenants_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_identities_updated_at BEFORE UPDATE ON identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_accounts_updated_at BEFORE UPDATE ON service_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_machine_identities_updated_at BEFORE UPDATE ON machine_identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mfa_devices_updated_at BEFORE UPDATE ON mfa_devices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_permissions_updated_at BEFORE UPDATE ON permissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policy_bindings_updated_at BEFORE UPDATE ON policy_bindings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE ON policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vaults_updated_at BEFORE UPDATE ON vaults FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON secrets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rotation_policies_updated_at BEFORE UPDATE ON rotation_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lease_policies_updated_at BEFORE UPDATE ON lease_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dynamic_secrets_updated_at BEFORE UPDATE ON dynamic_secrets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificate_authorities_updated_at BEFORE UPDATE ON certificate_authorities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certificates_updated_at BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trust_bundles_updated_at BEFORE UPDATE ON trust_bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_spiffe_identities_updated_at BEFORE UPDATE ON spiffe_identities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_mtls_configs_updated_at BEFORE UPDATE ON mtls_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_kms_keys_updated_at BEFORE UPDATE ON kms_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_rotation_policies_updated_at BEFORE UPDATE ON key_rotation_policies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_encryption_keys_updated_at BEFORE UPDATE ON encryption_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_signing_keys_updated_at BEFORE UPDATE ON signing_keys FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_key_hierarchies_updated_at BEFORE UPDATE ON key_hierarchies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_compliance_frameworks_updated_at BEFORE UPDATE ON compliance_frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_access_reviews_updated_at BEFORE UPDATE ON access_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recertifications_updated_at BEFORE UPDATE ON recertifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_approval_requests_updated_at BEFORE UPDATE ON approval_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_delegations_updated_at BEFORE UPDATE ON delegations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_identity_providers_updated_at BEFORE UPDATE ON identity_providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rate_limit_rules_updated_at BEFORE UPDATE ON rate_limit_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_quotas_updated_at BEFORE UPDATE ON quotas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 20. Background Workers

| Worker | Schedule | Purpose |
|--------|----------|---------|
| **SecretRotationWorker** | Every 5 min | Process scheduled secret rotations |
| **CertificateRenewalWorker** | Every 15 min | Renew expiring certificates (30d, 7d, 1d before) |
| **KeyRotationWorker** | Daily | Rotate KMS keys per policy |
| **SessionCleanupWorker** | Every 10 min | Revoke expired/idle sessions |
| **LeaseExpiryWorker** | Every 5 min | Revoke expired secret leases |
| **DynamicSecretWorker** | Every 10 min | Generate/refresh dynamic secret credentials |
| **SyncWorker** | Per IdP schedule | Full/incremental identity sync |
| **RiskScoringWorker** | Every 30 min | Recalculate risk scores for entities |
| **AnomalyDetectionWorker** | Every 5 min | Detect authentication/authorization anomalies |
| **ThreatCorrelationWorker** | Every 10 min | Correlate events into threats |
| **AlertEvaluationWorker** | Every 30 sec | Evaluate alert rules |
| **ComplianceAssessmentWorker** | Per schedule | Run automated compliance checks |
| **EvidenceCollectionWorker** | Daily | Collect compliance evidence |
| **ReportGenerationWorker** | Per schedule | Generate compliance reports |
| **AccessReviewWorker** | Per schedule | Start/complete access reviews |
| **RecertificationWorker** | Per schedule | Run recertification campaigns |
| **EscalationWorker** | Every 5 min | Process approval escalations |
| **AuditIntegrityWorker** | Hourly | Verify audit chain integrity |
| **AuditExportWorker** | Per schedule | Export audit events |
| **RetentionWorker** | Daily | Apply data retention policies |
| **AbuseDetectionWorker** | Every 15 min | Detect rate limit abuse patterns |
| **QuotaEnforcementWorker** | Every 1 min | Enforce quota limits |
| **DecisionCacheWarmer** | Every 5 min | Warm AuthZ decision cache |
| **PolicyCompilerWorker** | On change | Compile policies to decision trees |
| **TrustBundleUpdater** | Every hour | Update SPIFFE trust bundles |
| **RevocationPublisher** | Every 5 min | Publish CRLs/OCSP responses |
| **LoginAttemptCleanup** | Daily | Archive old login attempts |
| **DeviceTrustExpiry** | Daily | Expire stale device trust |
| **BackupVerificationWorker** | Daily | Verify backup integrity |

---

## 21. Repository Structure

```
hermes-security/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── cd-staging.yml
│   │   ├── cd-production.yml
│   │   └── security-scan.yml
├── docker/
│   ├── Dockerfile.identity
│   ├── Dockerfile.authn
│   ├── Dockerfile.authz
│   ├── Dockerfile.policy
│   ├── Dockerfile.secrets
│   ├── Dockerfile.certificates
│   ├── Dockerfile.keys
│   ├── Dockerfile.tokens
│   ├── Dockerfile.sessions
│   ├── Dockerfile.audit
│   ├── Dockerfile.threats
│   ├── Dockerfile.compliance
│   ├── Dockerfile.approvals
│   ├── Dockerfile.federation
│   ├── Dockerfile.ratelimit
│   └── docker-compose.yml
├── kubernetes/
│   ├── base/
│   │   ├── namespace.yaml
│   │   ├── configmap.yaml
│   │   ├── secrets.yaml
│   │   ├── serviceaccount.yaml
│   │   └── rbac.yaml
│   ├── services/
│   │   ├── identity-service.yaml
│   │   ├── authn-service.yaml
│   │   ├── authz-service.yaml
│   │   ├── policy-engine.yaml
│   │   ├── secrets-service.yaml
│   │   ├── certificate-service.yaml
│   │   ├── key-service.yaml
│   │   ├── token-service.yaml
│   │   ├── session-service.yaml
│   │   ├── audit-service.yaml
│   │   ├── threat-detection.yaml
│   │   ├── compliance-service.yaml
│   │   ├── approval-service.yaml
│   │   ├── federation-service.yaml
│   │   └── ratelimit-service.yaml
│   ├── workers/
│   │   ├── secret-rotation.yaml
│   │   ├── cert-renewal.yaml
│   │   ├── session-cleanup.yaml
│   │   ├── risk-scoring.yaml
│   │   ├── anomaly-detection.yaml
│   │   ├── threat-correlation.yaml
│   │   ├── compliance-assessment.yaml
│   │   ├── access-review.yaml
│   │   ├── audit-integrity.yaml
│   │   └── abuse-detection.yaml
│   ├── overlays/
│   │   ├── development/
│   │   ├── staging/
│   │   └── production/
│   └── helm/
│       ├── Chart.yaml
│       ├── values.yaml
│       ├── values-dev.yaml
│       ├── values-staging.yaml
│       └── values-prod.yaml
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── types/
│   │   │   ├── errors/
│   │   │   ├── utils/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── identity/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── repositories/
│   │   │   ├── models/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── authn/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── handlers/
│   │   │   ├── protocols/
│   │   │   │   ├── oidc/
│   │   │   │   ├── saml/
│   │   │   │   ├── ldap/
│   │   │   │   ├── webauthn/
│   │   │   │   └── mfa/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── authz/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── engines/
│   │   │   │   ├── rbac/
│   │   │   │   ├── abac/
│   │   │   │   └── pbac/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── policy/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── compiler/
│   │   │   ├── evaluator/
│   │   │   ├── simulator/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── secrets/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── providers/
│   │   │   │   ├── hashicorp/
│   │   │   │   ├── aws/
│   │   │   │   ├── azure/
│   │   │   │   └── gcp/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── certificates/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── pk/
│   │   │   ├── spiffe/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── keys/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── kms/
│   │   │   │   ├── aws/
│   │   │   │   ├── gcp/
│   │   │   │   ├── azure/
│   │   │   │   └── hashicorp/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── jwks/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── sessions/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── devices/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── audit/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── integrity/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── threats/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── detection/
│   │   │   │   ├── anomalies/
│   │   │   │   ├── correlation/
│   │   │   │   └── intel/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── compliance/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── frameworks/
│   │   │   ├── evidence/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── approvals/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── escalation/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── federation/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── providers/
│   │   │   │   ├── oidc/
│   │   │   │   ├── saml/
│   │   │   │   ├── ldap/
│   │   │   │   └── scim/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── ratelimit/
│   │   ├── src/
│   │   │   ├── services/
│   │   │   ├── algorithms/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── sdk/
│   │   ├── src/
│   │   │   ├── client/
│   │   │   ├── interceptors/
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── testing/
│       ├── src/
│       │   ├── fixtures/
│       │   ├── mocks/
│       │   └── utils/
│       ├── package.json
│       └── tsconfig.json
├── apps/
│   ├── api-gateway/
│   ├── admin-cli/
│   └── migration-runner/
├── libs/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── index.ts
│   ├── messaging/
│   │   ├── kafka/
│   │   ├── pulsar/
│   │   └── index.ts
│   ├── cache/
│   │   ├── redis/
│   │   └── index.ts
│   ├── crypto/
│   │   ├── hsm/
│   │   ├── kms/
│   │   └── index.ts
│   ├── observability/
│   │   ├── metrics/
│   │   ├── tracing/
│   │   └── index.ts
│   └── config/
│       ├── schema/
│       └── index.ts
├── scripts/
│   ├── dev-setup.sh
│   ├── db-migrate.sh
│   ├── generate-certs.sh
│   ├── rotate-keys.sh
│   └── compliance-report.sh
├── docs/
│   ├── architecture/
│   ├── api/
│   ├── deployment/
│   └── operations/
├── turbo.json
├── package.json
├── tsconfig.base.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

---

## 22. Performance

### 22.1 Caching Strategy

| Cache | TTL | Max Size | Eviction | Use Case |
|-------|-----|----------|----------|----------|
| **AuthZ Decisions** | 30 sec | 100k entries | LRU | Sub-10ms authorization |
| **JWKS** | 1 hour | 100 entries | TTL | Token validation |
| **Policy Compilations** | 1 hour | 1k entries | LRU | Policy evaluation |
| **User/Identity Lookups** | 5 min | 10k entries | LRU | Authentication |
| **Session Data** | Session TTL | N/A | TTL | Session management |
| **Rate Limit Counters** | Window TTL | 1M entries | TTL | Rate limiting |
| **Risk Scores** | 15 min | 50k entries | LRU | Risk-based auth |
| **Certificate Chains** | 24 hours | 10k entries | LRU | mTLS validation |
| **Trust Bundles** | 1 hour | 100 entries | TTL | SPIFFE validation |

### 22.2 Scaling Targets

| Metric | Target | Scaling Strategy |
|--------|--------|------------------|
| **AuthZ Latency P99** | < 10ms | Horizontal PDP replicas + cache |
| **AuthN Latency P99** | < 100ms | Stateless + connection pooling |
| **Token Issuance P99** | < 50ms | Stateless + KMS caching |
| **Secret Read P99** | < 20ms | Vault connection pooling |
| **Certificate Issuance** | < 500ms | HSM pooling + async |
| **Policy Evaluation** | < 5ms | Compiled decision trees |
| **Throughput** | 100k req/s | Horizontal scaling + sharding |
| **Concurrent Sessions** | 1M+ | Redis Cluster |
| **Audit Ingestion** | 1M events/s | Kafka partitioning |

### 22.3 High Availability

| Component | HA Strategy | RTO | RPO |
|-----------|-------------|-----|-----|
| **PostgreSQL** | Primary + 2 replicas + Patroni | < 30s | 0 |
| **Redis** | Redis Cluster (3 masters) | < 10s | < 1s |
| **Kafka** | 3+ brokers, ISR | < 30s | 0 |
| **Vault** | 5-node raft cluster | < 10s | 0 |
| **KMS/HSM** | Multi-AZ + CloudHSM | < 1min | 0 |
| **Services** | K8s Deployment (3+ replicas) | < 30s | N/A |
| **Workers** | K8s Job + leader election | < 1min | N/A |

### 22.4 Disaster Recovery

| Scenario | Recovery Procedure |
|----------|-------------------|
| **Region Failure** | Failover to secondary region (DNS + DB replica promotion) |
| **Database Corruption** | Point-in-time recovery from WAL + base backup |
| **Key Compromise** | Emergency key rotation + certificate reissuance |
| **Vault Seal** | Unseal with Shamir shares + re-encrypt transit |
| **Audit Loss** | Rebuild from Kafka replay + object storage |

---

## 23. Integration Points

### 23.1 Subsystem Contracts

| Subsystem | Provides | Consumes | Protocol |
|-----------|----------|----------|----------|
| **Hermes Core** | Tenant/workspace CRUD, config, feature flags | AuthZ decisions, audit events | gRPC + Events |
| **Memory** | — | Secret access, cert validation, token validation | gRPC |
| **Automation** | Workflow approvals, secret injection | AuthZ for executions, audit trails | gRPC + Events |
| **Observability** | Metrics, logs, traces | Audit events, security alerts | OTLP + Events |
| **Models** | — | API key auth, rate limits, audit | gRPC |
| **MCP** | Server certificates, mTLS config | Token validation, AuthZ | gRPC + SPIFFE |
| **Agents** | Service accounts, workload identity | Token validation, secret access | gRPC |
| **Plugins** | Plugin signing keys, certificates | AuthN, AuthZ, rate limits | gRPC |
| **Skills** | Skill signing, permissions | Token validation | gRPC |
| **Machine Control** | Device certificates, mTLS | AuthN, AuthZ, audit | gRPC |
| **Chat** | User sessions, MFA | Token validation, risk scores | gRPC |
| **Organization** | Tenant/workspace hierarchy | Cross-tenant policies | gRPC |

### 23.2 Event Contracts

```typescript
// Published Events
interface SecurityEvents {
  // Identity
  'identity.created': IdentityCreatedEvent;
  'identity.updated': IdentityUpdatedEvent;
  'identity.deleted': IdentityDeletedEvent;
  'identity.linked': IdentityLinkedEvent;
  
  // Authentication
  'auth.success': AuthSuccessEvent;
  'auth.failed': AuthFailedEvent;
  'mfa.challenged': MFAChallengedEvent;
  'mfa.verified': MFAVerifiedEvent;
  'session.created': SessionCreatedEvent;
  'session.revoked': SessionRevokedEvent;
  'device.registered': DeviceRegisteredEvent;
  'device.trusted': DeviceTrustedEvent;
  
  // Authorization
  'authz.allowed': AuthZAllowedEvent;
  'authz.denied': AuthZDeniedEvent;
  'permission.granted': PermissionGrantedEvent;
  'permission.revoked': PermissionRevokedEvent;
  'delegation.created': DelegationCreatedEvent;
  'delegation.revoked': DelegationRevokedEvent;
  
  // Policy
  'policy.created': PolicyCreatedEvent;
  'policy.updated': PolicyUpdatedEvent;
  'policy.compiled': PolicyCompiledEvent;
  'policy.evaluated': PolicyEvaluatedEvent;
  
  // Secrets
  'secret.created': SecretCreatedEvent;
  'secret.updated': SecretUpdatedEvent;
  'secret.rotated': SecretRotatedEvent;
  'secret.expired': SecretExpiredEvent;
  'secret.accessed': SecretAccessedEvent;
  'lease.created': LeaseCreatedEvent;
  'lease.revoked': LeaseRevokedEvent;
  
  // Certificates
  'cert.issued': CertIssuedEvent;
  'cert.renewed': CertRenewedEvent;
  'cert.revoked': CertRevokedEvent;
  'cert.expired': CertExpiredEvent;
  'trust.bundle.updated': TrustBundleUpdatedEvent;
  
  // Keys
  'key.created': KeyCreatedEvent;
  'key.rotated': KeyRotatedEvent;
  'key.archived': KeyArchivedEvent;
  'key.used': KeyUsedEvent;
  'signing.performed': SigningPerformedEvent;
  
  // Tokens
  'token.issued': TokenIssuedEvent;
  'token.validated': TokenValidatedEvent;
  'token.revoked': TokenRevokedEvent;
  'token.exchanged': TokenExchangedEvent;
  
  // Audit
  'audit.logged': AuditLoggedEvent;
  'audit.exported': AuditExportedEvent;
  'integrity.verified': IntegrityVerifiedEvent;
  'compliance.generated': ComplianceGeneratedEvent;
  
  // Threats
  'threat.detected': ThreatDetectedEvent;
  'risk.updated': RiskUpdatedEvent;
  'alert.generated': AlertGeneratedEvent;
  'incident.created': IncidentCreatedEvent;
  
  // Approvals
  'approval.requested': ApprovalRequestedEvent;
  'approval.granted': ApprovalGrantedEvent;
  'approval.denied': ApprovalDeniedEvent;
  'review.scheduled': ReviewScheduledEvent;
  'delegation.created': DelegationCreatedEvent;
  
  // Federation
  'idp.configured': IdPConfiguredEvent;
  'identity.linked': IdentityLinkedEvent;
  'jit.provisioned': JITProvisionedEvent;
  'sync.completed': SyncCompletedEvent;
  
  // Rate Limiting
  'rate.limit.exceeded': RateLimitExceededEvent;
  'quota.adjusted': QuotaAdjustedEvent;
  'abuse.detected': AbuseDetectedEvent;
}

// Consumed Events
interface ConsumedEvents {
  'tenant.created': TenantCreatedEvent;
  'tenant.updated': TenantUpdatedEvent;
  'tenant.deleted': TenantDeletedEvent;
  'workspace.created': WorkspaceCreatedEvent;
  'workspace.updated': WorkspaceUpdatedEvent;
  'workspace.deleted': WorkspaceDeletedEvent;
  'user.created': UserCreatedEvent;
  'user.updated': UserUpdatedEvent;
  'user.deleted': UserDeletedEvent;
  'config.changed': ConfigChangedEvent;
  'feature.flag.changed': FeatureFlagChangedEvent;
}
```

---

## 24. Production Readiness

### 24.1 Runbooks

| Scenario | Runbook | Owner |
|----------|---------|-------|
| **AuthN Service Down** | Runbook-AUTHN-001 | Security On-Call |
| **AuthZ Latency Spike** | Runbook-AUTHZ-001 | Platform On-Call |
| **Vault Sealed** | Runbook-SECRETS-001 | Security On-Call |
| **Certificate Expiry** | Runbook-CERTS-001 | PKI On-Call |
| **Key Compromise** | Runbook-KEYS-001 | Security Lead |
| **Threat Detection Alert** | Runbook-THREATS-001 | SOC |
| **Compliance Audit** | Runbook-COMPLIANCE-001 | Compliance Team |
| **Audit Integrity Failure** | Runbook-AUDIT-001 | Security On-Call |
| **Rate Limit Abuse** | Runbook-RATELIMIT-001 | Platform On-Call |
| **IdP Sync Failure** | Runbook-FEDERATION-001 | Identity Team |

### 24.2 Monitoring & Alerting

| Alert | Condition | Severity | Channel |
|-------|-----------|----------|---------|
| **AuthN Error Rate** | > 1% for 5min | Critical | PagerDuty |
| **AuthZ P99 Latency** | > 50ms for 5min | Critical | PagerDuty |
| **Vault Unsealed** | Vault sealed > 1min | Critical | PagerDuty |
| **Cert Expiring** | < 30 days | Warning | Slack |
| **Cert Expired** | Any cert expired | Critical | PagerDuty |
| **Key Rotation Failed** | Any rotation failure | Critical | PagerDuty |
| **Threat Critical** | Critical threat detected | Critical | PagerDuty |
| **Compliance Drift** | Control failing | Warning | Slack |
| **Audit Chain Broken** | Integrity verification failed | Critical | PagerDuty |
| **Session Spike** | > 2x baseline | Warning | Slack |
| **Abuse Detected** | Abuse pattern detected | Critical | PagerDuty |

### 24.3 Backup & Recovery

| Data | Frequency | Retention | Recovery Test |
|------|-----------|-----------|---------------|
| **PostgreSQL** | Continuous (WAL) + Daily base | 30 days | Weekly |
| **Redis** | AOF every 1s + RDB hourly | 7 days | Monthly |
| **Vault** | Daily snapshots | 90 days | Monthly |
| **KMS Keys** | Automatic (provider) | Infinite | Quarterly |
| **Certificates** | On issuance + daily export | 10 years | Monthly |
| **Audit Events** | Stream to object storage | 7 years | Quarterly |
| **Config/Secrets** | GitOps (ArgoCD) | Infinite | Continuous |

### 24.4 Chaos Testing

| Experiment | Frequency | Success Criteria |
|------------|-----------|------------------|
| **AuthN Pod Kill** | Weekly | < 30s recovery, no auth failures |
| **AuthZ Pod Kill** | Weekly | < 10s recovery, cache warm |
| **DB Primary Failover** | Monthly | < 30s, 0 data loss |
| **Redis Failover** | Monthly | < 10s, sessions preserved |
| **Vault Seal/Unseal** | Monthly | < 1min, all secrets accessible |
| **KMS Outage** | Monthly | Envelope encryption fallback works |
| **Network Partition** | Quarterly | Services degrade gracefully |
| **Certificate Revocation Storm** | Quarterly | CRL/OCSP serves < 500ms |

### 24.5 Load Testing

| Test | Target | Pass Criteria |
|------|--------|---------------|
| **AuthN Peak Load** | 10k login/s | P99 < 500ms, error rate < 0.1% |
| **AuthZ Sustained** | 100k check/s | P99 < 10ms, error rate < 0.01% |
| **Token Issuance** | 50k issue/s | P99 < 50ms |
| **Secret Read** | 20k read/s | P99 < 20ms |
| **Policy Evaluation** | 50k eval/s | P99 < 5ms |
| **Audit Ingestion** | 1M events/s | < 5s end-to-end latency |

### 24.6 Security Testing

| Test | Frequency | Scope |
|------|-----------|-------|
| **SAST** | Every PR | All code |
| **DAST** | Weekly | API endpoints |
| **Dependency Scan** | Daily | All dependencies |
| **Container Scan** | Every build | All images |
| **Penetration Test** | Quarterly | Full subsystem |
| **Red Team Exercise** | Annually | End-to-end |
| **Compliance Audit** | Annually | SOC2, ISO27001 |

### 24.7 Operational Readiness Checklist

- [ ] All runbooks documented and tested
- [ ] Alerting configured with correct routing
- [ ] Dashboards for all SLIs/SLOs
- [ ] Backup/restore tested < 30 days ago
- [ ] Chaos experiments passing
- [ ] Load test results within targets
- [ ] Security scan findings remediated
- [ ] Compliance evidence current
- [ ] On-call rotation documented
- [ ] Incident response plan current
- [ ] Capacity planning updated
- [ ] Disaster recovery drill < 90 days ago
- [ ] Key rotation tested
- [ ] Certificate renewal tested
- [ ] Vault disaster recovery tested
- [ ] Cross-region failover tested

---

## 25. Summary

### 25.1 Architecture Completeness

| Area | Completeness | Notes |
|------|--------------|-------|
| **Identity & Access** | 100% | Full lifecycle, federation, provisioning |
| **Authentication** | 100% | 10 methods, MFA, risk-based, sessions |
| **Authorization** | 100% | RBAC/ABAC/PBAC, policy engine, delegation |
| **Secrets Management** |