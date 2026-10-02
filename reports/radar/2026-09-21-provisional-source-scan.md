# Research Radar — 2026-09-21 来源核验稿（待状态核对）

**范围**：2026-09-14 07:00 UTC 至 2026-09-21 07:05 UTC。**状态**：仅完成公开来源检索、全文调查和独立争议复核。本地执行器报 `helper_unknown_error: setup refresh had errors`，未能读取本次配置、自动化记忆、AMSC 持久状态、既有 paper objects 或归档排除项。因此以下是**待去重候选**，不是正式 Master List 新增，也不对应已接受的 Gap Registry 状态变化。

## English executive interpretation

This week's strongest candidates concern contextual multimodal demand inference, weak but measurable gaze–grounding associations, a diagnostic separation of content-driven speech intervention from turn opportunity, and supervised access to visual–textual harm signals. The evidence does not establish general human-like pragmatic understanding. Benchmark construction, participant clustering, judge calibration, and mismatched supervision materially limit stronger claims. No persistent AMSC state was changed during this partial run.

# 【本周论文及其总结分析】

## 优先核对的高相关候选

1. **Omni Demand Understanding: A Benchmark for Contextual User-Intent Inference in Multimodal Interaction** — Qi Chen 等；2026-09-18 arXiv 预印本；[摘要与全文](https://arxiv.org/abs/2609.21392)。**Core Question**：系统能否先判断是否存在需求，再结合语音、视频和历史推断意图？**Method**：2,078 个场景，含 1,801 个生成场景和 277 个演员录制场景，测试 14 个原生多模态模型。**Findings**：作者报告最强模型从语境恢复关键内容为 44.7%，11/14 模型在无需求场景的误触发率超过 50%。**Relation**：直接连接 situated pragmatic understanding 与多模态语境推断。**Priority**：Important，待本地去重。**Remaining Gap**：自然互动中的意图、适当沉默与人的可接受性；合成/脚本场景不构成自然泛化证据。既有隐含目标与帮助时机评估，勿称此问题首次被提出。

2. **Gaze as Evidence for Common Grounding: A Cross-Corpus Analysis of MapTask and MUNDEX** — Nan Li、Albert Gatt、Massimo Poesio；EMNLP 2026 MINT workshop oral；[摘要与全文](https://arxiv.org/abs/2609.18011)。**Core Question**：gaze 是否提供互动中 grounding 的证据？**Method**：46 段 MapTask 对话的 5,144 个 reference windows 与 26 场 MUNDEX 互动的 807 个 windows，统一 gaze 类别、关联分析和分组预测。**Findings**：任务定向 gaze 与两种 grounding-related 标签同向关联，但效应弱；按重复参与者组聚类后 MapTask 特征均未通过校正，预测相对对照的 macro-F1 增益约 .060/.020。**Relation**：直接触及多模态 grounding。**Priority**：Important。**Remaining Gap**：区分预示理解的 gaze 与理解后的 gaze，处理重复参与者和 MUNDEX 非随机 coverage 缺失；不能把 gaze 当作共同理解的可靠读数。

3. **Full-Duplex Speech Models Take the Floor When Asked, Not When Needed** — Linkai Peng、Baorian Nuchged、Kaiqi Fu、Yuyang Yao；2026-09-17 arXiv 预印本；[摘要与全文](https://arxiv.org/abs/2609.19596)。**Core Question**：全双工语音模型何时因内容需要而主动插话？**Method**：40 个匹配英语 TTS 话题、10 种 cue 条件、五个模型家族。**Findings**：直接提问和静默更容易触发发话；在两个被测模型的非空回复中，错误纠正比例仅 .14–.15，危险警告 .04–.07。**Relation**：把 turn opportunity 与 pragmatic intervention 决策拆开。**Priority**：Important。**Remaining Gap**：真人对照、打断是否适当的独立人类判断、内容评判的人工验证；结论限于测试协议。

4. **Evaluating Communicative Success in Machine-Translated Conversation** — Faiz Ghifari Haznitrama、Alice Oh；2026-09-17 arXiv 预印本；[摘要与全文](https://arxiv.org/abs/2609.19885)。**Core Question**：译文忠实之外，口译代理是否保留语用与社会关系意义？**Method**：语义、语用、文化社会三层 checklist/judge；5,624 个字幕衍生场景，四种语言、12 个方向和 10 个 interpreter setups；模拟多轮及有限人类标注。**Findings**：较高层的代理指标较弱，常规 MT 指标遗漏部分差异。**Relation**：提供 situated meaning evaluation 的方法先例。**Priority**：Important/Worth Reading。**Remaining Gap**：代理分数能否预测真实双语理解、修复与关系后果。语言标签不能代替参与者文化；judge 在三种语言相对人类低估约 11.8–18.8 点，语料是脚本对话，系统输入上下文不对等。

5. **Decodable but Misrouted: Sparse Features Uncover a Readout Gap in Vision-Language Models for Harmful Meme Detection** — Girish A. Koushik、Diptesh Kanojia、Helen Treharne；2026-09-16 arXiv 预印本；[摘要与全文](https://arxiv.org/abs/2609.18860)。**Core Question**：图文社会伤害信号是未编码，还是未进入分类输出？**Method**：两个 VLM 家族、六个任务，稀疏探针、特征干预、路由和图像扰动控制。**Findings**：作者报告 Qwen 原生/监督探针平均 macro-F1 为 .432/.740；这是不同监督条件下的可解码性证据，不证明原生模型已经理解社会意义。**Relation**：CV/AI 对多模态社会意义的机制分析。**Priority**：Important，精确机制结论待核。**Remaining Gap**：跨模型、自然传播 meme 与人类解释的预输出因果路径。论文附录承认 FHM 主图的 n=1000 与保存的 931 个成对预测不一致，故暂不采信该精确效果；小样本干预和监督路由也限制因果归因。

6. **Negation Beyond the Verbal Channel: Temporal Multimodal Correlates in Dialogue** — Leon Hammerla、Patrick Schrottenbacher、Alexander Mehler；2026-09-14 arXiv 预印本，拟投 ARR；[摘要与全文](https://arxiv.org/abs/2609.16396)。**Core Question**：非语言行为是否伴随否定表达？**Method**：27 场德语 VR 访谈、964 个否定 cue，排除词汇与音频后的时序预测和模态消融。**Findings**：speaker-side 最好 AUROC 约 .75，面部特征消融影响较大；这是预测关联。**Relation**：多模态表达的可测信号。**Priority**：Worth Reading。**Remaining Gap**：跨场景、非显式否定及听者实际解释；不能从 cue 预测推断交际意图已被理解。

## Track / 暂缓

- [Talking Past the Machine](https://arxiv.org/abs/2609.21401)：礼貌与趋同的组合问题值得追踪，但 WildChat 与 Topical-Chat 的体裁、角色、长度不匹配，预测变量与 outcome 部分共享标记；不能据相关性认定人机合作机制“反转”。独立 scout 倾向 Important，gap red team 建议 Track；本稿采用 Track，保留分歧。
- [Building a Cultural Perspective on Doctor-Patient Conversations](https://arxiv.org/abs/2609.18390)：互动 marker 值得看；正文与附录对生成模型（Gemini 3.7 Flash / GPT-5.1）及人机一致性指标（κ / 原始一致率）的描述冲突。真实印度 Telugu 门诊与模拟美国英语数据不能支持总体文化差异推断；待澄清后决定是否收录。
- [CLASH](https://arxiv.org/abs/2609.16582)：词汇/韵律反事实审计方法先例，需控制语音变换伪迹与语料差异。
- [CIBuzzBench](https://arxiv.org/abs/2609.21722)：静态中文网络语跨语言意义 benchmark，缺对话历史；与 X21 相邻而非重复。
- [From Task Success to Productive Success](https://arxiv.org/abs/2609.21117)：互动成本的评估先例，主任务连接较间接。
- [Finding Common Ground](https://arxiv.org/abs/2609.19549)：社群词汇库重叠是 communal common ground 的代理，未观察互动中的理解建立。
- [GestureFAR](https://arxiv.org/abs/2609.21576)：测手势生成质量/延迟，未测交际意义，故不因关键词而进入主线。

# 【Master Literature List 更新】

版本变更、新增、priority 调整、经典恢复和 supersession：**均未执行**。本地配置和既有条目不可读，去重与归档核对未完成。不得将上列候选视为已收录。

# 【当前研究现状与 Gap 更新】

正式状态的“仍然成立 / 得到加强 / 被部分解决 / 被重新定义 / 删除 / 新增”均**未写入**。待复核的概念性方向：多模态需求推断应以自然互动和人类意图判断检验；gaze 只是弱、角色相关的 grounding cue；译文语用检查表是代理指标；监督探针可解码性不等于原生语义理解。Current Top Research Gaps 与 next-question priority 的正式排序须在读取现有 registry 和 program 后决定。

## Quality controls 与剩余执行项

- 上列重点论文均有可访问 arXiv 原文，未把不可访问全文称为已读。来源层面已由 HCI、AI/CV/NLP scout、gap red team、文化操作化及量化方法角色独立复核。
- 本地执行器持续初始化失败，导致无法读取自动化记忆、`config/research_radar.yaml`、`PROGRAM.md`、`program.yaml`、既有 AMSC 状态和排除项；作者/venue/citation/historical-term 检索因此未能按本地配置完整执行，且不能声称已去重。
- 未修改 Master List、Current State、Gap Registry、Research Graph、next-question priority、paper pages、workflow dashboard 或 Exam KB。因 paper pages 未改，不触发网站 build/test；`scripts/validate-install.ps1` 也因同一执行器错误未运行。
- 恢复后应先读取上次记忆与配置、核对已有/归档记录和 DOI/arXiv 别名；再定分级、写正式周报及可追溯状态，并运行所需验证。

## Q1 / Q2 / Q3（暂定，不替代正式项目优先级）

**Q1 What do we know?** 情境、互动角色、视觉与语音线索会改变可测的语用判断；现有 benchmark 和探针暴露了模型输出与某些代理指标的落差。

**Q2 What don't we know?** 这些代理指标在自然互动中多大程度对应人类理解、可接受的插话、意义修复和持续适应？哪些效应在参与者、群体、模型与场景外仍稳定？

**Q3 What should I study next?** 在读完现有 priority 后，优先评估一个情境性社会意义任务的构念与证据链：同时控制语境/模态、检验模型的预输出判断，并在结论涉及人的解释时引入人类证据。这是研究机会建议，不是已批准的首个 RQ。
