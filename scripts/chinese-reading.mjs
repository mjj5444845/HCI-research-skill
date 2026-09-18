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
const labels = {INCUBATE:'暂缓',WEAKENED:'证据削弱',DRAFT:'草案，尚未验证',REDEFINED:'已重新界定',PARTIALLY_ADDRESSED:'已有部分解答',STRENGTHENED:'支持证据增加',ACTIVE:'待研究',UNCHANGED:'状态未变',RESOLVED:'已有解答',REMOVED:'已移除'};
const status = s => labels[s] || '保留原有判断';
const p = s => '<p>'+text(s)+'</p>';
const section = (title,body) => '<section class="paper-section reading-section"><h2>'+text(title)+'</h2>'+body+'</section>';
const source = url => /^https?:\/\//.test(url || '') ? '<a href="'+text(url)+'" target="_blank" rel="noreferrer">查看来源 ↗</a>' : '';
const raw = file => 'https://github.com/mjj5444845/HCI-research-skill/blob/main/'+file;
const hero = (kicker,title,summary) => '<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">'+text(kicker)+'</span><h1>'+text(title)+'</h1>'+p(summary)+'</div></section>';
export function renderChineseReading({page,write,papers,workspace,data}) {
  const writePage = write;
  write = (file, html) => writePage(file, data.stale?.length ? html.replace('<main id="main">', '<main id="main"><div class="container evidence-gate">原始研究记录已有更新；本页中文解读需要重新核对，请先查看来源记录。</div>') : html);
  const paperLinks = (slugs,depth='../') => slugs.map(s=>{const item=papers.find(p=>p.slug===s);return item?'<a class="evidence-chip" href="'+depth+'papers/'+text(s)+'/">'+text(item.id+' · '+item.title)+'</a>':'';}).join('');
  const gapLink = (id,depth='../') => '<a class="evidence-chip" href="'+depth+'gaps/#'+id.toLowerCase()+'">'+text(id+' · '+(data.gaps[id]?.title || id))+'</a>';
  for(const paper of papers){
    const r=data.papers[paper.id], limited=paper.investigation_status==='abstract_evidence_investigation';
    const urls=[paper.source_url,...(paper.investigation_provenance?.sources || [])].filter(u=>typeof u==='string');
    const links=[...new Set(urls)].map(source).join(' · ');
    const body=hero(paper.id+' · 论文解读',r.title,r.summary)+'<div class="container detail-shell"><article class="prose"><div class="evidence-gate"><strong>'+(limited?'尚未读到全文：以下结论仅来自摘要':'已有全文调查记录')+'</strong>'+p('中文标题为工作译名；下文按已有审查整理，具体数字和证据范围以原始论文为准。')+'</div>'+section('作者具体做了什么？',p(r.method))+section('结果说明了什么？',p(r.findings))+section('哪些话现在还不能说？',p(r.boundary))+section('与你的研究有什么关系？',(paper.researcher_relationship?p('已有研究基础：用户明确确认是本文二作；作者身份不改变证据审查标准。'):'')+p(r.why))+section('从这里继续看', (paper.amsc?.gap_ids || []).map(id=>gapLink(id,'../../')).join(''))+section('论文与审查来源',links+p('最近证据核验：'+(paper.last_verified || paper.updated_at || '见原记录'))+p(paper.id==='X4'?'全文来自作者上传版本；出版商文件访问受阻。':paper.id==='X5'?'阅读的是作者预印本；最终出版版正文未逐字比对。':limited?'全文获取仍受阻，样本、方法和统计细节不能补写为已核实。':'本页是已有分析的中文通俗整理，不代表本轮重新开展实验或重新核验全文。')+'<a href="'+raw('state/paper-pages/'+paper.slug+'.json')+'" target="_blank" rel="noreferrer">查看保留的原始审查记录 ↗</a>')+'</article><aside class="side-panel"><h2>查找这篇论文</h2><dl><dt>英文原标题</dt><dd>'+text(paper.original_title)+'</dd><dt>作者</dt><dd>'+text(paper.authors.join(', '))+'</dd><dt>年份与发表出处</dt><dd>'+text(paper.year+' · '+(paper.venue || '见来源'))+'</dd><dt>论文标识</dt><dd>'+text(paper.doi || paper.id)+'</dd></dl><div class="button-row"><a class="button" href="../">返回论文库</a><a class="button" href="../../questions/">查看研究问题</a></div></aside></div>';
    write('papers/'+paper.slug+'/index.html',page({title:r.title,description:r.summary,current:'papers',depth:2,body}));
  }
  const gaps=workspace.gapRegistry.gaps;
  const gapCards=gaps.map(g=>{const r=data.gaps[g.id];if(!r)throw new Error('Missing Chinese gap '+g.id);return '<article class="surface-card reading-card" id="'+g.id.toLowerCase()+'" data-filter-item><div class="claim-top"><strong>'+g.id+'</strong><span class="tag">'+status(g.status)+'</span></div><h2>'+text(r.title)+'</h2>'+p(r.example)+section('别人已经做到了哪里？',p(r.known))+section('为什么还要谨慎？',p(r.caution))+section('下一步具体查什么？',p(r.next))+'<details><summary>相关论文与证据限制</summary>'+p('这些论文与问题相关，并不都支持存在研究空白。下面分别给出论文内容和不能推出的结论。')+g.evidence.map(e=>{const item=papers.find(p=>p.slug===e.paper_slug);const r=item&&data.papers[item.id];return r?'<div class="validation-record">'+paperLinks([e.paper_slug])+p(r.summary)+p('证据限制：'+r.boundary)+'</div>':'';}).join('')+'</details><details><summary>判断的变化记录</summary>'+p('以下区分证据变化与2026-09-18用户授权的范围调整；暂缓不表示科学问题已解决。')+g.history.map(h=>p(h.date+'：'+status(h.from)+' → '+status(h.to)+'；'+(h.reason||''))).join('')+source(raw('research-programs/amsc/state/gap_registry.yaml'))+'</details><div class="button-row">'+workspace.pipeline.questions.filter(q=>q.gap_ids.includes(g.id)).map(q=>'<a class="text-link" href="../questions/#'+q.id.toLowerCase()+'">'+text(data.questions[q.id].title)+' →</a>').join('')+'</div></article>';}).join('');
  write('gaps/index.html',page({title:'研究空白库',description:'看懂已有研究做到哪里，哪些问题仍值得追问。',current:'gaps',depth:1,body:hero('02 · 研究空白','哪些事情仍没有研究清楚？','这里的“空白”不等于没人做过。每项都说明已有成果、剩下的疑问，以及接下来怎样核实。')+'<section class="section compact"><div class="container" data-filter-root><div class="filter-bar"><label>搜索问题或相关论文 <input type="search" data-filter-search placeholder="例如：换伙伴、误解、记忆"></label><span data-filter-count aria-live="polite"></span></div><div class="workspace-list">'+gapCards+'</div><p hidden data-filter-empty>没有匹配内容，请换一个词。</p></div></section>'}));
  const questions=workspace.pipeline.questions;
  const cards=questions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card reading-card" id="'+q.id.toLowerCase()+'"><div class="claim-top"><strong>'+q.id+'</strong><span class="tag">'+status(q.status)+'</span></div><h2>'+text(r.title)+'</h2>'+p(r.summary)+section('举个例子',p(r.example))+section('为什么值得研究？',p(r.value))+section('现在还没确定什么？',p(r.boundary))+section('下一步',p(r.next))+'<details><summary>原问题与关联证据</summary>'+p('原问题的中文表达：'+r.original)+p('上方通俗问法用于阅读；原问题保留在研究记录中，尚未据此批准新项目。')+q.gap_ids.map(id=>gapLink(id)).join('')+paperLinks(q.paper_slugs)+source(raw('research-programs/amsc/state/research_pipeline.json'))+'</details><a class="text-link" href="../validation/#'+q.id.toLowerCase()+'">查看核验理由 →</a></article>';}).join('');
  write('questions/index.html',page({title:'潜在研究问题',description:'用具体、可讨论的问题连接文献和实验。',current:'questions',depth:1,body:hero('03 · 潜在研究问题','接下来，我们究竟想弄清什么？','先说清每个问题为什么值得问，再检查是否已有人回答、能否用实验回答。')+'<section class="section compact"><div class="container workspace-list">'+(cards||'<article class="surface-card"><h2>主线已确定，首项研究问题尚未选择</h2><p>以已有EMNLP研究X21为起点，从具体的多模态表达与理解现象提炼问题。旧4个问题及其验证、3份研究草案已归档；不自动把误解修复或机器人实验设为下一项目。</p><a href="../papers/x21-social-pragmatic-chinese-comments/">回到已有研究基础 →</a></article>')+'</div></section>'}));
  const validations=questions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card" id="'+q.id.toLowerCase()+'"><h2>'+text(r?.title||q.statement)+'</h2>'+workspace.pipeline.validations.filter(v=>v.question_id===q.id).map(v=>'<section class="validation-record"><h3>'+text(v.checked_at)+'</h3>'+section('实际检索范围',p(v.search_scope))+section('已有研究与支持证据',p(v.closest_work)+p(v.support))+section('反方证据与边界',p(v.counterevidence))+section('当前建议',p(v.precise_statement)+p(v.recommendation))+paperLinks(v.paper_slugs||[])+(v.sources||[]).map(s=>source(s.url)).join(' · ')+'</section>').join('')+'</article>';}).join('');
  write('validation/index.html',page({title:'问题验证与筛选',description:'说明已有证据支持什么，反对什么，还有什么待查。',current:'validation',depth:1,body:hero('04 · 问题验证','这个问题，还值得继续做吗？','保留每次核验的日期。补读了论文，不等于确认了新颖性；还要看已有工作是否已经回答、实验能否区分不同解释。')+'<section class="section compact"><div class="container workspace-list">'+(validations||'<article class="surface-card"><h2>等待具体候选问题</h2><p>当前没有新问题的验证结论。方向更新不等于完成新颖性检索；旧验证记录随原问题完整归档。</p></article>')+'</div></section>'}));
}