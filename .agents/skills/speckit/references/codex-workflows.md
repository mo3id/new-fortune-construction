# Codex Workflow Map

Use these equivalents when a user types an old slash command or asks in natural language.

| User intent | Codex action |
| --- | --- |
| `/speckit.specify <description>` | Read `.opencode/command/speckit.specify.md`, create/update `specs/<feature>/spec.md`, and persist `.specify/feature.json`. |
| `/speckit.clarify` | Read `.opencode/command/speckit.clarify.md`, ask only high-impact clarification questions, and update the active spec. |
| `/speckit.plan` | Read `.opencode/command/speckit.plan.md`, run `.specify/scripts/bash/setup-plan.sh --json`, then create/update `plan.md`, `research.md`, `data-model.md`, `contracts/`, and `quickstart.md` as applicable. |
| `/speckit.tasks` | Read `.opencode/command/speckit.tasks.md`, run prerequisites/setup scripts as instructed, and generate `tasks.md`. |
| `/speckit.implement` | Read `.opencode/command/speckit.implement.md`, execute tasks from `tasks.md`, and verify with project tests/builds. |
| `/speckit.analyze` | Read `.opencode/command/speckit.analyze.md` and report inconsistencies across `spec.md`, `plan.md`, and `tasks.md`. |
| `/speckit.checklist` | Read `.opencode/command/speckit.checklist.md` and create/update checklist artifacts. |
| `/speckit.constitution` | Read `.opencode/command/speckit.constitution.md` and update `.specify/memory/constitution.md`. |

Codex-specific adjustments:

- Replace `$ARGUMENTS` with the user's actual request text.
- Treat OpenCode `handoffs` as suggested follow-ups in the current Codex thread.
- When a workflow says to output `EXECUTE_COMMAND`, execute the referenced local command directly if it is safe and permitted.
- If a git hook wants to commit or branch, follow Codex git safety rules and avoid destructive commands.
