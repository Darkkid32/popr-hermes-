<#
.SYNOPSIS
  Log an agent task to the local SQLite DB.

.DESCRIPTION
  Inserts a row into agent_logs (DB at $HOME\.hermes\agent-logs.db).
  Auto-detects the model from $HOME\.hermes\hermes.json or config.yaml, then
  falls back to %LOCALAPPDATA%\hermes\, then %APPDATA%\hermes\.
  Paths are resolved from $PSScriptRoot so the script is portable within
  the ~/.hermes tree.

.PARAMETER AgentName
  Short agent identifier (lowercase): orchestrator, scout, scribe, reach, dev, cashflow.

.PARAMETER TaskDescription
  Short description (<= 140 chars recommended).

.PARAMETER Status
  started | completed | failed | blocked

.PARAMETER ModelUsed
  Optional. Override the auto-detected model name.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File "$HOME\.hermes\agents\_shared\log-task-local.ps1" `
      -AgentName "dev" -TaskDescription "built the logging system" -Status "completed"
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]  [string]$AgentName,
    [Parameter(Mandatory = $true)]  [string]$TaskDescription,
    [Parameter(Mandatory = $true)]
    [ValidateSet("started","completed","failed","blocked")]
    [string]$Status,
    [Parameter(Mandatory = $false)] [string]$ModelUsed
)

$ErrorActionPreference = "Stop"

# --- Resolve paths ---
$ScriptDir    = Split-Path -Parent $MyInvocation.MyCommand.Path
$HermesHome   = Split-Path -Parent (Split-Path -Parent $ScriptDir)
$DbPath       = Join-Path $HermesHome "agent-logs.db"
$PyHelperPath = Join-Path $ScriptDir "_log_helper.py"

# --- Find a Python interpreter ---
function Resolve-Python {
    $candidates = @()
    foreach ($name in @("python","python.exe","py","py.exe")) {
        $cmd = Get-Command $name -ErrorAction SilentlyContinue
        if ($cmd) { $candidates += $cmd.Source }
    }
    $candidates = $candidates | Where-Object { $_ -and ($_ -notmatch "WindowsApps") } | Select-Object -Unique
    if (-not $candidates -or $candidates.Count -eq 0) {
        throw "Python not found on PATH."
    }
    return $candidates[0]
}

# --- Auto-detect model ---
if ([string]::IsNullOrWhiteSpace($ModelUsed)) {
    $ModelUsed = "unknown"
    $configDirs = @(
        $HermesHome,
        (Join-Path $env:LOCALAPPDATA "hermes"),
        (Join-Path $env:APPDATA      "hermes")
    ) | Where-Object { $_ -and (Test-Path $_) } | Select-Object -Unique

    foreach ($dir in $configDirs) {
        $hj = Join-Path $dir "hermes.json"
        if (Test-Path $hj) {
            try {
                $obj = Get-Content $hj -Raw | ConvertFrom-Json
                if ($obj.model)            { $ModelUsed = "$($obj.model)"; break }
                elseif ($obj.default_model) { $ModelUsed = "$($obj.default_model)"; break }
            } catch { }
        }
        $yaml = Join-Path $dir "config.yaml"
                if (Test-Path $yaml) {
                    try {
                        $cfg = Get-Content $yaml -Raw
                        # Pick the first "default: VALUE" line in the file (works for both
                        # top-level model.default and nested agent.model.default).
                        $m = [regex]::Match($cfg, '(?m)^\s*default:\s*(\S+)')
                        if ($m.Success) {
                            $ModelUsed = $m.Groups[1].Value.Trim()
                            break
                        }
                    } catch { }
                }
    }
}

# --- Generate id + UTC timestamp ---
$Id        = [guid]::NewGuid().ToString()
$CreatedAt = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

# --- Write temp JSON config (UTF-8, no BOM) for the Python helper ---
$cfgObj = [ordered]@{
    db_path          = $DbPath
    id               = $Id
    agent_name       = $AgentName
    task_description = $TaskDescription
    model_used       = $ModelUsed
    status           = $Status
    created_at       = $CreatedAt
}
$cfgFile = Join-Path $env:TEMP ("agent-log-{0}.json" -f ([guid]::NewGuid().ToString("N")))
[System.IO.File]::WriteAllText($cfgFile, ($cfgObj | ConvertTo-Json -Depth 5), [System.Text.UTF8Encoding]::new($false))

try {
    $python = Resolve-Python
    $stdoutOut = ""
    $stderrOut = ""
    $p = Start-Process -FilePath $python -ArgumentList @($PyHelperPath, $cfgFile) `
                       -NoNewWindow -Wait -PassThru `
                       -RedirectStandardOutput "$cfgFile.out" `
                       -RedirectStandardError  "$cfgFile.err"
    if (Test-Path "$cfgFile.out") { $stdoutOut = Get-Content "$cfgFile.out" -Raw }
    if (Test-Path "$cfgFile.err") { $stderrOut = Get-Content "$cfgFile.err" -Raw }
    if ($p.ExitCode -ne 0) {
        Write-Error ("python helper failed (exit {0}): {1}" -f $p.ExitCode, $stderrOut)
        exit 3
    }
    if ($stdoutOut) { Write-Output $stdoutOut.TrimEnd() }
    Write-Output ("LOGGED: {0} | {1} | {2}" -f $AgentName, $Status, $ModelUsed)
} finally {
    Remove-Item -Path $cfgFile -ErrorAction SilentlyContinue
    Remove-Item -Path "$cfgFile.out" -ErrorAction SilentlyContinue
    Remove-Item -Path "$cfgFile.err" -ErrorAction SilentlyContinue
}