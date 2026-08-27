---
name: paper-investigation
description: Critically read, reconstruct, audit, contextualize, and internalize a research paper; not a simple summary.
---

# Paper Investigation

## Trigger
Use when the user asks to read, understand, summarize, critique, compare, extract, or deeply investigate a paper.

## Reading modes
- triage
- normal
- deep
- method-focused
- related-work-focused
- reviewer-style
- replication-focused

If mode is not specified, infer from context and state the chosen depth.

## Workflow

### 1. Triage
Determine:
- what the paper is actually about;
- why it exists;
- relevance;
- novelty value;
- method value;
- theory value;
- citation value;
- reading priority.

Suggested priority:
- Skip
- Track
- Worth Reading
- Important
- Must Read

### 2. Reconstruct the argument
Build:
Problem -> Claimed Gap -> RQ -> Method -> Evidence -> Claim -> Contribution -> Significance

### 3. Method Audit
Do not stop at method labels.
Inspect the full evidence generation process using domain-appropriate checks.

### 4. Claim–Evidence Audit
For each consequential claim:
- exact claim;
- supporting evidence;
- analysis;
- what evidence actually supports;
- boundary;
- alternative explanation;
- overclaim status.

### 5. Contribution Audit
Do not accept the paper's contribution statement at face value.
Separate:
- author-claimed contribution;
- agent-reassessed contribution;
- contribution type;
- strength;
- novelty;
- whether it materially increases community knowledge/capability.

### 6. Significance Inflation Audit
Check:
- Evidence -> Claim gap
- Claim -> Contribution gap
- Contribution -> Significance gap
- Context -> generalized-context gap

### 7. Attack
Always on.
Classify:
- Fatal flaw
- Major concern
- Minor concern
- Missed opportunity
- Unresolved question
- Possible gap exposed

### 8. Contextualize
For important papers, investigate when resources permit:
- prior work by authors;
- key cited work;
- forward citations;
- project/code/talk/blog;
- closest competing work;
- later corrections or contradictions.

Never invent inaccessible content.

### 9. Connect
Produce concrete links to the researcher's projects:
- reusable construct;
- method;
- manipulation;
- measure;
- theory;
- framing;
- limitation to avoid;
- dataset/benchmark;
- specific reason the connection matters.

### 10. Internalize
Populate:
- `remember_when`
- reusable components
- literature-map facets
- graph updates

For every paper accepted for persistent display, create or update one evidence-traceable JSON record under `state/paper-pages/<slug>.json` using `schemas/paper-page.schema.json`. The `slug` must be stable and URL-safe. Record the real access status and use explicit uncertainty or empty arrays for unavailable content; never fill a web page by inventing methods, findings, or contributions. The website build generates one independent page per JSON record.

When the active program is AMSC, also update `research-programs/amsc/state/workflow_dashboard.json`: refresh affected field claims/gaps, the paper's Agent investigation readiness, and `workflow_runs`. Never infer or overwrite researcher reading/mastery progress.

### 11. Communication gate
Only if explicitly judged `worth_sharing: true`:
- offer a Xiaohongshu post;
- offer a WeChat Official Account article.

Do not generate these by default.

## Output levels

### Paper Card
- What
- Why
- How
- Found
- Real contribution
- Biggest weakness
- Why researcher should care
- Priority

### Research Brief
1. What is this paper actually about?
2. Why did the problem matter?
3. What did prior work fail to do?
4. What exactly did the authors do?
5. Why this method?
6. What evidence was obtained?
7. What can the evidence support?
8. What can it not support?
9. What is genuinely new?
10. Where is the argument weak?
11. What controversy/gap does it expose?
12. What should future work do?
13. What can be reused?
14. When should this paper be remembered?

### Deep Investigation
Include full method, claim-evidence, contribution, context, and connection audits.

---

## AMSC Mainline Mapping

For papers relevant to the active AMSC program, additionally report:

- AMSC bucket(s): A–G
- Mainline stage:
  - informal expression
  - social meaning/pragmatics
  - grounding/common ground
  - convention
  - personalization/co-adaptation
  - situated adaptive communication
- mechanism contribution:
  - Meaning
  - Grounding
  - Convention
  - Adaptation
  - Embodied Communication
- related Gap Registry IDs
- whether the paper strengthens, weakens, partially addresses, redefines, resolves, or removes a gap
- exam theme and potential oral question
- whether it belongs in Master Literature List

Do not force a paper into the mainline if the connection is superficial.
