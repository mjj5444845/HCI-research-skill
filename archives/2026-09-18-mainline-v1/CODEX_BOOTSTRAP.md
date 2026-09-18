# Codex Bootstrap Task

Build this repository into a working **Senior Researcher OS** for research conversations and recurring paper monitoring.

## Non-negotiable goal

The user should be able to talk naturally to Codex, e.g.:

- “读一下这篇论文。”
- “这个 idea 有人做过吗？”
- “帮我深挖这个方向，确认 novelty。”
- “这个 RQ 应该怎么设计 study？”
- “最近有什么值得看的新论文？”
- “攻击一下这个 framing。”
- “这个研究是不是在强行上价值？”
- “如果投 CHI / CSCW / FAccT / ACL，各自应该怎么 frame？”

Codex should select or combine the appropriate workflow skills.

## Phase 1 — Normalize the architecture

1. Inspect `AGENTS.md`, all `skills/*/SKILL.md`, `agents/`, `schemas/`, and `config/`.
2. Preserve all research principles.
3. Reorganize to current native Codex Skills/Agents conventions where beneficial.
4. Keep workflows modular. Do NOT turn the system into one giant prompt.
5. Ensure every skill has:
   - clear trigger
   - required/optional inputs
   - workflow
   - handoffs
   - output contract
   - failure/uncertainty behavior

## Phase 2 — Implement a minimal research state layer

Implement durable project-local storage for:
- papers
- literature map
- projects
- claims/evidence
- author/lab graph
- radar runs

A simple JSON/YAML/SQLite layer is acceptable for v0.1.

Requirements:
- traceability;
- deduplication;
- timestamps;
- source/evidence status;
- human corrections must not be overwritten silently.

## Phase 3 — Implement workflow routing

Natural-language request -> relevant skill(s).

Examples:
- “这篇 paper 讲什么？” -> paper-investigation
- “有人做过这个 idea 吗？” -> literature-investigation, then idea-development
- “方法合理吗？” -> paper-investigation method audit OR study-design depending context
- “给我最近 HRI/cultural AI 新论文” -> research-radar
- “这个 gap 真成立吗？” -> literature-investigation + gap red team

## Phase 4 — Multi-agent panels

Implement specialized roles as independent analyses, not fake personas repeating the same answer.

At minimum:
- Senior Faculty Synthesizer
- Gap Red Team
- Missing Paper Attacker
- Novelty Domain Panel
- Method Efficiency Advocate
- Human Evidence Advocate
- Quantitative Rigor Auditor
- Qualitative Reliability Auditor
- Interpretivist Qualitative Auditor
- Cognitive/Behavioral Methods Auditor
- Culture Operationalization Auditor
- Research Graph Curator

Each panel should expose disagreements and evidence.

## Phase 5 — Research Radar automation

Implement a recurring workflow that can run on a schedule.

Do not hard-code one scheduler. Provide at least:
- local cron/Task Scheduler instructions;
- a GitHub Actions option if the repo is hosted;
- native Codex scheduling/automation integration if available in the user's environment.

Use `config/research_radar.example.yaml` as the user-editable control plane.

A scheduled run should:
1. load interests;
2. retrieve recent candidates from configured scholarly/public sources;
3. deduplicate against existing state;
4. triage;
5. run Paper Investigation on top papers;
6. update maps/graph;
7. produce `reports/radar/YYYY-MM-DD.md`;
8. retain skipped/tracked candidates;
9. never invent inaccessible paper contents.

## Phase 6 — Validate

Create tests/evaluation fixtures for:
- obvious-result rejection;
- novelty uncertainty;
- significance inflation detection;
- method/RQ mismatch;
- missing-paper attack;
- culture != nationality;
- qualitative paradigm disagreement;
- graph inferred edge vs verified edge;
- maximum defensible claim calibration.

## Important

Do not implement proposal-development, paper-writing, or formal paper-review workflows beyond stubs. Those require another design round.

Prefer the smallest robust system over premature complexity.

---

## Active Research Program Requirement — AMSC

This repository now contains an active personal research program under:

`research-programs/amsc/`

Codex implementation must:
1. keep general Senior Researcher OS workflows reusable;
2. load AMSC only when the task concerns the user's main research trajectory or radar;
3. synchronize the five persistent AMSC state objects;
4. treat the Master Literature List as persistent/versioned;
5. never invent the user's 41 baseline papers; require/import the actual list later;
6. preserve Gap Registry histories rather than overwriting old claims;
7. run program-specific relevance screening before adding radar papers;
8. make weekly radar output match the fixed AMSC template;
9. expose human correction for author/lab/intellectual-lineage graph edges;
10. ensure every major AMSC update answers:
   - What do we know?
   - What don't we know?
   - What should I study next?

Do not collapse AMSC into simple keyword filters. Use mechanism-based search and semantic relevance.
