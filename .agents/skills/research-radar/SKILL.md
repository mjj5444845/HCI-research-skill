---
name: research-radar
description: Recurring research monitoring workflow that finds, triages, investigates, and integrates new papers into the Senior Researcher OS.
---

# Research Radar

## Trigger
Use for:
- scheduled recurring paper monitoring;
- "最近有什么值得看的论文";
- updates to a literature list / research landscape;
- ongoing tracking of defined research interests.

## Goal
Act like a senior faculty member who scans the field, filters aggressively, and reports only what changes the researcher's understanding or next action.

## Inputs
Load from `config/research_radar.example.yaml` or active config:
- interests
- subfields
- venues
- authors/labs
- semantic descriptions
- exclusions
- time window
- run budget
- output mode

## Workflow

### 1. Retrieve
Use configured scholarly/public sources.
Do not claim to have read inaccessible full text.

### 2. Deduplicate
Against:
- prior radar candidates;
- existing Paper Objects;
- DOI/title/arXiv/version aliases.

### 3. Triage
Rank:
- Must Read
- Important
- Worth Reading
- Track
- Skip

Suggested criteria:
- relevance
- novelty signal
- method value
- theory value
- citation/landscape value
- challenge to current assumptions
- direct project connection

### 4. Investigate
- Must Read -> Paper Investigation Deep where access allows
- Important -> Normal/Deep
- Worth Reading -> Card/Lite
- Track -> metadata + rationale
- Skip -> retain minimal reason, do not waste reading budget

### 5. Integrate
Update:
- literature facets
- closest work
- controversy map
- candidate gaps
- author/lab graph
- reading queue
- project connections
- `state/paper-pages/<slug>.json` for every accepted paper that should have a public evidence-traceable interface, following `schemas/paper-page.schema.json`

### 6. Research graph update
Use verified edges only for affiliations/coauthorship.
Mark scholarly "extends/contradicts/lineage" edges as inferred unless directly evidenced.
Preserve human corrections.

### 7. Detect meaningful change
A radar report should highlight:
- new closest work
- new contradiction
- new method
- new dataset/benchmark
- new theory connection
- gap weakened/strengthened
- novelty assessment changed
- new key author/lab
- venue trend shift

### 8. Report
Example:

# Research Radar — YYYY-MM-DD

## Must Read
...

## Important
...

## What changed in our understanding
...

## Gap / novelty updates
...

## Research graph updates
...

## Recommended actions
...

## Tracked / skipped summary
...

## Quality controls
- inaccessible full texts
- uncertain metadata
- potential false positives
- search limitations

## Scheduling
This skill is safe to run periodically.
The external scheduler determines cadence.

---

## AMSC Mainline Mode

When `active_research_program: amsc`:

### Search behavior
Use mechanism-based search, not only artifact keywords.

Cross:
- signal
- communication function
- mechanism
- interaction
- embodiment

Also search:
- anchor researchers;
- their students/postdocs/frequent collaborators;
- Tier-1/Tier-2 venues;
- backward/forward citations;
- theory terms;
- historical terminology.

### Screening
For every candidate answer:
1. communication phenomenon?
2. modality/signal?
3. what does it express?
4. fixed/context-/interaction-dependent/emergent meaning?
5. interaction history/adaptation?
6. embodiment/situated context?
7. theory/mechanism?
8. does it update a current gap?

### Persistent updates
A meaningful run must evaluate updates to:
- Master Literature List
- Current State of Field
- Gap Registry
- Comprehensive Exam KB
- Research Graph

### Weekly fixed output

# 【本周论文及其总结分析】
For each accepted paper:
- Title
- Authors
- Venue / Status
- Core Question
- Method
- Findings
- Relation to My Research
- Priority
- Most Important Remaining Gap

If no high-relevance work exists, explicitly write:
> 本周无值得进入 Master List 的高相关新论文。

Never pad the report with weak papers.

After evidence-backed paper-page records change, run `npm run build` and `npm run test:site` so GitHub Pages receives one independent interface per accepted paper. Do not create placeholder paper records merely to make the website look populated.

# 【Master Literature List 更新】
Report:
- version transition
- additions
- recovered classics
- priority increases/decreases
- partially superseded / superseded changes

# 【当前研究现状与 Gap 更新】
Report:
- 仍然成立
- 得到加强
- 被部分解决
- 被重新定义
- 删除
- 新增
- Current Top Research Gaps

### Every run ends with
- Q1 What do we know?
- Q2 What don't we know?
- Q3 What should I study next?
