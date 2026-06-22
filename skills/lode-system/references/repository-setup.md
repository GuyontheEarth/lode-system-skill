# LODE Repository Setup

Use this reference when a repository is adopting LODE rather than merely using an existing LODE folder.

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

## Change Rule

Before a feature change, read its LODE file and inspect the code paths it names. Before handoff, update the file if intended behavior, current behavior, source of truth, role authority, relationships, or failure modes changed.
