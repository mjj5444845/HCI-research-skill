# Research lifecycle and workspaces

This is the active lifecycle contract for Research Radar, Idea Development, Literature Investigation, Study Design, exam preparation and writing.

## Ownership and durable objects

- Paper facts: existing Paper Objects and state/paper-pages; stable slugs join records.
- Gap evidence, skepticism and history: research-programs/amsc/state/gap_registry.yaml. The dashboard remains a presentation projection, not a second authority.
- Field synthesis: state_of_field.yaml and its dashboard projection.
- Questions, validations, studies, pilots and decisions: research-programs/amsc/state/research_pipeline.json.
- Exam: comprehensive_exam.yaml and only dashboard.exam; never owns the Master Literature List.
- Writing: state/writing_workspace.json. Projects and materials refer to source IDs, never overwrite source claims.
- Update only the affected objects. Preserve human edits and existing timestamps/history.
- Sources, agent recommendations and researcher decisions must remain distinguishable.
- An empty collection means no recorded object; never invent questions, writing projects or pilot results to fill a page.

## Stage handoffs

1. Radar finds and deduplicates papers. Paper Investigation records actual access depth, claim/evidence, limitations and A–G topic buckets. A limitation is only a candidate gap.
2. Gap Curator aggregates independent evidence, common mechanisms, contradictions, closest work and skeptic objections. Repeated future-work statements do not count as independent evidence.
3. Idea Development creates a DRAFT question with statement, value, boundary, assumptions, gap_ids and paper_slugs. Real observations can also initiate questions. No minimum paper count automatically creates or promotes a question.
4. Validation records checked_at, search_scope, closest_work, sources, support, counterevidence, assessment and precise_statement. Sources may be papers, lab pages, systems, news or blogs; distinguish their evidential roles. Search must include alternate terms, adjacent work, anchors, citations and counterexamples. No-results is not proof of absence.
5. Assess importance, novelty, answerability, feasibility and mainline fit separately. Agents may recommend; PURSUE requires an explicit researcher decision recorded with date and rationale. Reframe, incubate, close or reopen instead of forcing promotion.
6. Study Design maps RQ to evidence, method, analysis and claim boundary. Record procedure, analysis, rationale, key risks, materials, resources, ethics requirements and alternatives. A method mismatch must lead to explicit RQ revision, additional study or another method.
7. Pilot targets a specific uncertainty and has pass/change/stop criteria before execution. Record kind (technical, simulation, protocol, measurement or participant), status, actual artifacts, completion time, report and design_changes. Generated plans and simulated participants are not human evidence.
8. A READY study needs a completed evidence-backed pilot, or an explicit justified pilot_waiver. Small pilots do not establish the main hypothesis. Keep exploratory findings distinguishable from confirmatory claims.

## Agent routing

| Trigger | Lead workflow / role | Independent contribution |
| --- | --- | --- |
| New literature | Radar / amsc_scout | Paper Investigation; theory mapper when substantive |
| Gap aggregation or major change | amsc_gap_curator | gap_red_team and missing_paper_attacker before consequential promotion |
| Candidate question | Idea Development | amsc_skeptic on importance, distinction and mainline fit |
| Novelty validation | Literature Investigation | novelty_domain_panel with relevant domain lenses |
| Basic design | Study Design | method_efficiency_advocate and human_evidence_advocate; computational-evaluation, quantitative, behavioral, culture and paradigm-appropriate qualitative auditors as relevant |
| Pilot report | Study Design | Relevant method auditor compares observations against predeclared criteria |
| Mainline decision | amsc_final_synthesizer | Synthesize disagreement, not a vote; researcher decides priority |
| Non-AMSC decision | senior_faculty_synthesizer | Same evidence and deliberation requirements |
| Graph / field changes | graph and current-state curators | Return traceable proposals; no project-promotion authority |

Specialized agents remain read-only. The primary agent writes accepted changes and checks links and state constraints.

## Downstream workspaces

Exam and writing select from the research program. Their deadlines, chapter structure and preferred narrative never redefine upstream facts.
- Exam personal reading/mastery changes only from researcher evidence, never from agent reading status.
- Writing projects store title, description, outline, draft and dated revisions.
- Writing materials may begin in the inbox without project_id. Store title, content, section, paper_slugs, question_ids, source_checked_at, URL and next_action.
- When an upstream paper is newer than source_checked_at, the page marks the material for review. Unknown check dates remain explicitly unverified. Do not automatically overwrite drafts.
- A correction discovered downstream returns as a proposed, separately reviewed upstream update.

## Operation

The first release is a generated reading workspace, maintained through the agent. Browser controls search and filter; they do not launch jobs or save state.
After state changes: npm run build, npm run test:site. After workflow/state-topology changes: npm run validate.
Use schemas/research-pipeline.schema.json and schemas/writing-workspace.schema.json as field contracts. Run node --test tests/research-workspace.test.mjs for lifecycle guard checks.

## 中文阅读呈现

论文、研究空白和问题页面默认使用通俗中文。先说明具体做法与发现，再说明证据不能支持什么，以及与研究主线的关系。不要用连续英文术语代替解释。中文标题标为工作译名，保留英文原标题、作者、出处和来源用于检索。例子须明确是解释性示例，不能写成实验结果。

网页阅读内容维护在 `state/reading_zh.json`，原始审查记录仍作为证据来源。新增或修订论文、Gap、问题时，同时核对对应中文解读并更新来源哈希；源记录变化而解读未核对时，网页提示待复核。翻译或通俗改写不得改变研究状态、优先级、研究者决定及实际实验完成情况。

## Program scope migration (2026-09-18)

Current scope is program v2.0. A–G labels are defined in program.yaml; old paper IDs remain stable and no longer imply the new category. archives/2026-09-18-mainline-v1 preserves all pre-migration records including uncommitted work. Deferred robot material and old RQ/validation/study bundles are absent from current site projections. Archival does not resolve a scientific gap. New specific RQs require question development; direction approval is not PURSUE. Do not run legacy import or integration scripts against v2 state.

Select evidence by contribution: computational validation is a first-class study design; human-study and qualitative audits are conditional. After scope changes validate every paper, gap, question, graph and downstream reference and rebuild Chinese source hashes only for reviewed edits.

## Artifact roadmap approval (2026-09-18)

Program v2.1 supersedes the earlier v2.0 direction-only snapshot. The user approved AMSC × FailureTrace as one mainline with tangible artifacts at every stage and website publication. program.yaml#artifact_roadmap owns stages, interface blueprints, deliverables, evidence gates, dependencies and official capability references; the website reads it directly.

Actual implementation, validation and release require artifact evidence. Roadmap approval does not establish novelty or study readiness. The current priority is MeaningTrace Studio plus a minimal FrictionBench protocol. Model and application work may proceed in parallel. Laboratory references support inferred capability fit, never collaboration or adoption claims. Exam and writing remain independent downstream workspaces.
