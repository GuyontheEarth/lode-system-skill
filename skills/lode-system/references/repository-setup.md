# LODE Repository Setup

Use this reference when a repository is adopting LODE rather than merely using an existing LODE folder.

## Start With An Interview

Use [bootstrap-interview-prompt.md](bootstrap-interview-prompt.md) for the first setup pass. The initial LODE is only useful if it captures the user's real project context, so the agent should interview the user before writing the files.

The setup interview should collect:

- project purpose and intended users;
- current implementation state;
- important workflows and roles;
- source-of-truth data and external systems;
- architecture and operational constraints;
- verification commands and manual checks;
- known risks, unresolved decisions, and terminology.

If the user does not know an answer, record it as unknown or planned. Do not invent authority that has not been confirmed.

## Minimal LODE Files

```text
lode/
  lode-map.md
  summary.md
  terminology.md
  practices.md
  architecture/
  data/
  features/
  operations/
  plans/
  tmp/
```

## File Responsibilities

- `lode-map.md` is the index. Agents should start here instead of searching blindly.
- `summary.md` explains the product purpose, priorities, operating model, and knowledge contract.
- `terminology.md` keeps domain language consistent.
- `practices.md` defines how agents read, update, verify, and hand off LODE-guided work.
- `architecture/` records durable layer ownership and boundaries.
- `data/` records source-of-truth ownership, snapshots, read models, and database mutation contracts.
- `features/` records intended behavior, current behavior, role access, source-of-truth rules, invariants, warnings, blockers, and cross-feature relationships.
- `operations/` records setup and verification commands.
- `plans/` stores approved implementation plans.
- `tmp/` stores session scratch notes and handovers that are not durable truth.

## Project Memory

Use one compact project-memory file for current job state and handoff evidence. Keep durable product truth out of project memory.

Useful entry fields:

```text
JOB TITLE:
DATE:
OBJECTIVE:
IMPACT KEYS:
CONFLICT WAVE:
WHAT WAS DONE:
FILES TOUCHED:
DECISIONS LOCKED:
VERIFICATION EVIDENCE:
DB/RLS CHANGES:
PENDING ACTIONS:
SUGGESTED IMPROVEMENT:
```

## Interactive LODE Graph

After the initial interview has produced the LODE files, generate a project-specific graph:

```bash
node ~/.agents/skills/lode-system/scripts/create-lode-graph.mjs --root . --out lode/lode-graph.html
```

The generator scans `lode/`, builds nodes from markdown files and headings, follows markdown links, and writes a self-contained HTML graph. If the installed skill lives somewhere other than `~/.agents/skills/lode-system`, locate `scripts/create-lode-graph.mjs` inside that skill folder and run it from there.

Include `lode/lode-graph.html` in the setup handoff. It is a visual onboarding artifact: useful for seeing the project shape, but the markdown LODE files remain the durable source of truth.

## Change Rule

Before a feature change, read its LODE file and inspect the code paths it names. Before handoff, update the file if intended behavior, current behavior, source of truth, role authority, relationships, or failure modes changed.
