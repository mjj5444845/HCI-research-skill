
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';
import {text} from './research-workspace.mjs';
export function renderArchive({root,out,page,write,renderMarkdown,papers}){
 const routes=[];
 const append=(route,html)=>{const p=path.join(out,route,'index.html');write(route+'/index.html',fs.readFileSync(p,'utf8').replace('</main>',html+'</main>'));};
 const section=(title,body)=>'<section class="section compact"><div class="container"><h2>'+title+'</h2>'+body+'</div></section>';
 const paperLinks=(ids=[])=>ids.map(id=>papers.find(p=>p.id===id||p.source_list_id===id||p.slug===id)).filter(Boolean).map(p=>'<a class="evidence-chip" href="../papers/'+text(p.slug)+'/">'+text(p.id)+' · '+text(p.title)+'</a>').join('');
 const reports=fs.readdirSync(path.join(root,'reports/radar')).filter(n=>n.endsWith('.md')).sort().reverse();
 for(const file of reports){const slug=file.replace(/\.md$/,'');const route='radar/'+slug+'/';routes.push(route);write(route+'index.html',page({title:'Research Radar · '+slug.slice(0,10),description:'保留原日期与证据边界的研究报告',current:'papers',depth:2,body:'<section class="page-hero compact-hero"><div class="container"><span class="eyebrow">历史报告 · '+text(slug.slice(0,10))+'</span><h1>Research Radar</h1><p>以下为当时的检索与审议记录；后续变化以当前 Gap 和领域状态为准。</p><a href="../../papers/">返回论文库</a></div></section><article class="container prose">'+renderMarkdown(fs.readFileSync(path.join(root,'reports/radar',file),'utf8'))+'</article>'}));}
 append('papers',section('Research Radar 历史报告','<div class="workspace-list">'+reports.map(file=>'<a class="surface-card" href="../radar/'+file.replace(/\.md$/,'')+'/">'+text(file.slice(0,10))+' · 查看论文发现、审议与主线更新 →</a>').join('')+'</div>'));
 const exam=parse(fs.readFileSync(path.join(root,'research-programs/amsc/state/comprehensive_exam.yaml'),'utf8'));
 append('exam',section('Radar 带来的口试问题',(exam.radar_oral_questions||[]).map(q=>'<article class="surface-card"><span class="tag">'+text(q.id)+' · Theme '+text(q.themes.join(' / '))+'</span><h3>'+text(q.question)+'</h3><p>'+text(q.boundary)+'</p>'+paperLinks(q.evidence)+'</article>').join(''))+
 section('逐篇阅读与口试矩阵',(exam.reading_matrix||[]).map(r=>'<details class="surface-card"><summary>'+text(r.id)+' · '+text(r.citation)+'</summary><p><strong>研究问题：</strong>'+text(r.rq)+'</p><p><strong>理论：</strong>'+text((r.theory||[]).join(' · '))+'</p><p><strong>方法：</strong>'+text(r.method)+'</p><p><strong>发现：</strong>'+text(r.finding)+'</p><p><strong>局限：</strong>'+text(r.limitation)+'</p>'+paperLinks([r.id])+'<p>个人阅读：'+text(r.researcher_reading||'未记录')+'；掌握：'+text(r.researcher_mastery||'未记录')+'</p>'+Object.entries(r.oral_questions||{}).map(([k,v])=>'<p><strong>'+text(k)+'：</strong>'+text(v)+'</p>').join('')+'</details>').join('')));
 const candidates=exam.candidate_anchor_review||{};
 append('exam',section('候选阅读与核心晋级',Object.values(candidates).filter(v=>v&&typeof v==='object'&&v.candidates).map(v=>'<article class="surface-card"><p>'+text(v.rationale)+'</p>'+paperLinks(v.candidates)+'</article>').join('')+'<p>'+text(candidates.guardrail||'')+'</p>'));
 return routes;
}

