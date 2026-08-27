# Research Radar Scheduling

The workflow itself is scheduler-agnostic.

## Option A — Native Codex scheduling
If the user's Codex environment exposes native recurring/background scheduling:
1. configure the Research Radar command/task;
2. load `config/research_radar.yaml`;
3. run at the configured cadence;
4. write reports and state back into the repository;
5. surface only meaningful changes.

Current workspace deployment: the native `AMSC Research Radar` task is enabled for every Monday at 08:00 in `America/New_York`, targeting this local project.

## Option B — cron (macOS/Linux)

Example command:

```bash
0 8 * * 1 cd /path/to/repo && ./scripts/run-research-radar
```

The implementation should create `scripts/run-research-radar`.

## Option C — Windows Task Scheduler
Create a weekly task invoking the repository's PowerShell entry point, using the project environment and credentials:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/run-research-radar.ps1
```

Use `-DryRun` first to verify the resolved project, config, and prompt.

## Option D — GitHub Actions
If the repository is hosted and secrets/API access are appropriate, implement:
- `workflow_dispatch`
- `schedule`
- artifact or commit-based report persistence

Do not store private API keys in the repo.

## Safety / scientific quality
A scheduled run must not:
- hallucinate paper contents;
- claim exhaustive coverage;
- overwrite human graph corrections;
- silently change project novelty conclusions.

When evidence changes a prior conclusion, report the delta explicitly.
