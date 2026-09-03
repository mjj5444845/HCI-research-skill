# AMSC Research Radar — 2026-09-03

**Run:** `amsc-radar-2026-09-03`

**Window:** 2026-08-27 00:00–2026-09-03 10:00, America/New_York

**Program:** Adaptive Multimodal Social Communication (AMSC)

## Executive interpretation (English)

This run does not overturn the AMSC chain **Meaning → Grounding → Convention → Adaptation → Embodied Communication**, but it materially sharpens the novelty boundary. Artificial-agent populations can already form decentralized grounded lexical conventions under designer-specified language-game dynamics, and prompted LLM dyads can develop and partially transmit shorthand. Therefore, the defensible opportunity is not whether AI or robots can form codes in general. It is how humans and embodied AI agents jointly form, confirm, repair, and appropriately transfer partner-specific multimodal conventions—and how such claims can be distinguished from alignment, audience design, user attunement, system memory, shared priors, and task learning.

No gap status changed. GAP-02, GAP-03, GAP-04, and GAP-07 remain `PARTIALLY_ADDRESSED`; GAP-01, GAP-05, and GAP-06 remain `REDEFINED`. Three evidence-audited candidates were added: X17–X19.

## Search, access, and deduplication

- Mechanism-first searches covered common ground, conceptual pact, lexical entrainment, audience/recipient design, repeated reference, emergent communication, partner specificity, repair, interaction history, multimodal signaling, and embodied HRI.
- Sources included arXiv records/full text, DOI/Crossref metadata, venue and researcher pages, citation/lineage searches, and targeted historical missing-paper attacks.
- The exact window was supplemented by late-indexed/backfill detection. Publication date, DOI creation date, and first visible indexing were kept distinct.
- X19's TACL record was merged with arXiv:2401.08461 and the AAMAS 2024 extended abstract as one lineage. It is a recovered, substantially expanded method anchor—not a wholly new mechanism and not a duplicate record.
- ACM, IEEE, Taylor & Francis, and Emerald access was incomplete for several items. Finding-level claims were not made when only titles or metadata were available.

## 【本周论文及其总结分析】

### X17 — GlossoGen: Emergent Language in Complex Multi-Agent LLM Interactions

- **Authors:** Elias Stengel-Eskin, Newton Sander, Carlos Bonetti, Sasha Boguraev, James Bowler, Hale Sirin, Simon Kirby
- **Venue/status:** arXiv:2609.01491, v1 2026-09-01; open full text
- **Core question:** 在复杂、角色不对称且通信成本受限的 AI–AI task 中，LLM agents 会在什么条件下发展并传递非普通英语的协议？
- **Method:** SaveVeyru 两-agent task；字符预算、有/无免费 postmortem、多模型比较、productive-form probes，以及替换一名 agent 后提供 0/1/5/10 rounds history 的 swap study。
- **Findings:** 紧字符预算与 postmortem 的组合产生更高效、较不似英语的 shorthand；newcomer 获得更多历史后成功率提高，针对 compositional terms 的 clarification questions 减少；只检验了一次替换。
- **Relation to AMSC:** 提供 negotiation、history dosage、swap、clarification 和 transmission 的可借鉴组件，直接影响 GAP-02/03/04/07 的方法边界。
- **Priority:** **Important**。
- **Most important remaining gap:** Prompt 明示要求发展 shorthand，postmortem 允许免费定义 code，部分 linguistic analyses 依赖 LLM judge；一次 swap 不能支持 cumulative cultural evolution，更不能支持 human–embodied-AI common ground。

Source: [arXiv record and full text](https://arxiv.org/abs/2609.01491)

### X18 — From Small Talk to Rapport: Exploring Robot Self-Disclosure in Collaborative Tasks

- **Authors:** Kaitlynn Taylor Pineda, Anvii Mishra, Brian Chien, Angela Guo, Toluwani Williams, Ziang Xiao, Chien-Ming Huang
- **Venue/status:** arXiv:2608.28154, v1 2026-08-28; open full text
- **Core question:** 非拟人实体机器人在共同工作时应如何使用 self-disclosure？
- **Method:** N=50 between-subjects；Franka Panda 与参与者完成约 17 分钟 sorting task；比较 low/high disclosure 的 GPT-4o dialogue，结合行为编码、问卷和访谈。
- **Findings:** High-disclosure 条件下用户 turn-level disclosure 更少；low-disclosure 条件的 perceived teaming 与 coordination 更高；既有 HRI/team experience 调节若干结果。访谈提出 embodiment incongruence、inauthenticity、shallow reciprocity 与 privacy 作为可能解释。
- **Relation to AMSC:** 为 GAP-06 提供非单调 social–functional boundary：更丰富的 social signal 不必然改善 embodied collaboration。
- **Priority:** **Important / adjacent**。
- **Most important remaining gap:** 操作同时改变 disclosure content 与 word count，N=50 却使用较多 covariates/stepwise selection；访谈机制未被因果检验，也没有 interaction-history adaptation 或 convention。

Source: [arXiv record and full text](https://arxiv.org/abs/2608.28154)

### X19 — Emergent Communication in Continuous Worlds: Self-Organisation of Conceptually Grounded Vocabularies at Scale

- **Authors:** Jérôme Botoko Ekila, Lara Verheyen, Jens Nevens, Katrien Beuls, Paul Van Eecke
- **Venue/status:** Transactions of the Association for Computational Linguistics, 2026; DOI 10.1162/tacl.a.799; canonical merge with its 2024 arXiv/AAMAS lineage; open accepted manuscript
- **Core question:** 空白起点的 artificial-agent populations 能否通过局部、去中心化 reference games 在连续/高维感知空间形成 grounded vocabularies？
- **Method:** Agents 轮换 speaker/listener，通过 invention、失败后的 target disclosure、adoption、reward/inhibition 学习；覆盖 37 datasets、最多 100 agents、held-out evaluation、noise、uncalibrated/heteromorphic sensors、sensor loss 与 multiword conditions。
- **Findings:** 七个重点数据集的 held-out success 约为 95.77–99.76%，conventionality 约为 86.55–96.11%；若干异质感知条件下仍可收敛并在 sensor loss 后重组，但强噪声/异质性明显降低 coherence；multiword systems 收敛显著更慢且仍以单词 message 为主。
- **Relation to AMSC:** 是 GAP-02/03/04/07 的强 computational method anchor，彻底封死“人工 agents 不能形成 decentralized grounded conventions”的宽泛叙事。
- **Priority:** **Must Read / recovered method anchor**。
- **Most important remaining gap:** 收敛规则由设计者写入，且共享 candidate scene、object identity、feedback protocol 和常见 encoder prior；conventionality 是 lexical coherence，不是 mutual belief 或 counterfactual shared-history dependence，dataset feature 也不等同物理 embodiment。

Sources: [DOI record](https://doi.org/10.1162/tacl.a.799), [research-portal record](https://researchportal.unamur.be/en/publications/emergent-communication-in-continuous-worlds-self-organisation-of-/)

## Track、recovered omissions 与 next-week watch

### High-value Track

- **Robots playing communication games** ([DOI](https://doi.org/10.1108/RIA-06-2025-0164), 2026-09-02): 摘要支持 real-robot auditory imitation、iterated learning 与 Morse-like proto-linguistic form evolution；现阶段不能确认 signal 是否因果 grounded 于 recipient referent/action，也没有 dyadic common ground，因此不进 Master。
- **MemeBridge** ([arXiv](https://arxiv.org/abs/2609.00491)): cross-cultural meme understanding 与 metaperception asymmetry 可补强 shared-prior/cultural interpretation 诊断，但没有 repeated interaction、repair 或 embodiment。
- **Contradictions ontology for dialogue-based HRI** ([arXiv](https://arxiv.org/abs/2609.02364)): Activity Theory 可作为 breakdown/repair 和规范—功能目标冲突的表示桥；目前是短篇 workshop ontology，无实现或人类实证。
- **VakyArth** ([arXiv](https://arxiv.org/abs/2609.01788)), **AR-HRC situational awareness** ([arXiv](https://arxiv.org/abs/2609.01461)), **multi-party noisy-space robot conversation** ([arXiv](https://arxiv.org/abs/2609.00648)), and **STEP** ([arXiv](https://arxiv.org/abs/2608.27225)) remain diagnostic/method neighbors rather than convention evidence.
- **Therapeutic change and the emergence of common ground over interactional history** ([DOI](https://doi.org/10.1080/08351813.2026.2615626)) is a high-priority validation item; method/findings were inaccessible, so only its existence and metadata are recorded.

### Historical closest-work omissions requiring follow-up

- Rothwell, Shalin & Romigh, **Comparison of Common Ground Models for Human–Computer Dialogue** ([DOI](https://doi.org/10.1145/3410876)): four human–computer task tests mean we cannot claim common-ground models have not been compared in HCI.
- Knutsen & Caroux, **Is common ground built during human-system dialogue device-specific?** ([DOI](https://doi.org/10.1093/iwc/iwaf049)): device-switch reuse challenges the assumption that all system-related shared knowledge is strictly partner/device specific.
- Peña et al. ([DOI](https://doi.org/10.1016/j.ijhcs.2023.103058)), Dombi et al. ([DOI](https://doi.org/10.1016/j.pragma.2022.03.001)), Branigan et al. ([DOI](https://doi.org/10.1016/j.pragma.2009.12.012)), and the Steels embodied emergent-language lineage must be integrated before making broad novelty claims.

### Next-week watchlist

- **Passing the Pact: Comparing Common Ground Building and Audience Design In Multiparty Human and Human-Agent Collaborative Communication** ([DOI](https://doi.org/10.1145/3806774.3827983)); DOI visible 2026-09-03, formal online date 2026-09-06. **Must Read once available.**
- **The Role of Gestures in the Perception of Creative One-Word References Produced by Humans and Virtual Agents** ([DOI](https://doi.org/10.1145/3806774.3827974)); formal online date 2026-09-06. **High watch.**

## 【Master Literature List 更新】

- Version: **v1.4 → v1.5**
- Baseline: **41**, unchanged
- Candidates: **16 → 19**
- Added:
  - X17 — Important
  - X18 — Important / adjacent
  - X19 — Must Read / recovered computational method anchor
- Not promoted: real-robot auditory communication game (abstract-only construct uncertainty), MemeBridge, ontology, VakyArth, AR-HRC, multi-party audio, STEP.
- No human correction, researcher-reading status, or mastery field was altered.

## 【当前研究现状与 Gap 更新】

| Gap | Status | This run's maximum defensible update |
|---|---|---|
| GAP-01 | REDEFINED | GlossoGen adds AI-only history-conditioned protocol evidence; human embodied meaning detection remains open. |
| GAP-02 | PARTIALLY_ADDRESSED | X17/X19 close broad AI-code-emergence claims; mutual human–embodied-AI convention with causal shared history, repair and transfer remains open. |
| GAP-03 | PARTIALLY_ADDRESSED | AI-only establishment, swap/transmission and perturbation recovery components strengthen; integrated reciprocal lifecycle remains absent. |
| GAP-04 | PARTIALLY_ADDRESSED | Multi-measure batteries improve, but success/lexical coherence still do not diagnose mutual belief or partner-history dependence. |
| GAP-05 | REDEFINED | Cultural/pragmatic resources expanded; no operational bridge to adaptive embodied convention. |
| GAP-06 | REDEFINED | X18 adds a non-monotonic social–functional embodied boundary; no history-dependent joint optimization. |
| GAP-07 | PARTIALLY_ADDRESSED | X17 offers swap/history dosage, X19 offers heterogeneity/perturbation; neither yields the unified human–embodied-AI causal protocol. |

**Top gap remains:** demonstrate that a multimodal communication gain causally depends on the dyad's shared history after controlling pretrained priors, same-producer/style exposure, memory availability, user attunement, and independent task learning. Then test role reversal/repair, followed by partner/context transfer and retirement.

## Q1 — 这周最重要的新知识是什么？

AI code emergence 已有比当前 Master 所呈现更强的先例：population-level decentralized grounded lexical convergence（X19）和 prompted LLM shorthand negotiation/transmission（X17）。这使“AI 能不能形成 convention”不再是可辩护的新颖问题；真正需要解释的是 human–embodied-AI mutual convention 的因果机制与诊断标准。

## Q2 — 这周哪个结果最可能改变研究设计？

X17 的 history-dose + newcomer swap 与 X19 的 perceptual heterogeneity + perturbation recovery 可以被组合成更严格的实验逻辑，但必须加入 original dyad vs history-severed pseudo-dyad、role reversal、controlled breakdown、human interpretation、shared-prior disruption 和真实 multimodal consequences。

## Q3 — 下周最高优先级是什么？

首先全文审计 *Passing the Pact*；其次补齐 Rothwell/Knutsen/Peña/Dombi/Branigan 的 human–computer common-ground lineage；同时核验 real-robot auditory paper 是否真的存在 referential/action success、双向 role、meaning-permuted control 与 software-only/yoked-noise baseline。只有通过这些检查，才能最终确定 AMSC 的最大可防守 novelty statement。
