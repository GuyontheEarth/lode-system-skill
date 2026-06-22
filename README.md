# LODE System Skill

LODE is a local-first knowledge system for agentic software work. It keeps durable project truth in a small `lode/` folder instead of scattering decisions across chats, work logs, and one-off documents.

This repository contains an installable Codex skill that teaches an agent how to work from a LODE system:

- read the durable knowledge map before planning;
- compare intended behavior with real code and database evidence;
- keep source-of-truth rules, invariants, role boundaries, and cross-feature relationships in LODE;
- keep short-term job evidence in project memory;
- update LODE before handoff when product behavior, architecture, or data authority changes.

## Install

Copy `skills/lode-system` into your local skills folder.

For Codex:

```bash
mkdir -p ~/.agents/skills
cp -R skills/lode-system ~/.agents/skills/
```

Then start a new Codex session and ask to use `$lode-system` in a repository that has a `lode/` folder.

## Bootstrap A New Project

If the project does not have LODE yet, give your agent the bootstrap interview prompt:

[skills/lode-system/references/bootstrap-interview-prompt.md](skills/lode-system/references/bootstrap-interview-prompt.md)

The prompt tells the agent to interview you first, then create the initial LODE files from your answers. This is usually better than asking an agent to invent project docs from a quick summary.

## Recommended Project Shape

```text
your-project/
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
  scripts/
    PROJECT_MEMORY.md
```

The exact folder names can vary. The important idea is stable ownership:

- LODE stores durable product and engineering truth.
- Project memory stores short-term job state and verification evidence.
- Code and database state remain current implementation evidence.

## License

MIT
