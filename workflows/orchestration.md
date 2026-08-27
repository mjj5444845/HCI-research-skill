# Workflow Orchestration

## Natural entry points

### "读这篇论文"
Paper Investigation

### "这个 idea 有人做过吗 / novel 吗"
Literature Investigation -> Novelty Domain Panel -> Idea Development

### "这个方向的 gap 是什么"
Literature Investigation -> Candidate Gap Generation -> Gap Red Team -> Senior Faculty Synthesis

### "这个 idea 值不值得做"
Idea Development -> Literature Investigation if evidence missing -> Feasibility -> Multi-agent decision

### "怎么设计实验"
Study Design -> Literature method precedents -> Method Panel -> Blueprint

### "最近有什么新论文"
Research Radar -> Paper Investigation for top papers -> Knowledge integration

## Required shared state

Paper Investigation updates:
- Paper Objects
- literature facets
- graph
- project connections

Literature Investigation consumes:
- Paper Objects
and updates:
- Literature Objects
- gaps
- novelty
- graph

Idea Development consumes:
- Literature Objects
and updates:
- Research Project

Study Design consumes:
- Research Project
- Literature method precedents
and updates:
- Study Blueprints
- RQ/Evidence/Claim traceability

Research Radar touches all upstream knowledge objects but must not silently make final project decisions.

---

# Active Research Program Orchestration

When the user's request is about their PhD mainline:

```text
AMSC Research Program
        ↓
Research Program Guardrail
        ↓
┌──────────────────────────────────────────────┐
│ Paper Investigation                         │
│ Literature Investigation                    │
│ Idea Development                            │
│ Study Design                                │
│ Research Radar                              │
└──────────────────────────────────────────────┘
        ↓
Persistent synchronized state:
- Master Literature List
- Current State of Field
- Gap Registry
- Comprehensive Exam KB
- Research Graph
```

Research Radar is the main recurring entry point.

A new meaningful paper should trigger:
Paper Investigation
-> Mainline mapping
-> Master List decision
-> Gap updates
-> Current-state updates
-> Exam updates
-> Research Graph updates

The final synthesis should always answer:
- What do we know?
- What don't we know?
- What should I study next?
