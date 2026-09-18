import { renderRoadmapOverview } from "./artifact-roadmap.mjs";
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import Ajv from 'ajv';
const ajv = new Ajv({allErrors: true});
const pipelineSchema = ajv.compile(JSON.parse(fs.readFileSync(new URL('../schemas/research-pipeline.schema.json', import.meta.url), 'utf8')));
const writingSchema = ajv.compile(JSON.parse(fs.readFileSync(new URL('../schemas/writing-workspace.schema.json', import.meta.url), 'utf8')));

const programDefinition = parse(fs.readFileSync(new URL('../research-programs/amsc/program.yaml', import.meta.url), 'utf8'));
export const topics = Object.fromEntries(Object.entries(programDefinition.categories).map(([id,label]) => [id,label.split(' / ')[0]]));
const labels = {
  DRAFT: '草案 / 待验证', VALIDATING: '验证中', RECOMMENDED: '建议推进', PURSUE: '已决定推进',
  REFRAME: '需要重构', INCUBATE: '暂时搁置', CLOSED: '已关闭', REOPENED: '重新验证',
  PLANNED: '计划中', RUNNING: '执行中', COMPLETED: '已完成', READY: '成熟方案',
  REDEFINED: '已重新定义', PARTIALLY_ADDRESSED: '部分解决', STRENGTHENED: '证据增强',
  WEAKENED: '证据削弱', RESOLVED: '已解决', REMOVED: '已移除', UNCHANGED: '尚未改变',
  NEW_CORE_CANDIDATE: '核心候选', HIGH: '高', MEDIUM: '中', LOW: '低'
};
export const text = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const slug = value => String(value).toLowerCase().replace(/[^a-z0-9-]/g, '-');
const list = (items, render) => items.map(render).join('');
const tag = value => `<span class="tag">${text(labels[value] || value)}</span>`;
const empty = (title, detail) => `<div class="workspace-empty"><span class="eyebrow">下一步</span><h2>${title}</h2><p>${detail}</p></div>`;
const paragraph = value => value ? `<p>${text(value)}</p>` : '<p class="muted">尚未记录</p>';
const provenance = r => r.provenance ? `<p class="provenance-note">${text(r.provenance)}</p>` : "";
const safeLink = url => /^https?:\/\//i.test(url || '') ? `<a href="${text(url)}" target="_blank" rel="noreferrer">原始来源 ↗</a>` : '';

export function readWorkspace(root) {
  return {
    gapRegistry: parse(fs.readFileSync(path.join(root, 'research-programs/amsc/state/gap_registry.yaml'), 'utf8')),
    pipeline: JSON.parse(fs.readFileSync(path.join(root, 'research-programs/amsc/state/research_pipeline.json'), 'utf8')),
    writing: JSON.parse(fs.readFileSync(path.join(root, 'state/writing_workspace.json'), 'utf8'))
  };
}

export function validateWorkspace({pipeline, writing}, papers, gaps) {
  const fail = message => { throw new Error(`Research workspace: ${message}`); };
  if (!pipelineSchema(pipeline)) fail(ajv.errorsText(pipelineSchema.errors));
  if (!writingSchema(writing)) fail(ajv.errorsText(writingSchema.errors));
  const ids = (records, name) => {
    if (!Array.isArray(records)) fail(`${name} must be an array`);
    const values = records.map(r => r.id);
    if (values.some(id => !/^[A-Za-z0-9][A-Za-z0-9-]*$/.test(id || '')) || new Set(values).size !== values.length) fail(`${name}: invalid or duplicate ID`);
    return new Set(values);
  };
  const qids = ids(pipeline.questions, 'questions');
  ids(pipeline.validations, 'validations');
  const sids = ids(pipeline.studies, 'studies');
  ids(pipeline.pilots, 'pilots'); ids(pipeline.decisions, 'decisions');
  const wids = ids(writing.projects, 'writing projects'); ids(writing.materials, 'writing materials');
  const pids = new Set(papers.map(p => p.slug)); const gids = new Set(gaps.map(g => g.id));
  const refs = (values, allowed, label) => (values || []).forEach(id => { if (!allowed.has(id)) fail(`${label}: unknown reference ${id}`); });
  for (const q of pipeline.questions) {
    if (!q.statement || !['DRAFT','VALIDATING','RECOMMENDED','PURSUE','REFRAME','INCUBATE','CLOSED','REOPENED'].includes(q.status)) fail(`${q.id}: statement/status required`);
    refs(q.gap_ids, gids, q.id); refs(q.paper_slugs, pids, q.id);
    if (q.status === 'PURSUE' && !pipeline.decisions.some(d => d.question_id === q.id && d.decision === 'PURSUE' && d.actor === 'researcher' && d.rationale && d.date)) fail(`${q.id}: researcher decision required`);
  }
  for (const r of [...pipeline.validations, ...pipeline.studies, ...pipeline.decisions]) refs([r.question_id], qids, r.id);
  for (const v of pipeline.validations) {
    if (!v.checked_at || !v.search_scope) fail(`${v.id}: dated search scope required`);
    refs(v.paper_slugs, pids, v.id);
    if (!Number.isFinite(Date.parse(v.checked_at))) fail(`${v.id}: invalid checked_at`);
  }
  for (const s of pipeline.studies) {
    if (!s.title || !s.status) fail(`${s.id}: title/status required`);
    if (s.status === 'READY' && (!s.evidence_matrix || !s.procedure || !s.analysis || !s.claim_boundary)) fail(`${s.id}: complete blueprint required`);
    if (s.status === 'READY' && !pipeline.pilots.some(p => p.study_id === s.id && p.status === 'COMPLETED' && p.report && p.artifact_refs?.length) && !s.pilot_waiver) fail(`${s.id}: completed pilot or explicit waiver required`);
  }
  for (const p of pipeline.pilots) {
    refs([p.study_id], sids, p.id);
    if (!p.kind || !p.status) fail(`${p.id}: pilot kind/status required`);
    if (p.status === 'COMPLETED' && (!p.report || !p.artifact_refs?.length || !p.completed_at)) fail(`${p.id}: actual report, artifacts and completion time required`);
  }
  for (const m of writing.materials) {
    if (m.project_id) refs([m.project_id], wids, m.id);
    refs(m.paper_slugs, pids, m.id); refs(m.question_ids, qids, m.id);
    if (m.source_checked_at && !Number.isFinite(Date.parse(m.source_checked_at))) fail(`${m.id}: invalid source_checked_at`);
    if (!m.title) fail(`${m.id}: material title required`);
  }
}

export function renderWorkspace({page, write, papers, dashboard, workspace}) {
  const {pipeline, writing} = workspace;
  const paperLinks = (slugs = []) => list(slugs, s => { const p = papers.find(p => p.slug === s); return p ? `<a class="evidence-chip" href="../papers/${text(s)}/">${text(p.title)}</a>` : ''; });
  const gapLinks = (ids = []) => list(ids, id => `<a class="evidence-chip" href="../gaps/#${slug(id)}">${text(id)}</a>`);
  const questionLinks = id => `<a href="../questions/#${slug(id)}">${text(id)} · 问题档案</a>`;
  const section = (title, body) => `<section class="section compact"><div class="container"><div class="section-head single"><h2>${title}</h2></div>${body}</div></section>`;
  const intro = (kicker, title, description) => `<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${description}</p></div></section>`;
  const routes = ['gaps/', 'questions/', 'validation/', 'studies/', 'writing/'];
  const save = (route, title, body) => write(`${route}/index.html`, page({title, description: title, current: route, depth: 1, body}));
  const stages = [
    ['papers','01','论文库','发现、拆解并按主题积累文献',papers.length],
    ['gaps','02','Gap 库','聚合证据，辨认仍然开放的问题',dashboard.field_map.gaps.length],
    ['questions','03','潜在研究问题','把未知转化为值得回答的问题',pipeline.questions.length],
    ['validation','04','验证与筛选','检查已有解答、价值和可行性',pipeline.validations.length],
    ['studies','05','研究方案与报告','计算、实证与系统研究的设计及验证',pipeline.studies.length]
  ];
  write('index.html', page({title:'AMSC · 研究主线', description:dashboard.research_line.identity, current:'home', body:`
    <div class="container"><section class="hero research-hero"><div><span class="eyebrow">Adaptive Multimodal Social Communication</span><h1>看见误解，<br>让<span class="accent-text">澄清有据可循。</span></h1><p class="hero-copy">${text(programDefinition.artifact_roadmap?.identity || dashboard.research_line.identity)}</p><p>从真实误解的记录，到数据集、模型评估与沟通支持，让每一阶段留下可检验、可复用的研究成果。</p><div class="button-row"><a class="button primary" href="#artifact-roadmap">探索落地路线 ↓</a><a class="button" href="papers/">进入论文库</a></div></div>
    <figure class="communication-scene"><svg viewBox="0 0 480 310" role="img" aria-labelledby="scene-title scene-desc"><title id="scene-title">情境化多模态沟通</title><desc id="scene-desc">文字、图像和情境共同构成表达，AI需要理解其用意；共享意义是长期问题。</desc><rect x="12" y="12" width="456" height="286" rx="24" fill="#e3ede6"/><rect x="38" y="48" width="270" height="66" rx="18" fill="white"/><text x="62" y="89" fill="#315f78" font-size="22">这次真有你的！</text><rect x="184" y="133" width="250" height="67" rx="18" fill="#176b5b"/><text x="207" y="174" fill="white" font-size="20">赞赏？调侃？共同梗？</text><path d="M113 122 L113 165 L166 165" fill="none" stroke="#315f78" stroke-width="3"/><text x="240" y="250" text-anchor="middle" fill="#174b3f" font-size="17">文字 · 图像 · 情境 · 共同经历</text></svg><figcaption>解释性示例：同一句表达，在不同情境中可能具有不同用意。</figcaption></figure></section></div>
    ${renderRoadmapOverview()}
    <section class="section tinted" id="research-map"><div class="container"><div class="section-head"><div><span class="eyebrow">研究核心</span><h2>五个相互关联的问题</h2></div><p>社会语用与多模态意义是近期重心；共同理解、惯例与适应保留为相互关联的研究视角。</p></div><div class="concept-grid">${list(dashboard.research_line.nodes,(n,i)=>`<article class="concept-card" id="${text(n.id)}"><span class="node-number">0${i+1}</span><h3>${text(n.label_zh || n.label)}</h3><span class="concept-en">${text(n.label)}</span><p>${text(n.question)}</p><details><summary>这一部分研究什么</summary><p>${text(n.detail)}</p><div class="tag-row">${list(n.buckets,b=>`<a class="tag" href="papers/?topic=${b}">${text(topics[b])}</a>`)}</div><p>${list(n.gaps,id=>`<a href="gaps/#${slug(id)}">${text(id)}</a>`).split('</a>').join('</a> ')}</p></details></article>`)}</div><p class="map-note">互动反馈会重新塑造意义、共同理解与惯例；这些节点是研究视角，箭头不代表已证实的因果顺序。</p></div></section>
    ${section('沿着证据，推进研究',`<div class="workspace-path">${list(stages,([route,num,title,desc,count])=>`<a class="stage-link" href="${route}/"><span>${num} / ${count} 项</span><h3>${title}</h3><p>${desc}</p><strong>进入 →</strong></a>`)}</div><div class="support-links"><span>独立工作区</span><a href="exam/">考试准备 ↗</a><a href="writing/">论文写作 ↗</a><small>从主线获取材料，独立维护笔记与进度。</small></div>`)}` }));

  const gaps = workspace.gapRegistry.gaps;
  save('gaps','Gap 库',intro('02 / Evidence synthesis','从文献中的未知，到值得追问的空白。','按研究主线整理已有 Gap，保留证据边界与相互关系。论文数量提示关注程度，不代表问题已被验证。')+
    section('按研究主题浏览',`<div data-filter-root><div class="filter-bar"><label>主线 <select data-filter="topic"><option value="">全部主线</option>${list(dashboard.research_line.nodes,n=>`<option value="${text(n.id)}">${text(n.label)}</option>`)}</select></label><label>搜索 <input type="search" data-filter-search placeholder="Gap、机制、研究意义"></label><span data-filter-count aria-live="polite"></span></div><div class="workspace-list">${list(gaps,g=>{
      const nodes=dashboard.research_line.nodes.filter(n=>n.gaps.includes(g.id)); const linked=papers.filter(p=>(p.amsc?.gap_ids||[]).includes(g.id));
      return `<article class="surface-card" id="${slug(g.id)}" data-filter-item data-topic="${nodes.map(n=>n.id).join(' ')}"><div class="claim-top"><strong>${text(g.id)}</strong>${tag(g.status)}</div><h3>${text(g.statement)}</h3><div class="tag-row">${list(nodes,n=>tag(n.label))}${tag(`证据：${g.evidence_strength || '待审查'}`)}</div>${paragraph(dashboard.field_map.gaps.find(item=>item.id===g.id)?.research_implication)}<details><summary>证据、反方意见与演化历史</summary>${list(g.evidence || [],e=>`<div class="validation-record">${paperLinks([e.paper_slug])}${paragraph(e.supports)}${paragraph(e.boundary)}</div>`)}<h4>反方挑战</h4>${paragraph(g.skeptic_challenge)}<h4>历史</h4>${list(g.history || [],h=>`<p>${text(h.date)} · ${text(h.from)} → ${text(h.to)}：${text(h.reason)}</p>`)}</details><details><summary>关联论文与问题 · ${linked.length} 篇</summary><p>以下为已有论文记录中的 Gap 映射；关联不代表每篇都支持该 Gap。</p>${paperLinks(linked.map(p=>p.slug))}<p>${list(pipeline.questions.filter(q=>q.gap_ids?.includes(g.id)),q=>questionLinks(q.id)) || '尚未形成独立问题档案。'}</p></details><a class="text-link" href="../field-map/#${slug(g.id)}">查看领域状态中的判断</a></article>`;
    })}</div><p hidden data-filter-empty>没有匹配的 Gap，请调整筛选。</p></div>`));

  save('questions','潜在研究问题',intro('03 / Research questions','把重要的未知，整理成可讨论的问题。','每个问题保留来源、价值、边界和待验证假设。进入验证后，仍使用同一个问题档案。')+
    section('问题档案',pipeline.questions.length ? `<div class="workspace-list">${list(pipeline.questions,q=>`<article class="surface-card" id="${slug(q.id)}"><div class="claim-top"><strong>${text(q.id)}</strong>${tag(q.status)}</div><h3>${text(q.statement)}</h3>${provenance(q)}${paragraph(q.value)}${paragraph(q.boundary)}${gapLinks(q.gap_ids)}${paperLinks(q.paper_slugs)}<details><summary>待验证假设与决策记录</summary>${paragraph(q.assumptions)}${list(pipeline.decisions.filter(d=>d.question_id===q.id),d=>`<p>${text(d.date)} · ${text(d.actor)} · ${text(d.decision)}：${text(d.rationale)}</p>`)}</details><a class="text-link" href="../validation/#${slug(q.id)}">查看验证与筛选 →</a></article>`)}</div>` : empty('从一个重要的未知开始','目前尚未登记独立研究问题。下一步从 Gap 或真实现象提炼问题，记录研究价值、来源和待验证假设。')));

  save('validation','验证与筛选',intro('04 / Question evaluation','这个问题，仍然值得研究吗？','对照已有解答、现实变化和反方证据，分别判断重要性、新颖性、可回答性与可行性。')+
    section('问题验证档案',pipeline.questions.length ? `<div class="workspace-list">${list(pipeline.questions,q=>`<article class="surface-card" id="${slug(q.id)}">${questionLinks(q.id)}<h3>${text(q.statement)}</h3>${tag(q.status)}${list(pipeline.validations.filter(v=>v.question_id===q.id),v=>`<section class="validation-record"><p>核验日期：${text(v.checked_at)}</p>${provenance(v)}<h4>检索范围与 closest work</h4>${paragraph(v.search_scope)}${paperLinks(v.paper_slugs)}${paragraph(v.closest_work)}<h4>支持与反方证据</h4>${paragraph(v.support)}${paragraph(v.counterevidence)}${list(v.sources||[],s=>`<p>${text(s.kind)} · ${text(s.title)} ${safeLink(s.url)}</p>`)}<h4>分项判断</h4><dl>${list(Object.entries(v.assessment||{}),([k,val])=>`<dt>${text(k)}</dt><dd>${text(val)}</dd>`)}</dl><h4>当前准确问题表述</h4>${paragraph(v.precise_statement)}${paragraph(v.recommendation)}</section>`) || '<p>尚未进行验证，不能据此声称新颖性。</p>'}<p><a href="../studies/#${slug(q.id)}">关联实验方案 →</a></p></article>`)}</div>` : empty('等待候选问题','问题登记后，这里将显示 closest-work 对照、检索日期、反例、分项评估和准确问题表述。')));

  save('studies','实验方案与报告',intro('05 / Studies & pilots','用合适的证据，回答准确的问题。','按贡献选择计算实验、数据评估、人类研究或系统验证；分别记录试跑、实际证据和修订。')+
    section('按研究问题组织',pipeline.questions.length ? list(pipeline.questions,q=>`<article class="surface-card" id="${slug(q.id)}">${questionLinks(q.id)}<h3>${text(q.statement)}</h3>${list(pipeline.studies.filter(s=>s.question_id===q.id),s=>`<section id="${slug(s.id)}"><h4>${text(s.title)}</h4>${tag(s.status)}${provenance(s)}${paragraph(s.rationale)}<h4>RQ → 证据 → 方法 → 分析 → 可支持结论</h4>${paragraph(s.evidence_matrix)}${paragraph(s.procedure)}${paragraph(s.analysis)}${paragraph(s.claim_boundary)}<details><summary>材料、风险、资源与替代方案</summary>${paragraph(s.materials)}${paragraph(s.risks)}${paragraph(s.resources)}${paragraph(s.ethics)}${paragraph(s.alternatives)}${s.pilot_waiver ? `<p>Pilot 豁免理由：${text(s.pilot_waiver)}</p>` : ''}</details><h4>Pilot 与方案修订</h4>${list(pipeline.pilots.filter(p=>p.study_id===s.id),p=>`<div class="pilot-record"><strong>${text(p.id)} · ${text(p.kind)}</strong>${tag(p.status)}${paragraph(p.target_risk)}${paragraph(p.criteria)}${paragraph(p.report)}${paragraph(p.design_changes)}${list(p.artifact_refs||[],r=>`<p>${text(r)}</p>`)}</div>`) || '<p>尚无 pilot 记录。</p>'}</section>`) || '<p>尚未登记基础方案。</p>'}</article>`) : empty('从通过评估的问题开始设计','目前尚无实验方案或实际 pilot 报告。方案将记录所需证据、方法、分析、关键风险和 pilot 通过标准。')));

  const material = m => {
    const newer = (m.paper_slugs || []).some(s => {const p=papers.find(p=>p.slug===s); return p?.updated_at && m.source_checked_at && new Date(p.updated_at)>new Date(m.source_checked_at);});
    return `<article class="surface-card" data-filter-item id="${slug(m.id)}"><div class="tag-row">${tag(m.section || '待整理')}${newer?tag('来源已更新，待复核'):!m.source_checked_at?tag('来源尚未核验'):tag(`来源核验：${m.source_checked_at}`)}</div><h3>${text(m.title)}</h3>${provenance(m)}${paragraph(m.content)}${paperLinks(m.paper_slugs)}${list(m.question_ids||[],questionLinks)}${safeLink(m.url)}${paragraph(m.next_action)}</article>`;
  };
  save('writing','论文写作',intro('Independent workspace / Writing','让零散的材料，逐步长成论文。','按写作项目收集材料、组织章节、整理论点与证据，保留草稿和修改记录。写作内容独立维护，主线来源更新后提示复核。')+
    section('写作项目',writing.projects.length ? list(writing.projects,p=>`<article class="writing-project" id="${slug(p.id)}"><span class="eyebrow">${text(p.id)}</span><h2>${text(p.title)}</h2>${paragraph(p.description)}<details><summary>提纲、当前草稿与修改记录</summary>${paragraph(p.outline)}${paragraph(p.draft)}${list(p.revisions||[],r=>`<p>${text(r.date)} · ${text(r.note)}</p>`)}</details><div class="workspace-list">${list(writing.materials.filter(m=>m.project_id===p.id),material) || '<p>尚无项目材料。</p>'}</div></article>`) : empty('建立你的第一个写作项目','你可以随时提供论文构想、笔记、链接、段落或图表材料，由 agent 更新此工作区。尚未提供的项目与草稿保持为空。'))+
    section('材料收集箱',writing.materials.some(m=>!m.project_id)?`<div data-filter-root><div class="filter-bar"><label>搜索材料 <input type="search" data-filter-search placeholder="论点、主题、论文或来源"></label><span data-filter-count aria-live="polite"></span></div><div class="workspace-list">${list(writing.materials.filter(m=>!m.project_id),material)}</div><p hidden data-filter-empty>没有匹配的材料。</p></div>`: '<div class="workspace-empty"><p>暂时没有未归档材料。材料可以先收集，之后再分配到项目与章节。</p></div>'));
  return routes;
}

