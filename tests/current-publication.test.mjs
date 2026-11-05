import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import YAML from 'yaml';
const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(fs.readFileSync(new URL(p,root),'utf8'));
const publication=read('research-programs/amsc/state/site_publication.json');
test('every source has an individual publication decision without changing scientific facts',()=>{
 const files=fs.readdirSync(new URL('state/paper-pages/',root)).filter(f=>f.endsWith('.json'));
 assert.equal(publication.papers.length,files.length);
 assert.equal(new Set(publication.papers.map(p=>p.id)).size,files.length);
 assert.deepEqual(publication.papers.filter(p=>p.role==='FOUNDATION').map(p=>p.id),['X33','X68']);
 for(const r of publication.papers){
  assert.ok(r.rationale.length>15);assert.equal(r.publish,r.role!=='ARCHIVE');
  const file=`state/paper-pages/${r.slug}.json`,now=read(file),old=read(`${publication.archive}/${file}`);
  for(const key of ['title','authors','year','source_url','method','findings','claim_boundary','investigation_status'])assert.deepEqual(now[key],old[key],`${r.id}: ${key}`);
 }
});
test('snapshot preserves original files and personal exam and writing records',()=>{
 const snapshot=read(`${publication.archive}/snapshot.json`);
 for(const entry of snapshot.files){const bytes=fs.readFileSync(new URL(`${publication.archive}/${entry.path}`,root));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),entry.sha256,entry.path);}
 for(const file of ['state/writing_workspace.json','research-programs/amsc/state/comprehensive_exam.yaml'])assert.deepEqual(YAML.parse(fs.readFileSync(new URL(file,root),'utf8')),YAML.parse(fs.readFileSync(new URL(`${publication.archive}/${file}`,root),'utf8')));
});
test('archived papers and old application are absent from routes, search and output',()=>{
 const catalog=read('site/data/catalog.json'),map=fs.readFileSync(new URL('site/sitemap.xml',root),'utf8');
 for(const r of publication.papers){const route=`papers/${r.slug}/`;assert.equal(catalog.routes.includes(route),r.publish,r.id);assert.equal(map.includes(route),r.publish,r.id);assert.equal(fs.existsSync(new URL(`site/${route}index.html`,root)),r.publish,r.id);}
 assert.ok(!fs.existsSync(new URL('site/assets/meaningtrace/',root)));
 for(const route of ['','foundations/','manicule/','future/','papers/','tools/','writing/','exam/','radar/','graph/'])assert.ok(catalog.routes.includes(route));
});
test('live plan preserves proposal status and separates advisor work from own foundation',()=>{
 const plan=read('research-programs/amsc/state/current_plan.json');
 assert.match(plan.foundations.find(x=>x.paper_id==='X33').role,/导师/);
 assert.match(plan.foundations.find(x=>x.paper_id==='X68').role,/用户/);
 assert.match(plan.project.status,/草案/);assert.match(plan.project.example.status,/未/);
 assert.ok(plan.project.contributions.every(c=>/候选|潜在/.test(c.kind)));
 const home=fs.readFileSync(new URL('site/index.html',root),'utf8');
 for(const removed of ['Microduck','五个并列候选','MeaningTrace','Sony proposal'])assert.ok(!home.includes(removed));
 const system=fs.readFileSync(new URL('site/manicule/index.html',root),'utf8');
 assert.equal((system.match(/role="tab"/g)||[]).length,plan.project.flow.length);
 assert.ok(system.includes('非已实现系统截图'));assert.ok(system.includes('配送示例'));
});
test('archived deep links get a working 404 navigation independent of requested URL',()=>{
 const html=fs.readFileSync(new URL('site/404.html',root),'utf8');
 for(const [,url] of html.matchAll(/(?:href|src)="([^"]*)"/g))assert.match(url,/^(https:\/\/mjj5444845\.github\.io\/HCI-research-skill\/|#)/);
});
