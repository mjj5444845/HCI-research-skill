# 1. Workflow 名称

**Adaptive Multimodal Social Communication Research Intelligence Workflow**

简称：

**AMSC Research Agent**

主要服务于：

> **Adaptive Multimodal Social Communication for Embodied AI**

当前研究主线：

> 人类与具身 AI 如何通过 informal、multimodal、situated expressions 建立社会意义、common ground 和 shared conventions，并随着用户、情境和 interaction history 逐渐形成 adaptive communication。

---

# 2. Workflow 的核心任务

这个系统不是单纯“每周找论文”。

它需要长期维护四个彼此连接的对象：

1. **Master Literature List**
2. **Current State of the Field**
3. **Research Gap Map**
4. **Comprehensive Exam Knowledge Base**

所有新论文都必须更新这四个对象，而不是只生成一次性摘要。

---

# 3. Research Scope

## 核心研究主题

### A. Social / Multimodal / Informal Expression

研究：

- informal visual language
- multimodal expression
- emoji
- kaomoji
- typography
- textual paralanguage
- visual language
- visual symbols
- animation
- meme-like expression
- social signaling
- social meaning
- affect
- stance
- humor
- identity

---

### B. Pragmatics / Representation / Communicative Efficiency

研究：

- pragmatics
- pragmatic inference
- visual abstraction
- informativeness
- communicative efficiency
- multimodal redundancy
- compression
- representation
- Rational Speech Act

核心问题：

> 什么信息需要表达？

> 什么信息可以省略？

> 什么是 minimal but sufficient representation？

---

### C. Common Ground / Grounding / Convention Formation

这是当前最高优先级理论主题。

研究：

- common ground
- grounding
- conceptual pact
- collaborative reference
- alignment
- repeated reference
- interaction history
- shared representation
- convention formation
- shared shorthand
- abstraction

核心问题：

> 人与 embodied AI 是否能够形成 interaction-specific communication conventions？

---

### D. Human–Robot Communication

研究：

- nonverbal HRI
- multimodal HRI
- gaze
- gesture
- motion
- expressive movement
- robot state communication
- intent communication
- uncertainty communication
- capability communication
- transparency
- legibility
- predictability

核心问题：

> robot 如何让人理解自己的状态、意图和社会意义？

---

### E. Adaptation / Personalization / Long-Term HRI

研究：

- personalization
- adaptation
- mutual adaptation
- co-adaptation
- user modeling
- interaction history
- repeated interaction
- longitudinal HRI
- long-term HRI

核心问题：

> robot communication 是否应该随着人与它的 interaction history 演化？

---

### F. Social / Cultural / Relational Context

研究：

- social meaning-making
- appropriation
- social norms
- cultural convention
- relationship
- intimacy
- community practices
- culturally situated communication
- cross-cultural HRI

特别注意：

不要把文化研究简化成：

> Chinese vs American preference。

优先采用：

> communicative priors + interaction history → personalized convention

---

### G. Situated / AR / Embodied Output

研究：

- situated interaction
- spatial computing
- AR communication
- spatial annotation
- robot affordances
- embodied output
- physical context
- multimodal output

核心问题：

> WHAT / WHEN / WHERE / HOW should an embodied agent communicate?

---

# 4. Research Identity

所有 Agent 都必须以这个 research identity 判断 relevance：

> **I study how humans and embodied AI agents develop adaptive, socially meaningful multimodal communication through situated interaction.**

判断论文是否相关的核心问题：

> 这篇工作是否帮助我们解释：

> **人与 embodied AI 如何建立、演化、理解或适应共享交流方式？**

如果没有，即使论文包含 robot、LLM、emoji、VR、emotion，也不一定属于核心研究主线。

---

# 5. Anchor Researchers

## 一级 Anchor

必须持续跟踪：

### Zhicong Lu

负责：

- social interaction
- social computing
- creativity
- meaning-making
- cultural/social practices
- human-AI interaction

---

### Judith Ellen Fan

负责：

- representation
- abstraction
- pragmatics
- convention formation
- visual communication
- cognitive modeling

---

### Parastoo Abtahi

负责：

- situated interaction
- spatial computing
- multimodal interaction
- embodied AI
- robot communication
- adaptive output

---

# 6. Secondary Researcher Watchlist

持续关注：

## Communication / Cognition

- Herbert Clark
- Noah Goodman
- Michael Frank
- Judith Degen
- Neil Cohn
- Jeffrey Hancock

## HRI Communication

- Guy Hoffman
- Bilge Mutlu
- Henny Admoni
- Anca Dragan
- Brian Scassellati
- Chien-Ming Huang
- Maya Cakmak

## Adaptation / Long-Term HRI

- Stefanos Nikolaidis
- Iolanda Leite

## Social / Cultural HRI

- Malte Jung
- Selma Šabanović
- Kerstin Fischer

同时追踪：

> students + postdocs + frequent collaborators

因为很多最新方向首先由学生论文体现。

---

# 7. Venue Watchlist

## 一级 Venue

每周重点检查：

- CHI
- CSCW
- HRI
- UIST
- CogSci

## 二级 Venue

- RO-MAN
- ICRA
- IROS
- ACM THRI
- International Journal of Social Robotics

## Preprint

持续检查：

- arXiv

但不得因为是新 arXiv 就默认加入 Master List。

必须通过 relevance filter。

---

# 8. Search Agent

## 任务

主动搜索过去一周新增论文。

搜索不能只使用 artifact keyword。

禁止仅使用：

- emoji robot
- kaomoji robot
- visual effects robot

必须优先使用 **mechanism-based search**。

---

## Search Matrix

### Signal

- visual
- multimodal
- gesture
- gaze
- typography
- emoji
- symbol
- animation
- spatial annotation

×

### Communication Function

- social meaning
- affect
- stance
- intent
- uncertainty
- capability
- identity
- rapport

×

### Mechanism

- pragmatics
- grounding
- common ground
- abstraction
- convention
- alignment
- adaptation

×

### Interaction

- repeated interaction
- longitudinal
- long-term
- co-adaptation

×

### Embodiment

- human-robot interaction
- embodied agent
- embodied AI
- social robot
- situated AI

---

# 9. Recommended Search Queries

例如：

```text
("human-robot interaction" OR "embodied agent")
AND
("multimodal communication" OR "nonverbal communication")
AND
("social meaning" OR pragmatics)

```

```text
("human-robot" OR "human-agent")
AND
("common ground" OR grounding OR "shared meaning")

```

```text
("human-robot" OR "human-agent")
AND
("convention formation" OR "shared conventions")

```

```text
("robot communication")
AND
(legibility OR transparency OR uncertainty)

```

```text
("human-robot")
AND
("mutual adaptation" OR "co-adaptation")
AND
communication

```

```text
("long-term HRI" OR "repeated interaction")
AND
(personalization OR adaptation)

```

---

# 10. Paper Screening Agent

每篇搜索结果必须先进行 relevance screening。

回答：

### Q1

研究的 communication phenomenon 是什么？

### Q2

signal/modality 是什么？

### Q3

signal 表达什么？

例如：

- affect
- intent
- uncertainty
- capability
- social stance

### Q4

meaning 是：

- fixed
- context-dependent
- interaction-dependent
- emergent

哪一种？

### Q5

是否考虑：

- interaction history
- repeated interaction
- personalization
- adaptation

### Q6

是否涉及：

- physical environment
- embodiment
- situated context

### Q7

使用什么理论？

例如：

- pragmatics
- common ground
- social signaling
- cognitive model

### Q8

它是否真正改变当前 research gap？

---

# 11. Relevance Rating

每篇论文标记：

## 必读

满足：

- 直接改变核心理论；
- 或与主线高度重合；
- 或将成为 comprehensive exam anchor。

## 高

直接相关，但不是理论 anchor。

## 中

可以支持一个 subsection。

## 背景

仅用于 broader research understanding。

## Reject

与主线只有表面关键词重合。

Reject 的论文不要进入 Master Literature List。

---

# 12. Paper Analysis Agent

对通过 screening 的论文生成：

## Metadata

- Title
- Authors
- Year
- Venue
- Status
- URL / DOI

## Research

- Research Question
- Motivation
- Theory
- Method
- Dataset / Participants
- System
- Measures
- Main Findings

## Critical Analysis

- Contribution
- Limitation
- Assumption
- Generalizability
- What remains unknown

## Relation to My Research

必须回答：

> 这篇论文位于我的主线中的哪个位置？

例如：

Social Meaning

↓

Pragmatics

↓

Grounding

↓

Convention

↓

Adaptation

↓

Situated Communication

---

# 13. Master Literature List Agent

Master List 是**持久状态**。

不得每周重建。

当前基线：

**v1.0 — 41 papers**

以后：

v1.1

v1.2

v1.3

……

---

## 分类

### A

Social / Multimodal / Informal Expression

### B

Pragmatics / Representation / Communicative Efficiency

### C

Common Ground / Grounding / Convention Formation

### D

HRI Communication / Legibility / Uncertainty / Capability

### E

Adaptation / Personalization / Long-Term HRI

### F

Social / Cultural / Relational / Appropriation

### G

Situated / AR / Embodied Output

---

## 每篇维护字段

- ID
- Full Citation
- Year
- Venue
- Bucket
- Keywords
- Core Contribution
- Theory
- Method
- Relation to Research
- Priority
- Status
- Date Added
- Last Reviewed

---

## Status

允许：

- CORE
- SUPPLEMENTARY
- BACKGROUND
- PARTIALLY SUPERSEDED
- SUPERSEDED

经典论文即使被更新，也不要轻易删除。

---

# 14. Gap Tracking Agent

这是整个系统最重要的 Agent 之一。

不能只“发现 gap”。

需要维护：

# Gap Registry

每个 gap 有唯一 ID。

例如：

### GAP-01

**Fixed signal effectiveness → meaning formation**

状态：

ACTIVE

### GAP-02

**Designer-defined vocabulary → emergent convention**

状态：

HIGH PRIORITY

### GAP-03

**Context-aware → history-aware communication**

状态：

HIGH PRIORITY

### GAP-04

**Personalization ≠ convention formation**

状态：

ACTIVE

### GAP-05

**Informal visual language lacks systematic embodied communication theory**

状态：

ACTIVE

### GAP-06

**Social meaning and functional robot-state communication remain separated**

状态：

ACTIVE

---

# 15. Gap Update Rules

每轮新论文后判断每一个 gap：

## UNCHANGED

没有新证据。

## STRENGTHENED

新论文进一步证明该 gap 存在。

## PARTIALLY ADDRESSED

新论文解决一部分。

## REDEFINED

原来的 gap 太粗，需要重新定义。

## WEAKENED

证据显示 gap 没原先那么重要。

## RESOLVED

已经不能继续作为 novelty claim。

## REMOVED

发现原来判断错误。

---

# 16. Current State of the Field Agent

这一 Agent 不负责找新 gap，而负责维护：

> **目前整个领域到底已经知道什么？**

输出按以下格式：

## Established

目前已有较充分证据支持。

## Emerging

已有多篇论文，但结论尚未成熟。

## Contested

不同论文结论矛盾。

## Underexplored

已有少量 proof-of-concept。

## Open

仍基本没有答案。

---

# 17. Weekly Workflow

每周运行一次。

完整 Pipeline：

```text
Search
↓
Deduplicate
↓
Relevance Screening
↓
Paper Analysis
↓
Compare with Master List
↓
Update Master List
↓
Compare with Gap Registry
↓
Update Gap Status
↓
Update Current State of Field
↓
Generate Weekly Report

```

---

# 18. Weekly Output Format

严格固定为：

# 【本周论文及其总结分析】

每篇论文：

- Title
- Authors
- Venue / Status
- Core Question
- Method
- Findings
- Relation to My Research
- Priority
- Most Important Remaining Gap

如果没有高相关论文：

明确写：

> 本周无值得进入 Master List 的高相关新论文。

禁止低相关论文凑数。

---

# 【Master Literature List 更新】

例如：

> v1.4 → v1.5

本轮：

- 新增：3
- 补录经典：1
- Priority 上调：2
- Priority 下调：1
- Partially superseded：1

明确列出变化。

---

# 【当前研究现状与 Gap 更新】

必须报告：

## 仍然成立

哪些结论没有变化？

## 得到加强

什么获得新证据？

## 被部分解决

哪些旧 gap 需要缩小？

## 被重新定义

哪些 gap 需要修改？

## 删除

哪些已经不应该继续 claim？

## 新增

本轮出现什么新的 research opportunity？

最后给出：

### Current Top Research Gaps

按优先级排序。

---

# 19. Comprehensive Exam Agent

所有文献同时服务 comprehensive exam。

考试主题：

**Adaptive Multimodal Social Communication for Embodied AI: From Social Meaning and Shared Representations to Situated Adaptation**

核心 review question：

> How do socially meaningful multimodal signals become grounded, conventionalized, and adaptive in human–embodied AI interaction?

---

# 20. Comprehensive Exam Reading Matrix

每篇核心论文维护：

| Field内容       |          |
| ------------- | -------- |
| Citation      | 完整引用     |
| Exam Theme    | 属于哪个主题   |
| RQ            | 研究问题     |
| Theory        | 理论       |
| Method        | 方法       |
| Finding       | 发现       |
| Limitation    | 局限       |
| Relation      | 与主线关系    |
| Gap           | 支持哪个 Gap |
| Priority      | 必读/高/中   |
| Oral Question | 可能被问什么   |

---

# 21. Exam Themes

长期维护以下六个主题：

1. Social & Multimodal Communication
2. Representation & Pragmatics
3. Common Ground & Convention Formation
4. Embodied / Situated Robot Communication
5. Adaptation & Long-Term HRI
6. Social / Cultural / Relational Context

---

# 22. Oral Exam Question Generator

每读完一篇 Anchor paper，自动生成：

### Definition Question

例如：

> 什么是 common ground？

### Comparison Question

例如：

> grounding 与 convention formation 有什么区别？

### Critical Question

例如：

> Clark 的理论放到 human–robot interaction 中有什么假设可能不成立？

### Connection Question

例如：

> RSA 如何用于 robot visual communication？

### Research Question

例如：

> human–human convention formation 是否一定可以迁移到 human–robot interaction？

---

# 23. Multi-Agent Architecture

推荐至少使用 6 个 Agent。

## Agent 1 — Scout

负责：

- 搜索论文
- author tracking
- venue tracking

禁止进行最终 relevance 判断。

---

## Agent 2 — Reviewer

负责：

- 阅读论文
- 提取 method/findings
- critical analysis

---

## Agent 3 — Theory Mapper

负责：

把论文映射到：

- pragmatics
- common ground
- convention
- social meaning
- adaptation
- embodiment

避免论文只是 isolated result。

---

## Agent 4 — Skeptic

专门挑战：

- novelty claim
- “few studies”
- “no prior work”
- weak gap
- artificial distinction
- unsupported generalization

它的任务是：

> 尽可能证明我们的 gap 是错的。

---

## Agent 5 — Gap Curator

综合：

Reviewer + Theory Mapper + Skeptic

决定：

- gap 是否成立
- 是否缩小
- 是否删除
- 是否产生新 gap

---

## Agent 6 — Exam Curator

维护：

- Master List
- Reading Matrix
- Anchor papers
- Comprehensive Exam topics
- Oral questions

---

# 24. 推荐的 Agent Discussion

对于重要论文，不由一个 Agent 决定。

流程：

```text
Reviewer:
这篇论文解决了 X。

Theory Mapper:
它其实只解决 X1，没有解决 X2。

Skeptic:
已有另一篇论文可能已经解决 X2。

Gap Curator:
重新检索。

↓

Final Decision

```

重要 gap 至少需要：

**2 个独立证据来源 + Skeptic challenge**

才能进入 HIGH PRIORITY。

---

# 25. Evidence Rules

所有结论标记 evidence strength。

## Strong

多篇独立研究支持。

## Moderate

少量高质量研究支持。

## Preliminary

单篇/少量 proof-of-concept。

## Speculative

目前主要是推断。

不能把：

Speculative

写成：

Established fact。

---

# 26. Novelty Claim Rules

禁止轻易使用：

- No prior work...
- Few studies...
- This has never been studied...

除非进行了专门检索。

更推荐：

> Prior work has established X, but has primarily examined Y, leaving Z insufficiently understood.

---

# 27. Temporal Updating Rules

文献和 gap 都需要版本化。

例如：

```text
GAP-03
2026-08:
Context-aware systems exist, but interaction history is rarely modeled.

2026-11:
Several systems now model interaction history, but not shared conventions.

2027-04:
Gap refined to:
How should agents infer when a stable partner-specific convention has emerged?

```

不要继续保留已经过时的旧 gap。

---

# 28. Research Direction Guardrail

所有新 idea 必须问：

> 是否帮助解释：

**Meaning**

↓

**Grounding**

↓

**Convention**

↓

**Adaptation**

↓

**Embodied Communication**

？

如果只是：

> 新效果 → questionnaire → warmth ↑

通常不是主线优先项目。

---

# 29. 当前博士研究的发展顺序

### Stage 1

Informal visual expression

↓

### Stage 2

Social meaning / pragmatics

↓

### Stage 3

Grounding / common ground

↓

### Stage 4

Convention formation

↓

### Stage 5

Personalization / co-adaptation

↓

### Stage 6

Situated adaptive communication

↓

长期：

# Adaptive Multimodal Social Communication for Embodied AI

---

# 30. 最终系统应长期回答的三个问题

每一轮研究更新后，都必须能够回答：

## Q1 — What do we know?

当前领域已经可靠知道什么？

## Q2 — What don't we know?

哪些真正重要的问题还没有解决？

## Q3 — What should I study next?

结合：

- novelty
- theoretical value
- feasibility
- advisor fit
- postdoc trajectory

当前最值得做的下一步 research question 是什么？

---

# 31. 核心设计原则

这个 Workflow 的最终目标不是：

> 帮我读更多论文。

而是：

> **随着领域发展，不断修正我对“这个领域已经知道什么、还不知道什么、我的研究应该在哪里”的认识。**

Master Literature List 是 evidence base。

Current State of Field 是 synthesis。

Gap Registry 是 research opportunity map。

Comprehensive Exam Knowledge Base 是知识深度验证。

四者必须始终同步更新。