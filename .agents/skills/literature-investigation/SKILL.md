---
name: literature-investigation
description: Build a high-confidence literature landscape, closest-work set, controversy map, candidate gaps, and novelty assessment with missing-paper attacks.
---

# Literature Investigation

## Typical missions
- vague idea: has this been studied?
- novelty validation
- related work for proposal/paper
- reviewer check of novelty claims

## Modes
Ask/select when useful:
- Quick Scan
- Focused Investigation
- Deep Investigation
- Review-grade Investigation

## Workflow

### 1. Define mission
Record:
- idea/RQ/claim;
- required depth;
- target communities;
- time/venue constraints if any.

### 2. Concept decomposition
Decompose A+B+C concepts into:
- exact intersections;
- pairwise intersections;
- adjacent phenomena;
- theoretical concepts;
- methodological analogues;
- historical terminology;
- contradictory concepts.

### 3. Multi-path search
Search across relevant communities and disciplines.
For each cross-disciplinary branch, explain why it is substantively relevant.

### 4. Dynamic literature map
Every important paper gets facets:
- topic
- RQ
- method
- population
- technology
- theory
- construct
- measure
- finding
- contribution
- limitation
- context
- author/lab
- venue

Support multiple views without changing underlying paper objects.

### 5. Paper Investigation handoff
Candidate funnel:
- all candidates -> triage
- relevant -> Paper Investigation Lite/Normal
- important/foundational/closest -> Deep as needed

### 6. Controversy detection
Do not merely list papers.
Identify:
- competing positions;
- conflicting findings;
- differing assumptions;
- method/population/operationalization reasons for disagreement;
- unresolved issue.

Use multi-agent debate where useful.

### 7. Gap generation
Generate many candidate gaps:
- empirical
- contradiction
- context/population
- theoretical
- measurement
- methodological
- boundary condition
- design opportunity
- new technical capability
- outdated historical assumption
- unexplained phenomenon
- policy/social consequence

### 8. Gap red team
For each candidate:
- is it actually missing?
- why does it matter?
- does closest work already resolve it?
- would proposed evidence resolve it?
- is it merely "few studies..."?
- is the researcher/agent manufacturing importance?

Rank survivors.

### 9. Novelty debate
Use domain-specific agents.
Assess separately:
- problem novelty
- context novelty
- empirical novelty
- technical novelty
- technology-enabled research novelty
- method novelty
- theory novelty
- design novelty
- dataset/benchmark/resource novelty

Never use absolute "no prior work exists" based on normal search.

### 10. Missing Paper Attack
Assume the map is incomplete.
Search alternate terminology, adjacent fields, older work, key labs/authors, citation chains, surveys/reviews, contradictions, and unusual venues.

### 11. Coverage / stopping
Track marginal yield per search round.
Stopping signal:
- high-value new results approach zero;
- remaining results are increasingly peripheral or low-relevance;
- no new foundational/closest/theory/author/controversy clusters appear;
- Missing Paper Attack fails to uncover major omissions.

Output `coverage_confidence`, not fake completeness.

## Final deliverables
- Chinese + English Executive Research Brief
- Research landscape
- Key papers
- Foundational papers
- Closest work
- Research clusters
- Historical evolution
- Methods
- Theories
- Established findings
- Disagreements/controversies
- Open questions
- Candidate gaps
- Surviving gaps
- Novelty assessment
- Missing-paper audit
- Search coverage/confidence
- Recommended reading order
- Implications for current project

---

## AMSC Program Integration

When investigating the active AMSC research program:
- classify accepted papers into buckets A–G;
- update Master Literature List incrementally, never rebuild it;
- evaluate every existing Gap Registry entry;
- add a candidate gap only after explicit evidence;
- require >=2 independent evidence sources + Skeptic challenge for HIGH PRIORITY;
- update Current State of Field using ESTABLISHED / EMERGING / CONTESTED / UNDEREXPLORED / OPEN;
- generate Comprehensive Exam mappings for CORE/anchor papers;
- update temporal gap histories when old wording becomes obsolete.

Always determine whether new work changes:
- Meaning
- Grounding
- Convention
- Adaptation
- Embodied Communication

After an AMSC run changes the literature landscape, synchronize evidence-backed changes to the long-term research program, Current State of Field, Gap Registry, Research Graph, next-question priority, and the public projection in `research-programs/amsc/state/workflow_dashboard.json`. The exam knowledge base is a downstream filtered view: update it only when the changed landscape directly affects an exam theme, anchor, or synthesis claim. Claims lacking finding-level evidence belong in a validation queue or `CANNOT_CLAIM`, not in the public field-known set.
