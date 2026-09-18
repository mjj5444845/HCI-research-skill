import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import {renderChineseReading} from '../scripts/chinese-reading.mjs';
const root=new URL('../',import.meta.url);
const read=f=>YAML.parse(fs.readFileSync(new URL(f,root),'utf8'));
const papers=fs.readdirSync(new URL('state/paper-pages/',root)).filter(f=>f.endsWith('.json')).map(f=>read('state/paper-pages/'+f));
const slugs=new Set(papers.map(p=>p.slug));
test('active corpus, gap evidence, graph and downstream sources have no dangling references',()=>{
 const m=read('research-programs/amsc/state/master_literature.yaml');assert.deepEqual(new Set([...m.papers,...m.candidates].map(p=>p.slug)),slugs);
 const gaps=read('research-programs/amsc/state/gap_registry.yaml').gaps;const gids=new Set(gaps.map(g=>g.id));
 for(const g of gaps)for(const e of g.evidence)assert.ok(slugs.has(e.paper_slug),g.id+': '+e.paper_slug);
 for(const p of papers)for(const g of p.amsc.gap_ids)assert.ok(gids.has(g),p.id+': '+g);
 const d=read('research-programs/amsc/state/workflow_dashboard.json');assert.deepEqual(d.field_map.claims,read('research-programs/amsc/state/state_of_field.yaml').claims,'public field claims must match authority');assert.deepEqual(new Set(d.field_map.gaps.map(g=>g.id)),gids);
 for(const c of [...d.field_map.claims,...read('research-programs/amsc/state/state_of_field.yaml').claims])for(const s of c.evidence)assert.ok(slugs.has(s),c.id+': '+s);
 const graph=read('research-programs/amsc/state/research_graph.yaml'),nodes=new Set(graph.nodes.map(n=>n.id));
 for(const e of graph.edges){assert.ok(nodes.has(e.source_node));assert.ok(nodes.has(e.target_node));}
 for(const n of graph.nodes.filter(n=>n.type==='paper'))assert.ok(slugs.has(n.id.replace(/^paper:/,'')));
});
test('scope migration preserves original paper findings and complete pre-migration corpus',()=>{
 const prefix='archives/2026-09-18-mainline-v1/';const manifest=read('reports/mainline/2026-09-18-migration.json');
 for(const p of papers.filter(p=>manifest.active_paper_ids.includes(p.id))){const old=read(prefix+'state/paper-pages/'+p.slug+'.json');for(const key of ['title','authors','year','source_url','method','findings','claim_boundary','investigation_status'])assert.deepEqual(p[key],old[key],p.id+': '+key);}
 for(const p of manifest.deferred_papers){assert.ok(fs.existsSync(new URL(prefix+'state/paper-pages/'+p.slug+'.json',root)));assert.ok(!slugs.has(p.slug));}
 assert.equal(manifest.active_paper_ids.length+manifest.deferred_papers.length,fs.readdirSync(new URL(prefix+'state/paper-pages/',root)).filter(f=>f.endsWith('.json')).length);
 const old=read(prefix+'research-programs/amsc/state/research_pipeline.json');assert.ok(old.questions.length>0);assert.ok(old.studies.length>0);
 const current=read('research-programs/amsc/state/research_pipeline.json');assert.ok(!current.questions.some(q=>q.status==='PURSUE'));
});
test('Chinese validation renders a new question date from its evidence, not historical hardcoding',()=>{
 const q={id:'RQ-NEW',statement:'Fixture',status:'DRAFT',gap_ids:[],paper_slugs:[]};
 const workspace={gapRegistry:{gaps:[]},pipeline:{questions:[q],validations:[{id:'V-NEW',question_id:q.id,checked_at:'2027-01-01',search_scope:'新的检索范围',closest_work:'独立材料',support:'支持证据',counterevidence:'反例记录',recommendation:'仍需验证',paper_slugs:[],sources:[]}]}};
 const data={stale:[],questions:{'RQ-NEW':{title:'新问题',summary:'新摘要',example:'示例',value:'价值',boundary:'边界',next:'下一步',original:'原始问题'}}};
 const out={};renderChineseReading({page:o=>o.body,write:(f,c)=>out[f]=c,papers:[],workspace,data});
 assert.match(out['validation/index.html'],/新的检索范围/);assert.match(out['validation/index.html'],/反例记录/);assert.doesNotMatch(out['validation/index.html'],/undefined|积压论文补读|9月7日/);
});
