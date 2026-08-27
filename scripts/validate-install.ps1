[CmdletBinding()]
param(
    [string]$ProjectRoot
)

$ErrorActionPreference = 'Stop'
if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = Split-Path -Parent $PSScriptRoot
}
$expectedSkills = @(
    'comprehensive-exam',
    'idea-development',
    'literature-investigation',
    'paper-investigation',
    'research-program-guardrail',
    'research-radar',
    'senior-researcher-core',
    'study-design'
)

$failures = [System.Collections.Generic.List[string]]::new()

foreach ($skill in $expectedSkills) {
    $skillFile = Join-Path $ProjectRoot ".agents\skills\$skill\SKILL.md"
    if (-not (Test-Path -LiteralPath $skillFile)) {
        $failures.Add("Missing skill: $skillFile")
        continue
    }
    $content = Get-Content -Raw -LiteralPath $skillFile
    if ($content -notmatch "(?ms)^---\s*.*?^name:\s*$([regex]::Escape($skill))\s*$.*?^description:\s*.+?^---") {
        $failures.Add("Invalid SKILL.md frontmatter: $skillFile")
    }
}

$agentFiles = Get-ChildItem -LiteralPath (Join-Path $ProjectRoot '.codex\agents') -Filter '*.toml' -File
if ($agentFiles.Count -lt 12) {
    $failures.Add("Expected at least 12 custom agents; found $($agentFiles.Count).")
}
foreach ($agentFile in $agentFiles) {
    $content = Get-Content -Raw -LiteralPath $agentFile.FullName
    foreach ($requiredField in @('name', 'description', 'developer_instructions')) {
        if ($content -notmatch "(?m)^$requiredField\s*=") {
            $failures.Add("Missing $requiredField in $($agentFile.FullName)")
        }
    }
}

$requiredPaths = @(
    'AGENTS.md',
    '.codex\config.toml',
    'config\research_radar.yaml',
    'state\papers.yaml',
    'state\literature_maps.yaml',
    'state\projects.yaml',
    'state\claims_evidence.yaml',
    'state\research_graph.yaml',
    'state\radar_runs.yaml',
    'research-programs\amsc\state\master_literature.yaml',
    'research-programs\amsc\state\gap_registry.yaml',
    'research-programs\amsc\state\state_of_field.yaml',
    'research-programs\amsc\state\comprehensive_exam.yaml',
    'research-programs\amsc\state\research_graph.yaml',
    'tests\evaluation-fixtures.yaml'
)
foreach ($relativePath in $requiredPaths) {
    if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot $relativePath))) {
        $failures.Add("Missing required path: $relativePath")
    }
}

if ($failures.Count -gt 0) {
    $failures | ForEach-Object { Write-Error $_ }
    exit 1
}

Write-Output "Senior Researcher OS validation passed."
Write-Output "Skills: $($expectedSkills.Count)"
Write-Output "Custom agents: $($agentFiles.Count)"
Write-Output "Active radar config: config\research_radar.yaml"
