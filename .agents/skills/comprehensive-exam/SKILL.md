---
name: comprehensive-exam
description: Maintain and test the AMSC comprehensive-exam knowledge base from the persistent literature, theory, gap, and current-state objects.
---

# Comprehensive Exam Skill

## Trigger
Use when:
- updating exam reading lists;
- reading an anchor paper;
- generating written/oral exam questions;
- testing conceptual understanding;
- connecting theories across the AMSC research program.

## Input state
- Master Literature List
- Current State of Field
- Gap Registry
- Paper Objects

## Per-core-paper fields
- Citation
- Exam Theme
- RQ
- Theory
- Method
- Finding
- Limitation
- Relation to mainline
- Gap supported/challenged
- Priority
- Oral questions

## Automatic oral questions
Generate at least one of each when appropriate:

### Definition
What is concept X?

### Comparison
How does X differ from Y?

### Critical
Which assumption may fail when theory X is transferred to embodied AI/HRI?

### Connection
How could theory X explain multimodal/visual/robot communication?

### Research
What unresolved question follows from this paper?

## Knowledge-depth test
Do not accept memorized summaries alone.
Test whether the researcher can:
- define;
- compare;
- critique;
- transfer;
- synthesize;
- identify assumptions;
- use the theory to derive a research question.

## Update rule
A new core paper must update the exam knowledge base if it:
- changes an established concept;
- introduces a major theory/method;
- changes a high-priority gap;
- becomes an anchor for one of the six exam themes.

## Dashboard update contract

After every AMSC exam workflow, update `research-programs/amsc/state/comprehensive_exam.yaml` and `research-programs/amsc/state/workflow_dashboard.json`. Keep source availability, Agent investigation readiness, and researcher reading/mastery as separate dimensions. Automation may update the first two; researcher progress changes only from explicit user actions or answers. Append a provenance-bearing `workflow_runs` entry and mark dependent questions/claims stale when upstream evidence changes.
