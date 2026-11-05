import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import YAML from 'yaml';
const root = path.resolve(new URL('../', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
process.chdir(root);
const archive = 'archives/2026-11-05-mainline-rebuild';
if (!fs.existsSync(`${archive}/snapshot.json`)) throw new Error('Pre-edit snapshot required');
const json = p => JSON.parse(fs.readFileSync(p,'utf8'));
const save = (p,v) => fs.writeFileSync(p, JSON.stringify(v,null,2)+'\n');
const yaml = p => YAML.parse(fs.readFileSync(p,'utf8'));
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const plan = json('research-programs/amsc/state/current_plan.json');
const original = fs.readdirSync('state/paper-pages').filter(f=>f.endsWith('.json')).map(f=>json(`state/paper-pages/${f}`));
const rows = fs.existsSync('tmp/site-restructure-2026-11-05/relevance.tsv') ? fs.readFileSync('tmp/site-restructure-2026-11-05/relevance.tsv','utf8').trim().split(/\r?\n/).map(line=>{const [id,role,...rest]=line.split('\t');return {id,role,rationale:rest.join('\t')};}) : json('research-programs/amsc/state/site_publication.json').papers.map(({id,role,rationale})=>({id,role,rationale}));
if (rows.length!==original.length || new Set(rows.map(r=>r.id)).size!==rows.length) throw new Error('Every original paper needs exactly one review');
const featured = new Set(['X33','X68','C2','D4','D5','D6','X43','X55','X59','X81','X83']);
const future = new Set(['E1','E2','E3','E4','F3','X4','X16','X50','X51','X57','X58','X65','X70','X74','X75','X76','X80','X81','X85','X86','X87','X89']);
const papers = rows.map(r=>{const p=original.find(p=>p.id===r.id);if(!p)throw new Error(r.id);return {...r,slug:p.slug,publish:r.role!=='ARCHIVE',featured:featured.has(r.id),topic:r.role==='FOUNDATION'?'foundation':future.has(r.id)?'adaptation':r.role==='SUPPORT'?'theory':'expression',checked_at:'2026-11-05',evidence_basis:'Existing paper knowledge object; relevance review, not a new full-text audit.'};});
const publication = {version:'1.0',updated_at:'2026-11-05',approved_by:'researcher',authorization:plan.authorization,archive,reviewers:['amsc_skeptic: A1–X33','missing_paper_attacker: X34–X90','primary agent: synthesis and state write'],policy:'Publish only individually reviewed FOUNDATION/CORE/SUPPORT entries. ARCHIVE means removed from current site, not scientifically refuted. All source facts and human edits preserved in snapshot and evidence records.',papers,active_question_ids:[],active_gap_ids:[],featured_paper_ids:[...featured]};
save('research-programs/amsc/state/site_publication.json',publication);
const counts=Object.fromEntries(['FOUNDATION','CORE','SUPPORT','ARCHIVE'].map(role=>[role,papers.filter(p=>p.role===role).length]));

const programPath='research-programs/amsc/program.yaml';
const program=yaml(`${archive}/${programPath}`);
const identity='我研究如何设计机器人的视觉与具身表达，使具体的人能够理解其请求、状态和行动；这些表达如何根据个人、情境与互动历史调整，以及这种沟通如何影响持续互动中的期待、负担与关系。';
program.version='3.1'; program.updated_at='2026-11-05';
program.name='Robot Visual Expression, Personalized Communication and Ongoing Human–Robot Interaction';
program.research_identity_zh=identity;
program.research_identity='I study how to design robots’ visual and embodied expressions so that people can understand their requests, states and actions; how these expressions adapt to individuals, contexts and interaction histories; and how this communication shapes expectations, burdens and relationships over time.';
program.core_chain=plan.spine;
program.development_stages=plan.work_packages.map(p=>p.title);
program.development_policy='One coherent mainline; empirical, artifact and potentially theoretical contributions may coexist. Work packages and future branches are proposals, not selected papers or a fixed sequence.';
delete program.foundation_paper;
program.foundation_works=plan.foundations.map(f=>({id:f.paper_id,slug:original.find(p=>p.id===f.paper_id).slug,role:f.role,status:f.paper_id==='X68'?'COMPLETED_RESEARCH_REJECTED_USER_REPORTED':'ADVISOR_PRIOR_WORK',boundary:f.boundary}));
program.resources.robot_available=false;
program.resources.ar_development_device='Meta Quest 3';
program.resources.ar_status='User-planned development; implementation, registration and synchronization unverified';
program.resources.last_confirmed_at='2026-11-05';
program.resources.reconfirmation_note='Quest 3 AR development planned; real laboratory robot not yet identified. Recruitment, budget and code reuse readiness remain unconfirmed, not re-established by this update.';
program.resources.budget='Current budget unconfirmed; no hardware purchase authorized';
program.resources.devices=['Meta Quest 3 (planned AR platform); other previously recorded devices are historical resources, not current execution assumptions'];
program.resources.field_updates.push({date:'2026-11-05',field:'current_platform_plan',value:'Quest 3 AR; seek lab robot; model unconfirmed',evidence:'User reply in current conversation'});
program.decisions.integration_2026_11_05='User approves new website structure, individual publication review and on-disk archive. Two current foundations are SpeechCap and Manicule. General system flow is a proposal; lab delivery is an example; all new contributions are candidates. No formal first RQ selected.';
program.platform_plan={preferred:'Unspecified accessible laboratory robot',status:'ACCESS_AND_CAPABILITIES_UNCONFIRMED',ar_device:'Meta Quest 3',checked_at:'2026-11-05',gates:['Stable supported actions and real completion/failure feedback','Quest 3 alignment and legibility','Reliable reset and logging','Scenario determined by actual capability'],boundary:'Historical Microduck assessment archived; not the selected current platform.'};
delete program.proposal_sources;
program.artifact_roadmap={title:'从已有表达研究，到可理解、可调整的机器人沟通',status:'APPROVED_DIRECTION',approved_at:'2026-11-05',first_question_id:null,identity,foundations:program.foundation_works,stages:plan.work_packages.map(w=>({id:w.id,title:w.title,question:w.question,status:'DRAFT',contribution:w.contributions,deliverables:[w.outputs],depends_on:[]})),plan_source:'research-programs/amsc/state/current_plan.json'};
program.plan_revision='2026-11-05 user-confirmed mainline, two foundations and Manicule reconstruction; historical proposal/platform priorities archived.';
program.current_plan_source='research-programs/amsc/state/current_plan.json';
program.site_publication_source='research-programs/amsc/state/site_publication.json';
program.design_space.architecture_status='OPEN';
fs.writeFileSync(programPath,YAML.stringify(program,{lineWidth:110}));

const masterPath='research-programs/amsc/state/master_literature.yaml',master=yaml(`${archive}/${masterPath}`);
const zhPath='state/reading_zh.json',zh=json(`${archive}/${zhPath}`);
for(const review of papers){
 const file=`state/paper-pages/${review.slug}.json`, p=json(`${archive}/${file}`);
 const old=p.program_membership;
 p.membership_history=[...(p.membership_history||[]),{date:'2026-11-05',previous:old,reason:'User-confirmed current site/mainline relevance review; source facts unchanged.'}];
 p.program_membership={status:review.role==='ARCHIVE'?'ARCHIVED':review.role==='SUPPORT'?'SUPPORTING':'CORE',program_version:'3.1',reviewed_at:'2026-11-05',reason:review.rationale};
 p.publication_review={role:review.role,checked_at:review.checked_at,publish:review.publish,rationale:review.rationale};
 save(file,p);
 zh.papers[p.id].why=review.rationale;
 zh.papers[p.id].source_sha256=sha(file);
 for(const entry of [...master.papers,...master.candidates]) if(entry.slug===p.slug){entry.scope_review={id:p.id,slug:p.slug,...p.program_membership};entry.publication_role=review.role;}
}
master.updated_at='2026-11-05';master.version='3.3';master.publication_policy='Current website subset is owned by site_publication.json; archived entries remain evidence records with stable IDs.';
fs.writeFileSync(masterPath,YAML.stringify(master,{lineWidth:110}));

const dashboardPath='research-programs/amsc/state/workflow_dashboard.json',dashboard=json(`${archive}/${dashboardPath}`);
dashboard.last_updated='2026-11-05';
dashboard.research_line={identity,core_question:'机器人如何通过视觉与具身表达，与具体的人建立可理解、可调整的沟通方式？',nodes:plan.work_packages.map(w=>({id:w.id,label:w.title,label_zh:w.title,question:w.question,detail:w.status,buckets:[],gaps:[]})),scope:{core:plan.spine,adjacent:['按具体问题使用社会感知、期待、归因、grounding与关系理论','AR、机器人与计算方法须服务实质沟通问题'],out_of_scope:['纯关键词关联','将短期好感当长期关系','把硬件更换当充分新颖性']},next_questions:[],foundation_works:program.foundation_works,resources:program.resources,platform_plan:program.platform_plan,current_plan_source:program.current_plan_source,next_step:'具体梳理新版Manicule系统与通用交互，确认实验室机器人能力；配送只作为待确认示例，贡献为候选。'};
dashboard.publication={source:program.site_publication_source,archive,counts,current_plan_source:program.current_plan_source};
save(dashboardPath,dashboard);

const radarPath='config/research_radar.yaml',radar=yaml(`${archive}/${radarPath}`);
radar.interests.semantic_descriptions=['robot visual and embodied expression; typography, graphics, motion and spatial communication','human interpretation of requests, understanding feedback, response requirements and actual actions','personalized robot expression: user control, preferences, context and interaction history','ongoing interaction: expectations, social burden, trust and relationship evidence','AR expression linked to physical robots; expression creation and meaningful evaluation'];
delete radar.amsc.foundation_paper;radar.amsc.foundation_papers=['x33-speechcap','x68-manicule'];radar.amsc.program_version='3.1';
radar.program_sources.current_plan=program.current_plan_source;radar.program_sources.site_publication=program.site_publication_source;
fs.writeFileSync(radarPath,YAML.stringify(radar,{lineWidth:110}));

zh.updated_at='2026-11-05';
for(const file of Object.keys(zh.source_hashes||{}))zh.source_hashes[file]=sha(file);
save(zhPath,zh);
save('reports/mainline/2026-11-05-site-restructure.json',{date:'2026-11-05',status:'CONTENT_MIGRATED_VERIFICATION_PENDING',authorization:plan.authorization,archive,counts,publication_source:program.site_publication_source,plan_source:program.current_plan_source,considered:{master:'All 114 records individually reviewed; facts preserved.',field:'No new scientific claim promoted; existing claim authority retained.',gaps:'Old gap objects preserved; no longer automatic live priorities.',graph:'Original source graph retained; live view filtered to published evidence.',questions:'No formal first RQ selected; old records retained but removed from current projection.',exam:'Original mastery and source records preserved; live reading subset follows current relevance.'}});
console.log(JSON.stringify({counts,published:papers.filter(p=>p.publish).length,archive}));
