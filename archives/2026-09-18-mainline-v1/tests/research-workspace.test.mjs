
import test from 'node:test';
import assert from 'node:assert/strict';
import {validateWorkspace, renderWorkspace} from '../scripts/research-workspace.mjs';
const fresh = () => ({pipeline:{version:'1.0',questions:[],validations:[],studies:[],pilots:[],decisions:[]},writing:{version:'1.0',projects:[],materials:[]}});
const q = {id:'RQ-1',statement:'Fixture question',status:'DRAFT',gap_ids:['GAP-1'],paper_slugs:['paper-1']};
const papers=[{slug:'paper-1',title:'Source',updated_at:'2026-09-10'}], gaps=[{id:'GAP-1'}];
test('empty workspaces are valid and do not create research claims',()=>validateWorkspace(fresh(),papers,gaps));
test('references and object IDs remain traceable',()=>{const w=fresh();w.pipeline.questions=[{...q,paper_slugs:['missing']}];assert.throws(()=>validateWorkspace(w,papers,gaps),/unknown reference/);w.pipeline.questions=[q,q];assert.throws(()=>validateWorkspace(w,papers,gaps),/duplicate ID/);});
test('agent recommendation cannot substitute for researcher decision',()=>{const w=fresh();w.pipeline.questions=[{...q,status:'PURSUE'}];assert.throws(()=>validateWorkspace(w,papers,gaps),/researcher decision/);w.pipeline.decisions=[{id:'D-1',question_id:q.id,actor:'researcher',decision:'PURSUE',date:'2026-09-12',rationale:'Explicit decision'}];validateWorkspace(w,papers,gaps);});
test('completed pilot needs actual evidence',()=>{const w=fresh();w.pipeline.questions=[q];w.pipeline.studies=[{id:'S-1',question_id:q.id,title:'Fixture study',status:'DRAFT'}];w.pipeline.pilots=[{id:'P-1',study_id:'S-1',kind:'technical',status:'COMPLETED',target_risk:'Timing',criteria:'Under limit'}];assert.throws(()=>validateWorkspace(w,papers,gaps),/actual report/);});
test('mature blueprint cannot be a label without methods',()=>{const w=fresh();w.pipeline.questions=[q];w.pipeline.studies=[{id:'S-1',question_id:q.id,title:'Fixture study',status:'READY'}];assert.throws(()=>validateWorkspace(w,papers,gaps),/complete blueprint/);});
test('schema rejects malformed fields and unknown states',()=>{const w=fresh();w.pipeline.questions=[{...q,status:'APPROVED_BY_AI'}];assert.throws(()=>validateWorkspace(w,papers,gaps),/allowed values/);});
test('downstream rendering flags stale evidence and escapes drafts without mutation',()=>{
 const w=fresh();w.pipeline.questions=[q];
 w.writing.projects=[{id:'W-1',title:'Fixture writing'}];
 w.writing.materials=[{id:'M-1',project_id:'W-1',title:'Notes',content:'<script>alert(1)</script>',paper_slugs:['paper-1'],source_checked_at:'2026-09-01'}];
 w.gapRegistry={gaps:[]};
 const before=JSON.stringify(w);const output={};
 renderWorkspace({page:o=>o.body,write:(p,c)=>output[p]=c,papers,dashboard:{research_line:{identity:'Fixture',nodes:[]},field_map:{gaps:[]}},workspace:w});
 assert.match(output['writing/index.html'],/来源已更新/);assert.match(output['writing/index.html'],/&lt;script&gt;/);
 assert.equal(JSON.stringify(w),before);
 assert.match(output['validation/index.html'],/id="rq-1"/);assert.match(output['studies/index.html'],/id="rq-1"/);
});

