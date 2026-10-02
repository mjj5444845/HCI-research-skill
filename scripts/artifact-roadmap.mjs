import fs from 'node:fs';
import { parse } from 'yaml';
const program = parse(fs.readFileSync(new URL('../research-programs/amsc/program.yaml', import.meta.url), 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const items = values => `<ul>${(values || []).map(v => `<li>${esc(v)}</li>`).join('')}</ul>`;
const anchor = id => `stage-${String(id).toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
const stateLabel = status => ({PLANNED:'候选 · 未选择',RUNNING:'实施中',COMPLETED:'已完成'}[status] || '候选 · 未选择');
export function renderRoadmapOverview() {
  const r = program.artifact_roadmap;
  if (!r) return '';
  return `<section class="section roadmap-overview" id="artifact-roadmap"><div class="container"><div class="section-head"><div><span class="eyebrow">一条主线 · 五个候选方向</span><h2>${esc(r.title)}</h2></div><p>${esc(r.subtitle)}</p></div><p class="roadmap-principle">${esc(r.principle)}</p><div class="roadmap-strip">${r.stages.map(s => `<a class="roadmap-step" href="program/#${anchor(s.id)}"><span class="roadmap-number">${esc(s.number)}</span><span class="roadmap-status">${stateLabel(s.status)}</span><h3>${esc(s.artifact_name)}</h3><p>${esc(s.title)}</p><small>${esc(s.artifact_kind)}</small><strong>查看阶段蓝图 →</strong></a>`).join('')}</div><p class="roadmap-note">主线范围已批准；五个方向为候选，首项问题未选择，artifact和研究结果尚未完成。</p><a class="button primary" href="program/">查看完整路线与首轮行动 →</a></div></section>`;
}
export function renderArtifactRoadmap() {
  const r = program.artifact_roadmap;
  if (!r) return '';
  return `<section class="page-hero compact-hero roadmap-hero"><div class="container"><span class="eyebrow">AMSC · 研究空间</span><h1>${esc(r.title)}</h1><p class="roadmap-identity">${esc(r.identity)}</p><div class="roadmap-badges"><span>长期范围已确定</span><span>五个方向并列候选</span><span>首项 RQ 尚未选择</span></div><p class="program-spine">视觉与具身表达 ↔ 用户理解 ↔ 角色–行为一致性 ↔ 身份与适应 ↔ 持续关系</p><div class="button-row"><a class="button primary" href="#roadmap-stages">比较候选方向 ↓</a><a class="button" href="../questions/">查看研究问题</a></div></div></section>
  <section class="section compact"><div class="container"><div class="roadmap-thesis"><span class="eyebrow">共同原则</span><p>${esc(r.principle)}</p></div><div class="roadmap-stages compact-roadmap" id="roadmap-stages">${r.stages.map(s=>`<article class="roadmap-stage" id="${anchor(s.id)}"><header class="roadmap-stage-head"><div><span class="eyebrow">${stateLabel(s.status)}</span><h2>${esc(s.title)}</h2></div><span class="roadmap-status">未立项</span></header><p class="roadmap-question">${esc(s.question)}</p><div class="roadmap-summary-grid"><div><strong>可能形成的成果</strong><p>${esc(s.artifact_name)}</p></div><div><strong>贡献边界</strong><p>${esc(s.contribution)}</p></div></div><details class="roadmap-detail"><summary>推进前需要确认什么</summary><div class="roadmap-detail-grid"><section><h3>证据要求</h3>${items(s.evidence)}</section><section class="roadmap-gate"><h3>继续条件</h3><p>${esc(s.gate)}</p><h3>收缩或停止</h3><p>${esc(s.stop)}</p></section></div></details></article>`).join('')}</div></div></section>
  <section class="section tinted" id="first-cycle"><div class="container"><div class="section-head"><div><span class="eyebrow">Next decision</span><h2>先选择一个值得核验的问题</h2></div><p>当前不指定方向顺序，也不把候选 artifact 写成已完成成果。</p></div><div class="roadmap-detail-grid"><section><h3>下一步行动</h3>${items(r.next_actions)}</section><section><h3>必须守住的边界</h3>${items(r.boundaries)}</section></div></div></section>`;
}
