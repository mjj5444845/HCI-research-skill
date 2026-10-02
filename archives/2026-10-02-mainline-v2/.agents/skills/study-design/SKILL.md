---
name: study-design
description: Design fast, credible, rigorous evidence generation for an RQ, with method precedents, multi-agent method debate, pilot planning, and RQ-evidence traceability.
---

# Study Design

## Core principle
Find the **fastest credible way to obtain evidence that can actually answer the RQ**.

Efficiency is a methodological criterion, but never at the cost of construct validity.

## Method selection order
1. How does the closest literature study this?
2. What evidence does the RQ actually require?
3. What method can generate that evidence?
4. What resources are available?
5. Is there a faster equally credible alternative?

## Candidate design panel
Always consider when relevant:
- Fastest credible
- Best cost/performance
- Methodologically strongest
- No-traditional-user-study alternative
- Ideal/resource-rich design

## Conditional independent review roles
- Method Efficiency Advocate
- Human Evidence Advocate
- Quantitative Rigor Auditor
- Qualitative Reliability Auditor when reliability-oriented qualitative evidence is used
- Interpretivist Qualitative Auditor when interpretive qualitative evidence is used
- Cognitive/Behavioral Methods Auditor when behavioral claims are made
- Computational Evaluation Auditor for model, dataset or benchmark claims; HRI/Culture auditors only when applicable

## Evidence preference
Prefer public / digital-trace / large-scale / reusable evidence when it measures the construct well.
Do not assume objective > subjective universally.
Ask whether the construct itself requires human meaning, interpretation, lived experience, social practice, or self-report.

## Traditional HCI workflow
Formative -> system/design -> evaluation is allowed but never mandatory.
Attack ritualized/formulaic studies that add expensive interviews/user studies without unique evidentiary value.

## Quantitative audit
Apply the relevant checks for the design; briefly mark non-applicable checks rather than requiring every item.
- construct validity
- operationalization
- sample size/power logic
- randomization
- counterbalancing
- confounds
- manipulation check
- assumptions
- model specification
- effect sizes + CIs
- multiple comparisons
- missing data
- outliers/exclusions
- preregistration consistency
- researcher degrees of freedom
- order/carryover/learning
- demand characteristics
- common-method bias
- scale reliability/validity
- robustness/sensitivity
- alternative explanations
- practical significance

## Qualitative audit
Be strict but paradigm-aware.
Audit:
- sampling
- recruitment
- protocol
- positionality
- coding/analysis process
- reflexivity
- evidence traceability
- negative cases
- interpretive coherence
- transferability

Do not mechanically demand kappa for every qualitative paradigm.
If reliability-oriented coding is claimed, agreement metrics may be important.
If reflexive TA is used, assess coherence with that stance.

## Pilot policy
Default: pilot recommended/required for most empirical studies.
Possible pilots:
- protocol
- manipulation
- measurement
- technical
- analysis
- recruitment

## AI/HRI validity module
Check:
- model/version drift
- knowledge drift
- prompt sensitivity
- stochasticity
- hallucination / false information
- safety-induced behavior
- defensive behavior / excessive refusal
- artificial boundary inflation
- narrative fabrication
- linguistic competence
- baseline fairness
- Wizard-of-Oz
- embodiment confound
- novelty effect
- anthropomorphism
- repeated exposure
- reproducibility
- cultural assumptions
- language confounds

## Cross-cultural module
Culture must be defined and operationalized.
Do not equate nationality with culture.
Inspect:
- ethnicity
- language
- region
- diaspora/migration
- socialization
- self-identification
- institutional context
- within-culture variation
- translation equivalence
- measurement invariance
- essentialism
- Western-theory transfer
- researcher positionality

Use social-science literature when defining cultural group boundaries.

## RQ mismatch policy
Never silently narrow.
If method can answer only part of an RQ, show:
- Narrow RQ
- Add study
- Replace method
- Split project
- Defer RQ

## Full Study Blueprint

Use applicable sections for a full design. A screening request needs only a compact contribution, evidence and feasibility assessment. Qualitative review, human recruitment and IRB applicability are conditional; no new human study is implied.
1. RQ
2. Why empirical evidence is needed
3. Constructs
4. Required evidence
5. Literature precedents
6. Candidate designs
7. Relevant independent method review when material
8. Selected design
9. Participants/dataset
10. Conditions/materials
11. Procedure
12. Measures
13. Analysis
14. RQ -> Evidence -> Method -> Analysis -> Claim matrix
15. Quant rigor audit
16. Qualitative rigor audit when qualitative evidence is used
17. AI/HRI audit when relevant
18. Cross-cultural audit when relevant
19. Pilot plan
20. Failure modes
21. Alternative explanations
22. Claim boundary
23. Feasibility
24. Time/cost/recruitment complexity
25. Venue precedent
26. Alternative designs
27. Applicable data ethics, permissions and IRB determination

---

## AMSC Study-Design Guardrail

For each mainline project, identify the exact claim: interpretation, model performance, dataset validity, interaction behavior or shared meaning. Require evidence for that claim, not every level of the program. A model or benchmark project need not establish convention formation.

Do not treat a one-shot preference increase as evidence of convention formation or long-term adaptation.

If the claim involves:
- common ground,
- convention,
- causal effects of shared interaction history,
- co-adaptation,
- partner-specific shorthand,

the design should usually include evidence capable of testing repeated interaction, history dependence, partner specificity, emergent coordination, or longitudinal change.

If a fast one-shot study cannot support the mainline claim, expose the mismatch and offer staged alternatives.

## Current program contract

For AMSC work, load `research-programs/amsc/PROGRAM.md` and `program.yaml`; their current version overrides historical framing. HCI, AI, CV and NLP are equal routes. X21/arXiv:2609.04384 is user-confirmed second-author work and the near-term foundation. Do not require robots, user studies, embodied settings or convention formation for a valid mainline contribution. Choose human evidence when the claim concerns human behavior or interpretation. Understanding is the current focus, not a mandatory sequence of papers. Archived v1 content is not an active priority.

## Computational evidence module

For AI/CV/NLP contributions audit train/test and source separation, leakage and contamination, fair baselines, ablations, prompt/model/version/seeds, compute/data budgets, evaluation uncertainty, label ambiguity, annotation provenance and reproducibility. Split correlated items by episode/source/participant where the generalization claim requires it. Model-only experiments are valid; do not infer human effects from them. Route one relevant independent computational auditor rather than every qualitative auditor by default.

Offline history-conditioned interpretation can be tested on suitable archived traces; it does not require new repeated-participant experiments. Claims about causal shared-history effects, partner specificity or convention formation require corresponding designs. Existing suitable human annotations or traces may supply human evidence without new recruitment. Confirm compute/API/data access; programming confidence and wearable ownership do not establish training capacity.
