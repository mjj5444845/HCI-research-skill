// Historical migration only: current v2 data must never be overwritten.
import { readFileSync as readProgramGuard } from 'node:fs';
if (/version:\s*['"]?2/.test(readProgramGuard(new URL('../research-programs/amsc/program.yaml', import.meta.url),'utf8'))) throw new Error('Historical importer disabled for program v2; use explicit reviewed migration.');

import fs from 'node:fs';
import {parse} from 'yaml';
const read=p=>fs.readFileSync(p,'utf8');
const dashboard=JSON.parse(read('research-programs/amsc/state/workflow_dashboard.json'));
const gaps=parse(read('research-programs/amsc/state/gap_registry.yaml')).gaps;
const field=parse(read('research-programs/amsc/state/state_of_field.yaml'));
const papers=fs.readdirSync('state/paper-pages').filter(p=>p.endsWith('.json')).map(p=>JSON.parse(read('state/paper-pages/'+p)));
const report='reports/radar/2026-09-07-amsc-mainline.md';
const provenance='迁移自 '+report+' 与 workflow_dashboard.json#research_line.next_questions；保留 2026-09-07 历史判断，未进行新的检索或立项。';
const groups=[['GAP-01','GAP-02','GAP-04','GAP-07'],['GAP-02','GAP-03','GAP-04','GAP-07'],['GAP-03','GAP-05','GAP-06','GAP-07']];
const titles=['共享历史的因果作用','相互修复与角色转换','惯例生命周期及意义权衡'];
const boundary=[
'需要排除 shared priors、same-producer/style、externally supplied mappings、capability beliefs、memory availability 与 independent task learning；既有诊断不等于具身人机共同惯例已确立。',
'先建立 shared-history dependence，再检验 role reversal 与 controlled breakdown。检测 trouble、采取 repair、partner uptake 和 restored grounding 是不同证据。',
'需按 partner/context transfer、retirement、renegotiation 分阶段验证；social 与 instrumental meaning 不能预设为两个完全分离的领域。'
];
const evidenceIds=[['C3','C6','X9','X13','X20','X22','X23'],['C2','X1','X22','X24'],['X12','X14','X15','X16']];
const paperRefs=evidenceIds.map(ids=>papers.filter(p=>ids.includes(p.id)||ids.includes(p.source_list_id)).map(p=>p.slug));
const supports=[
'既有审议要求区分 pact reuse、knowledge-sensitive elaboration、acceptance 与 natural use。X22 提供 established-mapping retrieval 与 endogenous correction 的诊断分离；X23 提供状态表示组件。',
'既有记录把 shared-history dependence 后的 role reversal 与 repair 作为下一阶段。X24 提供 multimodal trouble-signal detection，但尚不承担 repair outcome。',
'既有 GAP-03/05/06 和 Q3 指向 partner/context transfer 与长期变化；既有文献提供迁移、具身约束和记忆使用的部分组件。'
];
const counters=[
'X20 已使“人不向 agent 复用 pact”失效；X22 已使“模型不能使用 convention”失效。X20 为摘要级；不能主张统计等价或 agent-side common ground。',
'检测 repair 信号不等于选择并执行有效修复。X22 为 archived human-dialogue matcher；X24 为 human–human corpora，不能直接推断 reciprocal embodied repair。',
'不可不断添加 lifecycle 阶段来维持永远开放的 gap。固定 action/affect integration 已有先例；human linguistic transfer 与 AI simulation 不等于人机长期迁移。'
];
const pipelinePath='research-programs/amsc/state/research_pipeline.json';
const pipeline=JSON.parse(read(pipelinePath));
const upsert=(array,record)=>{if(!array.some(x=>x.id===record.id))array.push(record);};
dashboard.research_line.next_questions.forEach((q,i)=>{
const id='RQ-'+(i+1);
upsert(pipeline.questions,{id,statement:q.question,status:'DRAFT',value:'既有优先序 '+q.rank+' / '+q.status+'。'+titles[i]+'；作为候选问题待研究者决定。',boundary:boundary[i],assumptions:'原始设计方向：'+q.design_stage, gap_ids:groups[i],paper_slugs:paperRefs[i],updated_at:'2026-09-07',provenance});
upsert(pipeline.validations,{id:'VAL-'+(i+1)+'-20260907',question_id:id,checked_at:'2026-09-07',search_scope:'历史验证快照，来自 2026-09-07 Radar（窗口 2026-08-31 至 2026-09-07；arXiv、DOI、IVA、ICMI、SIGDIAL/ACL 与作者链）。本轮仅迁移，当前新颖性需更新核验。',paper_slugs:paperRefs[i],closest_work:paperRefs[i].map(s=>{const p=papers.find(p=>p.slug===s);return p.id+' · '+p.title+'；'+(p.claim_boundary||p.biggest_weakness||'边界见论文档案');}).join('\n'),support:supports[i],counterevidence:counters[i],sources:[{kind:'既有 Radar 审议',title:'2026-09-07 AMSC Radar',url:'https://github.com/mjj5444845/HCI-research-skill/blob/main/'+report}],assessment:{importance:'既有优先级：'+q.rank+'；未重新评分。',novelty:'保留历史 residual question，待更新 closest-work 核验。',answerability:'既有设计方向：'+q.design_stage,feasibility:'尚未记录资源评估或实际 pilot；不能确认可行。',mainline_fit:'既有 AMSC 主线候选，关联 '+groups[i].join('、')},precise_statement:q.question,recommendation:'保留候选；先补当前证据核验和设计细节，不自动立项。',provenance});
upsert(pipeline.studies,{id:'STUDY-'+(i+1),question_id:id,title:titles[i]+' · 既有诊断草案',status:'DRAFT',rationale:'迁移既有 design_stage；不是已执行或成熟方案。',evidence_matrix:q.design_stage,procedure:'原始设计方向：'+q.design_stage+'。具体任务材料、条件分配和步骤尚待设计。',analysis:'原记录尚无完整分析计划；需在实施前明确主要指标、比较、排除标准和可支持结论。',claim_boundary:boundary[i],risks:counters[i],resources:'样本、设备、时间预算和招募方案未记录。',ethics:'尚未进入执行阶段，按最终设计完成适用的伦理审查。',provenance});
});
fs.writeFileSync(pipelinePath,JSON.stringify(pipeline,null,2)+'\n');
const writingPath='state/writing_workspace.json';const writing=JSON.parse(read(writingPath));
field.claims.forEach(c=>upsert(writing.materials,{id:'MAT-'+c.id,title:c.id+' · '+c.statement,content:'既有领域综合：'+c.statement+'\n类型：'+c.claim_kind+'；状态：'+c.status+'；证据：'+c.evidence_strength+'\n适用边界：'+(c.boundary||'见来源'),section:'论点与证据',paper_slugs:(c.evidence||[]).filter(s=>papers.some(p=>p.slug===s)),source_checked_at:String(field.updated_at),url:'https://github.com/mjj5444845/HCI-research-skill/blob/main/research-programs/amsc/state/state_of_field.yaml',next_action:'按未来写作项目选择章节；使用前复核原文与最新证据，不直接作为已完成稿件。',provenance:'从 state_of_field.yaml 的 '+c.id+' 迁移到独立材料箱；不创建虚构投稿项目。'}));
fs.writeFileSync(writingPath,JSON.stringify(writing,null,2)+'\n');
console.log('Integrated',pipeline.questions.length,'questions,',pipeline.validations.length,'historical validations,',pipeline.studies.length,'design drafts,',writing.materials.length,'writing materials.');

