# Research Radar — AMSC Mainline — 2026-08-27

## Run scope and epistemic status

- Configured window: 2026-08-20 through 2026-08-27 (`lookback_days: 7`).
- First-run rule: papers outside the window are separated as **recovered/backfill** and are not reported as this week's publications.
- Search logic: crossed communication signal/function/mechanism/interaction/embodiment terms; attacked terminology aliases including lexical entrainment, conceptual pact, pseudo-dyad, belief revision, repair, partner swap, world-model alignment, and partner-to-population transfer.
- Deduplication: DOI first, then normalized title/year and arXiv/conference aliases. CHI 2026 Maeda et al. was already C8; ACL 2026 Zeng et al. was already X2; Eye2Eye was already X3.
- Evidence levels: the accepted records below were audited against accessible full texts. Preprints remain labeled preprints. Agent investigation does not imply researcher reading or mastery.

# 【本周论文及其总结分析】

## Important — in-window

### Beyond Local Surprise: Grounded Dialogue as Selective Belief Revision under Referential Uncertainty

- Authors: Ziming Liu, Bhanu Chaitanya Jasti, Ziyang Xu, Hongyu Wu, Yi Wu, Jiqun Liu
- Venue / Status: arXiv:2608.26035v1, submitted 2026-08-26; full text accessible
- Core Question: Should a grounded dialogue system revise an accumulated interpretation in response to local mismatch or accumulated uncertainty?
- Method: Four preserve/revise policies are compared on PhotoChat while perception and interaction data are held fixed.
- Findings: The constructed local-mismatch policy destabilizes grounding and sharply harms retrieval. The uncertainty-sensitive policy produces structured selective revision, but its retrieval is not better than simple conservative/fixed baselines within reported variability.
- Relation to My Research: A candidate computational component for convention maintenance/revision; it also reinforces the need to separate task retrieval from grounding dynamics.
- Priority: **Important**, mainline fit 7.2/10; core-adjacent method, not human-mechanism evidence.
- Most Important Remaining Gap: Human and embodied validation of when a jointly established signal–meaning mapping should be preserved, repaired, revised, or retired.
- Evidence boundary: No new human experiment; PhotoChat contains sparse repair, and selectivity is partly induced by regularization/target revision rate. The paper is not evidence that human listeners use this mechanism. [Primary preprint](https://arxiv.org/abs/2608.26035)

### Embodied Multi-Agent Coordination by Aligning World Models Through Dialogue

- Authors: Vardhan Dongre, Dilek Hakkani-Tur
- Venue / Status: SIGDIAL 2026, August 2026; full ACL paper
- Core Question: Does dialogue align embodied agents' evolving world models rather than merely reduce action conflicts?
- Method: PARTNR is extended with dialogue under partial observability; three LLMs are evaluated with world-graph metrics for observation convergence, information novelty, and belief-sensitive messaging.
- Findings: Dialogue reduces action conflicts by 40–83 percentage points but lowers task success versus silent coordination.
- Relation to My Research: Direct method precedent for distinguishing embodied coordination, message utility, partner-belief modeling, and task outcome.
- Priority: **Important**, mainline fit 8.5/10; embodied method evidence, adjacent because no humans participate.
- Most Important Remaining Gap: Transfer these diagnostics to human–AI interaction and test jointly negotiated, history-dependent conventions.
- Evidence boundary: AI–AI simulation cannot establish human–AI common ground or social convention. [ACL Anthology](https://aclanthology.org/2026.sigdial-1.21/)

## Must Read — first-run recovered/backfill

### Success and Cost Elicit Convention Formation for Efficient Communication

- Authors: Saujas Vaduguru, Yilun Hua, Yoav Artzi, Daniel Fried
- Venue / Status: ACL 2026, DOI 10.18653/v1/2026.acl-long.1946; July publication, outside the strict seven-day window
- Core Question: Can multimodal models be trained to form efficient ad hoc referring conventions without additional human-produced demonstrations?
- Method: Success+cost preference training from simulated photo/tangram reference games, followed by model-speaker→human-listener evaluation.
- Findings: The paper reports message length reductions up to 41%, success gains over interaction, and faster human responses; success-only or cost-only training is insufficient.
- Relation to My Research: Directly weakens any generic claim that AI cannot display convention-like adaptation; identifies success×cost as a causal training pressure.
- Priority: **Must Read**, mainline fit 9.6/10; core.
- Most Important Remaining Gap: Reciprocal role-switching, repair, partner-history ablation, mutual belief, transfer, and physical multimodal embodiment.
- Evidence boundary: Efficient trained reference policy is not yet a mutually negotiated human–AI convention. [ACL Anthology](https://aclanthology.org/2026.acl-long.1946/)

### Aligned but Not Partner-Specific

- Authors: Po-Ya Angela Wang, Chinmaya Mishra, Aslı Özyürek, Paula Rubio-Fernández, Esam Ghaleb
- Venue / Status: arXiv:2606.08081v1; preprint, outside the strict window
- Core Question: Does observed MLLM alignment depend on shared partner history?
- Method: A constrained pseudo-dyad baseline preserves referent, round position, turn count, and success while breaking partner history; 45 MLLM dyads are compared with 42 human dyads.
- Findings: Human real dyads compress and diverge from pseudo-dyads; agent real/pseudo overlap is near ceiling and not reliably different. Agents coordinate through verbose shared priors rather than compact partner-specific conventions in this setup.
- Relation to My Research: Supplies a core falsifiable diagnostic: history-severed counterfactuals.
- Priority: **Must Read**, mainline fit 9.7/10; core method/contradiction evidence.
- Most Important Remaining Gap: Apply pseudo-dyad, partner swap, and repair probes in mixed human–embodied-AI dyads.
- Evidence boundary: Single GPT-5 setup, AI–AI only, and preprint status. [Primary preprint](https://arxiv.org/abs/2606.08081)

### LLMs and People Both Learn to Form Conventions—Just Not with Each Other

- Authors: Cameron R. Jones, Agnese Lombardi, Kyle Mahowald, Benjamin K. Bergen
- Venue / Status: arXiv:2602.08208v1; preprint, outside the strict window
- Core Question: Can general-purpose LLMs form conventions in bidirectional role-switching dyads with people?
- Method: Preregistered human–human, human–AI, and AI–AI repeated tangram games plus a second humanlike-prompt intervention.
- Findings: Same-type dyads show convention-like performance signatures; mixed dyads remain worse. A humanlike prompt shortens messages but does not reliably close the lexical-overlap gap.
- Relation to My Research: Reframes generic capability as heterogeneous-dyad compatibility and shows that surface imitation is insufficient.
- Priority: **Must Read**, mainline fit 9.4/10; core.
- Most Important Remaining Gap: Identify whether mixed-dyad failure is caused by incompatible priors/representations, asymmetric repair, or lack of reciprocal partner modeling.
- Evidence boundary: AI–AI uses identical GPT-5 copies/prompts and begins with high overlap; “shared interpretive biases” is an interpretation, not a manipulated mechanism. [Primary preprint](https://arxiv.org/abs/2602.08208)

## Important — first-run recovered/backfill

### A Benchmark to Assess Common Ground in Human-AI Collaboration

- Authors: Christian Poelitz, Finale Doshi-Velez, Siân Lindley
- Venue / Status: arXiv:2602.21337v1; preprint, outside the strict window
- Core Question: How can common ground be assessed through joint action, reference, repair, and situation awareness rather than surface dialogue acts alone?
- Method: A collaborative puzzle benchmark with a 2×2 role×shared-view study involving 40 participants and GPT-4.1.
- Findings: The benchmark reproduces several human-grounding expectations while showing AI failures to build on clarification, maintain puzzle state, and adapt vocabulary.
- Relation to My Research: Resolves the broad “no human–AI common-ground benchmark” claim and becomes closest work for a narrower embodied diagnostic battery.
- Priority: **Important**, mainline fit 9.0/10; core method.
- Most Important Remaining Gap: Add history ablation, role reversal, partner swap, breakdown/repair manipulation, transfer, multiple models, and embodiment.
- Evidence boundary: Single model, N=40, text/puzzle task, preprint. [Primary preprint](https://arxiv.org/abs/2602.21337)

### From Partners to Populations: A Hierarchical Bayesian Account of Coordination and Convention

- Authors: Robert D. Hawkins, Michael Franke, Michael C. Frank, Adele E. Goldberg, Kenny Smith, Thomas L. Griffiths, Noah D. Goodman
- Venue / Status: Psychological Review 130(4), 2023, DOI 10.1037/rev0000348; recovered theory anchor
- Core Question: How can fast partner-specific common ground coexist with stable population conventions and transfer across partners?
- Method: CHAI hierarchical Bayesian theory, new repeated communication experiments, and simulation.
- Findings: The account covers within-partner efficiency, gradual transfer to strangers, and contextual influence on convention formation.
- Relation to My Research: Prevents AMSC from claiming generic convention lifecycle/transfer theory as absent and shows that partner-specific origin and later transfer are compatible.
- Priority: **Must Read**, mainline fit 9.7/10; theory core.
- Most Important Remaining Gap: Scalable online inference and falsifiable lifecycle control for embodied human–AI multimodal interaction.
- Evidence boundary: Human linguistic interaction and simulation, not embodied human–AI evidence. [Open manuscript](https://arxiv.org/abs/2104.05857)

## Track / rejected summary

- **Maru** — Important adjacent: visible/editable information architecture can stabilize user-system alignment, but N=12 sessions occur within one ~120-minute study; this is explicit structured memory, not natural convention or longitudinal personalization. [Preprint](https://arxiv.org/abs/2608.25565)
- **MemUse** — Important adjacent method: natural memory integration predicts satisfaction better than direct-QA memory scores, but it does not measure shared meaning, grounding, or convention. [Preprint](https://arxiv.org/abs/2608.24189)
- **TOSS**, **MOSAIC**, and incongruent virtual-human behavior — Track only: useful teaching/ToM/nonverbal methods, but no reciprocal human–AI grounding evidence.
- **Aura**, free-energy motor plasticity, and pure robot task learning — Rejected from mainline: adaptation/embodiment keywords without a communication-meaning mechanism.

# 【Master Literature List 更新】

- Version transition: `v1.1 → v1.2`.
- Baseline: all 41 user-defined papers retained; no priority decrease, supersession, deletion, or silent correction.
- Added as separately labeled candidates: X6–X12 (two in-window; five recovered/backfill).
- Recovered classic/theory anchor: CHAI (X12).
- Deduplicated, not re-added: C8 Maeda et al.; X2 Zeng et al.; X3 Eye2Eye.
- No paper was marked partially superseded or superseded.

# 【当前研究现状与 Gap 更新】

## What changed in our understanding

1. **AI convention behavior is regime-dependent, not a binary capability.** Targeted success×cost training can produce human-legible efficiency gains in a one-way reference setup, while mixed human–AI dyads, history-severed pseudo-dyads, and richer role-asymmetric tasks expose failures.
2. **Coordination is not convention.** Task success, lexical overlap, message shortening, memory retrieval, world-model alignment, mutual belief, and interaction-history-dependent convention are distinct evidence layers.
3. **Generic benchmark absence is no longer claimable.** Human–AI common-ground benchmarks and partner-history diagnostics already exist as components.
4. **Partner-specific origin and transfer are compatible.** A convention may originate in dyadic history and later generalize; “partner-specific” must be tested as origin dependence, not defined as permanent non-transferability.

## Gap decisions

- **GAP-01 — REDEFINED / still open:** Do not claim human meaning formation or transfer is unstudied. The residual question is how an embodied Agent detects and updates interaction-history-dependent multimodal meaning across dyad and population levels.
- **GAP-02 — PARTIALLY_ADDRESSED:** Trained models can show convention-like efficiency. The unresolved construct is a mutual human–AI mapping whose formation is counterfactually dependent on shared interaction history, followed by repair and transfer tests.
- **GAP-03 — REDEFINED:** Generic history use and common-ground tracking already exist. The remaining lifecycle is establishment, maintenance, repair/revision, context-sensitive retirement/forgetting, partner/context transfer, and renegotiation after breakdown.
- **GAP-04 — PARTIALLY_ADDRESSED:** Pseudo-dyads, human–AI puzzle benchmarks, factorial roles, and outcome/alignment distinctions already operationalize pieces. The opportunity is integration and validation, not invention from zero.
- **GAP-05 — UNCHANGED / cannot claim:** This run did not add finding-level evidence about informal visual language as embodied communication theory.
- **GAP-06 — UNCHANGED / cannot claim:** This run did not establish field-wide separation of social meaning and functional robot-state communication.
- **GAP-07 — PARTIALLY_ADDRESSED, HIGH residual priority:** “No benchmark exists” is resolved. No audited single protocol yet integrates human–human/human–AI/AI–AI/pseudo-dyad comparisons, role reversal, repair perturbation, partner swap, transfer, and physical multimodality.

## Current Top Research Gaps

1. Counterfactually interaction-history-dependent **mutual human–embodied-AI convention** formation, distinguished from shared priors, imitation, memory retrieval, and task familiarity.
2. **Convention lifecycle** under breakdown: detection, reciprocal repair, revision, context-sensitive forgetting/retirement, and renegotiation.
3. **Transfer structure**: when a dyad-originated mapping should remain partner-specific, generalize to new referents/partners, or become a community convention.
4. A unified **embodied diagnostic protocol** that measures task outcome, effort, mapping stability, partner specificity, belief/representation alignment, repair, and transfer separately.

## Research Graph updates

- Added source-verified paper nodes for X6–X12；作者列表保留在 paper objects 中，尚未把全部 coauthorship 展开成 graph edges。
- No affiliation or lab membership was inferred.
- Scholarly relations are recorded only as inferred when used: X9 challenges success/overlap-only convention evidence; X12 supplies the theory lineage for partner-to-population transfer.

## Comprehensive Exam downstream view

- Theme 3 (Common Ground & Convention Formation) receives X8–X12 as candidate anchors/closest work because they directly change the anchor/gap map.
- X6/X7 remain method candidates, not required exam anchors.
- Researcher reading/mastery remains `UNTRACKED`; no score, progress, or human note was inferred.

## Quality controls and limitations

- Strict-window and backfill papers are separated; crawler recency was not treated as publication recency.
- Seven full-text evidence audits do not constitute seven full Paper Investigation workflows.
- X6, X9, X10, and X11 are preprints; their status may change.
- Search was a bounded high-impact mechanism scan, not Scopus/WoS/Crossref exhaustive export and not evidence that no additional work exists.
- Non-English HRI and incompletely indexed 2025–2026 proceedings may remain undercovered.
- Site build/test, commit, and push were intentionally deferred to the main task after the ongoing website reconstruction, per user instruction.

# Q1 — What do we know?

- Repeated interaction and communicative pressure can yield more efficient referring behavior in humans and, under some training/interaction regimes, models.
- Current model success is highly regime-dependent; high success or label overlap can be caused by shared priors and verbosity rather than partner-history-dependent convention.
- Common-ground benchmark components, history-severing controls, embodied world-state diagnostics, and partner-to-population theory already exist.

# Q2 — What don't we know?

- Whether human and embodied AI can reciprocally negotiate a signal–meaning mapping whose formation genuinely depends on their shared interaction history.
- Why mixed human–AI dyads fail: incompatible priors, asymmetric grounding effort, repair policy, representation mismatch, or some combination.
- How such mappings should be detected, repaired, forgotten, and transferred across modalities, contexts, partners, and communities.

# Q3 — What should I study next?

Highest-value next study:

> In a physical or AR repeated collaboration task, factorially compare memory-only, adaptation-only, and convention-aware Agent policies, with human–human, human–AI, AI–AI, and history-severed pseudo-dyad controls; include role reversal, induced ambiguity/breakdown, partner swap, and new-referent/context transfer.

This design is non-obvious because it does not ask whether another cue improves warmth or task success. It identifies which observable signatures require a jointly formed convention rather than memory, imitation, shared priors, or task familiarity.
