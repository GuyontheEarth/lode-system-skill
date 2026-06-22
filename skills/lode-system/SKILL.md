---
name: lode-system
description: Use when working in a repository with a LODE knowledge system: user mentions LODE, lode-map.md, project memory, source-of-truth docs, durable project contracts, architecture knowledge, feature intent, impact metadata, conflict waves, or aligning code/database/docs with documented behavior.
---

# LODE System

## Overview

LODE is a durable project knowledge layer: intended behavior, current evidence, source-of-truth ownership, invariants, role boundaries, relationships, and approved plans. Treat live code and database state as current implementation evidence, and use project memory only for short-term job state and handoff proof.

## Start Workflow

1. Read project-level agent instructions first.
2. Locate the LODE root, usually `lode/`, and read `lode-map.md`, `summary.md`, `terminology.md`, and `practices.md` when they exist.
3. Read the repo's short-term project memory when the project defines one.
4. Use the LODE map, feature overview, and any impact-query command to choose the relevant feature, architecture, data, operations, or plan files.
5. Inspect real code and database evidence before claiming current behavior. LODE intent alone is not proof that implementation already matches.
6. If LODE and implementation disagree, do not silently let either side win. Treat code/database as current evidence, preserve product intent explicitly, then repair the implementation or update LODE to describe verified current reality and follow-up work.

## Ownership Rules

- Put durable product, feature, architecture, data, source-of-truth, role-authority, invariant, and cross-feature knowledge in LODE.
- Put temporary investigations, scratchpads, and handovers in the repo's temporary LODE area when one exists.
- Keep project memory compact: active job state, verification evidence, touched LODE files, pending manual checks, and exact handoff details.
- Do not turn LODE into a changelog. Rewrite files so they describe current reality, intended behavior, and remaining plans clearly.
- Use relative links between LODE files and keep files focused.
- Apply required database changes through the project's approved operator path when the project says to do so.

## Impact And Planning

Use impact metadata when a change may cross feature, data, route, verification, or source-truth boundaries:

```text
IMPACT KEYS: feature:orders, table:site_menu_allocations, route:/api/orders, verification:lode:check
CONFLICT WAVE: source-truth:menu-allocation
```

If a graph or impact command exists, run it before broad edits to find likely LODE files, source tables, routes, manual checks, and unsafe parallel-work areas. Generated diagrams and reports belong in ignored output folders unless the project explicitly makes them durable docs.

## Editing Discipline

- Before changing feature behavior, read the feature contract and any approved plan or template the repo names.
- Update the relevant LODE file before handoff when intended behavior, current behavior, data authority, role authority, architecture, failure modes, or feature relationships changed.
- For docs-only work, update LODE only when durable project truth changed.
- For persistent test data, use disposable markers, clean up where possible, and verify no residue before handoff.
- Respect the project's testing boundary. If live or visual checks are user-owned, provide exact manual checks instead.

## Verification And Handoff

Run focused verification scaled to the work. For LODE edits, include the repo's LODE check when one exists. For source-truth or database work, include relevant operator/database checks.

When setting up LODE for a new repository, generate a project-specific interactive graph after the initial LODE files exist:

```bash
node ~/.agents/skills/lode-system/scripts/create-lode-graph.mjs --root . --out lode/lode-graph.html
```

If the skill is installed somewhere else, locate `scripts/create-lode-graph.mjs` inside the installed `lode-system` skill. Include the generated graph path in the handoff so the user can open it.

Handoff with:

- what changed and where;
- verification that actually ran;
- database/security/data changes, including none;
- pending manual checks;
- current local link when the project requires one.

## Reference

Read [references/repository-setup.md](references/repository-setup.md) when setting up or adapting LODE conventions in a new repository. Use [references/bootstrap-interview-prompt.md](references/bootstrap-interview-prompt.md) when the repository does not yet have enough durable project knowledge. The graph generator uses [assets/lode-graph-template.html](assets/lode-graph-template.html) and writes a self-contained HTML file from the repository's LODE markdown.
