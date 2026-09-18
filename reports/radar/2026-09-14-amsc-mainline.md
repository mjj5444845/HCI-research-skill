# AMSC Research Radar — 2026-09-14

检索主窗：2026-09-07 至 2026-09-14（America/New_York）；按来源提交/发表日期区分新作与补收录，不把 arXiv feed 出现日期当提交日期。新增 X25–X29：3 篇本周新预印本、2 篇历史补收录。五篇均审读全文；另对概念性 A Robot Among People 作轻量筛查。

## Executive interpretation / 执行判断

本周最需要修改的不是研究方向，而是新颖性表述。X29 已提供 AI 团队换伙伴的干预先例，因此“AI 沟通没有伙伴特定的历史效应”过宽。研究价值应放在：伙伴模型兼容与双方共同确认的表达含义如何区分，以及这种区分在人机沟通中有什么后果。

The strongest update is a recovered intervention study of notebook-equipped LLM dyads. Partner-specific coordination costs already have an experimental precedent. The remaining AMSC opportunity concerns the mechanism and consequences of jointly established meaning, not a generic first partner-swap test. New diagnostics distinguish literal-information residuals, observer alignment judgments, local uptake and useful ambiguity; none alone establishes mutual grounding.

## 【本周论文及其总结分析】

### X25 — Must Read / 补收录

**Seeing Is Not Sharing: Some Vision-Language Models Overestimate Common Ground in Asymmetric Dialogue**  
Nan Li, Albert Gatt, Massimo Poesio。SIGDIAL 2026，8 月正式论文。[来源与全文](https://aclanthology.org/2026.sigdial-1.49/)

核心问题：模型是否把“可共享的信息”错当成“对话中已经建立的理解”？方法是让模型旁观 MapTask 对话，操作上下文和地图信息。部分模型的总体表现改善伴随过度判定一致，但模型之间存在异质性。

与主线关系：直接补入 Grounding 的错误校准诊断。最重要剩余问题是主动互动中能否识别尚未对齐，并通过澄清恢复理解。旁观者判断不能替代共同建立过程。详细审查见论文页 X25。

### X26 — Must Read / 本周新作

**The Convention Gap: Towards Measuring Implicit Communication in Cooperative AI Evaluation**  
Makoto Fukushima, Hua-Dong Xiong, Ehsan Moradi Pari。arXiv，9 月 10 日初稿、11 日 v2。[来源与全文](https://arxiv.org/abs/2609.11489)

核心问题：实际合作超出了字面信息所能支持的程度吗？方法是在 Hanabi 中建立精确字面基线，再与实际失败比较；受控惯例层级提供验证。

与主线关系：补充可解释的隐含沟通指标。最重要剩余问题是超额表现来自共同约定、单方适应还是其他策略信息。它是回顾性测量；同期差值与失败关联也不能自动证明预测能力。独立定量审计肯定作者已有聚类与参与者内分析，不采用“完全未处理重复观测”的错误批评。

### X27 — Important / 本周新作

**Calibrated Ambiguity in Multimodal Language Models: Humans reach for cultural references, while models describe the picture**  
Cody Kommers, Mingrui Ye, Evelyn Gius, Daniela Mihai, Hoyt Long, Zheng Yuan, Drew Hemment。arXiv，9 月 11 日。[来源与全文](https://arxiv.org/abs/2609.12575)

核心问题：怎样生成既可解释又容许多个合理读法的线索？作者比较英语 Dixit 人类与模型线索，用作者验证、模型扩展的编码规则分析模糊性与典故。

与主线关系：把 Meaning 中“有用的模糊”变成可研究对象。最重要剩余问题是受众是否实际识别与接受这些含义。文化审计指出选卡、干扰卡和编码受众的不对称；跨文化扁平化、关系收益和历史适应均未得到检验。

### X28 — Important / 本周新作

**Continue, Adapt, or Yield: In-Turn Adaptation to Overlapping Speech in Full-Duplex Agents**  
Yunqi Lu, Tyler Baumgartner, Nikhil Johri, Brandon Tai, Candice Fan, Luc Debaupte, Ruben Aguilar, Bill Wang, Yi Zhong。arXiv，9 月 11 日。[来源与全文](https://arxiv.org/abs/2609.13117)

核心问题：继续说话时是否吸收了听者补充？作者比较录音回应与单一模型续写，区分不变继续、局部吸收和让出话轮。

与主线关系：补上 repair 链的局部 uptake 测量。最重要剩余问题是正确修改、对方接受及后续共同理解。cue 分类看到了人类后续行为，加上条件性输出筛选，阻止把人机适应率差解释成无偏的通用能力差距。

### X29 — Must Read / 补收录

**Testing Interchangeability in LLM Agent Teams**  
Jianxin Gao, Tianyi Yu, Linna Deng, Runze Li, Zining Wang。arXiv，9 月 4 日。[来源与全文](https://arxiv.org/abs/2609.05279)

核心问题：同样熟练的队友能否无成本互换？同模型、同角色队友在形成阶段后互换，并加入安慰剂更换及笔记操作；协调成本受到影响。

与主线关系：直接攻击“尚无伙伴特定干预先例”的宽泛 novelty。最重要剩余问题是形成后的任务策略、私有伙伴模型与双方确认的信号约定各自贡献多少。

审计分歧：漏检审查建议 Must Read，定量审查建议 Important。主代理保留 Must Read，表示阅读优先级；证据强度记 PRELIMINARY。独立互换对数很少，笔记删除改变长度，形成顺序可能改变任务知识。恢复段落的首回合比值与十回合均值存在未解释的不一致，因此不接受精确“恢复慢一倍”的结论。

## 【Master Literature List 更新】

- v1.7 → v1.8；65 → 70 篇；41 篇用户基线保持不变，29 篇候选单列。
- 新增 X25–X29；3 篇 Must Read，2 篇 Important。阅读优先级不等于证据等级或研究者已经阅读。
- X25 和 X29 为补收录；X21 已存在，虽然本周 feed 再出现也不重复计数。
- A Robot Among People 留在 Track：概念立场及先前研究的综合，不作为本周新增独立实证。
- 无删除、无核心考试 anchor 自动晋升、无研究项目 PURSUE 决定。

## 【当前研究现状与 Gap 更新】

新增 SOF-36–40，均为 EMERGING。Gap Registry v0.7 → v0.8；保留已有状态，更新证据与历史。

| Gap | 本轮变化 | 仍需回答 |
| --- | --- | --- |
| GAP-01 | 保持原判断 | 具体多模态含义变化的检测与更新 |
| GAP-02 | 加入 AI-only 伙伴互换先例；宽泛缺少伙伴特定证据的论述被削弱 | 私有状态兼容与共同确认意义的机制区别 |
| GAP-03 | 加入局部 uptake 与换人恢复先例 | 正确修订、接受、后续沿用；恢复数字需核对 |
| GAP-04 | 指标组件已有实质推进 | 各指标的区分效度及与互动结果的联系 |
| GAP-05 | 增加典故产生与受众识别之间的桥接问题 | 实际接收与情境化解释 |
| GAP-06 | 未改变解决状态 | 模糊何时影响关系与任务理解 |
| GAP-07 | 新增可复用互换/安慰剂/笔记模块 | 围绕机制选必要对照，而非堆叠全部条件 |

仍然成立：成功、记忆、旁观对齐判断、局部吸收、共同确认不是同一个构念。得到加强的是测量区分的必要性；不据此宣称研究空白更大。没有 Gap 被标为 RESOLVED、REMOVED 或新增高优先级 Gap。

当前优先序保持：共同历史机制 → 修复与后续复用 → 迁移/弃用/关系解释。X29 要求第一项从泛化的“是否有伙伴效应”转向具体机制识别；记忆可以是互动影响的中介，不能把所有记忆作用都当混淆排除。

## Research Graph 与下游

加入五个可溯源论文节点及明确标为 inferred 的 grounding 理论连接；不由共著推断师生或实验室归属。Next-question 注释与 dashboard 同步。考试只增加 Theme 3 与 Theme 2/6 的候选比较问题：没有改研究者阅读、掌握或核心 anchor。写作与现有研究问题记录未自动重写。

## 检索、筛查与待办

主代理完成 mechanism、venue、historical-term 与 citation 搜索，浏览 arXiv cs.HC/cs.RO/cs.CL recent，并核对官方论文正文。Anchor 代理另核查 cs.CY 和 Abtahi、Fan、Lu 的官方团队/论文网络。这些 feed 合计条目不是去重后的 AMSC 候选量。

主要排除/跟踪项：

- [Whole-Body Robot Teleoperation](https://arxiv.org/abs/2609.12384)：本周新作，运动控制适应的相邻方法；未直接研究社会意义或共同约定。
- [A Robot Among People](https://arxiv.org/abs/2609.12937)：概念入口；相关经验研究需独立审读。
- [Encoded Early, Used Late](https://arxiv.org/abs/2609.07139)：伙伴专业知识模型的机制近邻，暂 Track。
- [What if LLMs Ate Their Words](https://arxiv.org/abs/2609.05882) 与 [Protocol Compression](https://arxiv.org/abs/2609.06129)：提交日期早于窗口；分别为历史干预、协议成本近邻，暂 Track。
- [From Propositional to Perceptual Asymmetry](https://aclanthology.org/2026.sigdial-1.28/)、[Grounding review](https://aclanthology.org/2026.sigdial-1.11/)、[ClarVis](https://aclanthology.org/2026.sigdial-1.6/)：已核摘要、保留下一轮全文队列；MapTask 衍生分析不自动算独立数据复制。
- 漏检代理提出 [Distributed Partial Information Puzzles](https://aclanthology.org/2026.lrec-1.391/)、[Who Owns the Robot Matters](https://doi.org/10.1145/3800645.3812876)、[Making Sense of Robots in Public Spaces](https://arxiv.org/abs/2504.01121)、[Embodied Cognition and Cultural Variation](https://aclanthology.org/2026.acl-long.461/)：主代理本轮未完成全文复核，仅保存候选链接，不接受其数值与 Master 晋升建议。
- F6/X20 全文仍待获取；本轮不重复声称已调查其全文。

## 独立审计与质量控制

定量审计覆盖 X26/X28/X29；文化审计覆盖 X27；missing-paper attack 提供 X29 与后续队列；anchor/coauthor 扫描补足相邻工作。保留上述 X29 优先级分歧。漏检代理对 X26 提出的“human–AI 仅10人、层级模型大量divergences”与主代理及定量审计读取的正文不符，明确不采纳，也未写入研究状态。

限制：ACM/IEEE 等 publisher-first、未索引 workshop、cs.AI-only 和部分非 arXiv 记录未穷尽；arXiv export API 限流。独立扫描曾被额度中断，恢复后完成可用结果；不据无结果证明没有先例。未复现实验或运行作者代码。

本轮未修改已有 research_pipeline.json、scripts/chinese-reading.mjs 或 reports/ideas；reading_zh.json 仅追加新论文并更新受影响 Gap 的说明与哈希，保留原有改动。

验证：build 成功（70篇），test:site 通过（117个HTML页面），workspace tests 7/7、Chinese-reading tests 2/2；validate-install 与 git diff --check 均通过。完成记录时间：2026-09-14 11:05 EDT。

## Q1 — What do we know?

AI 团队已经有形成后状态不可完全互换的干预证据；字面基线、视角判断和局部回应提供不同诊断。这些结果足以要求更精确的构念与新颖性表述。

## Q2 — What don't we know?

尚不能由这些论文确定人机双方何时共同确认了一个含义、怎样在误解后持续修订，以及伙伴状态兼容与这种共同确认的差别。文化典故的实际受众识别与关系后果也未被本轮证据解决。

## Q3 — What should I study next?

先对照 X29 修订 Q1 的最近工作比较：匹配形成序列与信息，区分伙伴笔记兼容和共同确认，并同时测任务效果与沟通成本。随后为 Q2 加入盲标 cue、正确修订、接受与后续复用。以上是建议，尚未批准或执行新实验。
