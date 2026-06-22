# Bootstrap LODE Interview Prompt

Copy this prompt into an agent when setting up LODE for a new or existing project. It is designed to gather the initial durable knowledge by interview before any files are written.

```text
I want to set up a LODE system for this project.

LODE is the durable project knowledge layer. It should describe intended behavior, current implementation evidence, source-of-truth ownership, role and access boundaries, invariants, feature relationships, operating rules, verification commands, and approved plans. It should not become a changelog or a pile of temporary notes.

Your job is to interview me first, then create the initial LODE files from my answers.

Important rules:

- Do not write the LODE files until you have asked the setup questions and summarized what you understood.
- Ask questions in practical groups. If the project is small, keep the interview lightweight. If the project is complex, go deeper.
- Do not invent facts. If something is unknown, write it as unknown, planned, or needs verification.
- Separate intended behavior from current implementation evidence.
- Treat code, database state, live configuration, and tests as current evidence, not automatically as intended product truth.
- Keep durable project truth in `lode/`.
- Keep temporary setup notes in `lode/tmp/`.
- Create or recommend one compact project-memory file for short-term job state and handoff evidence.
- After the initial LODE files exist, generate a project-specific interactive HTML graph and present it to me.
- Keep the first version useful and concise. It can be expanded as real work happens.

Start by interviewing me on these areas:

1. Project identity
   - What is the project called?
   - What problem does it solve?
   - Who uses it?
   - What does a good outcome look like?

2. Current state
   - Is this a new project, prototype, live product, internal tool, or production system?
   - What already exists in code, data, docs, deployments, or manual process?
   - What parts are reliable, incomplete, experimental, or deprecated?

3. Users, roles, and permissions
   - What user roles exist?
   - What should each role be allowed to see or change?
   - What data or actions are sensitive?
   - What boundaries must never be crossed?

4. Core workflows
   - What are the main workflows users perform?
   - What starts each workflow?
   - What data does each workflow consume?
   - What does each workflow produce?
   - What should block, warn, or fail closed?

5. Source of truth
   - Which records, files, services, or people are authoritative for each important decision?
   - Which data is derived, cached, imported, or historical evidence?
   - Which mutations must be atomic or carefully guarded?
   - What should happen when source data and generated/read-model data disagree?

6. Architecture
   - What is the current stack?
   - What are the major layers or modules?
   - Where should business logic live?
   - What should route handlers, UI components, services, repositories, jobs, or database functions avoid doing?
   - What architecture boundaries should agents protect?

7. Operations and verification
   - How do you install, run, build, test, and verify the project?
   - Which checks are fast and expected on most changes?
   - Which checks are expensive, live, risky, or user-owned?
   - Are there local links, health checks, staging environments, or manual QA steps?

8. External systems and data safety
   - What external services does the project use?
   - Which credentials, secrets, customer data, financial data, personal data, or regulated data need special handling?
   - What should agents never do without explicit approval?

9. Existing docs and terminology
   - What docs already exist?
   - Which docs are still reliable?
   - What terms must be used consistently?
   - What names, old concepts, or confusing labels should be avoided?

10. Roadmap and unresolved decisions
   - What is planned but not built?
   - What known bugs or risks matter most?
   - What decisions are still open?
   - What should future agents ask before changing?

After the interview:

1. Summarize what you understood in plain language.
2. Ask me to correct anything important.
3. Create this initial structure unless the project needs a small variation:

```text
lode/
  lode-map.md
  summary.md
  terminology.md
  practices.md
  architecture/
    summary.md
  data/
    source-of-truth.md
  features/
    overview.md
  operations/
    setup-and-verification.md
  plans/
    README.md
  tmp/
    .gitkeep
```

4. Create or recommend a compact project-memory file for current job state and handoff evidence.
5. Link the LODE files from `lode/lode-map.md`.
6. Include a clear "how agents should start work" section in `lode/practices.md`.
7. Include verification and manual-testing boundaries in `lode/operations/setup-and-verification.md`.
8. Generate the interactive graph from the completed LODE files:

```bash
node ~/.agents/skills/lode-system/scripts/create-lode-graph.mjs --root . --out lode/lode-graph.html
```

If the skill is installed somewhere else, locate `scripts/create-lode-graph.mjs` inside the installed `lode-system` skill. If that script is unavailable, create a self-contained `lode/lode-graph.html` with the same idea: a force-directed graph of the project LODE files, clusters, headings, and links.

9. End by listing what was created, what remains unknown, what I should review, and the graph file I can open.
```

## Notes For The Agent

The goal of the interview is not to gather every possible detail. The goal is to get enough durable context that future agent sessions can start from the project truth instead of reconstructing it from chat history.

Use the user's answers as the authority for intended behavior. Use the repository as evidence for current behavior. When those disagree, record the disagreement clearly rather than smoothing it over.
