# Research Radar — 新主线首次运行（2026-09-18）

窗口：2026-09-11至18；另设历史遗漏补回。主线版本2.0；Master List 2.0 → 2.1，42 → 48篇。

## 本周论文及其总结分析

本次有界检索中，本周无值得进入 Master List 的已核实高相关新论文。这不是不存在新工作的证明。以下6篇均为历史补回。

### X30 · Vision-Language Models Are Not Pragmatically Competent in Referring Expression Generation
作者：Ziqiao Ma, Jing Ding, Xuejun Zhang, Dezhi Luo, Jiahe Ding, Sihan Xu, Yuchen Huang, Run Peng, Joyce Chai。COLM 2025；Must Read。
问题：如何分别评价指称的可辨认性、简洁性和人的表达偏好？
方法：RefOI含1,485张图像，每个目标有3条书面和2条口头表达；比较模型输出、人类定位和自动指标，并操纵合成图像中的视觉线索。
发现：受测模型的指称表现落后于人类表达；常用自动指标不能可靠反映人的定位表现。
与主线关系：为GAP04提供明确的评价效度先例，连接Ziqiao Ma的研究风格；后续应明确自己增加的能力或测量贡献。
最重要的剩余疑问与边界：结论限于所测模型和指称任务；模型听者不是人类理解的替代，不能推广到全部社会语用能力。
证据：正文§3–5方法、结果与指标分析核查；未复现实验。 [来源](https://arxiv.org/abs/2504.16060) · [正文](https://arxiv.org/html/2504.16060v3)

### X31 · Order Matters: A Chinese Multi-Panel Meme Benchmark for Vision-Language Reasoning
作者：Haihan Li, Haihao Li, Zhenfei Xu, Jize Qian。arXiv preprint, 27 August 2026；Must Read。
问题：模型能否恢复多格meme的阅读顺序，并正确解释图文及评论的关系？
方法：1,214条中文多格meme；五个模型，868条强顺序样本用于打乱排序；252条做顺序×评论对照。解释主评价仅64条，另有31对上下文消融。
发现：按原顺序展示的高分不能代表排序推理；评论收益较小且有正负差异。
与主线关系：直接否定中文多格meme与评论上下文尚无benchmark的泛化空白；为X21后续提供必须比较的邻近资源。
最重要的剩余疑问与边界：预印本；解释评价是精选小样本，一致性中等；数据代码待接收后释放。排序与幽默理解相关但不能等同。
证据：正文§4–7协议、表4/6/8与局限核查；注意parseable输出分母及非独立评分。 [来源](https://arxiv.org/abs/2608.26866) · [正文](https://arxiv.org/html/2608.26866v1)

### X32 · Beyond the Literal: Decomposing Pragmatic Intent in Multimodal Meme Understanding
作者：Zhengyi Zhao, Shubo Zhang, Zezhong Wang, Luyao Ye, Huimin Wang, Hanqi Yan, Binyang Li, Kam-Fai Wong, Yulan He。arXiv preprint, 2 June 2026；Important。
问题：如何减少模型用画面描述代替meme用意解释的倾向？
方法：Intent Projection结合表征投影、结构化解释、自蒸馏和奖励训练；在多个meme与讽刺任务上比较基线及消融。
发现：作者报告多个骨干的生成和分类指标改善，尤其在字面内容与用意差异较大的材料上。
与主线关系：模型方法是主线的独立贡献路径；不能宣称尚无字面与语用分离方法，需核对训练成本、标签效度和跨分布收益。
最重要的剩余疑问与边界：预印本，未独立复现；主要英语/西方平台数据，自蒸馏可能复制错误；指标提升不证明恢复真实作者意图。
证据：正文方法概述、实验表1–4、消融及局限核查；训练成本与复现未核实。 [来源](https://arxiv.org/abs/2606.03604) · [正文](https://arxiv.org/html/2606.03604v1)

### X33 · SpeechCap: Leveraging Playful Impact Captions to Facilitate Interpersonal Communication in Social Virtual Reality
作者：Yu Zhang, Yi Wen, Siying Hu, Zhicong Lu。PACMHCI 9(7), CSCW246；CSCW 2025（DOI: 10.1145/3757427）；Must Read。
问题：花字如何成为实时人际交流中的表达资源？
方法：内容分析、4名专家共同设计和14名参与者原型研究；核查正文相关方法、体验与歧义章节。
发现：花字提供视觉修辞和互动表达机会，也出现歧义与误解。
与主线关系：Zhicong Lu的直接先例，贴近用户最初兴趣；区分好玩、表达丰富与准确理解，设备方案需另行评估。
最重要的剩余疑问与边界：探索性原型研究不能证明花字普遍提高理解正确率；研究的是支持人际交流，不是AI理解测试。
证据：独立遗漏审查者核验v2正文含§7.4.2误解案例；元数据v3声明CSCW2025，未做版本差异审计。 [来源](https://arxiv.org/abs/2502.10736) · [正文](https://arxiv.org/html/2502.10736v2)

### X34 · MemeBridge: A Dataset for Benchmarking and Mitigating the Bidirectional Cultural Gap in Meme Interpretation
作者：Hangxiao Zhu, Suliu Qin, Zhuoyan Li, Ming Jiang, Yu Zhang, Meng Xia。KDD 2026；Must Read。
问题：人们预测的跨文化误解与接收者实际解释是否一致，模型能否处理这种差异？
方法：621个美国来源meme；美国参与者预测误解、中国参与者提供解释，多阶段众包与模型评测。
发现：作者发现预测误解与实际解释存在不匹配；提供文化知识和解释评价资源。
与主线关系：为GAP04/05补上跨文化meme理解先例；可借鉴解释与误解预测分离，但不复制粗粒度文化假设。
最重要的剩余疑问与边界：双向视角不等于双向meme来源；群体内差异、评分和模板污染仍需审查，不能把国籍直接等同文化。
证据：独立审查者核验出版稿方法、结果与局限；70/15/15切分未核实模板或来源分组。日期字段为arXiv首发，会议早于该日。 [来源](https://arxiv.org/abs/2609.00491) · [正文](https://www.xiameng.org/KDD_Meme_Bridge.pdf)

### X35 · Multi-Granular Multimodal Clue Fusion for Meme Understanding
作者：Li Zheng, Hao Fei, Ting Dai, Zuquan Peng, Fei Li, Huisheng Ma, Chong Teng, Donghong Ji。AAAI 2025；Important。
问题：细粒度视觉线索与较弱的图文联系如何进入meme模型？
方法：对象级语义挖掘、全局与局部跨模态交互及双语义训练；在MET-MEME中英文任务上比较基线与组件消融。
发现：作者报告隐喻、情感、意图及冒犯检测上的性能改善。
与主线关系：新模型研究需比较已有融合方法，技术贡献本身有效，无须附加不相关人机实验。
最重要的剩余疑问与边界：证据限于受测标签任务；分类准确率不等于具体情境用意解释或共享意义，泛化与泄漏需进一步审计。
证据：独立审查者核验AAAI元数据与正文实验/消融；未复现实验。 [来源](https://arxiv.org/abs/2503.12560) · [正文](https://arxiv.org/html/2503.12560v1)

## Master Literature List 更新
新增X30–X35，全部是历史补回；不改变原42篇的阅读优先级，不恢复暂缓机器人材料。Must Read是阅读优先级，不是证据强度或项目批准。

## 当前研究现状与 Gap 更新
GAP01–03：本轮不改变。GAP04/05：维持REDEFINED与medium，追加直接先例并收紧泛化空白。没有新增、删除或宣称解决Gap。当前近期候选仍为GAP05，GAP04提供方法视角；具体RQ尚未选定。

独立遗漏审查支持补回SpeechCap、MemeBridge和MGMCF，但未建议提升为高优先级已验证空白。主线程同意：文献相关性明确，剩余新颖性仍待定位。独立审查另核查CMPM v2核心协议，与主线程v1核查共同提示：单一shuffle不是全面置换鲁棒性，评分展开不增加独立样本数，布局/索引处理失败也不能全部归因于语用缺陷。

## 图谱与下游
补入6篇论文及来源支持的作者/合著边，概念关系标为推断；不从兴趣推断合作或机构。SpeechCap与MemeBridge中同名Yu Zhang暂用论文内身份，未核实为同一人。新增一条直接相关口试素材；考试个人进度、原阅读队列和写作草稿不变。

## 跟踪与排除
- [Meme, Myself and AR](https://www.flomue.com/publication/meiMemeMyselfAR2026/)：CHI2026，作者页摘要级；AR社交meme先例，待正文审查，不进入本轮活动库。
- [I Came, I Saw, I Explained](https://aclanthology.org/2026.lrec-1.743/)：LREC2026，官方摘要显示模型可能过度判断修辞且解释不忠实；PDF打开失败，优先补读。
- [AVMeme Exam](https://arxiv.org/abs/2601.17645)：音视频文化理解方向，摘要级Track。
- [MER-Bench](https://arxiv.org/abs/2603.15020)：meme情绪重构与生成，摘要级Track，较近期理解重心间接。
- [RealityTalk](https://ryosuzuki.org/)：历史表达系统追溯线索；[Parastoo Abtahi](https://parastooabtahi.com/)的手势惯例研究C8已在库。
- A Mathematical Theory of Pragmatic Information（2609.10986）：任务导向信息论，不因pragmatic关键词收录；招聘评估与同名歌手Ryo Suzuki结果排除。

## 检索与质量控制
使用arXiv、ACL Anthology、OpenReview/出版方及作者主页；检索social pragmatic、multimodal meme、figurative meaning、context、共同基础、五位兴趣学者及引用线索。对日期限制检索返回的旧论文按真实首发日期归类；arXiv编号月份和抓取日期不作首发证据。与42篇活动库按标题/arXiv去重；没有声称遍历100条候选，100是预算上限。出版方覆盖不完整，未完成系统综述或所有模型复现。6篇是普通正文审查，不标为Deep。

## Q1 · 已知什么？
花字系统、meme模型与文化/顺序理解资源已有直接研究。描述、分类、解释、沟通成功和共同理解需要区分。

## Q2 · 还不知道什么？
哪些具体情境与模态关系让现有方法失效、怎样可信评价并改善，仍需比较最近邻工作；本轮没有确认一个空白。

## Q3 · 接下来研究什么？
以X21为基础，对照X30–X35建立任务、机制、评价、资源与3–6个月可行性矩阵，再选择首项问题。设备按问题选，不强制使用。

## English executive interpretation
The first v2 radar recovers six directly relevant older papers, with no verified in-window addition in the bounded search. Existing expressive systems, pragmatic evaluation, cultural meme resources and modeling methods narrow broad novelty claims. GAP04/05 remain candidates; no concrete research question or study is promoted.
