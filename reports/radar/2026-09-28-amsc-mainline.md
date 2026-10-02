# Research Radar — AMSC 主线周报（2026-09-28）

窗口：2026-09-21至28（America/New_York）；另设修订、作者链与历史术语遗漏通道。主线版本2.1；Master List 2.1 → 2.2，48 → 55篇。

## Executive decision

本周有7篇窗口内新论文进入Master List：X36–X42。最重要的更新不是又一次证明“context matters”，而是把RQ-FT-01收窄为：对视觉作品上的间接反馈，预测加入特定communication background后，真实recipient在具体item、具体时序下会出现help、harm还是no-change，以及变化幅度。X21与READI已经使宽泛context-benefit novelty不可辩护；Clarification Is Not Correction进一步要求区分首次解释前提供背景与形成解释后再纠正。

独立novelty、gap、quantitative和culture审查意见不完全一致。Novelty panel把Polite与Clarification列为Must Read，认可BSD/Live Assistant的AI贡献但拒绝把它们当recipient evidence；Gap red team认为READI和既有creative-feedback work是最大遗漏威胁；method audit把Two Emojis和Judge Calibration视为更强的测量警报但不建议用作RQ outcome；culture audit认可邮件实验的受控style-shift证据，同时否定“国家规范被覆盖”的外推。综合后只写入可追溯、边界明确的变化，RQ仍为DRAFT。

## 本周论文及其总结分析

### X36 · Polite but Misaligned: Evaluating LLM Politeness Judgments Against Human Pragmatic Norms

作者：Rong Wang, Kun Sun, Yadong Guo。EMNLP 2026；Must Read。

问题：模型的politeness判断与哪一种human pragmatic reference对齐，分歧是否具有方向？

方法：两个英语礼貌语料、七个模型、多种prompt；以human leave-one-out和模型间相关比较连续评分，并对318个高分歧样本由五名受过语言学/语用训练的L2英语标注者复核。

发现：平均inter-model相关高于model-human相关；三分类中模型系统性过产Neutral并低估Impolite，专家诊断集上仍出现该方向性偏差。

与主线关系：直接强化MeaningTrace/FrictionBench的多human-reference与directional disagreement设计；不操纵背景，不能回答RQ-FT-01。

最重要的剩余疑问与边界：第二语料来源与标注过程不清；专家集按争议抽样，不能估计总体流行率；只能称特定panel/reference，不能外推human norms、文化或内部机制。

证据：正文方法、主结果、专家诊断与限制；未复现实验。[来源](https://arxiv.org/abs/2609.29001) · [正文](https://arxiv.org/html/2609.29001v1)

### X37 · Clarification Is Not Correction: LLMs Fail to Let Go

作者：Jianzhe Lin, Xiaolin Li, Fei Wang, Robert Douglas, Rajeshkumar Golani, Jubin Chheda。arXiv preprint；Must Read。

问题：多轮失败是遗忘，还是早期歧义被过早固化，随后澄清未使旧状态失效？

方法：writing、planning、coding的受控短对话；比较信息顺序、Gemini 2.5 Pro/Flash、summary、CoT、state-ledger及小型rollback/two-phase干预。

发现：最终可用信息相当时，顺序仍改变成功率与old-hypothesis contamination；常见memory/prompt策略未稳定修复，显式rollback在小型受控实验中改善结果。

与主线关系：唯一实质收窄RQ操作定义的本周论文。背景在首次解释前提供、解释形成后作为correction提供、以及从旧状态patch或rebuild必须分开。

最重要的剩余疑问与边界：仅两种Gemini、生成任务和同族model judge；无人工judge校准或充分区间，未完全排除位置/近因效应；early posterior collapse不是测得的内部posterior。

证据：正文实验、干预和限制；未复现实验。[来源](https://arxiv.org/abs/2609.25337) · [正文](https://arxiv.org/html/2609.25337v1)

### X38 · User Model Extraction via Belief Self-Distillation

作者：Ali Holmov, Yiran Huang, Kirill Bykov, Zeynep Akata。arXiv preprint；Important。

问题：能否从模型对自然对话中用户的自我报告belief中抽取可读写、可干预的user-state表示？

方法：三种7–8B模型、约5.8万段WildChat/WildJailbreak对话、13个预设属性与rank-128 bottleneck；评价probe、steering、跨属性泄漏及跨模型对齐。

发现：低维状态保留多数probe信息，改写user-intent维度可改变拒答；同时存在明显cross-attribute leakage。

与主线关系：为Listener Model提供AI机制候选。其价值是model belief的可操纵性，不是证明模型理解真实用户。

最重要的剩余疑问与边界：监督目标来自模型自身belief和预设MCQ属性，无真实用户ground truth；白盒、小模型和安全拒答任务限制推广。

证据：正文目标、训练、probe、steering与限制；未复现实验。[来源](https://arxiv.org/abs/2609.31603) · [正文](https://arxiv.org/html/2609.31603v1)

### X39 · Live Assistant: Learning Whether, When, and Whom to Assist in Real-World Live Social Streams

作者：Shujian Gao, Jiamei Yan, Yuchen Yang, Penghao Zhou, Qinglei Wang, Tiehan Fan, Yuan Wang, Zuxuan Wu, Yu-gang Jiang。under review；Important。

问题：实时social stream中的助手如何联合决定保持沉默、记录或向特定recipient回应？

方法：原生音视频、评论、礼物、viewer dynamics和room metadata；320.8小时优化轨迹、38.4小时benchmark、275 clips与13,812个10秒interval；训练whether/when/whom/what联合策略。

发现：held-out benchmark为71.14 state、72.67 recipient、58.41 task accuracy，结构化训练优于一般SFT基线。

与主线关系：占据situated multimodal participation的AI/CV系统与资源路线；AMSC不能再把“选择性介入社会流”本身作为空白。

最重要的剩余疑问与边界：reference trajectory含teacher-model生成与人工审核；10秒粒度、少量rooms和自动judge限制效度。没有真实host/viewer的usefulness、interruption cost、appropriateness或shared meaning结果。

证据：正文任务、数据、训练、结果与限制；未复现实验。[来源](https://arxiv.org/abs/2609.27303) · [正文](https://arxiv.org/html/2609.27303v1)

### X40 · MSI-Bench: Evaluating Multi-Speaker Voice Interaction for Collaborative AI Agents

作者：Chenxu Xiong, Dongming Shen, Yuzhi Tang, Wentao Ma, Mu Li, Alex Smola。arXiv preprint；Must Read。

问题：voice agent能否在多说话者、多轮场景中维护speaker-scoped state并选择回应或克制？

方法：1,152个英/中双语音频场景，含participant context、expected tool calls与atomic rubrics，覆盖memory、instruction following和reasoning。

发现：最强配置只通过66.8%的英语和54.5%的中文全部rubrics；开放模型主要受audio front-end限制，frontier systems在clean transcript上仍有speaker-scoped decision失败，模型也常在未被addressed时回应。

与主线关系：为GAP-04和FrictionBench提供speaker、authority、audience与restraint的能力分解先例。

最重要的剩余疑问与边界：场景主要脚本化/TTS；rubric通过率不等于natural selective engagement、common ground或recipient outcome。双语覆盖也不是measurement invariance证据。

证据：正文benchmark组成、主要结果和限制；未复现实验。[来源](https://arxiv.org/abs/2609.24812) · [正文](https://arxiv.org/html/2609.24812v1)

### X41 · AI-Generated Email Drafts Shift Culturally Distinctive Communication Styles in Professional Email

作者：Shintaro Sakai, Alice Gao, Yuichi Shoda, Katharina Reinecke。arXiv preprint；Must Read。

问题：AI草稿是否改变professional email的communication style，且这种改变是否随群体背景与草稿风格的匹配而异？

方法：预注册2-group×3-condition混合设计；175名两次均点开草稿的日美Prolific全职雇员完成no-AI、low-context和high-context草稿任务；以LMM分析style marker变化。

发现：最终邮件向草稿风格移动，研究者定义的misaligned条件移动更大；日本组保留aligned草稿更多，美国组的aligned/misaligned保留差异不显著。

与主线关系：为communication support改变人类表达而非只提高效率提供受控HCI证据。

最重要的剩余疑问与边界：国别、居住国、语言捆绑；draft双次采用率日组96.6%、美组64.0%；单一双语coder、翻译链、高/低语境复合指标无invariance检验。邮件未真实发送，不能称国家规范被覆盖、关系受损或长期同质化。

证据：正文预注册设计、样本、LMM、讨论与culture audit；未复现实验。[来源](https://arxiv.org/abs/2609.26403) · [正文](https://arxiv.org/html/2609.26403v1)

### X42 · Small Cues, Big Consequences: Learning Pivotal Cues for Multimodal Meme Classification

作者：Akshit Sharma, Prashant W. Patil。Findings of EMNLP 2026；Important。

问题：多模态分类器是否抓住决定标签的pivotal cues，而不是依赖全局shortcut？

方法：MemeCF汇集9,895个meme并标注counterfactual cue、flip与rationale；MemePIVOT结合local alignment、global semantics和evidential fusion。

发现：显式pivotal-evidence建模在受测分类与cross-dataset设置中改善结果；7,495个cue为text、1,888个为image，只有512个为multimodal。

与主线关系：为AMSC×FailureTrace提供cue-level counterfactual evidence localization的CV/NLP先例。

最重要的剩余疑问与边界：任务仍是静态harm/hate/sarcasm分类；半自动生成、来源混合与随机划分需单独做近重复/模板泄漏审计。counterfactual label flip不等于作者意图、recipient interpretation或shared meaning。

证据：正文数据、模型、跨数据集、消融与限制；未复现实验。[来源](https://arxiv.org/abs/2609.26907) · [正文](https://arxiv.org/html/2609.26907v1)

## Master Literature List 更新

新增X36–X42。Deep审查预算用于X36、X37、X39、X40、X41；普通正文审查用于X38、X42及下面5项Track。Must Read表示主线阅读优先级，不是证据强度、研究者已读或项目批准。Master active count为55；没有删除、恢复archived v1或改变用户阅读进度。

## Current State、Gap与next-question更新

新增SOF-43至SOF-48。GAP-04保持REDEFINED/medium，新增human-reference disagreement、state invalidation、inferred-user state、selective participation、speaker-scoped restraint和style shift的有边界证据。GAP-05保持REDEFINED/medium，但statement被收窄：不再问宽泛的context是否重要，而问哪些text–visual–background关系对真实recipient产生item/person/timing-specific的help、harm或no-change，以及模型能否校准预测该变化。

RQ-FT-01保留DRAFT，未提升为第一项目。最小可辩护形式为：

> 对视觉作品上的间接反馈，在真实recipient或有依据的recipient distribution上，预测加入特定communication background后，解释会改善、恶化还是不变，以及变化幅度；区分首次解释前的background与解释形成后的correction。

下一步设计要求：recipient配对或随机context操纵、item×person层级模型、human calibration、effect interval、help/harm/no-change、perceptual access检查，以及独立judge/盲多人评审。culture层面要测实践经历、身份与群内差异，并检查translation equivalence/invariance。

## Research Graph、paper pages与下游

新增7个paper节点、来源核验的代表性coauthor边及有明确标注的推断机制边；没有从研究兴趣推断机构、指导或合作关系。新增7个paper pages。Comprehensive Exam KB未更新：本轮证据收窄主线问题和评测设计，但没有直接替换现有exam theme、anchor、写作claim或oral question；现有用户exam-preparation edits保持不动。

## Track、修订与历史遗漏

- [Two Emojis of Difference](https://arxiv.org/abs/2609.29445)：290 items×8 systems×3 Bangla raters的测量审计；强method warning，但emoji-affect decodability不是pragmatic understanding，跨语言比较被非平行语料/标签混杂。Track。
- [Calibrating LLM Judges for Human and AI Conversations](https://arxiv.org/abs/2609.29431)：affine calibration显著缩短score-distribution距离，却保持rank，不能修复item validity；Voice Arena上多数judge接近或低于duration baseline。Track。
- [Sorry Robot, Happy Human](https://arxiv.org/abs/2609.31403)：双层字体揭示VLM spatial-frequency selection failure，是visual access前提而非social-pragmatic interpretation。Track。
- [When LLM Agents Fail to Read the Room](https://arxiv.org/abs/2609.25284)：structured relational-state update值得保留，但500个合成社会世界、单一Gemini、300/1,000 queries且缺充分消融；Track，不进Master。
- [How Do Users Negotiate Harmful Value Conflicts with AI Companions?](https://arxiv.org/abs/2411.07042)：v3于9月24日修订，22人一周technology probe显示repair可能成为单边safety work；属于修订条目，不伪装成本周新论文，待version-diff audit。
- [READI](https://aclanthology.org/2026.findings-acl.1556/)：最大历史遗漏威胁。已有图像情境×间接言语行为×社会关系及错配图像ablation，但仅102个英/韩理论构造间接指令、模型MCQ；应进入下一次focused recovery。
- [Critique Me](https://doi.org/10.1145/3415232)：既有创意反馈研究已表明设计背景、个人背景与反馈需求会影响在线反馈；因此“创意反馈需要背景”只能作为前提。
- CEI、PaCE、Rethinking Pragmatics in LLMs、Meaningful Long-Term Thought Partnerships和Multi-Agent Comedy Club来自引用/作者链遗漏攻击，证据相关但超出本轮5+10调查预算；保留为Q3优先恢复队列，不写成已纳入Master。

上一期[2026-09-21 provisional scan](./2026-09-21-provisional-source-scan.md)是前一窗口的外部来源扫描，因当时无法读本地状态而未形成可接受的持久状态；本轮不把其中窗口外候选伪装为新证据。

## 检索与质量控制

检索覆盖机制词、五位primary anchor及其可核验作者链、CHI/CSCW/UIST/ACL/EMNLP等venue入口、X21 bibliography与forward-title/ID、历史术语（implicature、speech act、politeness/relational work、common ground、conceptual pact、repair、QUD、recipient design、backchannel、turn-taking/full-duplex）。严格排除仅因“multimodal”“pragmatic”“grounding”或anchor作者重合的论文，例如SVG数学视觉推理、企业证据grounding和通用video benchmark。

与48篇活动库按title/arXiv/DOI去重。12篇进入deep/normal全文调查，7篇纳入、5篇Track；另记录1项本周修订和历史遗漏队列。公开全文才写作full-text audit；未复现实验。arXiv API后段429、OpenReview ICLR入口403、部分UIST/EMNLP静态清单不可访问，因此不能声称穷尽。对X21的公开title/ID forward search未浮出引用，但Semantic Scholar API不可用，只能写“未发现”，不能写绝对0。

## Q1 · 已知什么？

Context importance、图像情境中的间接言语行为评估、选择性多模态参与、speaker-scoped voice-agent评价及局部cue建模均已有直接先例。模型间一致不等于与人类对齐；记住或承认澄清不等于撤销旧解释；communication support可能改变人的表达风格。

## Q2 · 还不知道什么？

尚不清楚哪些communication background对哪些真实recipient与visual-feedback item会改善、恶化或不改变解释，也缺少在新recipient/作品上校准预测该counterfactual effect的模型。跨群体translation equivalence、within-group variation、recipient outcome与长期互动后果仍不足。

## Q3 · 接下来研究什么？

先做两件小而关键的验证：第一，focused recovery审查READI、Critique Me、CEI、PaCE和open-ended pragmatic evaluation，完成closest-work矩阵；第二，用MeaningTrace Studio建立paired no-background/background材料，在首次解释前提供背景，先验证item-level effect与human reliability，再决定是否加入post-interpretation correction条件。若effect不稳定或主要由perceptual access驱动，应缩减或停止Listener Model开发。

## English executive interpretation

This radar adds seven in-window papers (X36–X42) after full-text review and independent novelty, gap, quantitative and culture audits. The broad claim that “context matters” is no longer novel: X21, READI and prior creative-feedback work already establish adjacent context effects. The defensible opportunity is narrower and stronger—predicting recipient-, item- and timing-specific counterfactual changes in how indirect feedback on visual work is interpreted, including help, harm and no-change. Clarification timing, state invalidation, human-reference disagreement, multi-party scope, and cultural measurement validity now become explicit design constraints. RQ-FT-01 remains a draft; no study or exam update is promoted.
