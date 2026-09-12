# AMSC Research Radar — 2026-09-07

## 本周结论

本轮覆盖 2026-08-31 03:00 至 2026-09-07 03:35（America/New_York），并对 2026-09-03 手工 Radar 之后的新记录做增量去重。检索同时触发 venue/author-chain Missing Paper Attack，恢复三篇此前未进入 Master、但直接改变 AMSC closest-work 的全文论文。按 `config/research_radar.yaml` 的 5 篇 deep-investigation 上限，最终将 X20–X24 写入长期状态：1 篇 abstract-only、4 篇 full-text；其余新近或恢复条目保留 Track / next-audit queue。

最大理论变化不是“已有工作覆盖更多关键词”，而是四个必须保持分离的证据层：

> situated meaning inference ≠ common ground；conceptual-pact reuse ≠ partner-knowledge-sensitive grounding；retrieving an established convention ≠ constructing or repairing it；detecting a repair signal ≠ completing successful repair。

因此，Q1 > Q2 > Q3 排序不变。GAP-07 从“单一统一大协议”重构为 linked modular causal protocol family；这是为避免 method maximalism 和 construct underidentification，不是降低研究雄心。

## English executive interpretation

This run adds five evidence-audited candidates that sharpen the AMSC diagnostic map. The most consequential finding is that current systems may reuse or retrieve externally available conventions while still failing to construct, epistemically calibrate, and repair them through interaction. A second boundary is equally important: preserving dialogue-derived state, interpreting situated social meaning, and detecting multimodal trouble signals are useful components, but none alone establishes mutual common ground. The main research priority therefore remains a causal test of dyad-shared history, followed by modular tests of repair, role reversal, transfer, and embodied consequence.

## 检索、访问与去重

- 来源：arXiv cs.HC/cs.RO/cs.CL、Crossref/DOI、ACM IVA 2026、ACM ICMI 2026 official sessions、SIGDIAL/ACL Anthology、新近作者与合作者链，以及 title/DOI/arXiv 精确去重。
- 精确窗口内的强候选包括 [X21](https://arxiv.org/abs/2609.04384)、[SocioGesture](https://arxiv.org/abs/2609.04545) 与 [Temporal Tactile Encoding](https://arxiv.org/abs/2609.05282)。IVA 两篇的 DOI 元数据在 2026-09-06 正式上线。
- Missing Paper Attack 恢复 [X22](https://arxiv.org/abs/2608.29571)，并通过本周浮现的 [ICMI 2026 sessions](https://icmi.acm.org/2026/sessions/) 恢复 [X23](https://arxiv.org/abs/2604.21144) 与 [X24](https://arxiv.org/abs/2607.23845)。“本周浮现”指新索引/venue evidence，不伪称论文均在本周首次发表。
- X22 与 X2/X9/X10 不重复：它把模型置于 naïve interpreter/overhearer 位置，并操纵 context relevance/order 与 feedback quality；X9 的 pseudo-dyad history severing 仍是不同诊断。
- X23 与 X4/X11/X16 不重复：它研究可检查的 depictive/propositional state representation，而不是共同记忆体验、benchmark 总览或 natural memory use。
- X24 与现有 corpus 不重复：它补的是 multimodal other-initiated-repair signal detection，不是 repair policy 或 repair outcome。

## 【本周论文及其总结分析】

### 1. X22 · *Which one is banana man? Evaluating vision–language models in multi-turn pragmatic interpretation*

- 来源：[arXiv:2608.29571](https://arxiv.org/abs/2608.29571)；全文 OA；code/data publicly linked。
- 优先级：**Must Read**；AMSC fit 9.4/10；B/C/E。
- 问题：VLM 能否利用 repeated Tangram interaction 的 prior context 解释 conventionalized references？context amount/order/relevance 与 feedback quality 如何影响它？
- 方法：10 个原始 2–6 人、6 rounds × 12 targets 的游戏；比较 naïve humans 与 5 个 open-weight VLM；8 个 context conditions、3 个 feedback regimes，并补充 frontier-model checks。
- 关键发现：给出 human-yoked 或 full correct feedback 时，模型可接近人类或接近满分；在 own guesses + limited correct/incorrect feedback 下，模型几乎不能从前次错误恢复，常反复选择同一错误。same-game / same-target context 的作用远高于 other-game 或 target-ablated context。
- 真正贡献：把 **convention retrieval** 与 **endogenous construction / correction** 直接拆开，是当前最接近 Q1/Q2 接口的 causal diagnostic。
- 最大局限：模型是 archived human dialogue 的 naïve matcher，不是 reciprocal human–AI partner；不能外推为“所有模型都不会形成 convention”。
- 状态影响：新增 SOF-33；进入 GAP-02/03/04/07；Q1 加入 externally supplied mappings，Q2 加入 error recovery。

### 2. X20 · *Passing the Pact: Comparing Common Ground Building and Audience Design In Multiparty Human and Human-Agent Collaborative Communication*

- 来源：[DOI 10.1145/3806774.3827983](https://doi.org/10.1145/3806774.3827983)；IVA 2026；**abstract-only**。
- 优先级：**Must Read / full-text retrieval priority**；AMSC fit 9.3/10；C/E。
- 问题：在知识不对称的 multiparty Tangram communication 中，speaker 对 human 与 agent addressee 的 pact reuse 和 audience design 是否相同？
- 摘要级发现：参与者对 less-knowledgeable human 与 agent 都复用 previously negotiated pacts，但在人类—人类条件下对知识差异更敏感、elaboration 更多。
- 真正贡献：提示 pact-term reuse 与 epistemically appropriate audience design 可分离；human-agent reuse 不是 mutual common ground 的充分证据。
- 最大局限：N、agent memory/state、trial order、coding reliability、effect size、interaction/equivalence analysis 均不可见；“similar”不能解释为 statistically equivalent。
- 状态影响：新增 SOF-31；进入 GAP-02/03/04/07；Theme 3 candidate/oral question 更新，但不自动晋升 core anchor。

### 3. X23 · *Using Machine Mental Imagery for Representing Common Ground in Situated Dialogue*

- 来源：[arXiv:2604.21144](https://arxiv.org/abs/2604.21144)；ICMI 2026 program；全文 OA。
- 优先级：**Important**；AMSC fit 8.7/10；B/C/E。
- 问题：agent 能否把 evolving situated-dialogue state 增量外化为可检查的 visual artifacts，以减少 representational blur 并支持后续 inference？
- 方法：Observer–Constructor–Linker–Reasoner pipeline；MeetUp dialogue / 200 IndiRef QA；比较 full dialogue、incremental image、incremental text 与 hybrid image+text。
- 关键发现：两种 incremental conditions 均优于 same-VLM full-dialogue baseline；image 对若干 temporal/inferred distinctions 更强，text 对 topology/negation 等更合适，hybrid 在四类中的三类最好。
- 真正贡献：提供可检查的 multimodal state architecture，并显式标注 confirmed、unresolved、assumed commitments。
- 最大局限：single benchmark、LLM judge；negation、indirect requests 与 cross-frame links 仍失败。它表示 system 认为 shared 的 state，而不是经 mutual acceptance 建立的 common ground。
- 状态影响：新增 SOF-34；进入 GAP-01/04；Q1 增加 state representation versus natural use 的边界。

### 4. X24 · *Do Visual Features Improve Other-Initiated Repair Detection? A Dyadic Multimodal Approach*

- 来源：[arXiv:2607.23845](https://arxiv.org/abs/2607.23845)，[DOI 10.1145/3776574.3831200](https://doi.org/10.1145/3776574.3831200)；ICMI 2026；全文 OA。
- 优先级：**Important**；AMSC fit 8.6/10；C/D。
- 问题：gaze、face、head、body、gesture 等 visual signals 是否改善 other-initiated-repair detection/type classification，且贡献是否跨场景稳定？
- 方法：CA-grounded handcrafted visual features + text/audio model；French screen-mediated NOXI（47 OIR / 7h）与 Dutch face-to-face CABB-S（378 OIR / 8h）；session-level 5-fold CV。
- 关键发现：visual features 使 detection macro-F1 相对 text+audio 提高 4.1pp（NOXI）与 12.9pp（CABB-S）；classification 提高 13.2pp 与 2.4pp，贡献方向显著依场景而变。
- 真正贡献：补上 AMSC repair 生命周期中“可观测 multimodal trouble signal detection”这一测量组件。
- 最大局限：human–human corpora；NOXI 极小且方差高；没有 real-time agent repair、uptake 或 restored-grounding outcome。
- 状态影响：新增 SOF-35；进入 GAP-03/04/07；Q2 将 trouble detection、repair action、uptake 与 restored grounding 分测。

### 5. X21 · *You Really Didn’t Get That? Benchmarking Social Pragmatic Inference for Indirect and Playful Chinese Online Comments*

- 来源：[arXiv:2609.04384](https://arxiv.org/abs/2609.04384)；EMNLP 2026 Main；全文 OA。
- 优先级：**Important**；AMSC fit 8.2/10；A/B/F。
- 问题：模型能否从中文平台互动中识别 indirect/playful comment 的 target、stance、wordplay mechanism 与 interactional force？
- 方法：从 Zhihu、Tieba、Douban、Xiaohongshu 的公开互动目的性筛选 3,200 episodes，生成并人工验证 4,735 个五选一 items；7 位 trained native-Chinese high-frequency social-media users；8 个 writer/solver models、human audit 与 context ablations。
- 关键发现：报告的 LWO model mean 为 68.70%；random 300-item human audit 为 90.8%、κ=.85。full-context → comment-only 下降 39.07pp；但 343 个 human-revised hard items 的人类准确率仅 64.14%、κ=.53。
- 真正贡献：用 plausible misreadings 把 broad humor/sarcasm 分类升级为 fine-grained situated social-meaning diagnostics。
- 最大局限：purposive sampling 本身选择 context-dependent cases；不同 solver 的 LWO denominators 不同；gold 是 trained annotator interpretation，不是 speaker intent/uptake。
- 文化边界：“Chinese”指中文语言与特定平台话语环境，不是被测量的民族/国别文化；不能据此声称跨文化差异或 general cultural competence。
- 状态影响：新增 SOF-32；进入 GAP-04/05；Theme 2/6 supplementary reading，不进入 Theme 3 grounding evidence。

## Track、拒绝与下一轮高优先级队列

- **Track — Gesture VA**：[DOI](https://doi.org/10.1145/3806774.3827974)。abstract-only；perceived communication quality 与 comprehension 的可能分离有价值，但 null-like result、imagery correlation 和 human/VA equivalence 均不可主张。
- **Track — SocioGesture**：[arXiv](https://arxiv.org/abs/2609.04545)。扎实的 occlusion-robust fixed-gesture perception / offline class expansion；supervised vocabulary expansion 不是 partner-specific communicative adaptation。
- **Track — Transfiver**：[arXiv](https://arxiv.org/abs/2609.03797)。shared editable state / rollback architecture；concept-only、无自然语言系统与人类实验，shared state 不等于 common ground。
- **Track — Beyond Bias**：[arXiv](https://arxiv.org/abs/2609.05102)。culture-as-practice、provenance、participation 与 stewardship 是有用设计立场；9 workshops / 200+ participants 不能证明 representativeness、translation equivalence、empowerment 或 AMSC mechanism change。
- **Track — Pack It My Way**：[arXiv](https://arxiv.org/abs/2609.04620)。triadic preference mediation 与 show-correct-generalize 有方法价值，但不是 shared convention。
- **Reject as direct AMSC evidence — Temporal Tactile Encoding**：[arXiv](https://arxiv.org/abs/2609.05282)。约 0.9 秒 tactile window 是 within-event temporal integration，不是 interaction history；scripted contact discrimination 也不是 natural intent/common ground。
- **Next deep-audit queue**：本轮 Missing Paper Attack 另发现 [Seeing Is Not Sharing](https://aclanthology.org/2026.sigdial-1.49/)、[From Propositional to Perceptual Asymmetry](https://aclanthology.org/2026.sigdial-1.28/)、[Conversational Grounding in LLMs](https://aclanthology.org/2026.sigdial-1.11/)、[ClarVis](https://aclanthology.org/2026.sigdial-1.6/) 与 memory-driven relational turning-points work。它们看起来高度相关，但发现较晚且超出本轮 5 篇 deep 上限，因此未在未完成同等全文审计前写入 Master。

## 独立审议与分歧综合

- **Novelty panel**：X22 与 X20 对 AMSC 最核心；X21 的 resource/method novelty 在 NLP 更强，但对 AMSC 是 Meaning-side bridge。disciplinary novelty 与 AMSC novelty 不同向。
- **Gap red team**：本批没有 gap 应升为 STRENGTHENED。Passing Pact 已使“人不会向 agent 复用 pact”这一宽泛主张失效；X22 又使“模型不能使用 convention”失效。最大可防守 residual 是 endogenous、mutual、history-causal construction/calibration/repair。
- **Method audit**：abstract-only 的 similarity/null 不可当 equivalence；X21 的 solver ranking、X23 的 component attribution、X24 的 cross-setting stability 均需保留 sampling/analysis boundary。
- **Culture audit**：X21 是 Chinese-language platform pragmatics，不是“中国文化”；Beyond Bias 是 single initiative 的设计框架，不是已验证的文化适应机制。
- **Theory mapping**：AMSC chain 是构念与研究发展链，不是每篇论文自动走通的因果阶梯；本轮五篇分别位于 interpretation、reuse、retrieval、state representation 与 repair detection，不应合并成 common ground 已解决。
- **综合决定**：只将完成本轮 deep audit 的 X20–X24 持久化；高相关但未完成同等核验的 SIGDIAL/ICMI 条目进入下一轮 queue。GAP-07 由 monolithic protocol 改成 linked modular family；其他 gap status 保持。

## 持久状态更新

- Master Literature List：v1.5 → v1.6；candidate 19 → 24；新增 X20–X24；41-paper baseline 与 human corrections 未改。
- Current State of the Field：v0.5 → v0.6；新增 SOF-31..35，并修正 evidence snapshot 为 65 papers（41 baseline + 24 candidates）。
- Gap Registry：v0.5 → v0.6；GAP-01/02/03/04/05 加入新 evidence；GAP-07 `PARTIALLY_ADDRESSED → REDEFINED`，变更理由写入 history。
- Research Graph：v0.4 → v0.5；增加 paper/selected-author nodes、verified coauthorship、inferred concept mappings；不推断 lab/supervisory 关系。
- Comprehensive Exam：v0.6 → v0.7；仅更新直接受影响的 Theme 2/3/6 candidate review 与 3 个 oral questions；Top-20 与 researcher reading/mastery 均未改。
- Workflow dashboard：v1.4 → v1.5；同步 coverage、claims、gaps、next questions、workflow run 与下一次 scheduled date。

## Quality controls

- DOI/title/arXiv 去重完成；X22 的 8/30 submission 明确标为 recovered missing paper，不伪装成 9/3 后新提交。
- X20 全文不可得，所有 method/result 表述严格限制在 abstract-level；未填补 N、agent implementation、effect size 或 statistical model。
- X21 只作 Chinese-language/platform evidence，不作 national-culture evidence；context ablation 不等于 common ground。
- X23 的 stored state 不等于 mutual belief；X24 的 detection 不等于 repair execution。
- SocioGesture 的 offline category expansion 与 tactile handover 的 sub-second temporal window 未进入 interaction-history/convention evidence。
- 所有 contentious novelty/gap/method/culture/theory judgment 均经独立角色审议；主代理负责最终 evidence-traceable state write。

## 现在最值得追的 3 个问题

1. **Q1 — Shared-history causality：** communication gains 是否依赖 dyad-shared history，且能排除 pretrained/shared priors、same-producer/style、externally supplied mappings、interlocutor capability beliefs、memory availability 与 independent task learning？核心指标应同时包括 pact reuse、knowledge-sensitive elaboration、acceptance 与 natural use。
2. **Q2 — Reciprocal repair：** shared-history dependence 建立后，mapping 能否在 role reversal 下保持，并在 controlled breakdown 后完成 trouble detection → repair action → partner uptake → restored grounding 的完整链？
3. **Q3 — Lifecycle and trade-off：** convention 何时应 transfer、retire 或 renegotiate；跨 partner/context 时，instrumental legibility 与 relational/social meaning 如何发生可测 trade-off？
