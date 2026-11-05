import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
fs.mkdirSync('.tmp',{recursive:true});
process.env.MEANINGTRACE_DATA_DIR=fs.mkdtempSync(path.resolve('.tmp/meaningtrace-api-test-'));
const {meaningtrace,meaningtraceImage}=await import('../scripts/meaningtrace-api.mjs');
test('roles, visibility, locking, revisions, snapshots, submission and annotations',async()=>{
 const server=http.createServer(async(req,res)=>{if(meaningtraceImage(req,res))return;if(await meaningtrace(req,res))return;res.writeHead(404);res.end();});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port+'/api/meaningtrace';let cookie='';
 async function call(route,body,token,expected=200,withAdmin=true){const res=await fetch(base+route,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(cookie&&withAdmin?{Cookie:cookie}:{}),...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});if(res.headers.get('set-cookie'))cookie=res.headers.get('set-cookie').split(';')[0];const v=await res.json();assert.equal(res.status,expected,JSON.stringify(v));return v;}
 try{
 await call('/admin/data',null,null,401);await call('/setup',{password:'test-only-password'});
 const u=await call('/admin/user',{name:'P01'}),u2=await call('/admin/user',{name:'P02'});let d=await call('/admin/data');const m=d.materials[0];
 await call('/admin/assign',{userIds:[u.id,u2.id],materialIds:[m.id]});assert.equal((await call('/admin/assign',{userIds:[u.id],materialIds:[m.id]})).added,0);
 let t=(await call('/user/tasks',null,u.token)).tasks[0];assert.equal('context' in t.material,false);assert.equal('notes' in t.material,false);assert.equal('snapshot' in t,false);
 const other=(await call('/user/tasks',null,u2.token)).tasks[0];await call('/user/draft',{id:other.id,revision:0,stage:'initial',answer:{interpretation:'bad'}},u.token,404);
 await call('/admin/data',null,u.token,401,false);
 const initial={interpretation:'第一种解释 <script>test</script>',reason:'图文线索',uncertain:true};
 t=await call('/user/draft',{id:t.id,revision:t.revision,stage:'initial',answer:initial},u.token);
 await call('/user/advance',{id:t.id,revision:0,answer:initial},u.token,409);
 t=await call('/user/advance',{id:t.id,revision:t.revision,answer:initial},u.token);assert.equal(t.material.context,m.context);
 await call('/user/draft',{id:t.id,revision:t.revision,stage:'initial',answer:{interpretation:'overwrite',reason:'x'}},u.token,409);
 await call('/admin/material',{...m,title:'updated',context:'new context',notes:'hidden note'});const frozen=(await call('/user/tasks',null,u.token)).tasks[0];assert.equal(frozen.material.title,m.title);assert.equal(frozen.material.context,m.context);
 t=await call('/user/advance',{id:t.id,revision:t.revision,answer:{interpretation:'第二种解释',reason:'背景线索',uncertain:false}},u.token);assert.equal(t.stage,'review');
 t=await call('/user/back',{id:t.id,revision:t.revision},u.token);assert.equal(t.stage,'context');
 t=await call('/user/advance',{id:t.id,revision:t.revision,answer:{interpretation:'修订的第二次解释',reason:'背景线索'}},u.token);
 t=await call('/user/submit',{id:t.id,revision:t.revision},u.token);assert.equal(t.status,'submitted');
 await call('/user/back',{id:t.id,revision:t.revision},u.token,409);
 t=await call('/user/issue',{id:t.id,revision:t.revision,message:'材料问题'},u.token);
 await call('/admin/annotate',{id:t.id,excluded:true,reason:''},null,400);
 await call('/admin/annotate',{id:t.id,excluded:true,reason:'technical test',notes:'research note'});
 d=await call('/admin/data');const a=d.assignments.find(a=>a.id===t.id);assert.equal(a.initial.interpretation,initial.interpretation);assert.equal(a.annotation.excluded,true);assert.equal(a.snapshot.version,1);assert.ok(a.events.some(e=>e.type==='initial_locked'));assert.ok(a.events.some(e=>e.type==='submitted'));
 assert.equal(JSON.parse(fs.readFileSync(path.join(process.env.MEANINGTRACE_DATA_DIR,'database.json'))).assignments.length,2);
 await call('/admin/unassign',{id:t.id},null,409);await call('/admin/unassign',{id:other.id});
 await call('/logout',{});await call('/admin/data',null,null,401);
 }finally{await new Promise(r=>server.close(r));}
});
