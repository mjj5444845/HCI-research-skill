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
Which assumption may fail when theory X is transferred to AI or multimodal communication?

### Connection
How could theory X explain multimodal and visual communication?

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
- becomes an anchor for a current exam theme.

## Dashboard update contract

The exam is a short-term downstream view of the long-term AMSC research program. It does not own paper facts, field claims, gaps, or the research trajectory. Read those upstream objects and select only what serves the current exam scope.

After every AMSC exam workflow, update `research-programs/amsc/state/comprehensive_exam.yaml` and the exam projection in `research-programs/amsc/state/workflow_dashboard.json`. Keep source availability, Agent investigation readiness, and researcher reading/mastery as separate dimensions. Automation may update the first two; researcher progress changes only from explicit user actions or answers. Append provenance and mark dependent questions/claims stale when upstream evidence changes; never rewrite upstream research state merely to make the exam narrative cleaner.

## Current program contract

For AMSC work, load `research-programs/amsc/PROGRAM.md` and `program.yaml`; their current version overrides historical framing. HCI, AI, CV and NLP are equal routes. X21/arXiv:2609.04384 is user-confirmed second-author work and the near-term foundation. Do not require robots, user studies, embodied settings or convention formation for a valid mainline contribution. Choose human evidence when the claim concerns human behavior or interpretation. Understanding is the current focus, not a mandatory sequence of papers. Archived v1 content is not an active priority.
