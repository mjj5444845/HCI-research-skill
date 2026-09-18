import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "research-programs", "amsc", "imports", "master-literature-v1.0.md");
const paperDir = path.join(root, "state", "paper-pages");
const verifiedAt = "2026-08-26";

const P = (id, slug, title, authors, year, venue, source_url, doi = null, access_status = "full_text", extra = {}) => ({
  id, slug, title, authors, year, venue, source_url, doi, access_status, ...extra
});

const baseline = [
  P("A1", "a1-ai-mediated-communication", "AI-Mediated Communication: Definition, Research Agenda, and Ethical Considerations", ["Jeffrey T. Hancock", "Mor Naaman", "Karen Levy"], 2020, "Journal of Computer-Mediated Communication, 25(1), 89–100", "https://academic.oup.com/jcmc/article/25/1/89/5714020", "10.1093/jcmc/zmz022"),
  P("A2", "a2-textual-paralanguage", "Textual Paralanguage and Its Implications for Marketing Communications", ["Andrea Webb Luangrath", "Joann Peck", "Victor A. Barger"], 2017, "Journal of Consumer Psychology, 27(1), 98–107", "https://arxiv.org/abs/1605.06799", "10.1016/j.jcps.2016.05.002"),
  P("A3", "a3-interpreting-emoji-pragmatics", "Interpreting Emoji Pragmatics", ["Ashley R. Dainas", "Susan C. Herring"], 2021, "Approaches to Internet Pragmatics: Theory and Practice, 107–144", "https://homes.luddy.indiana.edu/herring/Interpreting_Emoji_Pragmatics.pdf", "10.1075/pbns.318.04dai"),
  P("A4", "a4-a-visual-lexicon", "A Visual Lexicon", ["Neil Cohn"], 2007, "Public Journal of Semiotics, 1(1), 35–56", "https://journals.lub.lu.se/pjos/article/view/8814", "10.37693/pjos.2007.1.8814"),
  P("A5", "a5-multimodal-parallel-architecture", "A Multimodal Parallel Architecture: A Cognitive Framework for Multimodal Interactions", ["Neil Cohn"], 2016, "Cognition, 146, 304–323", "https://www.visuallanguagelab.com/P/NC_multimodality.pdf", "10.1016/j.cognition.2015.10.007"),
  P("A6", "a6-puppetchat", "PuppetChat: Fostering Intimate Communication through Bidirectional Actions and Micronarratives", ["Emma Jiren Wang", "Siying Hu", "Zhicong Lu"], 2026, "CHI 2026, Article 1295, 1–19", "https://arxiv.org/abs/2602.19463", "10.1145/3772318.3790685"),

  P("B1", "b1-pragmatic-language-interpretation", "Pragmatic Language Interpretation as Probabilistic Inference", ["Noah D. Goodman", "Michael C. Frank"], 2016, "Trends in Cognitive Sciences, 20(11), 818–829", "https://langcog.stanford.edu/papers_new/goodman-2016-tics.pdf", "10.1016/j.tics.2016.08.005"),
  P("B2", "b2-rational-speech-act-framework", "The Rational Speech Act Framework", ["Judith Degen"], 2023, "Annual Review of Linguistics, 9, 519–540", "https://alpslab.stanford.edu/papers/2023Degen.pdf", "10.1146/annurev-linguistics-031220-010811"),
  P("B3", "b3-pragmatic-inference-visual-abstraction", "Pragmatic Inference and Visual Abstraction Enable Contextual Flexibility During Visual Communication", ["Judith E. Fan", "Robert D. Hawkins", "Mike Wu", "Noah D. Goodman"], 2020, "Computational Brain & Behavior, 3(1), 86–101", "https://cogtoolslab.github.io/pdf/fan_cbb_2019.pdf", "10.1007/s42113-019-00058-7", "full_text", { online_first_year: 2019, correction_note: "原清单使用 online-first 年份 2019；本页采用正式卷期年份 2020。" }),
  P("B4", "b4-when-redundancy-is-useful", "When Redundancy Is Useful: A Bayesian Approach to ‘Overinformative’ Referring Expressions", ["Judith Degen", "Robert D. Hawkins", "Caroline Graf", "Elisa Kreiss", "Noah D. Goodman"], 2020, "Psychological Review, 127(4), 591–621", "https://arxiv.org/abs/1903.08237", "10.1037/rev0000186"),

  P("C1", "c1-referring-as-collaborative-process", "Referring as a Collaborative Process", ["Herbert H. Clark", "Deanna Wilkes-Gibbs"], 1986, "Cognition, 22(1), 1–39", "https://web.stanford.edu/~clark/1980s/Clark%2C%20H.H.%20_%20Wilkes-Gibbs%2C%20D.%20_Referring%20as%20a%20collaborative%20process_%201986.pdf", "10.1016/0010-0277(86)90010-7"),
  P("C2", "c2-grounding-in-communication", "Grounding in Communication", ["Herbert H. Clark", "Susan E. Brennan"], 1991, "Perspectives on Socially Shared Cognition, 127–149", "https://www.cs.cmu.edu/~illah/CLASSDOCS/Clark91.pdf", "10.1037/10096-006"),
  P("C3", "c3-conceptual-pacts", "Conceptual Pacts and Lexical Choice in Conversation", ["Susan E. Brennan", "Herbert H. Clark"], 1996, "Journal of Experimental Psychology: Learning, Memory, and Cognition, 22(6), 1482–1493", "https://web.stanford.edu/~clark/1990s/Brennan%2C%20S.E.%20_%20Clark%2C%20H.H.%20_Conceptual%20pacts%20and%20lexical%20choice%20in%20conversation_%201996.pdf", "10.1037/0278-7393.22.6.1482"),
  P("C4", "c4-repeated-reference-games", "Characterizing the Dynamics of Learning in Repeated Reference Games", ["Robert D. Hawkins", "Michael C. Frank", "Noah D. Goodman"], 2020, "Cognitive Science, 44(6), e12845", "https://onlinelibrary.wiley.com/doi/full/10.1111/cogs.12845", "10.1111/cogs.12845"),
  P("C5", "c5-graphical-convention-formation", "Graphical Convention Formation During Visual Communication", ["Robert X. D. Hawkins", "Megumi Sano", "Noah D. Goodman", "Judith E. Fan"], 2019, "Proceedings of the 41st Annual Meeting of the Cognitive Science Society", "https://cognitivesciencesociety.org/cogsci-2019/", null),
  P("C6", "c6-visual-resemblance-interaction-history", "Visual Resemblance and Interaction History Jointly Constrain Pictorial Meaning", ["Robert D. Hawkins", "Megumi Sano", "Noah D. Goodman", "Judith E. Fan"], 2023, "Nature Communications, 14, Article 2199", "https://www.nature.com/articles/s41467-023-37737-w", "10.1038/s41467-023-37737-w", "full_text", { investigation_status: "abstract_and_full_page_reviewed", problem: "图像意义究竟主要来自 visual resemblance，还是来自互动中形成的 socially mediated conventions？", method: "三项实验与一次完整 replication 使用 repeated drawing reference game；研究操纵 shared interaction history，并结合 model-based image analyses 与 crowdsourced annotations。", findings: ["参与者随重复互动形成 object-specific 与 interaction-specific 的高效表达策略，变化不能仅由任务练习或纯 resemblance account 解释。", "图画并未简单漂移为任意符号，而是继续保留能区分 referent 的 diagnostic visual features。"], real_contribution: "把 resemblance-based 与 convention-based 解释整合为可检验的 pictorial meaning account，显示视觉信息与 shared history 共同约束 graphical conventions。", biggest_weakness: "实验聚焦受控的视觉对象 reference game；对抽象概念、真实协作与具身 Agent 的外推仍需新证据。", claim_boundary: "证据支持特定 repeated visual communication 范式中的 dyad-specific convention formation，不等同于已证明机器人可学习或生成同类约定。" }),
  P("C7", "c7-shared-procedural-abstractions", "Learning to Communicate about Shared Procedural Abstractions", ["William P. McCarthy", "Robert D. Hawkins", "Haoliang Wang", "Cameron Holdaway", "Judith E. Fan"], 2021, "Proceedings of the 43rd Annual Meeting of the Cognitive Science Society, 77–83", "https://repositories.cdlib.org/uc/item/3vs8285x", null, "full_text", { correction_note: "原清单将 Holdaway 列在 Wang 之前；本页按论文标题页与会议记录纠正作者顺序。" }),
  P("C8", "c8-gesturing-toward-abstraction", "Gesturing Toward Abstraction: Multimodal Convention Formation in Collaborative Physical Tasks", ["Kiyosu Maeda", "William P. McCarthy", "Ching-Yi Tsai", "Jeffrey Mu", "Haoliang Wang", "Robert D. Hawkins", "Judith E. Fan", "Parastoo Abtahi"], 2026, "CHI 2026", "https://arxiv.org/abs/2602.08914", "10.1145/3772318.3790618"),

  P("D1", "d1-nonverbal-teamwork", "Effects of Nonverbal Communication on Efficiency and Robustness in Human-Robot Teamwork", ["Cynthia Breazeal", "Cory D. Kidd", "Andrea Lockerd Thomaz", "Guy Hoffman", "Matt Berlin"], 2005, "IROS 2005, 708–713", "https://www.media.mit.edu/publications/effects-of-nonverbal-communication-on-efficiency-and-robustness-in-human-robot-teamwork-2/", "10.1109/IROS.2005.1545011"),
  P("D2", "d2-footing-in-human-robot-conversations", "Footing in Human-Robot Conversations: How Robots Might Shape Participant Roles Using Gaze Cues", ["Bilge Mutlu", "Toshiyuki Shiwa", "Takayuki Kanda", "Hiroshi Ishiguro", "Norihiro Hagita"], 2009, "HRI 2009, 61–68", "https://pages.cs.wisc.edu/~bilge/pubs/2009/HRI09-Mutlu-Footing.pdf", "10.1145/1514095.1514109"),
  P("D3", "d3-nonverbal-leakage", "Nonverbal Leakage in Robots: Communication of Intentions through Seemingly Unintentional Behavior", ["Bilge Mutlu", "Fumitaka Yamaoka", "Takayuki Kanda", "Hiroshi Ishiguro", "Norihiro Hagita"], 2009, "HRI 2009, 69–76", "https://pages.cs.wisc.edu/~bilge/pubs/2009/HRI09-Mutlu-Leakage.pdf", "10.1145/1514095.1514110"),
  P("D4", "d4-expressing-thought", "Expressing Thought: Improving Robot Readability with Animation Principles", ["Leila Takayama", "Doug Dooley", "Wendy Ju"], 2011, "HRI 2011, 69–76", "https://doi.org/10.1145/1957656.1957674", "10.1145/1957656.1957674", "metadata_only"),
  P("D5", "d5-legibility-and-predictability", "Legibility and Predictability of Robot Motion", ["Anca D. Dragan", "Kenton C. T. Lee", "Siddhartha S. Srinivasa"], 2013, "HRI 2013, 301–308", "https://publications.ri.cmu.edu/legibility-and-predictability-of-robot-motion", "10.1109/HRI.2013.6483603"),
  P("D6", "d6-designing-robots-with-movement", "Designing Robots with Movement in Mind", ["Guy Hoffman", "Wendy Ju"], 2014, "Journal of Human-Robot Interaction, 3(1), 91–122", "https://doi.org/10.5898/JHRI.3.1.Hoffman", "10.5898/JHRI.3.1.Hoffman"),
  P("D7", "d7-social-eye-gaze-review", "Social Eye Gaze in Human-Robot Interaction: A Review", ["Henny Admoni", "Brian Scassellati"], 2017, "Journal of Human-Robot Interaction, 6(1), 25–63", "https://www.ri.cmu.edu/app/uploads/2018/01/admoni2017jhri.pdf", "10.5898/JHRI.6.1.Admoni"),
  P("D8", "d8-legible-multimodal-state-intent", "Legible and Intuitive Multi-modal Robot State and Intent Communication Validated in Online and Real-world Studies", ["Tim Schreiter", "Jens V. Rüppel", "Andrey Rudenko", "Martin Magnusson", "Achim J. Lilienthal"], 2026, "RO-MAN 2026 (accepted/presented; proceedings DOI pending)", "https://arxiv.org/abs/2606.24445", "10.48550/arXiv.2606.24445", "full_text", { publication_status: "accepted_with_preprint", last_verified: verifiedAt }),
  P("D9", "d9-anatomy-of-uncertainty", "Anatomy of Uncertainty: Expressive Descriptors of Robotic Manipulator Motion for Non-verbal Communication in Human-Robot Collaboration", ["Ridhima Bector", "Souravik Dutta", "Poornima Ramachandran", "Ree Yan Yeoh", "Jui Hien Tan", "Domenico Campolo", "Bernhard Johannes Schmitt"], 2026, "arXiv preprint", "https://arxiv.org/abs/2607.13696", "10.48550/arXiv.2607.13696", "full_text", { publication_status: "preprint_only", last_verified: verifiedAt }),

  P("E1", "e1-long-term-social-robots-survey", "Social Robots for Long-Term Interaction: A Survey", ["Iolanda Leite", "Carlos Martinho", "Ana Paiva"], 2013, "International Journal of Social Robotics, 5(2), 291–308", "https://viterbik12.usc.edu/wp-content/uploads/2018/06/Social-Robots-for-Long-Term-Interaction-A-Survey.pdf", "10.1007/s12369-013-0178-y"),
  P("E2", "e2-human-robot-mutual-adaptation", "Human-Robot Mutual Adaptation in Collaborative Tasks: Models and Experiments", ["Stefanos Nikolaidis", "David Hsu", "Siddhartha Srinivasa"], 2017, "The International Journal of Robotics Research, 36(5–7), 618–634", "https://pubmed.ncbi.nlm.nih.gov/32855581/", "10.1177/0278364917690593"),
  P("E3", "e3-continual-adaptation-machine-communication", "Continual Adaptation for Efficient Machine Communication", ["Robert Hawkins", "Minae Kwon", "Dorsa Sadigh", "Noah Goodman"], 2020, "CoNLL 2020, 408–419", "https://aclanthology.org/2020.conll-1.33/", "10.18653/v1/2020.conll-1.33", "full_text", { investigation_status: "abstract_reviewed", problem: "人工沟通 Agent 能否在 repeated reference interaction 中像人一样，针对新伙伴与新语境持续形成高效 convention？", method: "提出 interactive repeated reference task 与 regularized continual learning framework，并在 COCO simulations 和真实 human-partner reference games 中评估。", findings: ["来源摘要报告：该框架使以通用语言模型初始化的 Agent 能随互动更准确、更高效地与伙伴沟通。"], real_contribution: "把 on-the-fly partner adaptation 变成可比较的机器沟通 benchmark 与 continual-learning 问题。", biggest_weakness: "公开摘要不足以支持对所有实验条件、效应量与失败模式的完整审计；页面当前不作更强结论。", claim_boundary: "证据针对 repeated linguistic reference communication；不能直接推出 multimodal embodied conventions 已被解决。" }),
  P("E4", "e4-designing-robots-long-term", "Designing Robots for Long-Term Social Interaction", ["Rachel Gockley", "Allison Bruce", "Jodi Forlizzi", "Marek Michalowski", "Anne Mundell", "Stephanie Rosenthal", "Brennan Sellner", "Reid Simmons", "Kevin Snipes", "Alan C. Schultz", "Jue Wang"], 2005, "IROS 2005, 1338–1343", "https://www.cs.cmu.edu/afs/cs/usr/reids/www/papers/Valerie-IROS2005-final.pdf", "10.1109/IROS.2005.1545303", "full_text", { correction_note: "原清单误写为 Kirby, R., et al.；依据论文标题页与 IEEE DOI metadata，纠正为 Gockley, R., et al." }),

  P("F1", "f1-emergence-social-norms-conventions", "The Emergence of Social Norms and Conventions", ["Robert X. D. Hawkins", "Noah D. Goodman", "Robert L. Goldstone"], 2019, "Trends in Cognitive Sciences, 23(2), 158–169", "https://rdhawkins.com/wp-content/uploads/2018/12/normemergence.pdf", "10.1016/j.tics.2018.11.003"),
  P("F2", "f2-robots-in-society", "Robots in Society, Society in Robots: Mutual Shaping of Society and Technology as a Framework for Social Robot Design", ["Selma Šabanović"], 2010, "International Journal of Social Robotics, 2(4), 439–450", "https://homes.luddy.indiana.edu/selmas/Sabanovic-IJSR2010.pdf", "10.1007/s12369-010-0066-7"),
  P("F3", "f3-robotic-products-social-products", "How Robotic Products Become Social Products: An Ethnographic Study of Cleaning in the Home", ["Jodi Forlizzi"], 2007, "HRI 2007, 129–136", "https://hcii.s3.amazonaws.com/ppr/papers/p129-forlizzi.pdf", "10.1145/1228716.1228734"),
  P("F4", "f4-my-roomba-is-rambo", "“My Roomba Is Rambo”: Intimate Home Appliances", ["Ja-Young Sung", "Lan Guo", "Rebecca E. Grinter", "Henrik I. Christensen"], 2007, "UbiComp 2007, LNCS 4717, 145–162", "https://faculty.cc.gatech.edu/~beki/c35.pdf", "10.1007/978-3-540-74853-3_9"),
  P("F5", "f5-robots-in-the-wild", "Robots in the Wild: A Time for More Robust Theories of Human-Robot Interaction", ["Malte F. Jung", "Pamela J. Hinds"], 2018, "ACM Transactions on Human-Robot Interaction, 7(1), Article 2", "https://interplay.infosci.cornell.edu/assets/papers/wild.pdf", "10.1145/3208975"),
  P("F6", "f6-generative-encounters-robin", "Generative Encounters with Robin: Design through Adaptation and Appropriation of a Social Robot in Four Eldercare Facilities", ["Nan Hu", "Selma Šabanović"], 2026, "HRI 2026, 306–315", "https://humanrobotinteraction.org/2026/schedule/", "10.1145/3757279.3785575", "metadata_only", { last_verified: verifiedAt }),

  P("G1", "g1-robot-motion-intent-ar", "Communicating Robot Motion Intent with Augmented Reality", ["Michael Walker", "Hooman Hedayati", "Jennifer Lee", "Daniela Szafir"], 2018, "HRI 2018, 316–324", "https://www.cs.columbia.edu/~allen/S19/Student_Papers/robot_intent_AR.pdf", "10.1145/3171221.3171253"),
  P("G2", "g2-visualisation-disambiguating-verbal-requests", "A Comparison of Visualisation Methods for Disambiguating Verbal Requests in Human-Robot Interaction", ["Elena Sibirtseva", "Dimosthenis Kontogiorgos", "Oscar Nykvist", "Hakan Karaoguz", "Iolanda Leite", "Joakim Gustafson", "Danica Kragic"], 2018, "IEEE RO-MAN 2018, 43–50", "https://arxiv.org/abs/1801.08760", "10.1109/ROMAN.2018.8525554"),
  P("G3", "g3-explainable-oohri", "Explainable OOHRI: Communicating Robot Capabilities and Limitations as Augmented Reality Affordances", ["Linda W. Wang", "Mohamed Kari", "Parastoo Abtahi"], 2026, "HRI 2026, 427–437", "https://xoohri.github.io/", "10.1145/3757279.3785569"),
  P("G4", "g4-context-aware-expressive-motion", "Context-Aware Generation and Modulation of Expressive Motion Behavior using Multimodal Foundation Models", ["Till Hielscher", "Fabio Scaparro", "Kai O. Arras"], 2026, "HRI 2026, 438–446", "https://gen-mod-expressive-motion-behavior.github.io/", "10.1145/3757279.3785635")
];

const candidates = [
  P("X1", "x1-spotter-human-robot-conventions", "SPOTTER: A Framework for Investigating Convention Formation in a Visually Grounded Human-Robot Reference Task", ["Jesse Kruijt", "Pepijn van Minkelen", "Lucia Donatelli", "Piek Vossen", "Elly Konijn", "Thomas Baier"], 2024, "LREC-COLING 2024, 15202–15215", "https://aclanthology.org/2024.lrec-main.1322/", null, "full_text", { priority: "Must Read", one_sentence: "直接研究 visually grounded human–robot reference task 中的 common ground、repeated interaction 与 convention formation，是原 41 篇清单中最明显的主线遗漏。", problem: "人和机器人在重复的视觉指称任务中能否形成稳定的 referring conventions？", findings: ["论文提供约 5,000 条 utterances 的研究资源。", "表达长度没有像典型 human–human repeated reference interaction 那样缩短，且 convention 稳定性受到 distractors 影响。"], real_contribution: "把 convention formation 直接放进 human–robot visually grounded reference task，并提供可复用 framework 与语料。", biggest_weakness: "单一任务范式的结果不能代表所有 multimodal embodied convention；也不能据此认为 GAP-02 已完全解决。", claim_boundary: "支持把 GAP-02 标为 partially addressed，但 human–robot shared convention 的机制、跨模态扩展与长期稳定性仍开放。", amsc: { mainline_fit: 9.8, buckets: ["C", "E"], stages: ["Grounding", "Convention", "Adaptation"], mechanisms: ["human–robot convention formation", "repeated reference"], gap_ids: ["GAP-02"], master_list_decision: "Candidate — Must Read" } }),
  P("X2", "x2-lvlms-humans-ground-differently", "LVLMs and Humans Ground Differently in Referential Communication", ["Pei Zeng", "Wenhao Li", "Alexandra J. Paige", "Ziqiao Wang", "Panos Kaliosis", "Dimitris Samaras", "Gregory Zelinsky", "Susan E. Brennan", "Owen Rambow"], 2026, "ACL 2026, 9061–9087", "https://aclanthology.org/2026.acl-long.410/", "10.18653/v1/2026.acl-long.410", "full_text", { priority: "Important", one_sentence: "通过 human–human、human–AI、AI–human 与 AI–AI 的 repeated reference 对照，检验 LVLM 是否形成 human-like interactive common ground。", findings: ["论文报告 LVLM 与人类在 referential communication 中的 grounding 方式不同。", "现有模型尚不能像人一样交互式建立和解析 referring expressions。"], claim_boundary: "结果细化了 GAP-02/GAP-04：问题不只是保存 interaction history，还在于更新机制是否产生 human-like grounding。", amsc: { mainline_fit: 9.2, buckets: ["B", "C"], stages: ["Grounding", "Convention"], mechanisms: ["referential grounding", "LVLM"], gap_ids: ["GAP-02", "GAP-04"], master_list_decision: "Candidate — Important" } }),
  P("X3", "x3-seeing-eye-to-eye", "Seeing Eye to Eye: Enabling Cognitive Alignment Through Shared First-Person Perspective in Human–AI Collaboration", ["Ziqi Teng", "Peilin Chen", "Yicheng Cai", "Ruijia Lu", "Zheng Jiang", "Jiachen Li", "Wenxuan You", "Lik-Hang Lee"], 2026, "CHI 2026, Article 19, 1–19", "https://arxiv.org/abs/2603.12701", "10.1145/3772318.3791059", "full_text", { priority: "Important", one_sentence: "把 gaze、gesture、AR highlights、revisable memory 与 accumulated common ground 整合进共享第一人称视角的 Human–AI collaboration。", claim_boundary: "GAP-03 应标为 partially addressed；仅增加 history-aware memory 已不足以构成 novelty，但 persistent memory 仍不等于 jointly negotiated convention。", amsc: { mainline_fit: 9.3, buckets: ["C", "E", "G"], stages: ["Grounding", "Adaptation", "Embodied Communication"], mechanisms: ["shared perspective", "accumulated common ground"], gap_ids: ["GAP-03"], master_list_decision: "Candidate — Important" } }),
  P("X4", "x4-making-memories-together", "Making Memories Together: Toward Transparent and Co-constructed Robot Memory in Child-Robot Interaction", ["Eline Malnatsky", "Shiqi Wang", "Koen Hindriks", "Mike E. U. Ligthart"], 2026, "HRI Companion 2026, 1125–1129", "https://research.utwente.nl/en/publications/making-memories-together-toward-transparent-and-co-constructed-ro/", "10.1145/3776734.3794570", "full_text", { priority: "Important", one_sentence: "以 transparent、co-constructed robot memory 回应长期 Child–Robot Interaction 中的 relationship decay、informational decay 与 opaque memory。", biggest_weakness: "这是 5 页 HRI Companion paper，证据应标记为 preliminary，不能把概念建议当作 gap 已解决。", claim_boundary: "Personalization memory 不是 convention formation，但 co-constructed memory 可成为 convention-aware Agent 的前置机制。", amsc: { mainline_fit: 8.8, buckets: ["E", "C", "F"], stages: ["Grounding", "Adaptation"], mechanisms: ["co-constructed memory", "long-term HRI"], gap_ids: ["GAP-04"], master_list_decision: "Candidate — Important / Preliminary" } }),
  P("X5", "x5-social-context-of-hri", "The Social Context of Human–Robot Interactions", ["Sophie Thompson", "Katherine Candon", "Marynel Vázquez"], 2026, "Annual Review of Control, Robotics, and Autonomous Systems, 9, 1–25", "https://www.annualreviews.org/content/journals/10.1146/annurev-control-030623-015506", "10.1146/annurev-control-030623-015506", "full_text", { priority: "Important", one_sentence: "梳理 HRI 中含混的 social context 用法，并提出可操作的 conceptual model 与 context attributes。", claim_boundary: "后续 AMSC 研究不应笼统声称 context-aware，而应区分 social situation、participants/roles、interaction scenario 与 history。", amsc: { mainline_fit: 8.4, buckets: ["F", "D", "E"], stages: ["Meaning", "Adaptation", "Embodied Communication"], mechanisms: ["social context", "context operationalization"], gap_ids: ["GAP-03"], master_list_decision: "Candidate — Important" } })
];

// Preserve the exact author forms exposed by the primary records checked on 2026-08-26.
candidates.find(paper => paper.id === "X1").authors = ["Jaap Kruijt", "Peggy van Minkelen", "Lucia Donatelli", "Piek T.J.M. Vossen", "Elly Konijn", "Thomas Baier"];
candidates.find(paper => paper.id === "X2").authors = ["Peter Zeng", "Weiling Li", "Amie J. Paige", "Zhengxiang Wang", "Panagiotis Kaliosis", "Dimitris Samaras", "Gregory Zelinsky", "Susan E. Brennan", "Owen Rambow"];
candidates.find(paper => paper.id === "X3").authors = ["Zhuyu Teng", "Pei Chen", "Yichen Cai", "Ruoqing Lu", "Zhaoqu Jiang", "Jiayang Li", "Weitao You", "Lingyun Sun"];
Object.assign(candidates.find(paper => paper.id === "X1"), {
  method: "SPOTTER 以可调整的 visually grounded reference game 比较 human–human 与 human–robot interaction；两项 Dutch exploratory pilots 操作 familiar inner circle 与 unfamiliar outer circle，并发布约 5,000 条 utterances。",
  investigation_status: "abstract_reviewed"
});
Object.assign(candidates.find(paper => paper.id === "X2"), {
  problem: "LVLM 是否能够在多轮 repeated referential communication 中建立、更新并使用与人类相似的 common ground？",
  method: "Factorial director–matcher design 比较 human–human、human–AI、AI–human 与 AI–AI；89 对参与者/Agent 完成四轮互动，共形成 356 段 dialogues，并分析 accuracy、efficiency 与 lexical overlap。",
  real_contribution: "把模型的 common-ground deficit 放进与 human baseline 可比的多轮实验，而不只检验单轮视觉问答能力。",
  biggest_weakness: "任务使用难以直接 lexicalize 的对象图片；结果说明这一范式中的 grounding failure，但不能自动外推到所有 LVLM 或 embodied settings。",
  investigation_status: "abstract_reviewed"
});
Object.assign(candidates.find(paper => paper.id === "X3"), {
  problem: "视觉型 AI assistant 如何减少用户把丰富 embodied intent 压缩为 verbal commands 的 communication gulf，并弥补 Agent 对细微 cues 的 understanding gulf？",
  method: "Eye2Eye AR prototype 整合 joint attention coordination、revisable memory 与 reflective feedback，通过 user study 和 post-hoc pipeline evaluation 评估。",
  findings: ["来源摘要报告系统降低 task completion time 与 interaction load，并提高 trust。", "三个组件共同用于维护 evolving common ground，但该 memory 是否形成 jointly negotiated convention 仍需单独检验。"],
  real_contribution: "把 first-person perspective、joint attention 与可修订 memory 组合为 Human–AI cognitive alignment framework。",
  biggest_weakness: "evolving common ground 的系统实现不等同于已证明 partner-specific convention formation；当前页面只依据公开摘要校准结论。",
  investigation_status: "abstract_reviewed"
});

function parseUserList() {
  const text = fs.readFileSync(sourceFile, "utf8").replace(/\r/g, "");
  const entries = new Map();
  const pattern = /^###\s+([A-G]\d+)\.\s+【([^】]+)】\n\*\*[\s\S]*?\*\*\n\n作用：([^\n]+)/gm;
  for (const match of text.matchAll(pattern)) entries.set(match[1], { label: match[2], note: match[3].trim() });
  return entries;
}

const bucketDefaults = {
  A: { fit: 7.8, stages: ["Meaning", "Embodied Communication"], mechanisms: ["social meaning", "multimodal expression"] },
  B: { fit: 8.5, stages: ["Meaning", "Grounding"], mechanisms: ["pragmatic inference", "representation"] },
  C: { fit: 9.6, stages: ["Grounding", "Convention"], mechanisms: ["common ground", "convention formation"] },
  D: { fit: 8.1, stages: ["Embodied Communication"], mechanisms: ["legibility", "nonverbal communication"] },
  E: { fit: 8.8, stages: ["Adaptation"], mechanisms: ["mutual adaptation", "long-term interaction"] },
  F: { fit: 7.9, stages: ["Meaning", "Adaptation"], mechanisms: ["social context", "appropriation"] },
  G: { fit: 8.4, stages: ["Embodied Communication"], mechanisms: ["situated communication", "augmented reality"] }
};

const priorityFromLabel = label => label.includes("必读") ? "Must Read" : label.includes("高") ? "Important" : label.includes("中") ? "Worth Reading" : "Track";
const userEntries = parseUserList();
if (userEntries.size !== 41) throw new Error(`Expected 41 source entries, found ${userEntries.size}`);
if (baseline.length !== 41) throw new Error(`Expected 41 verified baseline entries, found ${baseline.length}`);

const normalizedBaseline = baseline.map(paper => {
  const source = userEntries.get(paper.id);
  if (!source) throw new Error(`Missing source note for ${paper.id}`);
  const bucket = paper.id[0];
  const defaults = bucketDefaults[bucket];
  return {
    ...paper,
    priority: priorityFromLabel(source.label),
    one_sentence: source.note,
    problem: paper.problem ?? null,
    method: paper.method ?? null,
    findings: paper.findings ?? [],
    real_contribution: paper.real_contribution ?? null,
    biggest_weakness: paper.biggest_weakness ?? null,
    claim_boundary: paper.claim_boundary ?? "当前页面仅完成书目与来源核验；在 full Paper Investigation 前，不依据标题或清单说明推断 findings。",
    why_researcher_should_care: source.note,
    amsc: paper.amsc ?? { mainline_fit: defaults.fit, buckets: [bucket], stages: defaults.stages, mechanisms: defaults.mechanisms, gap_ids: [], master_list_decision: "Baseline v1.0 — retained" },
    evidence_notes: [
      "书目身份、作者、年份、venue、DOI 与可访问来源已于 2026-08-26 核验。",
      "研究相关性说明来自用户提供的 Master Literature List v1.0；除非页面另行标明 investigation_status，否则它不是从论文 findings 重建的结论。",
      paper.correction_note
    ].filter(Boolean),
    source_list_id: paper.id,
    provenance: "user_baseline_v1.0",
    investigation_status: paper.investigation_status ?? "bibliographic_verification_only",
    updated_at: verifiedAt
  };
});

const normalizedCandidates = candidates.map(paper => ({
  ...paper,
  problem: paper.problem ?? null,
  method: paper.method ?? null,
  findings: paper.findings ?? [],
  real_contribution: paper.real_contribution ?? null,
  biggest_weakness: paper.biggest_weakness ?? null,
  claim_boundary: paper.claim_boundary ?? "候选论文已完成来源与元数据核验；完整 Paper Investigation 尚待后续精读。",
  why_researcher_should_care: paper.one_sentence,
  evidence_notes: ["该条目来自 2026-08-26 bounded Missing Paper Attack，不属于用户原始 41 篇 baseline。", "检索覆盖不等于系统综述；不得据此声称不存在其他相关工作。"],
  provenance: "missing_paper_attack_2026-08-26",
  investigation_status: paper.investigation_status ?? "source_verified_candidate",
  updated_at: verifiedAt
}));

fs.mkdirSync(paperDir, { recursive: true });
for (const paper of [...normalizedBaseline, ...normalizedCandidates]) {
  fs.writeFileSync(path.join(paperDir, `${paper.slug}.json`), `${JSON.stringify(paper, null, 2)}\n`, "utf8");
}

const yamlQuote = value => JSON.stringify(String(value));
const categories = {
  A: "Social / Multimodal / Informal Expression",
  B: "Pragmatics / Representation / Communicative Efficiency",
  C: "Common Ground / Grounding / Convention Formation",
  D: "HRI Communication / Legibility / Uncertainty / Capability",
  E: "Adaptation / Personalization / Long-Term HRI",
  F: "Social / Cultural / Relational / Appropriation",
  G: "Situated / AR / Embodied Output"
};
const yaml = [
  "version: v1.1",
  "baseline_count: 41",
  `verified_at: ${verifiedAt}`,
  "note: \"The 41-paper baseline is user-defined; five search-discovered candidates are tracked separately.\"",
  "categories:",
  ...Object.entries(categories).map(([id, label]) => `  ${id}: ${yamlQuote(label)}`),
  "papers:",
  ...normalizedBaseline.flatMap(paper => [
    `  - id: ${paper.id}`,
    `    slug: ${paper.slug}`,
    `    title: ${yamlQuote(paper.title)}`,
    `    decision: ${yamlQuote(paper.amsc.master_list_decision)}`
  ]),
  "candidates:",
  ...normalizedCandidates.flatMap(paper => [
    `  - id: ${paper.id}`,
    `    slug: ${paper.slug}`,
    `    title: ${yamlQuote(paper.title)}`,
    `    decision: ${yamlQuote(paper.amsc.master_list_decision)}`
  ]),
  "change_log:",
  "  - date: 2026-08-26",
  "    change: \"Imported and source-verified the 41-paper user baseline; corrected B3 year, C7 author order, and E4 first author.\"",
  "  - date: 2026-08-26",
  "    change: \"Added five separately labeled candidates from a bounded Missing Paper Attack; GAP-02 and GAP-03 should be treated as partially addressed.\"",
  ""
].join("\n");
fs.writeFileSync(path.join(root, "research-programs", "amsc", "state", "master_literature.yaml"), yaml, "utf8");

console.log(`Imported ${normalizedBaseline.length} baseline papers and ${normalizedCandidates.length} search candidates.`);
