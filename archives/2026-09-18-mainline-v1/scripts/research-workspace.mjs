import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import Ajv from 'ajv';
const ajv = new Ajv({allErrors: true});
const pipelineSchema = ajv.compile(JSON.parse(fs.readFileSync(new URL('../schemas/research-pipeline.schema.json', import.meta.url), 'utf8')));
const writingSchema = ajv.compile(JSON.parse(fs.readFileSync(new URL('../schemas/writing-workspace.schema.json', import.meta.url), 'utf8')));

export const topics = {
  A: '社会与多模态表达', B: '语用、表征与沟通效率', C: '共同基础与惯例形成',
  D: '人机沟通与信号', E: '适应与长期互动', F: '社会、文化与关系', G: '情境与具身表达'
};
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
    ['studies','05','实验方案与报告','从基础设计，经 pilot 到成熟方案',pipeline.studies.length]
  ];
  const zhNodes = ['社会意义','共同理解','共享惯例','持续适应','具身沟通'];
  const examples = ['这个手势表达什么？','机器人是否理解了我的意思？','我们能否约定一个更简短的表达？','换对象或任务后，表达要怎么变？','距离、视线与动作如何影响沟通？'];
  write('index.html', page({title:'AMSC · 研究主线', description:dashboard.research_line.identity, current:'home', body:`
    <div class="container"><section class="hero research-hero"><div><span class="eyebrow">Adaptive Multimodal Social Communication</span><h1>在互动中，<br>形成<span class="accent-text">共享的意义。</span></h1><p class="hero-copy">我研究人类与具身 AI 如何在持续互动中，形成、理解并调整具有社会意义的多模态沟通。</p><p>从一个信号的含义，到双方共同建立的沟通习惯。</p><div class="button-row"><a class="button primary" href="#research-map">探索研究主线 ↓</a><a class="button" href="papers/">进入论文库</a></div></div>
    <figure class="communication-scene"><svg viewBox="0 0 480 310" role="img" aria-labelledby="scene-title scene-desc"><title id="scene-title">人与具身 AI 通过反馈形成共享沟通</title><desc id="scene-desc">人和机器人位于同一个任务空间中，通过表达、理解和修正不断互动。</desc><rect x="12" y="12" width="456" height="286" rx="24" fill="#e3ede6"/><ellipse cx="240" cy="261" rx="186" ry="20" fill="#cfddd3"/><circle cx="110" cy="138" r="28" fill="#315f78"/><path d="M65 240 Q64 179 110 179 Q157 179 156 240" fill="#315f78"/><path d="M145 198 L195 167" stroke="#315f78" stroke-width="15" stroke-linecap="round"/><rect x="311" y="112" width="72" height="67" rx="18" fill="#176b5b"/><circle cx="332" cy="142" r="6" fill="white"/><circle cx="362" cy="142" r="6" fill="white"/><rect x="302" y="188" width="90" height="54" rx="15" fill="#176b5b"/><path d="M161 88 Q238 35 310 88" fill="none" stroke="#176b5b" stroke-width="3"/><path d="M301 78 L312 89 L297 91" fill="none" stroke="#176b5b" stroke-width="3"/><path d="M306 214 Q239 256 180 218" fill="none" stroke="#315f78" stroke-width="3" stroke-dasharray="5 5"/><text x="240" y="51" text-anchor="middle" fill="#174b3f" font-size="17">表达 · 理解 · 确认</text><text x="240" y="285" text-anchor="middle" fill="#174b3f" font-size="15">互动历史与情境</text><rect x="206" y="114" width="73" height="63" rx="12" fill="white"/><path d="M222 145 L238 131 L262 156" fill="none" stroke="#9a6428" stroke-width="5" stroke-linecap="round"/></svg><figcaption>示意场景：人与机器人在共同任务中逐渐形成表达习惯。反馈与误解会推动双方继续调整。</figcaption></figure></section></div>
    <section class="section tinted" id="research-map"><div class="container"><div class="section-head"><div><span class="eyebrow">研究核心</span><h2>五个相互关联的问题</h2></div><p>Grounding 与 Convention Formation 是理论重点。身体、环境与互动历史贯穿其中。</p></div><div class="concept-grid">${list(dashboard.research_line.nodes,(n,i)=>`<article class="concept-card" id="${text(n.id)}"><span class="node-number">0${i+1}</span><h3>${zhNodes[i]}</h3><span class="concept-en">${text(n.label)}</span><p>${examples[i]}</p><details><summary>这一部分研究什么</summary><p>${text(n.detail)}</p><div class="tag-row">${list(n.buckets,b=>`<a class="tag" href="papers/?topic=${b}">${text(topics[b])}</a>`)}</div><p>${list(n.gaps,id=>`<a href="gaps/#${slug(id)}">${text(id)}</a>`).split('</a>').join('</a> ')}</p></details></article>`)}</div><p class="map-note">互动反馈会重新塑造意义、共同理解与惯例；这些节点是研究视角，箭头不代表已证实的因果顺序。</p></div></section>
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

  save('studies','实验方案与报告',intro('05 / Studies & pilots','用合适的证据，回答准确的问题。','基础方案 → Pilot 计划与实际报告 → 修订后的成熟方案。技术试跑、模拟和真实参与者研究分别记录。')+
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
