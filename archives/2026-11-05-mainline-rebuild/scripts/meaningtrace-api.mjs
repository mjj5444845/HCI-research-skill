import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const base=path.resolve(process.env.MEANINGTRACE_DATA_DIR||'local-data/meaningtrace');
const file=path.join(base,'database.json');
const now=()=>new Date().toISOString();
const id=()=>crypto.randomUUID();
const token=()=>crypto.randomBytes(32).toString('hex');
const digest=s=>crypto.createHash('sha256').update(s).digest('hex');
const fail=(status,message)=>{throw Object.assign(new Error(message),{status});};
const text=(v,max=10000)=>typeof v==='string'?v.slice(0,max).trim():'';
function seed(){const materials=[
 {id:id(),version:1,title:'一只会挑时候的猫',text:'一位用户分享了一张猫趴在电脑上的照片。',images:['cat.png'],comment:'你可真会挑时候。',context:'刚收到拒稿邮件，它就跑过来趴在我面前。',source:'虚构演示 · AI 生成图片',notes:'用于体验三步填写流程，不代表真实研究材料。',status:'published'},
 {id:id(),version:1,title:'窗边的位置',text:'朋友发来消息，说他为聚会预留了靠窗的座位。',images:[],comment:'你还真记得啊。',context:'几个月前，发消息的人曾说过自己喜欢看窗外的街景。',source:'虚构文字案例',notes:'观察参与者对语气和关系的解释。',status:'published'},
 {id:id(),version:1,title:'提前到场',text:'同事在会议开始前二十分钟来到会议室，看到另一位同事已经坐在那里。',images:[],comment:'今天这么积极。',context:'上一周，两人约好在会议前一起准备演示。',source:'虚构文字案例',notes:'仅作交互演示。',status:'published'}
].map(m=>({...m,createdAt:now(),updatedAt:now()}));return {schema:1,admin:null,sessions:[],materials,users:[],assignments:[]};}
let db;
function load(){if(!db){fs.mkdirSync(base,{recursive:true});db=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):seed();save();}return db;}
function save(){const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(db,null,2));fs.renameSync(tmp,file);}
function audit(a,type,extra={}){a.events.push({at:now(),type,...extra});a.updatedAt=now();}
function admin(req){const cookie=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mt_session='))?.slice(11);if(!cookie||!db.sessions.some(s=>s.hash===digest(cookie)&&s.expires>Date.now()))fail(401,'请先登录研究者工作区。');}
function user(req){const key=(req.headers.authorization||'').replace(/^Bearer /,'');const u=db.users.find(u=>u.token===key);if(!u)fail(401,'任务链接无效，请向研究者获取分配链接。');return u;}
function visible(a){const m=a.snapshot;return {id:a.id,revision:a.revision,status:a.status,stage:a.stage,material:{id:m.id,version:m.version,title:m.title,text:m.text,images:m.images,comment:m.comment,source:m.source,...(a.stage!=='initial'?{context:m.context}:{})},initial:a.initial,revised:a.revised,issues:a.issues,updatedAt:a.updatedAt,submittedAt:a.submittedAt};}
function answer(v){return {interpretation:text(v?.interpretation,4000),reason:text(v?.reason,4000),uncertain:!!v?.uncertain};}
function complete(v){return v?.interpretation?.trim()&&v?.reason?.trim();}
async function body(req){let value='';for await(const c of req){value+=c;if(Buffer.byteLength(value)>12*1024*1024)fail(413,'内容过大，请使用小于 8MB 的图片。');}try{return JSON.parse(value||'{}');}catch{fail(400,'请求内容格式不正确。');}}
function response(res,status,data,headers={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(JSON.stringify(data));}
export async function meaningtrace(req,res){const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/api/meaningtrace/'))return false;load();try{
 if(req.method!=='GET'){const origin=req.headers.origin;if(origin&&origin!==`http://${req.headers.host}`&&origin!==`https://${req.headers.host}`)fail(403,'来源不匹配。');}
 const route=url.pathname.slice('/api/meaningtrace'.length);const data=req.method==='GET'?{}:await body(req);
 if(route==='/status'&&req.method==='GET'){let loggedIn=false;try{admin(req);loggedIn=true;}catch{}response(res,200,{configured:!!db.admin,loggedIn});return true;}
 if(['/setup','/login'].includes(route)&&req.method==='POST'){
  if(route==='/setup'){if(db.admin)fail(409,'研究者账户已经设置。');if(typeof data.password!=='string'||data.password.length<8)fail(400,'密码至少需要 8 个字符。');const salt=token();db.admin={salt,hash:crypto.scryptSync(data.password,salt,64).toString('hex')};}
  else{if(!db.admin||typeof data.password!=='string'||data.password.length>1000)fail(401,'密码不正确。');const h=crypto.scryptSync(data.password,db.admin.salt,64);if(!crypto.timingSafeEqual(h,Buffer.from(db.admin.hash,'hex')))fail(401,'密码不正确。');}
  const t=token();db.sessions=db.sessions.filter(s=>s.expires>Date.now());db.sessions.push({hash:digest(t),expires:Date.now()+12*3600000});save();response(res,200,{ok:true},{'Set-Cookie':`mt_session=${t}; HttpOnly; SameSite=Strict; Path=/api/meaningtrace; Max-Age=43200`});return true;
 }
 if(route==='/logout'&&req.method==='POST'){const c=(req.headers.cookie||'').split(';').map(x=>x.trim()).find(x=>x.startsWith('mt_session='))?.slice(11);db.sessions=db.sessions.filter(s=>s.hash!==digest(c||''));save();response(res,200,{ok:true},{'Set-Cookie':'mt_session=; HttpOnly; SameSite=Strict; Path=/api/meaningtrace; Max-Age=0'});return true;}
 if(route.startsWith('/user')){const u=user(req);
  if(route==='/user/tasks'&&req.method==='GET'){response(res,200,{user:{name:u.name,id:u.id},tasks:db.assignments.filter(a=>a.userId===u.id).map(visible)});return true;}
  const a=db.assignments.find(a=>a.id===data.id&&a.userId===u.id);if(!a)fail(404,'找不到这条任务。');if(req.method!=='POST')fail(405,'不支持此操作。');
  if(data.revision!==a.revision)fail(409,'这条任务已在其他页面更新。请刷新后继续；当前输入不会自动覆盖新记录。');
  if(a.status==='submitted'&&route!=='/user/issue')fail(409,'记录已提交，原始回答不可覆盖。');
  if(route==='/user/draft'){if(data.stage!==a.stage||!['initial','context'].includes(a.stage))fail(409,'填写步骤已变化，请刷新页面。');const v=answer(data.answer);if(a.stage==='initial')a.initial=v;else a.revised=v;a.status='in_progress';audit(a,'draft_saved',{stage:a.stage});}
  else if(route==='/user/advance'){if(a.stage==='initial'){const v=answer(data.answer);if(!complete(v))fail(400,'请填写解释与依据，也可以写“不确定”。');a.initial=v;a.stage='context';a.status='in_progress';audit(a,'initial_locked',{answer:v});audit(a,'context_revealed');}else if(a.stage==='context'){const v=answer(data.answer);if(!complete(v))fail(400,'请填写解释与依据，也可以写“不确定”。');a.revised=v;a.stage='review';audit(a,'revised_saved',{answer:v});}else fail(409,'当前步骤不能继续。');}
  else if(route==='/user/back'){if(a.stage!=='review')fail(409,'初次回答已锁定。');a.stage='context';audit(a,'revised_edit_opened');}
  else if(route==='/user/submit'){if(a.stage!=='review'||!complete(a.initial)||!complete(a.revised))fail(400,'请完成前两步后再提交。');a.stage='review';a.status='submitted';a.submittedAt=now();audit(a,'submitted');}
  else if(route==='/user/issue'){const message=text(data.message,1000);if(!message)fail(400,'请填写问题。');a.issues.push({at:now(),message});audit(a,'issue_reported');}
  else fail(404,'未知操作。');a.revision++;save();response(res,200,visible(a));return true;
 }
 admin(req);
 if(route==='/admin/data'&&req.method==='GET'){response(res,200,{materials:db.materials,users:db.users,assignments:db.assignments});return true;}
 if(route==='/admin/material'&&req.method==='POST'){
  const current=data.id?db.materials.find(m=>m.id===data.id):null;if(data.id&&!current)fail(404,'材料不存在。');if(current&&data.version!==current.version)fail(409,'材料已被更新，请重新载入。');
  const m={title:text(data.title,150),text:text(data.text,20000),comment:text(data.comment,5000),context:text(data.context,10000),source:text(data.source,2000),notes:text(data.notes,5000),images:Array.isArray(data.images)?data.images.filter(x=>typeof x==='string'&&(x==='cat.png'||/^\/api\/meaningtrace\/image\/[a-f0-9-]+\.(png|jpg|webp)$/.test(x))).slice(0,8):[],status:['draft','published','archived'].includes(data.status)?data.status:'draft'};
  if(!m.title)fail(400,'请填写材料标题。');if(m.status==='published'&&(!m.context||(!m.text&&!m.images.length&&!m.comment)))fail(400,'发布需要原始内容和补充背景。');
  const value={...m,id:current?.id||id(),version:current?current.version+1:1,createdAt:current?.createdAt||now(),updatedAt:now()};if(current)db.materials[db.materials.indexOf(current)]=value;else db.materials.push(value);save();response(res,200,value);return true;
 }
 if(route==='/admin/upload'&&req.method==='POST'){const match=typeof data.image==='string'&&data.image.match(/^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/=]+)$/);if(!match)fail(400,'请上传 PNG、JPEG 或 WebP 图片。');const bytes=Buffer.from(match[2],'base64');if(bytes.length>8*1024*1024)fail(413,'图片需小于 8MB。');const name=id()+'.'+(match[1]==='jpeg'?'jpg':match[1]);fs.mkdirSync(path.join(base,'images'),{recursive:true});fs.writeFileSync(path.join(base,'images',name),bytes);response(res,200,{url:'/api/meaningtrace/image/'+name});return true;}
 if(route==='/admin/user'&&req.method==='POST'){const name=text(data.name,80);if(!name)fail(400,'请填写用户编号。');if(db.users.some(u=>u.name===name))fail(409,'用户编号已存在。');const u={id:id(),name,token:token(),createdAt:now()};db.users.push(u);save();response(res,200,u);return true;}
 if(route==='/admin/assign'&&req.method==='POST'){const users=Array.isArray(data.userIds)?data.userIds:[];const materials=Array.isArray(data.materialIds)?data.materialIds:[];if(!users.length||!materials.length)fail(400,'请选择用户和材料。');if(users.some(uid=>!db.users.some(u=>u.id===uid))||materials.some(mid=>!db.materials.some(m=>m.id===mid&&m.status==='published')))fail(400,'只能分配现有用户与已发布材料。');let added=0;for(const uid of new Set(users))for(const mid of new Set(materials)){const m=db.materials.find(x=>x.id===mid);if(db.assignments.some(a=>a.userId===uid&&a.materialId===mid))continue;db.assignments.push({id:id(),userId:uid,materialId:mid,snapshot:structuredClone(m),revision:0,status:'not_started',stage:'initial',initial:null,revised:null,issues:[],annotation:{notes:'',excluded:false,reason:''},events:[{type:'assigned',at:now()}],createdAt:now(),updatedAt:now()});added++;}save();response(res,200,{added});return true;}
 if(route==='/admin/unassign'&&req.method==='POST'){const a=db.assignments.find(a=>a.id===data.id);if(!a)fail(404,'任务不存在。');if(a.status!=='not_started')fail(409,'已开始的任务不能移除，请在总览中标记。');db.assignments=db.assignments.filter(x=>x!==a);save();response(res,200,{ok:true});return true;}
 if(route==='/admin/annotate'&&req.method==='POST'){const a=db.assignments.find(a=>a.id===data.id);if(!a)fail(404,'记录不存在。');const v={notes:text(data.notes,5000),excluded:!!data.excluded,reason:text(data.reason,2000)};if(v.excluded&&!v.reason)fail(400,'排除记录时请说明原因。');a.annotation=v;audit(a,'research_annotation_updated',{annotation:v});save();response(res,200,{ok:true});return true;}
 fail(404,'找不到这个接口。');
 }catch(e){response(res,e.status||500,{error:e.status?e.message:'保存服务发生错误，请保留输入并重试。'});}return true;}
export function meaningtraceImage(req,res){const pathname=new URL(req.url,'http://localhost').pathname;const match=pathname.match(/^\/api\/meaningtrace\/image\/([a-f0-9-]+\.(png|jpg|webp))$/);if(!match)return false;const target=path.join(base,'images',match[1]);if(!fs.existsSync(target)){res.writeHead(404);res.end();return true;}res.writeHead(200,{'Content-Type':{png:'image/png',jpg:'image/jpeg',webp:'image/webp'}[match[2]],'X-Content-Type-Options':'nosniff','Cache-Control':'private, max-age=3600'});fs.createReadStream(target).pipe(res);return true;}
