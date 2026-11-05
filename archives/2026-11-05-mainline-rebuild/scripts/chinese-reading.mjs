import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {text} from './research-workspace.mjs';

export function readChinese(root, papers) {
  const data = JSON.parse(fs.readFileSync(path.join(root, 'state/reading_zh.json'), 'utf8'));
  for (const p of papers) {
    const item = data.papers[p.id];
    if (!item || ['title','summary','method','findings','boundary','why'].some(k => !item[k])) throw new Error('Missing Chinese reading: ' + p.id);
  }
  data.stale = [];
  for (const paper of papers) {
    const hash = createHash("sha256").update(fs.readFileSync(path.join(root,"state/paper-pages/",paper.slug+".json"))).digest("hex");
    if (hash !== data.papers[paper.id].source_sha256) data.stale.push(paper.id);
  }
  for (const [file,hash] of Object.entries(data.source_hashes || {})) if (createHash("sha256").update(fs.readFileSync(path.join(root,file))).digest("hex") !== hash) data.stale.push(file);
  return data;
}
export function localizePapers(papers, data) {
  return papers.map(p => ({...p, original_title:p.title, title:data.papers[p.id].title, one_sentence:data.papers[p.id].summary, real_contribution:data.papers[p.id].summary}));
}
const labels = {CANDIDATE:'候选，尚未确认',INCUBATE:'暂缓',WEAKENED:'证据削弱',DRAFT:'草案，尚未验证',REDEFINED:'已重新界定',PARTIALLY_ADDRESSED:'已有部分解答',STRENGTHENED:'支持证据增加',ACTIVE:'待研究',UNCHANGED:'状态未变',RESOLVED:'已有解答',REMOVED:'已移除'};
const status = s => labels[s] || '保留原有判断';
const p = s => '<p>'+text(s)+'</p>';
const section = (title,body) => '<section class="paper-section reading-section"><h2>'+text(title)+'</h2>'+body+'</section>';
const source = url => /^https?:\/\//.test(url || '') ? '<a href="'+text(url)+'" target="_blank" rel="noreferrer">查看来源 ↗</a>' : '';
const hero = (kicker,title,summary) => '<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">'+text(kicker)+'</span><h1>'+text(title)+'</h1>'+p(summary)+'</div></section>';
export function renderChineseReading({page,write,papers,workspace,data}) {
  const writePage = write;
  write = (file, html) => writePage(file, data.stale?.length ? html.replace('<main id="main">', '<main id="main"><div class="container evidence-gate">原始研究记录已有更新；本页中文解读需要重新核对，请先查看来源记录。</div>') : html);
  const paperLinks = (slugs,depth='../') => slugs.map(s=>{const item=papers.find(p=>p.slug===s);return item?'<a class="evidence-chip" href="'+depth+'papers/'+text(s)+'/">'+text(item.id+' · '+item.title)+'</a>':'';}).join('');
  const gapLink = (id,depth='../') => '<a class="evidence-chip" href="'+depth+'gaps/#'+id.toLowerCase()+'">'+text(id+' · '+(data.gaps[id]?.title || id))+'</a>';
  for(const paper of papers){
    const r=data.papers[paper.id], limited=paper.access_status!=='full_text';
    const urls=[paper.source_url,...(paper.investigation_provenance?.sources || [])].filter(u=>typeof u==='string');
    const links=[...new Set(urls)].map(source).join(' · ');
    const body=hero(paper.id+' · 论文解读',r.title,r.summary)+'<div class="container detail-shell"><article class="prose"><div class="evidence-gate"><strong>'+(limited?'尚未读到全文：以下结论仅来自摘要':'已获取全文并按当前证据范围整理')+'</strong>'+p('中文标题为工作译名；具体数字、方法与结论边界仍以论文原文为准。')+'</div>'+section('作者具体做了什么？',p(r.method))+section('结果说明了什么？',p(r.findings))+section('哪些话现在还不能说？',p(r.boundary))+section('为什么与当前研究有关？',p(r.why))+section('从这里继续看', (paper.amsc?.gap_ids || []).map(id=>gapLink(id,'../../')).join(''))+section('论文来源',links+p('最近证据核验：'+(paper.last_verified || paper.updated_at || '见来源记录'))+p(paper.id==='X4'?'全文来自作者上传版本；出版商文件访问受阻。':paper.id==='X5'?'阅读的是作者预印本；最终出版版正文未逐字比对。':limited?'全文获取仍受阻，样本、方法和统计细节不能补写为已核实。':'本页是已有分析的中文整理，不代表本轮重新开展实验。'))+'</article><aside class="side-panel"><h2>论文信息</h2><dl><dt>英文原标题</dt><dd>'+text(paper.original_title)+'</dd><dt>作者</dt><dd>'+text(paper.authors.join(', '))+'</dd><dt>年份与发表出处</dt><dd>'+text(paper.year+' · '+(paper.venue || '见来源'))+'</dd><dt>论文标识</dt><dd>'+text(paper.doi || paper.id)+'</dd></dl><div class="button-row"><a class="button" href="../">返回论文库</a><a class="button" href="../../questions/">查看研究问题</a></div></aside></div>';
    write('papers/'+paper.slug+'/index.html',page({title:r.title,description:r.summary,current:'papers',depth:2,body}));
  }
  const gaps=workspace.gapRegistry.gaps;
  const currentGaps=gaps.filter(g=>g.scope_status==='CORE_CANDIDATE'||/^GAP-RC-0[1-5]$/.test(g.id));
  const supportingGaps=gaps.filter(g=>g.scope_status==='SUPPORTING'||g.id==='GAP-04');
  const archivedGaps=gaps.filter(g=>!currentGaps.includes(g)&&!supportingGaps.includes(g));
  const gapCards=currentGaps.map(g=>{const r=data.gaps[g.id];if(!r)throw new Error('Missing Chinese gap '+g.id);const linkedQuestions=workspace.pipeline.questions.filter(q=>q.gap_ids.includes(g.id)&&q.status!=='INCUBATE');return '<article class="surface-card reading-card" id="'+g.id.toLowerCase()+'"><div class="claim-top"><strong>'+g.id+'</strong><span class="tag">候选 Gap · 尚未完成新颖性验证</span></div><h2>'+text(r.title)+'</h2>'+p(r.known)+'<div class="reading-summary-grid"><section><h3>最大不确定性</h3>'+p(r.caution)+'</section><section><h3>下一步核验</h3>'+p(r.next)+'</section></div><details><summary>查看关键论文与关联问题</summary>'+paperLinks(g.evidence.slice(0,4).map(e=>e.paper_slug))+linkedQuestions.map(q=>'<a class="evidence-chip" href="../questions/#'+q.id.toLowerCase()+'">'+text(q.id+' · '+data.questions[q.id].title)+'</a>').join('')+'</details></article>';}).join('');
  const supportingCards=supportingGaps.map(g=>{const r=data.gaps[g.id];return '<article class="supporting-note" id="'+g.id.toLowerCase()+'"><span class="tag">支持性护栏</span><h3>'+text(r.title)+'</h3>'+p(r.caution)+'<details><summary>查看下一步与相关论文</summary>'+p(r.next)+paperLinks(g.evidence.slice(0,4).map(e=>e.paper_slug))+'</details></article>';}).join('');
  const gapArchive='<details class="archive-panel"><summary>查看历史与背景 Gap · '+archivedGaps.length+' 项</summary><div class="archive-list">'+archivedGaps.map(g=>{const r=data.gaps[g.id];return '<article id="'+g.id.toLowerCase()+'"><strong>'+text(g.id+' · '+status(g.status))+'</strong><p>'+text(r.title)+'</p></article>';}).join('')+'</div></details>';
  write('gaps/index.html',page({title:'候选 Gap',description:'当前五个研究方向仍需验证的证据空白。',current:'gaps',depth:1,body:hero('Evidence gaps','哪些事情仍没有研究清楚？','默认只展示与当前五个候选方向直接相连的 Gap。它们仍是待验证主张，不等于“没有人做过”。')+'<section class="section compact"><div class="container"><div class="workspace-list">'+gapCards+'</div></div></section><section class="section tinted"><div class="container"><div class="section-head single"><h2>跨问题的证据护栏</h2><p>这类 Gap 帮助校准主张，但不与五个候选方向并列。</p></div><div class="workspace-list">'+supportingCards+'</div>'+gapArchive+'</div></section>'}));
  const questions=workspace.pipeline.questions;
  const activeQuestions=questions.filter(q=>!['INCUBATE','CLOSED'].includes(q.status));
  const archivedQuestions=questions.filter(q=>['INCUBATE','CLOSED'].includes(q.status));
  const cards=activeQuestions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card reading-card" id="'+q.id.toLowerCase()+'"><div class="claim-top"><strong>'+q.id+'</strong><span class="tag">'+status(q.status)+'</span></div><h2>'+text(r.title)+'</h2>'+p(r.summary)+'<div class="reading-summary-grid"><section><h3>为什么值得问</h3>'+p(r.value)+'</section><section><h3>最大不确定性</h3>'+p(r.boundary)+'</section></div><div class="next-action"><strong>下一步</strong>'+p(r.next)+'</div><details><summary>查看关联 Gap 与关键论文</summary>'+q.gap_ids.map(id=>gapLink(id)).join('')+paperLinks(q.paper_slugs.slice(0,4))+'</details></article>';}).join('');
  const questionArchive=archivedQuestions.length?'<details class="archive-panel"><summary>查看暂缓问题 · '+archivedQuestions.length+' 项</summary><div class="archive-list">'+archivedQuestions.map(q=>{const r=data.questions[q.id];return '<article id="'+q.id.toLowerCase()+'"><strong>'+text(q.id+' · '+status(q.status))+'</strong><h3>'+text(r.title)+'</h3>'+p(r.summary)+'</article>';}).join('')+'</div></details>':'';
  write('questions/index.html',page({title:'候选研究问题',description:'五个并列候选问题；首项 RQ 尚未选择。',current:'questions',depth:1,body:hero('Current questions','接下来，我们究竟想弄清什么？','当前五个问题并列保留，均为草案；没有一个已被批准为首项 RQ。先比较价值、证据风险和可验证性，再由研究者决定。')+'<section class="section compact"><div class="container workspace-list">'+cards+questionArchive+'</div></section>'}));
  const validations=questions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card" id="'+q.id.toLowerCase()+'"><h2>'+text(r?.title||q.statement)+'</h2>'+workspace.pipeline.validations.filter(v=>v.question_id===q.id).map(v=>'<section class="validation-record"><h3>'+text(v.checked_at)+'</h3>'+section('实际检索范围',p(v.search_scope))+section('已有研究与支持证据',p(v.closest_work)+p(v.support))+section('反方证据与边界',p(v.counterevidence))+section('当前建议',p(v.precise_statement)+p(v.recommendation))+paperLinks(v.paper_slugs||[])+(v.sources||[]).map(s=>source(s.url)).join(' · ')+'</section>').join('')+'</article>';}).join('');
  write('validation/index.html',page({title:'问题验证与筛选',description:'说明已有证据支持什么，反对什么，还有什么待查。',current:'validation',depth:1,body:hero('04 · 问题验证','这个问题，还值得继续做吗？','保留每次核验的日期。补读了论文，不等于确认了新颖性；还要看已有工作是否已经回答、实验能否区分不同解释。')+'<section class="section compact"><div class="container workspace-list">'+(validations||'<article class="surface-card"><h2>等待具体候选问题</h2><p>当前没有新问题的验证结论。方向更新不等于完成新颖性检索；旧验证记录随原问题完整归档。</p></article>')+'</div></section>'}));
}
