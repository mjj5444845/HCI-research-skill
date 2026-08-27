import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const out = path.join(root, "site");
const source = path.join(root, "site-src");
const canonicalBase = "https://mjj5444845.github.io/HCI-research-skill/";

if (path.dirname(out) !== root || path.basename(out) !== "site") {
  throw new Error(`Refusing to replace unexpected output directory: ${out}`);
}
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(source, "assets"), path.join(out, "assets"), { recursive: true });

const escapeHtml = value => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const slugify = value => String(value)
  .normalize("NFKD")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

function inlineMarkdown(value) {
  let text = escapeHtml(value);
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');
  return text;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const html = [];
  let paragraph = [];
  let list = null;
  let code = false;
  let codeLines = [];

  const flushParagraph = () => {
    if (paragraph.length) html.push(`<p>${inlineMarkdown(paragraph.join(" "))}</p>`);
    paragraph = [];
  };
  const closeList = () => {
    if (list) html.push(`</${list}>`);
    list = null;
  };

  for (const line of lines) {
    if (line.startsWith("```")) {
      flushParagraph(); closeList();
      if (code) {
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
      }
      code = !code;
      continue;
    }
    if (code) { codeLines.push(line); continue; }
    const heading = line.match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      flushParagraph(); closeList();
      const level = Math.min(4, heading[1].length + 1);
      const id = slugify(heading[2]);
      html.push(`<h${level} id="${id}">${inlineMarkdown(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^\s*[-*]\s+(.+)$/);
    const numbered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (bullet || numbered) {
      flushParagraph();
      const type = bullet ? "ul" : "ol";
      if (list !== type) { closeList(); list = type; html.push(`<${type}>`); }
      html.push(`<li>${inlineMarkdown((bullet || numbered)[1])}</li>`);
      continue;
    }
    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph(); closeList();
      html.push(`<blockquote>${inlineMarkdown(quote[1])}</blockquote>`);
      continue;
    }
    if (!line.trim()) { flushParagraph(); closeList(); continue; }
    paragraph.push(line.trim());
  }
  flushParagraph(); closeList();
  if (codeLines.length) html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  return html.join("\n");
}

function parseSkill(file) {
  const raw = fs.readFileSync(file, "utf8");
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n([\s\S]*)$/);
  if (!match) throw new Error(`Invalid SKILL.md frontmatter: ${file}`);
  const frontmatter = Object.fromEntries(match[1].split(/\r?\n/).map(line => {
    const index = line.indexOf(":");
    return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")];
  }));
  return { ...frontmatter, slug: path.basename(path.dirname(file)), body: match[2].trim(), file: path.relative(root, file).replaceAll("\\", "/") };
}

function parseAgent(file) {
  const raw = fs.readFileSync(file, "utf8");
  const field = name => raw.match(new RegExp(`^${name}\\s*=\\s*"([^"]+)"`, "m"))?.[1] ?? "";
  const instructions = raw.match(/developer_instructions\s*=\s*"""([\s\S]*?)"""/)?.[1].trim() ?? "";
  const slug = path.basename(file, ".toml");
  const category = slug.startsWith("amsc-") ? "AMSC 研究计划" : slug.includes("auditor") || slug.includes("method") ? "方法与严谨性" : slug.includes("gap") || slug.includes("novelty") || slug.includes("paper") ? "创新与证据" : "综合与知识状态";
  return { name: field("name"), description: field("description"), instructions, slug, category, file: path.relative(root, file).replaceAll("\\", "/") };
}

function readPapers() {
  const directory = path.join(root, "state", "paper-pages");
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter(file => file.endsWith(".json"))
    .map(file => {
      const paper = JSON.parse(fs.readFileSync(path.join(directory, file), "utf8"));
      for (const field of ["slug", "title", "authors", "year", "source_url", "access_status", "priority", "one_sentence"]) {
        if (paper[field] === undefined || paper[field] === null || paper[field] === "") throw new Error(`Missing ${field} in ${file}`);
      }
      if (slugify(paper.slug) !== paper.slug) throw new Error(`Invalid paper slug in ${file}: ${paper.slug}`);
      return paper;
    })
    .sort((a, b) => String(b.year).localeCompare(String(a.year)) || a.title.localeCompare(b.title));
}

const skills = fs.readdirSync(path.join(root, ".agents", "skills"), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => parseSkill(path.join(root, ".agents", "skills", entry.name, "SKILL.md")))
  .sort((a, b) => a.name.localeCompare(b.name));

const agents = fs.readdirSync(path.join(root, ".codex", "agents"), { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith(".toml"))
  .map(entry => parseAgent(path.join(root, ".codex", "agents", entry.name)))
  .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

const papers = readPapers();
const configToml = fs.readFileSync(path.join(root, ".codex", "config.toml"), "utf8").trim();
const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.json"), "utf8"));
const dashboard = JSON.parse(fs.readFileSync(path.join(root, "research-programs", "amsc", "state", "workflow_dashboard.json"), "utf8"));

const skillTags = {
  "comprehensive-exam": ["AMSC", "knowledge base", "oral exam"],
  "idea-development": ["phenomenon", "novelty", "feasibility"],
  "literature-investigation": ["landscape", "gap", "missing paper"],
  "paper-investigation": ["claim–evidence", "method audit", "critique"],
  "research-program-guardrail": ["AMSC", "mainline fit", "trajectory"],
  "research-radar": ["recurring", "triage", "integration"],
  "senior-researcher-core": ["evidence", "claim calibration", "red team"],
  "study-design": ["RQ alignment", "rigor", "efficiency"]
};

const skillDescriptionsZh = {
  "comprehensive-exam": "从持久化的文献、理论、gap 与领域状态中维护并检验 AMSC comprehensive exam 知识库。",
  "idea-development": "把有趣现象推进为可辩护、可行且非显然的研究问题、gap、RQ、贡献与投稿定位。",
  "literature-investigation": "通过 missing-paper attack 建立高置信文献图景、closest-work 集合、争议地图、候选 gap 与 novelty 判断。",
  "paper-investigation": "批判性阅读、重建、审计、定位并内化一篇论文，而不是只做摘要。",
  "research-program-guardrail": "把 AMSC 博士研究方向用于相关性、idea、文献、论文、study design 与 radar 决策，同时保留有价值的邻近工作。",
  "research-radar": "持续发现、分诊、调查并整合新论文到 Senior Researcher OS 的监测 workflow。",
  "senior-researcher-core": "面向 HCI、CSCW、HAI、HRI、cross-cultural research、Cultural AI 与 AI policy 的 senior-faculty 推理规范。",
  "study-design": "围绕 RQ 设计快速、可信、严谨的证据生成方案，包含方法先例、多 Agent 辩论、pilot 计划与 RQ–evidence 对齐。"
};

const agentDescriptionsZh = {
  "amsc-current-state-curator": "基于证据权重提出 AMSC 领域状态更新，并区分 established、emerging、contested、underexplored 与 open。",
  "amsc-exam-curator": "根据已核验文献维护 AMSC 考试主题、anchor paper 映射、阅读优先级与 oral questions。",
  "amsc-final-synthesizer": "把 AMSC 的重要更新综合为已知、未知与下一步值得研究的问题，同时保留分歧。",
  "amsc-gap-curator": "综合 reviewer、理论与 skeptic 证据，提出可追踪版本的 AMSC Gap Registry 更新。",
  "amsc-scout": "寻找与 AMSC 相关的新论文、作者、venue 与合作者，但不替代最终相关性判断。",
  "amsc-skeptic": "以对抗性方式挑战 AMSC 的 novelty、gap、概念区分与 generalization claims。",
  "amsc-theory-mapper": "把已接受的 AMSC 工作映射到 pragmatics、common ground、grounding、convention、social meaning、adaptation 与 embodiment。",
  "cognitive-behavioral-methods-auditor": "识别可观察的认知、学习、行为或绩效证据，用于补充或检验 subjective constructs。",
  "culture-operationalization-auditor": "审计文化定义、抽样、测量、翻译、measurement invariance、组内差异与 essentialist assumptions。",
  "gap-red-team": "以对抗性方式检验一个 gap 是否真实、重要、尚未解决，并能由所提证据回答。",
  "human-evidence-advocate": "检验某个 construct 是否确实需要 human behavior、interpretation、lived experience、social practice 或 self-report 证据。",
  "interpretivist-qualitative-auditor": "审计 interpretivist qualitative research 的 reflexivity、positionality、解释深度、连贯性、意义建构与 transferability。",
  "method-efficiency-advocate": "在不牺牲 construct validity 或 RQ coverage 的前提下，寻找最快且可信的证据生成设计。",
  "missing-paper-attacker": "搜索可能改变文献地图或 novelty claim 的遗漏基础、邻近、早期、矛盾或异名工作。",
  "novelty-domain-panel": "跨相关研究社区独立评估 novelty，并区分 problem、empirical、method、theory、technical、design 与 resource novelty。",
  "qualitative-reliability-auditor": "审计 reliability-oriented qualitative work 的抽样、编码一致性、证据可追踪性、audit trail 与分析透明度。",
  "quantitative-rigor-auditor": "审计 quantitative study 的 validity、power、modeling、uncertainty、robustness、multiplicity 与替代解释。",
  "research-graph-curator": "提出可追踪的 author、lab、paper 与 intellectual-lineage graph 更新，并保留人工修正。",
  "senior-faculty-synthesizer": "综合独立研究 Agent 的分析，形成 maximum defensible conclusion，并暴露分歧与需研究者决定的问题。"
};

const skillDescription = skill => skillDescriptionsZh[skill.slug] || skill.description;
const agentDescription = agent => agentDescriptionsZh[agent.slug] || agent.description;

const rel = (depth, target = "") => `${"../".repeat(depth)}${target}`;

function nav(depth, current) {
  const links = [
    ["home", "", "首页"], ["papers", "papers/", "论文"], ["field-map", "field-map/", "Field Map"], ["exam", "exam/", "考试"], ["program", "program/", "研究主线"], ["skills", "skills/", "Skills"], ["agents", "agents/", "Agents"], ["architecture", "architecture/", "架构"]
  ];
  return `
    <a class="skip-link" href="#main">跳到主要内容</a>
    <div class="scroll-progress" aria-hidden="true"></div>
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="${rel(depth)}"><img src="${rel(depth, "assets/mark.svg")}" alt=""><span>Senior Researcher OS<small>证据先于叙事</small></span></a>
        <button class="nav-toggle" type="button" aria-label="打开导航" aria-expanded="false" data-nav-toggle>菜单</button>
        <nav class="nav-links" aria-label="主导航" data-nav>
          ${links.map(([id, target, label]) => `<a href="${rel(depth, target)}" ${current === id ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="nav-cta" href="https://github.com/mjj5444845/HCI-research-skill" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </div>
    </header>`;
}

function footer(depth) {
  return `<footer class="site-footer"><div class="container footer-grid"><div><strong>Senior Researcher OS</strong><br>面向 HCI / CSCW / HAI / HRI 的 evidence-first 研究协作系统。</div><div>v${escapeHtml(manifest.version)} · AMSC 运行中 · <a href="${rel(depth, "architecture/")}">查看系统架构</a></div></div></footer>`;
}

function page({ title, description, current, depth = 0, body }) {
  const pageTitle = title === "Senior Researcher OS" ? title : `${title} · Senior Researcher OS`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#14233a">
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(pageTitle)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <title>${escapeHtml(pageTitle)}</title>
  <link rel="icon" href="${rel(depth, "assets/mark.svg")}" type="image/svg+xml">
  <link rel="stylesheet" href="${rel(depth, "assets/styles.css")}">
</head>
<body>
  ${nav(depth, current)}
  <main id="main">${body}</main>
  ${footer(depth)}
  <script src="${rel(depth, "assets/app.js")}" defer></script>
</body>
</html>`;
}

function write(relative, content) {
  const file = path.join(out, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

const skillCards = skills.map((skill, index) => `
  <article class="motion-card" data-reveal data-searchable>
    <div class="card-index"><span>SKILL / ${String(index + 1).padStart(2, "0")}</span><i class="dot"></i></div>
    <h3>${escapeHtml(skill.name)}</h3>
    <p>${escapeHtml(skillDescription(skill))}</p>
    <div class="tag-row">${(skillTags[skill.slug] || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div>
    <a class="card-link" href="${skill.slug}/">查看 workflow</a>
  </article>`).join("");

const home = page({
  title: "Senior Researcher OS",
  description: "面向 HCI、CSCW、Human-AI Interaction 与 HRI 的 evidence-first senior-faculty 研究协作系统。",
  current: "home",
  body: `
    <div class="container">
      <section class="hero">
        <div data-reveal>
          <span class="eyebrow">Senior Faculty 研究协作者</span>
          <h1>把研究从故事，推进到<em>证据</em>。</h1>
          <p class="hero-copy">一个面向 HCI、CSCW、Human-AI Interaction 与 HRI 的研究操作系统：拆问题、攻 novelty、审方法、维护知识状态，并让多 Agent 的分歧真正可见。</p>
          <div class="button-row"><a class="button primary" href="skills/">探索 Skills</a><a class="button" href="architecture/">理解架构</a></div>
        </div>
        <div class="hero-visual" data-reveal>
          <canvas class="architecture-canvas" data-architecture-canvas aria-label="从请求到证据和研究状态的动态架构图"></canvas>
          <div class="visual-caption"><span>移动指针 / 探索关系</span><span>Evidence → Claim → State</span></div>
        </div>
      </section>
      <section class="stats" aria-label="系统统计" data-reveal>
        <div class="stat"><strong>${skills.length}</strong><span>Workflow Skills</span></div>
        <div class="stat"><strong>${agents.length}</strong><span>Custom Agents</span></div>
        <div class="stat"><strong>${papers.length}</strong><span>论文页面</span></div>
        <div class="stat"><strong>5</strong><span>持久化状态</span></div>
      </section>
    </div>
    <section class="section"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">Workflow 层</span><h2>八条清晰的研究路径</h2></div><p>不是一个巨型 prompt。每个 Skill 都有独立触发条件、分析边界、handoff 与输出契约，Codex 只在任务需要时加载。</p></div>
      <div class="grid three">${skills.slice(0, 6).map((skill, index) => `<article class="motion-card" data-reveal><div class="card-index"><span>0${index + 1}</span><i class="dot"></i></div><h3>${escapeHtml(skill.name)}</h3><p>${escapeHtml(skillDescription(skill))}</p><a class="card-link" href="skills/${skill.slug}/">进入详情</a></article>`).join("")}</div>
      <div class="button-row"><a class="button" href="skills/">查看全部 ${skills.length} 个 Skills</a></div>
    </div></section>
    <section class="section dark-section"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">多 Agent 协同</span><h2>争议判断，不交给单一声音</h2></div><p>Novelty、gap、method、culture 与 qualitative rigor 被分发给独立角色；主 Agent 保留综合、质疑与最终状态写入责任。</p></div>
      <div class="flow" data-reveal>
        <div class="flow-step"><span>01</span><h3>自然语言请求</h3><p>提出 paper、idea、gap 或 study design 问题。</p></div>
        <div class="flow-step"><span>02</span><h3>Skill 路由</h3><p>选择最小、最相关的 workflow 组合。</p></div>
        <div class="flow-step"><span>03</span><h3>独立 Agents</h3><p>证据搜索、red team 与方法审计独立展开。</p></div>
        <div class="flow-step"><span>04</span><h3>综合判断</h3><p>暴露分歧，寻找 maximum defensible claim。</p></div>
        <div class="flow-step"><span>05</span><h3>持久化状态</h3><p>更新 paper、gap、field state 与 research graph。</p></div>
      </div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">当前研究计划</span><h2>AMSC：从意义到具身适应</h2></div><p><strong>Adaptive Multimodal Social Communication for Embodied AI</strong> 聚焦 Meaning → Grounding → Convention → Adaptation → Embodied Communication，不把关键词重叠误当成研究主线相关性。</p></div>
      <div class="grid three">
        <article class="motion-card" data-reveal><div class="card-index"><span>理论</span><i class="dot"></i></div><h3>Common Ground</h3><p>最高优先级理论区域：grounding 与 convention formation。</p></article>
        <article class="motion-card" data-reveal><div class="card-index"><span>研究护栏</span><i class="dot"></i></div><h3>Mechanism first</h3><p>拒绝“新 effect → questionnaire → warmth increases”式低信息增益研究。</p></article>
        <article class="motion-card" data-reveal><div class="card-index"><span>决策</span><i class="dot"></i></div><h3>下一步研究什么</h3><p>每次重要更新都回答：已知什么、未知什么、下一步研究什么。</p></article>
      </div>
    </div></section>`
});
write("index.html", home);

const skillsIndex = page({
  title: "Skills",
  description: "用于论文精读、文献调查、idea development、study design 与持续 research monitoring 的八个模块化 workflow。",
  current: "skills",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">Workflow 目录</span><h1>Skills，不是万能提示词。</h1><p>每个工作流围绕一个清晰的研究任务组织：输入、推理步骤、handoff、输出与失败边界彼此独立。</p></div></section><section class="section compact"><div class="container"><div class="toolbar"><input class="search" type="search" placeholder="搜索 Skill、方法或概念…" aria-label="搜索 Skills" data-search><span class="result-count" data-result-count>${skills.length} 项</span></div><div class="grid three">${skillCards}</div></div></section>`
});
write("skills/index.html", skillsIndex);

for (const skill of skills) {
  write(`skills/${skill.slug}/index.html`, page({
    title: skill.name,
    description: skillDescription(skill),
    current: "skills",
    depth: 2,
    body: `<section class="page-hero"><div class="container"><span class="eyebrow">Skill 详情</span><h1>${escapeHtml(skill.name)}</h1><p>${escapeHtml(skillDescription(skill))}</p><div class="tag-row">${(skillTags[skill.slug] || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></div></section><div class="container detail-shell"><article class="prose">${renderMarkdown(skill.body)}</article><aside class="side-panel"><h2>Skill 元数据</h2><dl><dt>调用方式</dt><dd><code>$${escapeHtml(skill.name)}</code></dd><dt>作用范围</dt><dd>项目级可复用 workflow</dd><dt>来源</dt><dd><code>${escapeHtml(skill.file)}</code></dd><dt>相关架构</dt><dd><a class="card-link" href="../../architecture/">查看系统路由</a></dd></dl></aside></div>`
  }));
}

const agentCards = agents.map((agent, index) => `<article class="motion-card" data-reveal data-searchable><div class="card-index"><span>${escapeHtml(agent.category)} / ${String(index + 1).padStart(2, "0")}</span><i class="dot"></i></div><h3>${escapeHtml(agent.name.replaceAll("_", " "))}</h3><p>${escapeHtml(agentDescription(agent))}</p><a class="card-link" href="${agent.slug}/">查看角色边界</a></article>`).join("");
write("agents/index.html", page({
  title: "Agents",
  description: "面向 evidence、novelty、method、culture、research graph 与 AMSC 的独立专门 Agents。",
  current: "agents",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">独立分析</span><h1>${agents.length} 个角色，避免一种声音。</h1><p>Custom Agents 不是换名字的同一 persona。每个角色有明确任务、证据边界与只读约束；它们提出独立分析，由主 Agent 综合。</p></div></section><section class="section compact"><div class="container"><div class="toolbar"><input class="search" type="search" placeholder="搜索 Agent、audit 或 AMSC…" aria-label="搜索 Agents" data-search><span class="result-count" data-result-count>${agents.length} 项</span></div><div class="grid three">${agentCards}</div></div></section>`
}));

for (const agent of agents) {
  write(`agents/${agent.slug}/index.html`, page({
    title: agent.name.replaceAll("_", " "),
    description: agentDescription(agent),
    current: "agents",
    depth: 2,
    body: `<section class="page-hero"><div class="container"><span class="eyebrow">${escapeHtml(agent.category)}</span><h1>${escapeHtml(agent.name.replaceAll("_", " "))}</h1><p>${escapeHtml(agentDescription(agent))}</p></div></section><div class="container detail-shell"><article class="prose"><h2>Developer instructions 原文</h2>${renderMarkdown(agent.instructions)}<h2>为什么需要独立角色</h2><p>该角色默认以 read-only 方式运行：它负责寻找证据、挑战假设或提出结构化更新建议，不直接覆盖持久状态。最终决策与状态写入由主 Agent 完成。</p></article><aside class="side-panel"><h2>Agent 元数据</h2><dl><dt>名称</dt><dd><code>${escapeHtml(agent.name)}</code></dd><dt>类别</dt><dd>${escapeHtml(agent.category)}</dd><dt>Sandbox</dt><dd>read-only</dd><dt>配置来源</dt><dd><code>${escapeHtml(agent.file)}</code></dd></dl></aside></div>`
  }));
}

const architecture = page({
  title: "Architecture",
  description: "Senior Researcher OS 中 Skill 路由、独立 Agent 分析、综合判断与持久化状态的动态架构。",
  current: "architecture",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">系统架构</span><h1>从自然请求，到可追溯研究状态。</h1><p>Canvas 中的移动信号代表信息流；节点不是固定流水线，而是按任务选择的模块。鼠标移动可观察轻微视差，减少动态偏好会自动关闭脉冲。</p></div></section><section class="section compact"><div class="container"><div class="architecture-stage" data-reveal><canvas data-architecture-canvas aria-label="Senior Researcher OS 动态架构关系"></canvas><div class="architecture-legend" aria-label="架构节点说明"><span>Prompt：自然语言入口</span><span>Skills：可复用 workflow</span><span>Agents：独立分析</span><span>Synthesis：分歧综合</span><span>State：可追溯状态</span></div></div><div class="config-panel"><article class="motion-card" data-reveal><div class="card-index"><span>执行模型</span><i class="dot"></i></div><h3>项目级架构</h3><p><code>.agents/skills</code> 管理 workflow；<code>.codex/agents</code> 管理独立分析角色；<code>AGENTS.md</code> 管理长期研究原则。专门 Agent 默认只读，避免并行写入冲突。</p><div class="tag-row"><span class="tag">${skills.length} Skills</span><span class="tag">${agents.length} Agents</span><span class="tag">最多 4 路并发</span></div></article><div class="code-panel" data-reveal><button class="copy-button" type="button" data-copy="#toml-config">复制</button><pre id="toml-config"><code>${escapeHtml(configToml)}</code></pre></div></div></div></section><section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">决策闭环</span><h2>高争议判断的五步闭环</h2></div><p>并行不是目的。只有当独立证据路径能提高判断质量时才调用多个 Agents，之后由 Senior Faculty Synthesizer 暴露分歧与剩余不确定性。</p></div><div class="flow"><div class="flow-step"><span>01</span><h3>任务路由</h3><p>识别 paper、literature、idea、study 或 radar 任务。</p></div><div class="flow-step"><span>02</span><h3>检索证据</h3><p>收集可追溯来源，区分 full text 与 metadata。</p></div><div class="flow-step"><span>03</span><h3>对抗检验</h3><p>Missing Paper、Gap Red Team 与方法审计。</p></div><div class="flow-step"><span>04</span><h3>校准结论</h3><p>寻找 maximum defensible meaningful claim。</p></div><div class="flow-step"><span>05</span><h3>版本化</h3><p>追加历史、保留 human correction，不静默覆盖。</p></div></div></div></section>`
});
write("architecture/index.html", architecture);

const paperBySlug = new Map(papers.map(paper => [paper.slug, paper]));
const fieldStatusZh = {
  STILL_HOLDS: "仍然成立",
  STRENGTHENED: "证据增强",
  CONTESTED: "存在争议",
  PARTIALLY_ADDRESSED: "部分解决",
  NO_LONGER_CLAIMABLE: "不能再这样 claim",
  NEW_CORE: "上升为核心",
  REDEFINED: "已重新定义",
  UNCHANGED: "尚未改变",
  NEW_CORE_CANDIDATE: "核心 Gap 候选"
};
const statusClass = value => `status-${slugify(value)}`;
const evidenceLinks = slugs => (slugs || []).map(slug => {
  const paper = paperBySlug.get(slug);
  return paper ? `<a class="evidence-chip" href="../papers/${escapeHtml(slug)}/">${escapeHtml(paper.source_list_id || paper.id || paper.year)} · ${escapeHtml(paper.title)}</a>` : `<span class="evidence-chip muted">${escapeHtml(slug)}</span>`;
}).join("");

const investigationCounts = papers.reduce((counts, paper) => {
  const key = paper.investigation_status || "untracked";
  counts[key] = (counts[key] || 0) + 1;
  return counts;
}, {});
const fieldClaims = dashboard.field_map.claims;
const dashboardGaps = dashboard.field_map.gaps;

write("field-map/index.html", page({
  title: "Cumulative Field Map",
  description: "持续维护 AMSC 领域结论、证据强度、Gap 演化与当前不可声称内容。",
  current: "field-map",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">Cumulative Field Map</span><h1>不是静态综述，而是会改变的领域判断。</h1><p>这里把书目覆盖、阅读深度与结论强度分开：每次 Paper Investigation、Literature Investigation、Research Radar 或 Comprehensive Exam workflow 运行后，更新仍成立、被增强、被部分解决、不能再 claim 与新上升为核心的问题。</p></div></section>
  <section class="section compact"><div class="container">
    <div class="evidence-health" data-reveal>
      <div><span class="eyebrow">证据健康度</span><h2>46 篇 ≠ 46 篇已精读</h2><p>${escapeHtml(dashboard.field_map.coverage_note)}</p></div>
      <div class="health-grid"><div><strong>${investigationCounts.bibliographic_verification_only || 0}</strong><span>仅书目核验</span></div><div><strong>${investigationCounts.abstract_reviewed || 0}</strong><span>摘要调查</span></div><div><strong>${investigationCounts.abstract_and_full_page_reviewed || 0}</strong><span>全文页面调查</span></div><div><strong>${investigationCounts.source_verified_candidate || 0}</strong><span>候选来源核验</span></div></div>
    </div>
    <div class="section-head field-section-head"><div><span class="eyebrow">Current synthesis</span><h2>结论如何变化</h2></div><p>每条结论同时展示 evidence strength 与 claim boundary。标为 Agent synthesis 的内容不是任何单篇论文的原始结论。</p></div>
    <div class="field-claim-list">${fieldClaims.map(claim => `<article class="field-claim ${statusClass(claim.status)}" data-reveal><div class="claim-rail"><span>${escapeHtml(claim.id)}</span><i></i></div><div><div class="claim-top"><span class="status-pill">${escapeHtml(fieldStatusZh[claim.status] || claim.status)}</span><span class="evidence-level">${escapeHtml(claim.evidence_strength)}</span></div><h3>${escapeHtml(claim.statement)}</h3><p><strong>边界：</strong>${escapeHtml(claim.boundary)}</p><div class="evidence-links">${evidenceLinks(claim.evidence)}</div></div></article>`).join("")}</div>
  </div></section>
  <section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">Gap Registry</span><h2>Gap 是可争议的版本化 claim</h2></div><p>Gap 不等于“没搜到论文”。状态必须随 closest work 改变；claimability 不足时，页面明确显示当前不能作为 novelty 使用。</p></div><div class="gap-grid">${dashboardGaps.map(gap => `<article id="${slugify(gap.id)}" class="gap-card ${statusClass(gap.status)}" data-reveal><div class="gap-symbol" aria-hidden="true"></div><div class="claim-top"><strong>${escapeHtml(gap.id)}</strong><span class="status-pill">${escapeHtml(fieldStatusZh[gap.status] || gap.status)}</span></div><h3>${escapeHtml(gap.statement)}</h3><p>${escapeHtml(gap.research_implication)}</p><dl><dt>优先级</dt><dd>${escapeHtml(gap.priority)}</dd><dt>证据</dt><dd>${escapeHtml(gap.evidence_strength)}</dd>${gap.claimability ? `<dt>Claimability</dt><dd>${escapeHtml(gap.claimability)}</dd>` : ""}</dl></article>`).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Update trail</span><h2>每次 workflow 留下什么</h2></div><p>最新状态不会覆盖历史；自动化只能更新 Agent evidence readiness，不能替研究者标记“已读”或“已掌握”。</p></div><div class="timeline">${dashboard.workflow_runs.map(run => `<article><time>${escapeHtml(run.date)}</time><div><span class="status-pill">${escapeHtml(run.status)}</span><h3>${escapeHtml(run.workflow)}</h3><p>${escapeHtml(run.summary)}</p></div></article>`).join("")}</div></div></section>`
}));

const top20 = dashboard.exam.top20.map(item => ({ ...item, paper: paperBySlug.get(item.slug) })).filter(item => item.paper);
const sourceAvailable = top20.filter(item => item.paper.access_status === "full_text").length;
const agentReady = top20.filter(item => item.paper.investigation_status !== "bibliographic_verification_only").length;
const investigationLabel = status => ({
  bibliographic_verification_only: "待 First Read",
  abstract_reviewed: "已读摘要；待全文审计",
  abstract_and_full_page_reviewed: "已有 finding-level 页面；待 Deep Investigation",
  source_verified_candidate: "仅核验来源"
}[status] || "未追踪");

write("exam/index.html", page({
  title: "Comprehensive Exam",
  description: "AMSC comprehensive exam 的六主题、Top 20、8–10 页写作计划、口试能力与更新状态。",
  current: "exam",
  depth: 1,
  body: `<section class="page-hero exam-hero"><div class="container"><span class="eyebrow">Comprehensive Exam · AMSC</span><h1>把阅读，推进到可综合、可批判、可迁移。</h1><p>${escapeHtml(dashboard.exam.core_question)}</p><div class="schedule-banner"><span>下一次证据升级</span><strong>今天 03:00 · Top 20 Paper Investigation</strong><small>Automation: ${escapeHtml(dashboard.next_scheduled_run.status)}</small></div></div></section>
  <section class="section compact"><div class="container"><div class="readiness-grid" data-reveal><article><strong>${sourceAvailable}/20</strong><span>全文来源可访问</span></article><article><strong>${agentReady}/20</strong><span>已有摘要或更深 Agent 调查</span></article><article><strong>未记录</strong><span>研究者阅读进度</span></article><article><strong>8–10</strong><span>目标页数</span></article></div><p class="readiness-warning">Agent investigation readiness 不等于研究者已经阅读或掌握。网站不会从自动化状态推断你的个人进度。</p>
  <div class="section-head field-section-head"><div><span class="eyebrow">Six themes</span><h2>六个主题，一条论证链</h2></div><p>Theme 不是六篇独立 mini-survey。它们依次回答 signal 的意义、推断、grounding、convention、embodiment 与长期适应。</p></div><div class="grid three">${dashboard.exam.themes.map(theme => `<article class="motion-card theme-card" data-reveal><div class="card-index"><span>T${theme.id}</span><i class="dot"></i></div><h3>${escapeHtml(theme.name)}</h3><p>${escapeHtml(theme.question)}</p><div class="tag-row">${theme.concepts.slice(0, 4).map(item => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div><small>Anchors · ${escapeHtml(theme.anchors.join(" · "))}</small></article>`).join("")}</div>
  </div></section>
  <section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">Written exam</span><h2>8–10 页论证结构</h2></div><p>${escapeHtml(dashboard.exam.written_target)}</p></div><div class="writing-plan">${dashboard.exam.writing_plan.map((item, index) => `<article data-reveal><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(item.section)}</h3><p>${escapeHtml(item.goal)}</p></div><strong>${escapeHtml(item.pages)} 页</strong></article>`).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Priority corpus</span><h2>Top 20 证据准备队列</h2></div><p>顺序来自考试计划。03:00 workflow 会更新 Agent 调查层级和 Exam Card；研究者 progress 仍由你明确记录。</p></div><div class="paper-table" role="table" aria-label="Top 20 阅读准备"><div class="paper-table-head" role="row"><span>#</span><span>论文</span><span>Theme</span><span>Agent readiness</span><span>Researcher</span></div>${top20.map(item => `<a class="paper-table-row" role="row" href="../papers/${escapeHtml(item.slug)}/"><span>${item.order}</span><span><strong>${escapeHtml(item.id)}</strong>${escapeHtml(item.paper.title)}</span><span>T${item.theme}</span><span>${escapeHtml(investigationLabel(item.paper.investigation_status))}</span><span>未记录</span></a>`).join("")}</div></div></section>
  <section class="section compact"><div class="container"><div class="section-head"><div><span class="eyebrow">Readiness checklist</span><h2>从文献到考试能力</h2></div><p>Definition、Comparison、Critical、Connection 与 Research question 五类口试能力必须分别练习；背诵摘要不等于掌握。</p></div><div class="grid three">${dashboard.exam.checklists.map(group => `<article class="checklist-card" data-reveal><h3>${escapeHtml(group.name)}</h3><ul>${group.items.map(item => `<li><i aria-hidden="true"></i>${escapeHtml(item)}</li>`).join("")}</ul></article>`).join("")}</div></div></section>`
}));

const programNodes = dashboard.research_line.nodes;
write("program/index.html", page({
  title: "AMSC 研究主线",
  description: "AMSC 从 Meaning、Grounding、Convention、Adaptation 到 Embodied Communication 的研究主线、反馈关系与范围边界。",
  current: "program",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">AMSC Research Program</span><h1>意义不是被贴上去的；它在互动中被建立、修订和具身化。</h1><p>${escapeHtml(dashboard.research_line.identity)}</p></div></section>
  <section class="section compact"><div class="container"><div class="program-map" data-program-map data-reveal><svg viewBox="0 0 1200 360" role="img" aria-label="Meaning 到 Embodied Communication 的五阶段主线，包含从具身互动返回意义与 Grounding 的反馈"><defs><marker id="arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z"></path></marker></defs><path class="main-edge" d="M140 120 H1050" marker-end="url(#arrow)"></path><path class="feedback-edge" d="M1080 175 C990 320 290 320 135 175" marker-end="url(#arrow)"></path><text x="600" y="306">Situated feedback / repair / reinterpretation</text></svg><div class="program-node-row">${programNodes.map((node, index) => `<button type="button" class="program-node" data-program-node="${escapeHtml(node.id)}" aria-pressed="${index === 0 ? "true" : "false"}"><span>0${index + 1}</span><strong>${escapeHtml(node.label)}</strong><small>${escapeHtml(node.question)}</small></button>`).join("")}</div><div class="program-detail-stack">${programNodes.map((node, index) => `<article data-program-detail="${escapeHtml(node.id)}" ${index === 0 ? "" : "hidden"}><div><span class="eyebrow">${escapeHtml(node.label)}</span><h2>${escapeHtml(node.question)}</h2><p>${escapeHtml(node.detail)}</p></div><dl><dt>Buckets</dt><dd>${escapeHtml(node.buckets.join(" · "))}</dd><dt>Related gaps</dt><dd>${node.gaps.map(gap => `<a href="../field-map/#${slugify(gap)}">${escapeHtml(gap)}</a>`).join(" · ")}</dd></dl></article>`).join("")}</div></div><p class="map-caveat">这是一条分析 progression，不是单向时间线或已经证实的 causal model。Embodiment 从一开始就约束 grounding；situated feedback 也会反过来改变 Meaning 与 Convention。</p></div></section>
  <section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">Theme × Stage</span><h2>六主题不是外围目录</h2></div><p>Social / Cultural / Relational Context 直接改变 communicative priors、appropriation 与 relationship history，而不是放在主线之外的背景变量。</p></div><div class="crosswalk" role="table"><div class="crosswalk-head"><span>Exam Theme</span>${programNodes.map(node => `<span>${escapeHtml(node.label)}</span>`).join("")}</div>${dashboard.exam.themes.map(theme => { const marks = [["●","◐","·","·","◐"],["●","●","·","·","·"],["·","●","●","◐","·"],["·","◐","·","◐","●"],["·","·","◐","●","◐"],["●","·","◐","●","·"]][theme.id - 1]; return `<div class="crosswalk-row"><span>T${theme.id} · ${escapeHtml(theme.name)}</span>${marks.map(mark => `<span aria-label="${mark === "●" ? "直接关系" : mark === "◐" ? "桥接关系" : "无主要关系"}">${mark}</span>`).join("")}</div>`; }).join("")}</div><div class="crosswalk-legend"><span>● 直接关系</span><span>◐ 桥接关系</span><span>· 无主要关系</span></div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Research boundary</span><h2>主线、邻近与非主线</h2></div><p>关键词重叠不构成 relevance。主线项目通常至少连接两个相邻阶段，并对应一个仍存活的 Gap。</p></div><div class="grid three scope-grid"><article><span>MAINLINE</span><h3>直接更新共享沟通机制</h3><ul>${dashboard.research_line.scope.core.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article><article><span>ADJACENT</span><h3>提供明确的 substantive bridge</h3><ul>${dashboard.research_line.scope.adjacent.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article><article><span>NON-MAINLINE</span><h3>只有 artifact 或关键词重叠</h3><ul>${dashboard.research_line.scope.out_of_scope.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article></div><div class="empty-state project-empty"><div class="empty-mark">0</div><h3>当前没有已登记的 active research project</h3><p>Gap Registry 是 opportunity map，不自动等于 project。只有形成明确 phenomenon、RQ、evidence plan 与 gap linkage 后，项目节点才会出现。</p></div></div></section>`
}));

function paperCard(paper) {
  const collection = paper.provenance === "user_baseline_v1.0" ? `Baseline ${paper.source_list_id}` : "搜索候选";
  return `<article class="motion-card paper-card" data-reveal data-searchable><div class="paper-year">${escapeHtml(paper.year)}</div><div><div class="paper-meta">${escapeHtml((paper.authors || []).join(", "))}${paper.venue ? ` · ${escapeHtml(paper.venue)}` : ""}</div><h3>${escapeHtml(paper.title)}</h3><p>${escapeHtml(paper.one_sentence)}</p><div class="tag-row"><span class="priority">${escapeHtml(paper.priority)}</span><span class="tag">${escapeHtml(collection)}</span></div><a class="card-link" href="${escapeHtml(paper.slug)}/">打开论文界面</a></div></article>`;
}

const baselinePapers = papers.filter(paper => paper.provenance === "user_baseline_v1.0");
const candidatePapers = papers.filter(paper => paper.provenance !== "user_baseline_v1.0");
const papersBody = papers.length
  ? `<div class="toolbar"><input class="search" type="search" placeholder="搜索标题、作者、venue 或机制…" aria-label="搜索论文" data-search><span class="result-count" data-result-count>${papers.length} 项</span></div><div class="section-head paper-collection-head"><div><span class="eyebrow">Master Literature List v1.0</span><h2>已核验 Baseline · ${baselinePapers.length} 篇</h2></div><p>保留用户原始分类与相关性说明；所有书目都已核对来源，尚未精读的页面会明确写出证据边界。</p></div><div class="grid two">${baselinePapers.map(paperCard).join("")}</div><div class="section-head paper-collection-head"><div><span class="eyebrow">Missing Paper Attack</span><h2>搜索发现候选 · ${candidatePapers.length} 篇</h2></div><p>候选不会静默并入 baseline。它们会改变 GAP-02、GAP-03 或 GAP-04 的强度与措辞，需后续 Paper Investigation 决定是否正式纳入。</p></div><div class="grid two">${candidatePapers.map(paperCard).join("")}</div>`
  : `<div class="empty-state" data-reveal><div class="empty-mark">0</div><h3>没有被伪造的论文卡片</h3><p>当前 Master Literature baseline 尚未导入真实的 41 篇论文，Radar 也还没有产生可验证的新记录。系统会保持空状态；当 <code>state/paper-pages/</code> 出现经过 investigation 的 JSON 记录时，每篇论文会自动生成独立页面。</p><a class="button primary" href="../skills/paper-investigation/">查看 Paper Investigation 标准</a></div>`;
write("papers/index.html", page({
  title: "Papers",
  description: "可追踪证据的论文知识界面：每篇已核验论文拥有独立页面，并明确区分 metadata、abstract 与 full-text 证据。",
  current: "papers",
  depth: 1,
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">论文知识库</span><h1>一篇论文，一个可审计界面。</h1><p>每个页面分别呈现问题、方法、证据、真实贡献、最大弱点、claim boundary 与 AMSC 映射。拥有全文链接不代表已经完成精读；页面会另行标记 investigation status。</p></div></section><section class="section compact"><div class="container">${papersBody}</div></section>`
}));

for (const paper of papers) {
  const amsc = paper.amsc || {};
  const findings = paper.findings || [];
  const notes = paper.evidence_notes || [];
  const list = items => items.length ? `<ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "<p>Insufficient Evidence / 尚未记录。</p>";
  const fit = Number.isFinite(amsc.mainline_fit) ? amsc.mainline_fit : null;
  const accessLabels = { full_text: "可访问全文", abstract_only: "仅摘要", metadata_only: "仅元数据", inaccessible: "暂不可访问" };
  const investigationLabels = { bibliographic_verification_only: "仅完成书目核验", source_verified_candidate: "候选来源已核验", abstract_reviewed: "已阅读摘要", abstract_and_full_page_reviewed: "已阅读摘要与全文页面" };
  const collectionLabel = paper.provenance === "user_baseline_v1.0" ? `Master List Baseline · ${paper.source_list_id}` : "Missing Paper Attack · 搜索候选";
  write(`papers/${paper.slug}/index.html`, page({
    title: paper.title,
    description: paper.one_sentence,
    current: "papers",
    depth: 2,
    body: `<section class="page-hero"><div class="container"><span class="eyebrow">${escapeHtml(collectionLabel)} · ${escapeHtml(paper.priority)}</span><h1>${escapeHtml(paper.title)}</h1><p>${escapeHtml(paper.one_sentence)}</p><div class="tag-row">${[...(amsc.mechanisms || []), ...(amsc.buckets || [])].map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div></div></section><div class="container detail-shell"><article class="prose"><h2>这篇论文实际研究什么？</h2><p>${escapeHtml(paper.problem || "Insufficient Evidence / 尚未完成精读。")}</p><h2>研究方法</h2><p>${escapeHtml(paper.method || "Insufficient Evidence / 尚未完成精读。")}</p><h2>主要 Findings</h2>${list(findings)}<h2>真实贡献</h2><p>${escapeHtml(paper.real_contribution || "Insufficient Evidence / 尚未完成精读。")}</p><h2>最大局限</h2><p>${escapeHtml(paper.biggest_weakness || "Insufficient Evidence / 尚未完成精读。")}</p><h2>Claim boundary</h2><p>${escapeHtml(paper.claim_boundary || "Insufficient Evidence / 尚未完成精读。")}</p><h2>为什么与研究者相关</h2><p>${escapeHtml(paper.why_researcher_should_care || "Insufficient Evidence / 尚未记录。")}</p><h2>证据与来源说明</h2>${list(notes)}</article><aside class="side-panel"><h2>论文元数据</h2><dl><dt>作者</dt><dd>${escapeHtml(paper.authors.join(", "))}</dd><dt>年份 / Venue</dt><dd>${escapeHtml(paper.year)}${paper.venue ? ` · ${escapeHtml(paper.venue)}` : ""}</dd><dt>来源可访问性</dt><dd>${escapeHtml(accessLabels[paper.access_status] || paper.access_status)}</dd><dt>调查进度</dt><dd>${escapeHtml(investigationLabels[paper.investigation_status] || paper.investigation_status || "尚未标记")}</dd><dt>优先级</dt><dd>${escapeHtml(paper.priority)}</dd><dt>原始来源</dt><dd><a href="${escapeHtml(paper.source_url)}" target="_blank" rel="noreferrer">打开来源 ↗</a></dd>${paper.doi ? `<dt>DOI</dt><dd>${escapeHtml(paper.doi)}</dd>` : ""}<dt>AMSC 相关度</dt><dd>${fit === null ? "尚未评估" : `<div class="metric"><div class="metric-bar"><i style="--value:${fit * 10}%"></i></div><strong>${fit}/10</strong></div>`}</dd><dt>Gap IDs</dt><dd>${escapeHtml((amsc.gap_ids || []).join(", ") || "无")}</dd><dt>Master List 决策</dt><dd>${escapeHtml(amsc.master_list_decision || "尚未评估")}</dd></dl></aside></div>`
  }));
}

write("404.html", page({
  title: "页面不存在",
  description: "请求的 Senior Researcher OS 页面不存在。",
  current: "",
  body: `<section class="page-hero"><div class="container"><span class="eyebrow">404 / 缺失节点</span><h1>这个研究节点还不存在。</h1><p>链接可能已改变，或对应论文尚未进入持久知识状态。</p><div class="button-row"><a class="button primary" href="./">返回首页</a><a class="button" href="papers/">查看论文</a></div></div></section>`
}));

write("data/catalog.json", JSON.stringify({ version: manifest.version, generated_at: new Date().toISOString(), skills: skills.map(({ body, ...skill }) => skill), agents: agents.map(({ instructions, ...agent }) => agent), papers, dashboard }, null, 2));
write("schemas/paper-page.schema.json", fs.readFileSync(path.join(root, "schemas", "paper-page.schema.json"), "utf8"));
write("schemas/workflow-dashboard.schema.json", fs.readFileSync(path.join(root, "schemas", "workflow-dashboard.schema.json"), "utf8"));
write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${canonicalBase}sitemap.xml\n`);
const urls = ["", "skills/", "agents/", "architecture/", "papers/", "field-map/", "exam/", "program/", ...skills.map(item => `skills/${item.slug}/`), ...agents.map(item => `agents/${item.slug}/`), ...papers.map(item => `papers/${item.slug}/`)];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(url => `<url><loc>${canonicalBase}${url}</loc></url>`).join("")}</urlset>`);
write(".nojekyll", "");

console.log(`Built Senior Researcher OS site: ${skills.length} skills, ${agents.length} agents, ${papers.length} papers.`);
console.log(`Output: ${out}`);
