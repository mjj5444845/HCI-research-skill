# Senior Researcher OS State

This directory is the general, project-local durable state layer. The AMSC-specific state remains under `research-programs/amsc/state/`.

`paper-pages/` contains one validated JSON record per paper selected for the public site. These records drive independent pages under `papers/<slug>/`; they complement the aggregate `papers.yaml` index rather than replacing it.

Update rules:

- Preserve stable IDs and append timestamped change-log entries.
- Deduplicate papers by DOI first, then normalized title plus year; retain arXiv, conference, and journal aliases.
- Every consequential claim or graph edge must carry provenance and an evidence status.
- Never replace a human correction silently. Add a new versioned proposal and retain the prior value.
- Use ISO 8601 timestamps with an explicit timezone.
- Treat inaccessible full text as metadata-only evidence.
