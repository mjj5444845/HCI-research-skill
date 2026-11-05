# MeaningTrace Studio — three-workspace local application

## Run

Run `npm run build`, then `npm run preview`. Open `http://127.0.0.1:4173/assets/meaningtrace/#research`.

On first use, set a researcher password (at least eight characters). The researcher can prepare materials, create pseudonymous user IDs, and assign published materials. Each user receives an independent bearer-capability task link from the assignment page. These local URLs work only on the host computer. Remote deployment, HTTPS, recruitment, password recovery and production operations are not provided by this local release.

## Workspaces

- User: left material directory with search/status filter, separate saved progress per assignment, image enlargement, automatic draft saving, problem reports, three steps. Advancing step 1 locks the initial answer on the server and reveals the context. Step 3 allows editing step 2, then final submission makes answers read-only.
- Research: text/multiple image/context editing; public source notes versus researcher-only notes; draft/published/archived status; material duplication and preview; pseudonymous users, batch assignment, and cancellation of unstarted assignments. Each edit creates a new material version. Assignments keep immutable material snapshots.
- Overview: server-backed records across users, filters by user/material/status, original answer details, issue reports, researcher annotations, reasoned exclusions, audit history and JSON exports. Export includes original responses and material snapshots; it never includes user invitation tokens or researcher credentials.

## Data and access

The server stores the database and uploaded images under `local-data/meaningtrace/` (git-ignored), separate from generated `site/`. Back up this directory to preserve local work. `MEANINGTRACE_DATA_DIR` can point a separate test instance to another directory. Run only one server against a database directory.

Researcher sessions use HttpOnly SameSite cookies; passwords are salted scrypt hashes. User links identify one user and should not be shared beyond that user. The user API omits researcher notes and does not return background information until the initial answer is locked. Revision checks reject conflicting writes. Image paths are unguessable identifiers, but images are not individually authenticated; this is a local prototype, not a deployment for sensitive participant data.

The three seeded materials are fictional examples. Old browser-only v1 records are untouched and are not silently imported as research data. This release does not implement archival Reddit transcription, randomized conditions, arbitrary questions, automated collection, AI coding or study validation.

## Verification

- `node --test tests/meaningtrace.test.mjs`: authentication, user ownership, context visibility, initial lock, stale writes, version snapshots, submission, annotations and durable storage.
- `npm run build` and `npm run test:site`.
- Browser smoke test in isolated `.tmp` data: first setup/login, material upload/create, multiple assignment, user directory and drafts, reload persistence, review/edit/submit, researcher annotation/export and mobile overflow.

Generated demonstration image: `cat.png`, created for the interface on 2026-09-18.
