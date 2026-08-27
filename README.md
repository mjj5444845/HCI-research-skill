# Senior Researcher OS — Starter Kit v0.1

这是一个面向 HCI / CSCW / Human-AI Interaction / HRI / Cross-cultural Research / Cultural AI / AI Policy 的科研协作 starter kit。

目标不是“让 AI 帮忙总结论文”，而是把 AI 组织成一个 **Senior Faculty Collaborator**：

- 可以作为 research assistant、senior researcher、PI/advisor、reviewer、collaborator；
- 默认主动质疑，不服从错误前提；
- 证据优先于用户假设和模型直觉；
- 允许明确输出 `Insufficient Evidence`；
- 以真实、有趣的社会/使用现象为研究起点；
- 反对 obvious result、AI 套壳、强行上价值和纯讲故事；
- 重视 feasibility、效率、RQ–method alignment 和真正只有研究后才能得到的结论；
- 支持多 Agent 辩论，而不是单 Agent 武断裁决；
- 持续积累 Paper / Literature / Research / Claim / Author-Lab Graph 等研究对象。

## 当前已实现的 8 个 workflow skills

1. `senior-researcher-core`
2. `paper-investigation`
3. `literature-investigation`
4. `idea-development`
5. `study-design`
6. `research-radar`
7. `research-program-guardrail`
8. `comprehensive-exam`

Proposal、Paper Writing、Review & Revision 先保留为未来扩展，不在 v0.1 强行补完。

## 推荐目录

```text
senior-researcher-os/
├── AGENTS.md
├── CODEX_BOOTSTRAP.md
├── skills/
├── agents/
├── schemas/
├── config/
├── workflows/
├── templates/
└── memory/
```

## 给 Codex 的第一句话

把整个文件夹放进一个新 repo，然后对 Codex 说：

> Read `CODEX_BOOTSTRAP.md` and implement this Senior Researcher OS. Preserve the research principles and workflows, but reorganize files if needed for native Codex Skills/Agents/Automation conventions. Do not flatten distinct roles into one generic prompt. Build the smallest working version first, validate each workflow, then add scheduling for Research Radar.

## 设计原则

### 1. Evidence > narrative
任何重要判断尽可能给出证据来源与推理链，不为了“形成故事”而补齐不存在的因果关系。

### 2. Critique is always on
默认保持 reviewer / red-team mode。攻击不是为了否定，而是为了发现 gap、边界条件、争议、错误逻辑和 future work。

### 3. Do not silently narrow research questions
如果 evidence 只能回答部分 RQ，必须把选项显式交给 researcher：
- 缩窄 RQ
- 增加 study
- 换 method
- 拆 project
- defer

### 4. Maximum defensible claim
不 overclaim，也不把所有结论缩成无意义的 niche 描述。寻找“证据支持的最大且有意义的 claim”。

### 5. Multi-agent before high-stakes research judgment
Novelty、gap、method、culture、qualitative rigor、跨学科 connection 等高争议判断默认允许多 Agent 给独立意见，再由 Senior Faculty Synthesizer 汇总。

### 6. Human deliberation for consequential decisions
Agent 可以说：
- `DROP`
- `REFRAME`
- `INCUBATE`
- `PURSUE`

但对重要研究方向、proposal 是否放弃、文化定义、贡献最终定性等问题，应给研究者商榷空间。

## Research Radar

`research-radar` 是 recurring workflow。它应：

1. 根据 research interest profile 搜最新论文；
2. 去重；
3. Triage；
4. 对高价值论文调用 Paper Investigation；
5. 更新 Literature Map；
6. 更新 Author/Lab/Intellectual Lineage Graph；
7. 运行 Missing-Paper / Novelty / Gap checks（按需要）；
8. 输出 Daily/Weekly Brief。

定时策略见 `config/research_radar.example.yaml` 与 `workflows/research-radar-scheduling.md`。

## 未来扩展

- proposal-development
  - NSF
  - NIH
  - industry
- paper-development
- review-paper
- revision-response
- contribution-taxonomy
- theory-finder
- cross-cultural-methods
- AI-era-HCI-methods
- venue adapters
  - CHI
  - CSCW
  - UIST
  - HRI
  - FAccT
  - ACL/EMNLP
  - NeurIPS/ICML/ICLR

---

# v0.1 Mainline Update — AMSC

This same **v0.1** now includes the user's active PhD research program:

> **Adaptive Multimodal Social Communication for Embodied AI**

Research identity:

> **I study how humans and embodied AI agents develop adaptive, socially meaningful multimodal communication through situated interaction.**

New components:
- `research-programs/amsc/PROGRAM.md`
- `research-programs/amsc/program.yaml`
- persistent Master Literature List state
- persistent Gap Registry
- persistent Current State of Field
- persistent Comprehensive Exam KB
- persistent Research Graph
- `research-program-guardrail`
- `comprehensive-exam`
- AMSC-specific Research Radar behavior
- AMSC-specific paper/idea/study mappings
- program-specific Scout / Theory Mapper / Gap Curator / Exam Curator / Current-State Curator agents

The Senior Researcher OS remains general-purpose.
AMSC is the active personal research-program layer, not a replacement for the general research workflows.

## 当前工作区部署

本目录已经按 Codex 项目级约定部署：

- `.agents/skills/`：8 个可自动/显式调用的 research skills；
- `.codex/agents/`：独立的 reviewer、method、culture、graph 与 AMSC agents；
- `state/`：通用、可追溯的持久研究状态；
- `research-programs/amsc/state/`：AMSC 专属持久状态；
- `config/research_radar.yaml`：启用中的 Radar 配置；
- `scripts/validate-install.ps1`：部署验证；
- `scripts/run-research-radar.ps1`：本地/Task Scheduler 入口（先用 `-DryRun` 验证）。

## GitHub Pages

网站由 `scripts/build-site.mjs` 从真实项目文件生成到未跟踪的 `site/` 目录：

```powershell
npm run build
npm run test:site
npm run preview
```

站点包含 Skill/Agent 独立详情页、TOML 与 orchestration 架构可视化，以及由 `state/paper-pages/*.json` 驱动的一篇论文一个页面。论文 JSON 必须符合 `schemas/paper-page.schema.json`；没有足够证据时明确显示 `Insufficient Evidence`，不从标题推断 findings。

AMSC 还有三个数据驱动页面：`/field-map/` 展示 cumulative field claims 与 Gap Registry，`/exam/` 展示 comprehensive exam 的六主题、Top 20 与写作准备，`/program/` 展示 Meaning → Grounding → Convention → Adaptation → Embodied Communication 研究主线及反馈关系。它们读取 `research-programs/amsc/state/workflow_dashboard.json`；相关 research workflow 完成后必须同步这一状态，但不得自动推断研究者已经阅读或掌握论文。

AMSC 的 41 篇 `Master Literature List v1.0` 原文保存在 `research-programs/amsc/imports/`。运行 `npm run import:literature` 会重建 41 个 baseline 记录及 5 个独立标记的 search candidates，并同步 `research-programs/amsc/state/master_literature.yaml`。候选不会静默并入用户定义的 baseline。

一次性的 `AMSC Top 20 Paper Investigation` Codex Automation 安排在 America/New_York 2026-08-27 03:00。它只更新 Agent investigation readiness；`researcher_progress` 为受保护字段。

推送 `main` 后，`.github/workflows/pages.yml` 会构建并发布 GitHub Pages。

Codex 通常会自动检测 skill 变更；如果当前会话未显示新 skills，请重启 Codex 或开启一个新任务。
