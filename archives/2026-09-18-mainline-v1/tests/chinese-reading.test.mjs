import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {readChinese,localizePapers,renderChineseReading} from '../scripts/chinese-reading.mjs';
import {readWorkspace} from '../scripts/research-workspace.mjs';
const root = new URL('../',import.meta.url);
const dir = new URL('../state/paper-pages/',import.meta.url);
const papers=fs.readdirSync(dir).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(new URL(f,dir))));
const data=readChinese(fileURLToPath(root),papers);
test('all existing papers have Chinese explanations and current source references',()=>{assert.equal(Object.keys(data.papers).length,papers.length);assert.deepEqual(data.stale,[]);for(const r of Object.values(data.papers))for(const key of ['title','summary','method','findings','boundary','why'])assert.match(r[key],/[\u4e00-\u9fff]/);});
test('Chinese presentation preserves research states, original titles and evidence limits',()=>{
 const workspace=readWorkspace(fileURLToPath(root)),before=JSON.stringify(workspace),out={};
 const localized=localizePapers(papers,data);
 for(let i=0;i<papers.length;i++){assert.equal(localized[i].original_title,papers[i].title);assert.equal(localized[i].investigation_status,papers[i].investigation_status);}
 renderChineseReading({page:o=>'<main id="main">'+o.body+'</main>',write:(f,c)=>out[f]=c,papers:localized,workspace,data});
 for(const p of papers.filter(p=>['F6','X20'].includes(p.id)))assert.match(out['papers/'+p.slug+'/index.html'],/尚未读到全文/);
 assert.match(out['questions/index.html'],/草案，尚未验证/);assert.equal(JSON.stringify(workspace),before);
 const stale={...data,stale:['X3']};renderChineseReading({page:o=>'<main id="main">'+o.body+'</main>',write:(f,c)=>out[f]=c,papers:localized,workspace,data:stale});assert.match(out['questions/index.html'],/中文解读需要重新核对/);
});
