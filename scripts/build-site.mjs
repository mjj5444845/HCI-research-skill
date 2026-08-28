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

const skillOrder = ["research-program-guardrail", "research-radar", "paper-investigation", "literature-investigation", "idea-development", "study-design", "senior-researcher-core", "comprehensive-exam"];
const skills = fs.readdirSync(path.join(root, ".agents", "skills"), { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => parseSkill(path.join(root, ".agents", "skills", entry.name, "SKILL.md")))
  .sort((a, b) => skillOrder.indexOf(a.slug) - skillOrder.indexOf(b.slug));

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
    ["home", "", "首页"],
    ["program", "program/", "研究主线"],
    ["papers", "papers/", "论文库"],
    ["field-map", "field-map/", "领域状态"],
    ["skills", "skills/", "工作流"],
    ["exam", "exam/", "考试准备"],
    ["architecture", "architecture/", "系统"]
  ];
  return `
    <a class="skip-link" href="#main">跳到主要内容</a>
    <div class="scroll-progress" aria-hidden="true"></div>
    <header class="site-header">
      <div class="nav-shell">
        <a class="brand" href="${rel(depth)}"><img src="${rel(depth, "assets/mark.svg")}" alt=""><span>AMSC Research OS<small>长期主线 · 证据驱动</small></span></a>
        <button class="nav-toggle" type="button" aria-label="打开导航" aria-expanded="false" data-nav-toggle>菜单</button>
        <nav class="nav-links" aria-label="主导航" data-nav>
          ${links.map(([id, target, label]) => `<a href="${rel(depth, target)}" ${current === id ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
          <a class="nav-cta" href="https://github.com/mjj5444845/HCI-research-skill" target="_blank" rel="noreferrer">GitHub ↗</a>
        </nav>
      </div>
    </header>`;
}

function footer(depth) {
  return `<footer class="site-footer"><div class="container footer-grid"><div><strong>AMSC Research OS</strong><br>围绕长期研究主线维护论文、证据、Gap 与研究决策。</div><div class="footer-links"><a href="${rel(depth, "program/")}">研究主线</a><a href="${rel(depth, "field-map/")}">领域状态</a><a href="${rel(depth, "skills/")}">工作流</a><a href="${rel(depth, "exam/")}">考试准备</a></div></div></footer>`;
}

function page({ title, description, current, depth = 0, body }) {
  const pageTitle = title === "Senior Researcher OS" ? title : `${title} · Senior Researcher OS`;
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#176b5b">
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
  description: "围绕 AMSC 长期研究主线持续维护论文、证据、Gap、研究决策与阶段性考试准备。",
  current: "home",
  body: `
    <div class="container">
      <section class="hero">
        <div data-reveal>
          <span class="eyebrow">长期研究计划 · AMSC</span>
          <h1>研究人类与具身 AI 如何发展<em>共享的多模态沟通</em>。</h1>
          <p class="hero-copy">核心关注 Meaning、Grounding、Convention、Adaptation 与 Embodied Communication 如何在 situated interaction 中相互塑造。工作流持续为这条主线获取、审计和整合证据；考试只是其中一个阶段性应用。</p>
          <div class="button-row"><a class="button primary" href="program/">进入研究主线</a><a class="button" href="field-map/">查看当前领域状态</a></div>
        </div>
        <div class="hierarchy-figure" data-reveal aria-label="研究主线、工作流与考试的层级关系">
          <div class="hierarchy-layer primary"><strong>长期核心 · Research Program</strong><span>研究身份、理论主链、领域判断、Gap 与研究议程</span></div>
          <div class="hierarchy-arrow" aria-hidden="true">↑ 持续更新</div>
          <div class="hierarchy-layer"><strong>持续引擎 · Research Workflows</strong><span>Radar、Paper、Literature、Idea 与 Study Design</span></div>
          <div class="hierarchy-arrow" aria-hidden="true">↓ 按需要筛选</div>
          <div class="hierarchy-layer"><strong>阶段任务 · Comprehensive Exam</strong><span>从主线知识状态中抽取阅读、写作与口试材料</span></div>
        </div>
      </section>
      <section class="stats" aria-label="系统统计" data-reveal>
        <div class="stat"><strong>${papers.length}</strong><span>独立论文页面</span></div>
        <div class="stat"><strong>${dashboard.field_map.claims.length}</strong><span>当前领域判断</span></div>
        <div class="stat"><strong>${dashboard.field_map.gaps.length}</strong><span>在审 Gap</span></div>
        <div class="stat"><strong>${skills.length}</strong><span>研究工作流</span></div>
      </section>
    </div>
    <section class="section"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">Research model</span><h2>一条可被证据修正的概念主链</h2></div><p>这不是已被证实的单向 causal pipeline。Embodiment 从一开始就约束 grounding，而 repair 与新的 interaction history 会反过来改变 meaning 和 convention。</p></div>
      <div class="research-chain" data-reveal>${dashboard.research_line.nodes.map((node, index) => `<a class="chain-node" href="program/#${escapeHtml(node.id)}"><span>0${index + 1}</span><strong>${escapeHtml(node.label)}</strong><small>${escapeHtml(node.question)}</small></a>`).join("")}</div>
    </div></section>
    <section class="section tinted"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">System relationship</span><h2>工作流服务主线，考试消费筛选后的状态</h2></div><p>论文调查和 Radar 的结果先进入长期研究状态。只有直接改变考试主题、anchor 或写作论点的部分，才同步到考试页。</p></div>
      <div class="system-relationship" data-reveal><article class="relationship-card"><span>持续输入</span><h3>Research Workflows</h3><p>检索、精读、反方审计、idea 与 study design。</p><a class="text-link" href="skills/">查看工作流</a></article><div class="relationship-arrow" aria-hidden="true">→</div><article class="relationship-card primary"><span>长期 Source of Truth</span><h3>AMSC Research Program</h3><p>更新理论主线、领域状态、Gap、论文图谱和下一步研究。</p><a class="text-link" href="program/">查看主线</a></article><div class="relationship-arrow" aria-hidden="true">→</div><article class="relationship-card short-term"><span>阶段性筛选</span><h3>Comprehensive Exam</h3><p>抽取当前考试需要的 corpus、论证结构与口试训练。</p><a class="text-link" href="exam/">查看考试准备</a></article></div>
    </div></section>
    <section class="section"><div class="container">
      <div class="section-head" data-reveal><div><span class="eyebrow">Explore</span><h2>从你现在要回答的问题进入</h2></div><p>界面按决策对象组织，不把内部配置、证据边界和考试 checklist 一次性堆到同一层。</p></div>
      <div class="grid three">
        <article class="surface-card" data-reveal><div class="card-index"><span>01 · 长期方向</span><i class="dot"></i></div><h3>研究主线</h3><p>研究身份、概念主链、范围与工作流关系。</p><a class="card-link" href="program/">进入主线</a></article>
        <article class="surface-card" data-reveal><div class="card-index"><span>02 · 当前判断</span><i class="dot"></i></div><h3>领域状态与 Gap</h3><p>哪些结论可支持、哪些需收窄、哪些仍只是候选。</p><a class="card-link" href="field-map/">进入领域状态</a></article>
        <article class="surface-card" data-reveal><div class="card-index"><span>03 · 证据对象</span><i class="dot"></i></div><h3>论文知识库</h3><p>逐篇查看来源、调查深度、finding 与 claim boundary。</p><a class="card-link" href="papers/">进入论文库</a></article>
      </div>
    </div></section>`
});
write("index.html", home);

const skillsIndex = page({
  title: "研究工作流",
  description: "用于论文精读、文献调查、idea development、study design 与持续 research monitoring 的八个模块化 workflow。",
  current: "skills",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Research workflows</span><h1>每条工作流解决一个明确的研究任务。</h1><p>工作流不是研究主线本身。它们负责检索、审计、综合或设计证据，并把可追溯更新送回长期研究状态。</p><div class="button-row"><a class="button" href="../program/">先看研究主线</a><a class="button" href="../agents/">查看专门 Agents</a></div></div></section><section class="section compact"><div class="container"><div class="toolbar"><input class="search" type="search" placeholder="搜索工作流、方法或概念…" aria-label="搜索工作流" data-search><span class="result-count" data-result-count>${skills.length} 项</span></div><div class="grid three">${skillCards}</div></div></section>`
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
  title: "专门 Agents",
  description: "面向 evidence、novelty、method、culture、research graph 与 AMSC 的独立专门 Agents。",
  current: "agents",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Independent review</span><h1>专门角色提供独立审计，不决定研究主线。</h1><p>${agents.length} 个 Custom Agents 分别负责 evidence、novelty、method、culture 与 gap 等争议判断。主 Agent 综合分歧并承担最终状态写入责任。</p><div class="button-row"><a class="button" href="../skills/">返回工作流</a><a class="button" href="../architecture/">查看系统关系</a></div></div></section><section class="section compact"><div class="container"><div class="toolbar"><input class="search" type="search" placeholder="搜索 Agent、audit 或 AMSC…" aria-label="搜索 Agents" data-search><span class="result-count" data-result-count>${agents.length} 项</span></div><div class="grid three">${agentCards}</div></div></section>`
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
  title: "系统架构",
  description: "AMSC Research OS 中研究主线、工作流、证据状态与阶段性考试视图之间的关系。",
  current: "architecture",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">System architecture</span><h1>工作流把证据送回长期研究状态。</h1><p>系统不是围绕考试运行，也不是固定流水线。研究请求先经过 AMSC guardrail，再调用必要工作流和独立审计；结果进入持久状态，考试页只读取其中与当前考试相关的部分。</p></div></section>
  <section class="section compact"><div class="container"><div class="architecture-stage" data-reveal><div class="architecture-route" aria-label="从研究请求到持久状态的处理路径"><article class="architecture-node"><span>01 · Input</span><strong>研究请求</strong><p>paper、literature、idea、study 或 radar。</p></article><article class="architecture-node"><span>02 · Guardrail</span><strong>主线相关性</strong><p>检查机制连接，而非关键词重叠。</p></article><article class="architecture-node"><span>03 · Workflow</span><strong>选择工作流</strong><p>只加载任务需要的 Skill 与 Agent。</p></article><article class="architecture-node"><span>04 · Audit</span><strong>证据与反方审计</strong><p>区分 source、synthesis、hypothesis 与 opportunity。</p></article><article class="architecture-node"><span>05 · State</span><strong>版本化写入</strong><p>保留 provenance、边界与 human correction。</p></article></div><div class="state-map" aria-label="持久研究状态与下游视图"><article><strong>Research Program</strong><small>长期研究身份与议程</small></article><article><strong>Paper / Field / Gap</strong><small>论文、领域判断与 Gap</small></article><article><strong>Research Graph</strong><small>作者、论文与理论关系</small></article><article><strong>Exam View</strong><small>从以上状态筛选的短期视图</small></article></div></div>
  <div class="config-panel"><article class="surface-card" data-reveal><div class="card-index"><span>Project-scoped system</span><i class="dot"></i></div><h3>职责分离</h3><p><code>.agents/skills</code> 定义工作流，<code>.codex/agents</code> 提供独立分析，<code>research-programs/amsc/state</code> 保存长期主线状态。Exam 不拥有上游研究事实。</p><div class="tag-row"><a class="tag" href="../skills/">${skills.length} Workflows</a><a class="tag" href="../agents/">${agents.length} Agents</a><a class="tag" href="../program/">1 Research Program</a></div></article><details class="disclosure"><summary>查看项目 TOML 配置</summary><div class="code-panel"><button class="copy-button" type="button" data-copy="#toml-config">复制</button><pre id="toml-config"><code>${escapeHtml(configToml)}</code></pre></div></details></div></div></section>
  <section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">Decision loop</span><h2>每次重要更新回答三个问题</h2></div><p>工作流的价值不在于产出更多页面，而在于改变或确认研究决策，并记录为什么。</p></div><div class="flow"><div class="flow-step"><span>Q1</span><h3>已知什么？</h3><p>哪些结论有足够 evidence，适用边界是什么。</p></div><div class="flow-step"><span>Q2</span><h3>未知什么？</h3><p>哪些 gap 经反方审计后仍然成立。</p></div><div class="flow-step"><span>Q3</span><h3>下一步研究什么？</h3><p>结合 novelty、理论价值、可行性与长期 trajectory。</p></div><div class="flow-step"><span>Trace</span><h3>为什么改变？</h3><p>保留来源、时间、旧措辞和状态变化。</p></div><div class="flow-step"><span>Filter</span><h3>是否进入考试？</h3><p>只有相关内容才成为 exam anchor 或 synthesis。</p></div></div></div></section>`
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
const claimableGaps = dashboardGaps.filter(gap => gap.claimability !== "CANNOT_CLAIM");
const provisionalGaps = dashboardGaps.filter(gap => gap.claimability === "CANNOT_CLAIM");
const evidenceLabel = value => ({
  STRONG: "强", MODERATE: "中等", PRELIMINARY: "初步", SPECULATIVE: "推测",
  AGENT_SYNTHESIS: "综合判断", SYNTHESIS: "综合判断", SYNTHESIS_REQUIRES_VALIDATION: "待验证综合",
  SYNTHESIS_REQUIRES_SECOND_SOURCE: "待第二来源", BIBLIOGRAPHIC_ONLY: "仅书目"
}[value] || value || "未标记");

write("field-map/index.html", page({
  title: "领域状态与 Gap",
  description: "持续维护 AMSC 领域结论、证据强度、Gap 演化与当前不可声称内容。",
  current: "field-map",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Current field state</span><h1>当前证据支持什么，哪些问题仍然值得研究。</h1><p>这是长期研究主线的证据层，不是考试笔记。页面将来源覆盖、调查深度、跨论文综合和研究机会分开，避免把“收录了论文”误写成“领域已经知道”。</p><div class="button-row"><a class="button" href="../program/">返回研究主线</a><a class="button" href="../papers/">查看论文证据</a></div></div></section>
  <section class="section compact"><div class="container"><div class="evidence-summary" data-reveal><article class="summary-note"><strong>当前证据快照</strong><span>${escapeHtml(dashboard.field_map.coverage_note)}</span></article><article><strong>${investigationCounts.full_paper_investigation || 0}/41</strong><span>Baseline 全文审计</span></article><article><strong>${investigationCounts.abstract_evidence_investigation || 0}</strong><span>Baseline 摘要级审计</span></article><article><strong>${(investigationCounts.radar_full_text_audit || 0) + (investigationCounts.abstract_reviewed || 0) + (investigationCounts.source_verified_candidate || 0)}</strong><span>Radar / 搜索候选</span></article></div>
  <div class="section-head"><div><span class="eyebrow">Cumulative claims</span><h2>领域判断的当前版本</h2></div><p>卡片只展示结论与状态；来源和边界折叠在“证据说明”中。跨论文 synthesis 不会伪装成单篇论文结论。</p></div>
  <div class="claim-list">${fieldClaims.map(claim => `<article class="claim-item" data-reveal><div class="claim-top"><strong>${escapeHtml(claim.id)}</strong><span class="status-pill ${statusClass(claim.status)}">${escapeHtml(fieldStatusZh[claim.status] || claim.status)}</span></div><h3>${escapeHtml(claim.statement)}</h3><div class="claim-meta"><span class="tag">证据：${escapeHtml(evidenceLabel(claim.evidence_strength))}</span></div><details class="disclosure"><summary>查看证据、边界与来源</summary><p><strong>适用边界：</strong>${escapeHtml(claim.boundary)}</p><div>${evidenceLinks(claim.evidence)}</div></details></article>`).join("")}</div></div></section>
  <section class="section tinted"><div class="container"><div class="section-head"><div><span class="eyebrow">Gap registry</span><h2>仍在审查的研究问题</h2></div><p>Gap 是可被新证据削弱、重定义或删除的主张。候选问题不会自动成为 novelty claim。</p></div><div class="gap-columns"><div><h3>当前主线 Gap</h3><div class="gap-stack">${claimableGaps.map(gap => `<article id="${slugify(gap.id)}" class="gap-card" data-reveal><div class="claim-top"><strong>${escapeHtml(gap.id)}</strong><span class="status-pill ${statusClass(gap.status)}">${escapeHtml(fieldStatusZh[gap.status] || gap.status)}</span></div><h3>${escapeHtml(gap.statement)}</h3><details class="disclosure"><summary>为什么仍值得研究</summary><p>${escapeHtml(gap.research_implication)}</p><div class="claim-meta"><span class="tag">优先级：${escapeHtml(gap.priority || "待定")}</span><span class="tag">证据：${escapeHtml(evidenceLabel(gap.evidence_strength))}</span></div></details></article>`).join("")}</div></div><aside><h3>尚不能作为 Gap 声称</h3><div class="gap-stack">${provisionalGaps.map(gap => `<article id="${slugify(gap.id)}" class="gap-card cannot-claim"><div class="claim-top"><strong>${escapeHtml(gap.id)}</strong><span class="status-pill status-cannot-claim">待验证</span></div><h3>${escapeHtml(gap.statement)}</h3><p>${escapeHtml(gap.research_implication)}</p></article>`).join("")}</div></aside></div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Provenance</span><h2>状态如何被更新</h2></div><p>工作流先更新长期研究状态；只有与考试范围相关的变化才进入考试页。自动化不会替研究者标记“已读”或“已掌握”。</p></div><div class="timeline">${dashboard.workflow_runs.slice().reverse().slice(0, 6).map(run => `<article><time>${escapeHtml(run.date)}</time><div><span class="status-pill">${escapeHtml(run.status)}</span><h3>${escapeHtml(run.workflow)}</h3><p>${escapeHtml(run.summary)}</p></div></article>`).join("")}</div></div></section>`
}));

const top20 = dashboard.exam.top20.map(item => ({ ...item, paper: paperBySlug.get(item.slug) })).filter(item => item.paper);
const sourceAvailable = top20.filter(item => item.paper.access_status === "full_text").length;
const agentReady = top20.filter(item => item.paper.investigation_status !== "bibliographic_verification_only").length;
const investigationLabel = status => ({
  bibliographic_verification_only: "待 First Read",
  abstract_reviewed: "已读摘要；待全文审计",
  abstract_evidence_investigation: "摘要证据已审计；全文受限",
  abstract_and_full_page_reviewed: "已有 finding-level 页面；待 Deep Investigation",
  full_paper_investigation: "已完成全文证据审计",
  radar_full_text_audit: "Radar 已完成全文审计",
  source_verified_candidate: "仅核验来源"
}[status] || "未追踪");

write("exam/index.html", page({
  title: "Comprehensive Exam 准备",
  description: "AMSC comprehensive exam 的六主题、Top 20、8–10 页写作计划、口试能力与更新状态。",
  current: "exam",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Short-term task · Comprehensive Exam</span><h1>从长期研究状态中筛选考试所需的知识。</h1><p>${escapeHtml(dashboard.exam.core_question)}</p><div class="button-row"><a class="button" href="../program/">先看长期研究主线</a><a class="button" href="../field-map/">查看上游领域状态</a></div></div></section>
  <section class="section compact"><div class="container"><div class="exam-context" data-reveal><strong>这是一张下游视图。</strong><p>Paper、Literature、Radar、Idea 与 Study Design 工作流首先服务长期研究主线。考试页只筛选与六个考试主题、核心文献、写作论证或口试能力直接相关的部分，不接管上游研究状态。</p></div><div class="readiness-grid" data-reveal><article><strong>${sourceAvailable}/20</strong><span>Top 20 全文来源可访问</span></article><article><strong>${agentReady}/20</strong><span>已有摘要或更深 Agent 调查</span></article><article><strong>未记录</strong><span>研究者个人阅读进度</span></article><article><strong>8–10</strong><span>目标写作页数</span></article></div><p class="readiness-warning">来源可访问、Agent 调查与研究者掌握是三个独立维度。</p>
  <div class="section-head"><div><span class="eyebrow">Six themes</span><h2>六个考试主题</h2></div><p>主题用于组织论证，不代表长期研究主线只有六个固定板块。详细 concepts 与 anchors 按需展开。</p></div><div class="theme-list">${dashboard.exam.themes.map(theme => `<article class="theme-card" data-reveal><header><span>T${theme.id}</span><h3>${escapeHtml(theme.name)}</h3></header><p>${escapeHtml(theme.question)}</p><details class="disclosure"><summary>查看 concepts 与 anchors</summary><div class="tag-row">${theme.concepts.map(item => `<span class="tag">${escapeHtml(item)}</span>`).join("")}</div><p>Anchors · ${escapeHtml(theme.anchors.join(" · "))}</p></details></article>`).join("")}</div></div></section>
  <section class="section dark-section"><div class="container"><div class="section-head"><div><span class="eyebrow">Written exam</span><h2>8–10 页论证结构</h2></div><p>${escapeHtml(dashboard.exam.written_target)}</p></div><div class="writing-plan">${dashboard.exam.writing_plan.map((item, index) => `<article data-reveal><span>${String(index + 1).padStart(2, "0")}</span><div><h3>${escapeHtml(item.section)}</h3><p>${escapeHtml(item.goal)}</p></div><strong>${escapeHtml(item.pages)} 页</strong></article>`).join("")}</div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Priority corpus</span><h2>Top 20 证据准备队列</h2></div><p>这是考试优先队列，不是长期主线的完整文献版图。Top 20 仍未覆盖 T6；但第二轮 baseline audit 已完成 F1、F2、F5，可在写作时补入 social / cultural / relational synthesis。</p></div><div class="paper-table" role="table" aria-label="Top 20 阅读准备"><div class="paper-table-head" role="row"><span>#</span><span>论文</span><span>Theme</span><span>Agent 调查</span></div>${top20.map(item => `<a class="paper-table-row" role="row" href="../papers/${escapeHtml(item.slug)}/"><span>${item.order}</span><span><strong>${escapeHtml(item.id)}</strong>${escapeHtml(item.paper.title)}</span><span>T${item.theme}</span><span>${escapeHtml(investigationLabel(item.paper.investigation_status))}</span></a>`).join("")}</div></div></section>
  <section class="section tinted"><div class="container"><div class="section-head"><div><span class="eyebrow">Readiness</span><h2>考试能力检查</h2></div><p>Definition、Comparison、Critical、Connection 与 Research question 需要分别练习。详细 checklist 默认折叠，避免把准备页变成信息墙。</p></div><div class="checklist-grid">${dashboard.exam.checklists.map(group => `<details><summary>${escapeHtml(group.name)}</summary><ul>${group.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></details>`).join("")}</div></div></section>`
}));

const programNodes = dashboard.research_line.nodes;
write("program/index.html", page({
  title: "AMSC 研究主线",
  description: "AMSC 从 Meaning、Grounding、Convention、Adaptation 到 Embodied Communication 的研究主线、反馈关系与范围边界。",
  current: "program",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Long-term research program</span><h1>让具身 AI 的沟通从预设信号，走向互动中形成的共享意义。</h1><p>${escapeHtml(dashboard.research_line.identity)}</p><div class="button-row"><a class="button primary" href="../field-map/">查看当前证据与 Gap</a><a class="button" href="../skills/">查看服务主线的工作流</a></div></div></section>
  <section class="section compact"><div class="container"><div class="section-head"><div><span class="eyebrow">Conceptual spine</span><h2>Meaning → Grounding → Convention → Adaptation → Embodied Communication</h2></div><p>五个节点是分析透镜，不是线性成熟阶段。选择节点可查看它在主线中的问题、证据范围与关联 Gap。</p></div><div class="program-map" data-program-map data-reveal><div class="research-chain">${programNodes.map((node, index) => `<button id="${escapeHtml(node.id)}" type="button" class="chain-node" data-program-node="${escapeHtml(node.id)}" aria-pressed="${index === 0 ? "true" : "false"}"><span>0${index + 1}</span><strong>${escapeHtml(node.label)}</strong><small>${escapeHtml(node.question)}</small></button>`).join("")}</div>${programNodes.map((node, index) => `<article class="chain-detail" data-program-detail="${escapeHtml(node.id)}" ${index === 0 ? "" : "hidden"}><div><span class="eyebrow">${escapeHtml(node.label)}</span><h2>${escapeHtml(node.question)}</h2><p>${escapeHtml(node.detail)}</p></div><dl><dt>Literature buckets</dt><dd>${escapeHtml(node.buckets.join(" · "))}</dd><dt>Related gaps</dt><dd>${node.gaps.map(gap => `<a href="../field-map/#${slugify(gap)}">${escapeHtml(gap)}</a>`).join(" · ")}</dd></dl></article>`).join("")}</div><p class="map-note">Embodiment 持续约束 signal、perception 与 repair；situated feedback 会返回 Meaning、Grounding 与 Convention。因此图中的箭头表示研究组织方式，不表示已证实的 causal order。</p></div></section>
  <section class="section tinted"><div class="container"><div class="section-head"><div><span class="eyebrow">Operating model</span><h2>工作流如何服务这条长期主线</h2></div><p>所有工作流输出先进入长期研究状态。考试、论文写作或单个项目只能读取和筛选，不反向定义整条研究主线。</p></div><div class="system-relationship"><article class="relationship-card"><span>Observe</span><h3>发现与调查</h3><p>Research Radar、Paper Investigation 与 Literature Investigation 获取新证据。</p></article><div class="relationship-arrow" aria-hidden="true">→</div><article class="relationship-card primary"><span>Update</span><h3>修正长期状态</h3><p>更新 paper、field claims、gaps、research graph 与 next questions。</p></article><div class="relationship-arrow" aria-hidden="true">→</div><article class="relationship-card"><span>Act</span><h3>形成研究行动</h3><p>Idea Development 与 Study Design 把仍存活的问题变成可检验项目。</p></article></div><div class="button-row"><a class="button" href="../architecture/">查看完整系统架构</a><a class="button" href="../exam/">查看考试如何筛选主线状态</a></div></div></section>
  <section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Research boundary</span><h2>主线、邻近与非主线</h2></div><p>关键词重叠不构成 relevance。主线工作需要直接更新 meaning、grounding、convention、adaptation 或 situated embodiment 的机制理解。</p></div><div class="grid three scope-grid"><article><span>MAINLINE</span><h3>直接更新共享沟通机制</h3><ul>${dashboard.research_line.scope.core.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article><article><span>ADJACENT</span><h3>需要明确的 substantive bridge</h3><ul>${dashboard.research_line.scope.adjacent.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article><article><span>OUT OF SCOPE</span><h3>只有 artifact 或关键词重叠</h3><ul>${dashboard.research_line.scope.out_of_scope.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul></article></div></div></section>`
}));

const isBaselinePaper = paper => /^[A-G]\d+$/.test(String(paper.source_list_id || paper.id || ""));

function paperCard(paper) {
  const collection = isBaselinePaper(paper) ? `Baseline ${paper.source_list_id}` : "搜索候选";
  const summary = paper.investigation_status === "full_paper_investigation"
    ? (paper.real_contribution || paper.problem || paper.one_sentence)
    : paper.one_sentence;
  return `<article class="paper-card" data-reveal data-searchable><div class="paper-year">${escapeHtml(paper.year)}</div><div><div class="paper-meta">${escapeHtml((paper.authors || []).join(", "))}${paper.venue ? ` · ${escapeHtml(paper.venue)}` : ""}</div><h3>${escapeHtml(paper.title)}</h3><p>${inlineMarkdown(summary)}</p><div class="tag-row"><span class="priority">${escapeHtml(paper.priority)}</span><span class="tag">${escapeHtml(collection)}</span><span class="tag">${escapeHtml(investigationLabel(paper.investigation_status))}</span></div><a class="card-link" href="${escapeHtml(paper.slug)}/">查看证据页面</a></div></article>`;
}

const baselinePapers = papers.filter(isBaselinePaper);
const candidatePapers = papers.filter(paper => !isBaselinePaper(paper));
const papersBody = papers.length
  ? `<div class="toolbar"><input class="search" type="search" placeholder="搜索标题、作者、venue 或机制…" aria-label="搜索论文" data-search><span class="result-count" data-result-count>${papers.length} 项</span></div><div class="section-head paper-collection-head"><div><span class="eyebrow">Master Literature List v1.0</span><h2>已核验 Baseline · ${baselinePapers.length} 篇</h2></div><p>保留原始清单身份，同时以全文证据审计替换未经核验的内容摘要；不同调查深度会在卡片与详情页明确标注。</p></div><div class="grid two">${baselinePapers.map(paperCard).join("")}</div><div class="section-head paper-collection-head"><div><span class="eyebrow">Missing Paper Attack</span><h2>搜索发现候选 · ${candidatePapers.length} 篇</h2></div><p>候选与 Radar recovered papers 单独展示。它们可以修正 Field Map 或 Gap，但不会在未经审查时静默并入 baseline。</p></div><div class="grid two">${candidatePapers.map(paperCard).join("")}</div>`
  : `<div class="empty-state" data-reveal><div class="empty-mark">0</div><h3>没有被伪造的论文卡片</h3><p>当前 Master Literature baseline 尚未导入真实的 41 篇论文，Radar 也还没有产生可验证的新记录。系统会保持空状态；当 <code>state/paper-pages/</code> 出现经过 investigation 的 JSON 记录时，每篇论文会自动生成独立页面。</p><a class="button primary" href="../skills/paper-investigation/">查看 Paper Investigation 标准</a></div>`;
write("papers/index.html", page({
  title: "Papers",
  description: "可追踪证据的论文知识界面：每篇已核验论文拥有独立页面，并明确区分 metadata、abstract 与 full-text 证据。",
  current: "papers",
  depth: 1,
  body: `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">Evidence library</span><h1>每篇论文拥有独立、可审计的证据页面。</h1><p>论文库是长期研究主线的证据基础。页面明确区分书目核验、摘要调查与 finding-level 调查；全文可访问不等于已经精读。</p><div class="button-row"><a class="button" href="../program/">返回研究主线</a><a class="button" href="../field-map/">查看跨论文综合</a></div></div></section><section class="section compact"><div class="container">${papersBody}</div></section>`
}));

for (const paper of papers) {
  const amsc = paper.amsc || {};
  const findings = paper.findings || [];
  const notes = paper.evidence_notes || [];
  const fit = Number.isFinite(amsc.mainline_fit) ? amsc.mainline_fit : null;
  const accessLabels = { full_text: "可访问全文", abstract_only: "仅摘要", metadata_only: "仅元数据", inaccessible: "暂不可访问" };
  const investigationLabels = { bibliographic_verification_only: "仅完成书目核验", source_verified_candidate: "候选来源已核验", abstract_reviewed: "已阅读摘要", abstract_evidence_investigation: "已完成摘要层证据审计", abstract_and_full_page_reviewed: "已阅读摘要与全文页面", full_paper_investigation: "已完成全文证据审计", radar_full_text_audit: "Radar 已完成全文审计" };
  const collectionLabel = isBaselinePaper(paper) ? `Master List Baseline · ${paper.source_list_id}` : "Missing Paper Attack · 搜索候选";
  const metadataOnly = ["bibliographic_verification_only", "source_verified_candidate"].includes(paper.investigation_status);
  const paperSection = (title, content) => content ? `<section class="paper-section"><h2>${title}</h2>${content}</section>` : "";
  const paragraph = value => value ? `<p>${escapeHtml(value)}</p>` : "";
  const findingList = findings.length ? `<ul>${findings.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "";
  const evidenceGate = metadataOnly
    ? `<div class="evidence-gate"><strong>当前仅完成来源与书目核验</strong><p>下方不展示问题、方法、findings 或贡献推断。阅读定位来自用户清单，不等于论文原始结论；这些字段将在 Paper Investigation 后出现。</p></div>`
    : `<div class="evidence-gate"><strong>${escapeHtml(investigationLabels[paper.investigation_status] || "调查状态已记录")}</strong><p>页面结论受当前可访问证据与 claim boundary 约束；请通过原始来源核对重要细节。</p></div>`;
  const examinedContent = metadataOnly
    ? `<section class="paper-section"><h2>为什么进入当前阅读列表</h2><p>${inlineMarkdown(paper.why_researcher_should_care || paper.one_sentence)}</p></section><section class="paper-section"><h2>下一步调查</h2><p>重建 RQ、theory、method、findings、real contribution、biggest weakness 与 AMSC gap impact。</p></section>`
    : `${paperSection("这篇论文研究什么", paragraph(paper.problem))}${paperSection("研究方法", paragraph(paper.method))}${paperSection("主要 Findings", findingList)}${paperSection("真实贡献", paragraph(paper.real_contribution))}${paperSection("最大局限", paragraph(paper.biggest_weakness))}${paperSection("与 AMSC 的关系", paper.why_researcher_should_care ? `<p>${inlineMarkdown(paper.why_researcher_should_care)}</p>` : "")}`;
  const heroSummary = metadataOnly
    ? paper.one_sentence
    : (paper.real_contribution || paper.problem || paper.one_sentence);
  const gapLinks = (amsc.gap_ids || []).map(id => `<a href="../../field-map/#${slugify(id)}">${escapeHtml(id)}</a>`).join(" · ") || "尚未映射";
  write(`papers/${paper.slug}/index.html`, page({
    title: paper.title,
    description: paper.one_sentence,
    current: "papers",
    depth: 2,
    body: `<section class="page-hero compact-hero paper-hero"><div class="container"><span class="eyebrow">${escapeHtml(collectionLabel)} · ${escapeHtml(paper.priority)}</span><h1>${escapeHtml(paper.title)}</h1><p><strong>${metadataOnly ? "清单定位" : "证据摘要"}：</strong>${inlineMarkdown(heroSummary)}</p><div class="tag-row">${[...(amsc.mechanisms || []), ...(amsc.buckets || [])].map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}</div><div class="button-row"><a class="button" href="../">返回论文库</a><a class="button" href="../../program/">研究主线</a></div></div></section><div class="container detail-shell"><article class="prose">${evidenceGate}${examinedContent}${paperSection("Claim boundary", paragraph(paper.claim_boundary))}${paperSection("证据与来源说明", notes.length ? `<ul>${notes.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : "")}</article><aside class="side-panel"><h2>论文元数据</h2><dl><dt>作者</dt><dd>${escapeHtml(paper.authors.join(", "))}</dd><dt>年份 / Venue</dt><dd>${escapeHtml(paper.year)}${paper.venue ? ` · ${escapeHtml(paper.venue)}` : ""}</dd><dt>来源</dt><dd>${escapeHtml(accessLabels[paper.access_status] || paper.access_status)}</dd><dt>调查层级</dt><dd>${escapeHtml(investigationLabels[paper.investigation_status] || paper.investigation_status || "尚未标记")}</dd><dt>原始来源</dt><dd><a href="${escapeHtml(paper.source_url)}" target="_blank" rel="noreferrer">打开来源 ↗</a></dd>${paper.doi ? `<dt>DOI</dt><dd>${escapeHtml(paper.doi)}</dd>` : ""}<dt>AMSC 相关度</dt><dd>${fit === null ? "尚未评估" : `<div class="metric"><div class="metric-bar"><i style="--value:${fit * 10}%"></i></div><strong>${fit}/10</strong></div>`}</dd><dt>关联 Gap</dt><dd>${gapLinks}</dd><dt>Master List</dt><dd>${escapeHtml(amsc.master_list_decision || "尚未评估")}</dd></dl></aside></div>`
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
