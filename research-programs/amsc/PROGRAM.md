# AMSC Research Program v2.1 — AMSC × FailureTrace

Updated: 2026-09-18. AMSC remains the stable internal identifier.

## 研究身份

我研究 AI 如何理解、参与和支持具体情境中富有表现力的多模态沟通，以及人与 AI 如何通过持续互动建立共享意义、形成并调整彼此熟悉的表达方式。

I study how AI understands, participates in, and supports expressive multimodal communication in context, and how humans and AI develop shared meanings and adapt their ways of communicating through ongoing interaction.

## 主线与近期重心

以情境化社会语用理解为起点，研究言外之意、幽默、调侃、立场、共同梗与彼此懂的表达。花字、表情包、meme、图像、语言、声音与可选手势可以共同传意，不限定为纯非语言。

近期先研究理解；长期连接表达、恰当回应、理解确认与修复、共享意义、惯例与适应。这些是相互关联的视角，不是固定论文顺序。不能把默契直接等同于满意度、被理解感、系统记忆或任务效率。

## 已有研究基础

X21 — You Really Didn’t Get That? (arXiv:2609.04384, EMNLP 2026) 是用户二作成果，按用户明确陈述记录。继续其问题、方法和资源，无需回避；仍须明确后续新增贡献。上下文影响理解已进入该研究范围，不能再次当成未探索空白。

## 研究社区与贡献

HCI、CSCW、AI、CV、NLP及认知科学均可。问题与贡献先于venue；CHI/UIST不是门槛。数据集、benchmark、评估、模型、方法、理论、实证、系统与设计可以独立成篇。计算研究无需附加用户实验；关于人的行为、理解或关系的结论需要对应人类证据。

两种关系均允许：AI作为沟通伙伴；AI支持人与人的表达和理解。每个项目须说明角色。

## 资源与范围

无机器人、现成交互平台或虚拟角色；可自行开发。拥有若干Aria Gen 2和一台Quest 3，其具体开发能力尚未核实。预算有限，机器人延期。校内外可招募，学生可作为一般使用者；单次和重复互动均可能。首项后续研究以3–6个月为规划目标，不视为完成保证。设备可选，不为使用设备强行设题。

## 理论与选题要求

社会语用、多模态意义、common ground、grounding、convention与adaptation按问题选用。先具体说明表达现象及其机制、边界或后果；文化按共享知识、实践与经历处理，不默认国籍等于文化。变化模态或模型不自动构成贡献，但实质能力、方法与资源改进可成为独立贡献。

## 研究兴趣参照

Zhicong Lu；Judith Fan；Ziqiao Ma；Parastoo Abtahi；Ryo Suzuki。Zhicong Lu为用户最偏好的研究风格参照。这是兴趣信息，不是合作关系。

## 当前分类

- A · 社会与多模态表达 / Social and expressive multimodal communication
- B · 语用与情境化理解 / Pragmatics and contextual understanding
- C · 共同基础与沟通惯例 / Grounding and conventions
- D · 模型、评估与研究资源 / Models, evaluation and resources
- E · 记忆、适应与持续互动 / Memory, adaptation and ongoing interaction
- F · 文化、关系与社会实践 / Culture, relationships and social practices
- G · 沟通系统与情境化交互 / Communication systems and situated interaction

## 持久状态与网站

program.yaml 与本文件定义方向；master_literature、state_of_field、gap_registry、research_graph及research_pipeline保存可追溯研究状态。paper-pages保存论文事实；workflow_dashboard与reading_zh是同步展示层。考试与写作是独立下游，不反向决定主线。

2026-09-18后续用户批准整合为一条主线、每阶段有落地artifact并更新网站。具体RQ保持DRAFT，科学新颖性、效果、样本量与实验准备度尚未确立。归档机器人专属材料不表示原论文失效或科学问题已解决。迁移前快照：archives/2026-09-18-mainline-v1。

## 已批准的整合主线与artifact路线

近期执行主线：理解分歧 → 有效评价 → 校准预测 → 沟通支持 → 共享语境与适应。原有的社会表达研究身份保持；FailureTrace提供轨迹、校准与独立干预验证方法。合理的解释分歧不自动记作失败。

研究表述：我研究人和AI如何理解情境中的多模态表达、在哪里产生理解分歧，以及如何通过人类证据校准的模型预测和支持有效澄清，并在持续互动中形成共享语境。

正式结构与网站共同读取 program.yaml 的 artifact_roadmap；可读版本见 ARTIFACT_ROADMAP.md。

| 阶段 | 主要artifact与界面 | 验收重点 |
|---|---|---|
| 1 理解分歧 | MeaningTrace Studio：图像、评论、背景、解释采集与轨迹回放网页 | 区分意图、解释、合理歧义及行动后果 |
| 2 有效评价 | FrictionBench Communication Track：数据集、benchmark、案例与结果浏览器 | 独立切分、人类参照、冻结预测与强基线 |
| 3 校准预测 | Listener Model Workbench：模型/方法/API与校准分析台 | 增量预测能力、不确定性、成本及域外边界 |
| 4 沟通支持 | FrictionLens：澄清建议、证据与变体比较界面 | 沟通结果、误建议、打断及表达自主性 |
| 5 持续适应 | Shared Context Lab：重复互动与历史/伙伴控制台，可选VR/AR | 区分伙伴适应、一般记忆与练习；空间视角必要时才采用XR |

五阶段是能力与证据的依赖图，不是五篇预定论文。阶段3与4可并行；每阶段发布包包含演示/案例、可复现代码或数据、基线与指标、失效边界。界面完成与科学验证分别验收，当前五个artifact均为计划中。

近期优先阶段1与阶段2的最小闭环：视觉作品的间接反馈、固定指代对象、一种背景补充、真实解释数据、简单基线及留出干预验证。首项3–6个月，不同时承诺完整模拟器、大benchmark、设计师研究和XR。

前沿能力对应官方公开研究：Adobe的设计分析、Stanford HCI的用户建模、Anthropic的agent评估、Microsoft Research的协作与情境、DeepMind的虚拟环境互动、Meta Aria的情境感知。来源与边界保存在artifact_roadmap.sources；相关性不表示合作、采用、招聘或兴趣承诺。
