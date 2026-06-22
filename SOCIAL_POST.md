# Social Post Draft

LODE is a small project knowledge system for working with AI coding agents.

The basic problem is that chat history is a poor place to keep project truth. It gets long, disappears between sessions, and mixes durable decisions with temporary notes. LODE moves the durable part into the repository.

A project using LODE usually has a `lode/` folder with:

- `lode-map.md` as the index
- `summary.md` for the product/project purpose
- `terminology.md` for shared language
- `practices.md` for how agents should work in the repo
- architecture, data, feature, operations, and plan files
- `tmp/` for scratch notes that should not become durable truth

It also uses a compact project-memory file for current job state and handoff evidence.

The workflow is straightforward:

1. The agent starts by reading the LODE map, summary, terminology, practices, and the relevant feature or architecture docs.
2. It checks the actual code and database before claiming what the software currently does.
3. It makes the change.
4. If behavior, source-of-truth ownership, role authority, architecture, or feature relationships changed, it updates LODE before handoff.
5. It records short-term verification evidence in project memory.
6. It hands back what changed, what was verified, and what still needs manual checking.

The distinction matters:

- LODE is durable project truth.
- Project memory is short-term operational state.
- Code and database state are current implementation evidence.

This does not make agents magically correct. It gives them a stable place to start, a way to compare intent with reality, and a habit of updating the project knowledge after meaningful changes.

I turned the workflow into a small Codex skill so other people can adapt it:

https://github.com/GuyontheEarth/lode-system-skill

Image: `assets/social/lode-system-social.png`
