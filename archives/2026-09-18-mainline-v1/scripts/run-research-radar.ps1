[CmdletBinding()]
param(
    [string]$ProjectRoot,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
}
$configPath = Join-Path $ProjectRoot 'config\research_radar.yaml'
if (-not (Test-Path -LiteralPath $configPath)) {
    throw "Missing active Research Radar config: $configPath"
}

$prompt = '$research-radar Run the configured Research Radar workflow. Read config/research_radar.yaml and the active AMSC state. Preserve source traceability and uncertainty; update project state only for evidence-backed changes; write the report under reports/radar.'

if ($DryRun) {
    Write-Output "Project: $ProjectRoot"
    Write-Output "Config: $configPath"
    Write-Output "Prompt: $prompt"
    exit 0
}

$codex = Get-Command codex -ErrorAction SilentlyContinue
if ($null -eq $codex) {
    throw 'The codex CLI is not on PATH. Use the desktop Scheduled interface with the same prompt, or add the Codex CLI to PATH.'
}

& $codex.Source exec --cd $ProjectRoot $prompt
exit $LASTEXITCODE
