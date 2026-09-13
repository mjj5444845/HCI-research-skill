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
const labels = {DRAFT:'草案，尚未验证',REDEFINED:'已重新界定',PARTIALLY_ADDRESSED:'已有部分解答',STRENGTHENED:'支持证据增加',ACTIVE:'待研究',UNCHANGED:'状态未变',RESOLVED:'已有解答',REMOVED:'已移除'};
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
    const body=hero(paper.id+' · 论文解读',r.title,r.summary)+'<div class="container detail-shell"><article class="prose"><div class="evidence-gate"><strong>'+(limited?'尚未读到全文：以下结论仅来自摘要':'已有全文调查记录')+'</strong>'+p('中文标题为工作译名；下文按已有审查整理，具体数字和证据范围以原始论文为准。')+'</div>'+section('作者具体做了什么？',p(r.method))+section('结果说明了什么？',p(r.findings))+section('哪些话现在还不能说？',p(r.boundary))+section('与你的研究有什么关系？',p(r.why))+section('从这里继续看', (paper.amsc?.gap_ids || []).map(id=>gapLink(id,'../../')).join(''))+section('论文与审查来源',links+p('最近证据核验：'+(paper.last_verified || paper.updated_at || '见原记录'))+p(paper.id==='X4'?'全文来自作者上传版本；出版商文件访问受阻。':paper.id==='X5'?'阅读的是作者预印本；最终出版版正文未逐字比对。':limited?'全文获取仍受阻，样本、方法和统计细节不能补写为已核实。':'本页是已有分析的中文通俗整理，不代表本轮重新开展实验或重新核验全文。')+'<a href="'+raw('state/paper-pages/'+paper.slug+'.json')+'" target="_blank" rel="noreferrer">查看保留的原始审查记录 ↗</a>')+'</article><aside class="side-panel"><h2>查找这篇论文</h2><dl><dt>英文原标题</dt><dd>'+text(paper.original_title)+'</dd><dt>作者</dt><dd>'+text(paper.authors.join(', '))+'</dd><dt>年份与发表出处</dt><dd>'+text(paper.year+' · '+(paper.venue || '见来源'))+'</dd><dt>论文标识</dt><dd>'+text(paper.doi || paper.id)+'</dd></dl><div class="button-row"><a class="button" href="../">返回论文库</a><a class="button" href="../../questions/">查看研究问题</a></div></aside></div>';
    write('papers/'+paper.slug+'/index.html',page({title:r.title,description:r.summary,current:'papers',depth:2,body}));
  }
  const gaps=workspace.gapRegistry.gaps;
  const gapCards=gaps.map(g=>{const r=data.gaps[g.id];if(!r)throw new Error('Missing Chinese gap '+g.id);return '<article class="surface-card reading-card" id="'+g.id.toLowerCase()+'" data-filter-item><div class="claim-top"><strong>'+g.id+'</strong><span class="tag">'+status(g.status)+'</span></div><h2>'+text(r.title)+'</h2>'+p(r.example)+section('别人已经做到了哪里？',p(r.known))+section('为什么还要谨慎？',p(r.caution))+section('下一步具体查什么？',p(r.next))+'<details><summary>相关论文与证据限制</summary>'+p('这些论文与问题相关，并不都支持存在研究空白。下面分别给出论文内容和不能推出的结论。')+g.evidence.map(e=>{const item=papers.find(p=>p.slug===e.paper_slug);const r=item&&data.papers[item.id];return r?'<div class="validation-record">'+paperLinks([e.paper_slug])+p(r.summary)+p('证据限制：'+r.boundary)+'</div>':'';}).join('')+'</details><details><summary>判断的变化记录</summary>'+p('以下保留原始判断日期和状态；本次只是改写表达，没有提高问题优先级。')+g.history.map(h=>p(h.date+'：'+status(h.from)+' → '+status(h.to))).join('')+source(raw('research-programs/amsc/state/gap_registry.yaml'))+'</details><div class="button-row">'+workspace.pipeline.questions.filter(q=>q.gap_ids.includes(g.id)).map(q=>'<a class="text-link" href="../questions/#'+q.id.toLowerCase()+'">'+text(data.questions[q.id].title)+' →</a>').join('')+'</div></article>';}).join('');
  write('gaps/index.html',page({title:'研究空白库',description:'看懂已有研究做到哪里，哪些问题仍值得追问。',current:'gaps',depth:1,body:hero('02 · 研究空白','哪些事情仍没有研究清楚？','这里的“空白”不等于没人做过。每项都说明已有成果、剩下的疑问，以及接下来怎样核实。')+'<section class="section compact"><div class="container" data-filter-root><div class="filter-bar"><label>搜索问题或相关论文 <input type="search" data-filter-search placeholder="例如：换伙伴、误解、记忆"></label><span data-filter-count aria-live="polite"></span></div><div class="workspace-list">'+gapCards+'</div><p hidden data-filter-empty>没有匹配内容，请换一个词。</p></div></section>'}));
  const questions=workspace.pipeline.questions;
  const cards=questions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card reading-card" id="'+q.id.toLowerCase()+'"><div class="claim-top"><strong>'+q.id+'</strong><span class="tag">'+status(q.status)+'</span></div><h2>'+text(r.title)+'</h2>'+p(r.summary)+section('举个例子',p(r.example))+section('为什么值得研究？',p(r.value))+section('现在还没确定什么？',p(r.boundary))+section('下一步',p(r.next))+'<details><summary>原问题与关联证据</summary>'+p('原问题的中文表达：'+r.original)+p('上方通俗问法用于阅读；原问题保留在研究记录中，尚未据此批准新项目。')+q.gap_ids.map(id=>gapLink(id)).join('')+paperLinks(q.paper_slugs)+source(raw('research-programs/amsc/state/research_pipeline.json'))+'</details><a class="text-link" href="../validation/#'+q.id.toLowerCase()+'">查看核验理由 →</a></article>';}).join('');
  write('questions/index.html',page({title:'潜在研究问题',description:'用具体、可讨论的问题连接文献和实验。',current:'questions',depth:1,body:hero('03 · 潜在研究问题','接下来，我们究竟想弄清什么？','三个问题目前都是候选。先说清为什么值得问，再检查是否已有人回答、能否用实验回答。')+'<section class="section compact"><div class="container workspace-list">'+cards+'</div></section>'}));
  const validations=questions.map(q=>{const r=data.questions[q.id];return '<article class="surface-card reading-card" id="'+q.id.toLowerCase()+'"><h2>'+text(r.title)+'</h2><span class="tag">'+status(q.status)+'</span>'+workspace.pipeline.validations.filter(v=>v.question_id===q.id).slice().reverse().map(v=>{const latest=v.checked_at==='2026-09-12';return '<section class="validation-record"><h3>'+text(v.checked_at)+' · '+(latest?'积压论文补读后的复核':'此前的文献核验')+'</h3>'+p(latest?'本次补读5篇全文，并重查2篇摘要及获取全文的可能性。没有完成面向全部最新论文、实验室和新闻的全面检索。':'这次记录来自9月7日的文献监测，检索了论文库、出版来源和作者线索。它是当时的判断，不代表今天已证实新颖性。')+section('已有研究对这个问题说了什么？',p(latest?latestEvidence[q.id]:olderEvidence[q.id]))+section('现在能作出的判断',p(r.boundary))+p('研究价值：'+r.value)+p('能否回答：'+r.next)+p('实际可行性：尚无真实先导实验结果，不能确认。')+p('是否新颖：仍需针对最接近的已有研究逐项比较，不能宣称无人做过。')+section(latest?'建议进一步讨论的问法':'当时的问题表述',p(latest?r.title:r.original))+'<details><summary>本次关联论文和来源</summary>'+paperLinks(v.paper_slugs)+v.sources.map(s=>source(s.url)).join(' · ')+'</details></section>';}).join('')+'<a class="text-link" href="../questions/#'+q.id.toLowerCase()+'">返回问题档案 →</a></article>';}).join('');
  write('validation/index.html',page({title:'问题验证与筛选',description:'说明已有证据支持什么，反对什么，还有什么待查。',current:'validation',depth:1,body:hero('04 · 问题验证','这个问题，还值得继续做吗？','保留每次核验的日期。补读了论文，不等于确认了新颖性；还要看已有工作是否已经回答、实验能否区分不同解释。')+'<section class="section compact"><div class="container workspace-list">'+validations+'</div></section>'}));
}
const latestEvidence={
'RQ-1':'已有机器人指物任务、四类人机搭档比较和共享记录系统。因此不能把合作改善都归因于共同经历；也要排除看错物体、记错顺序和预先已有相同叫法。',
'RQ-2':'既有研究已经观察纠错、澄清及资料更新。关键不是有没有修正动作，而是对方是否接受、之后是否沿用，以及是否再次误解。',
'RQ-3':'儿童机器人重访研究涉及资料维护，但用户直接编辑记忆的界面尚未实测。社会情境也已有框架，所以应选一个具体变化来验证，而不是重新宣称整个领域空白。'};
const olderEvidence={
'RQ-1':'人会对模型复用旧叫法，模型也可能读懂外部提供的对应关系；但这些不直接证明双方建立了共同理解。其中“把旧约定讲给新听者”仍只有摘要证据。',
'RQ-2':'既有研究已能识别人类发出的求助和澄清信号，也测试模型在有限反馈下纠错。识别信号、采取纠正和之后理解恢复，需要分别测量。',
'RQ-3':'已有伙伴经验向新人迁移的理论、模拟群体的表达演化及自然记忆使用研究。但它们的对象、时间尺度和任务不同，不能直接拼成真实人机长期沟通的完整结论。'};
