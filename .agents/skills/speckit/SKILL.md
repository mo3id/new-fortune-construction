---
name: speckit
description: Run Spec Kit workflows from Codex in this repository. Use when the user asks for Spec Kit, speckit, specifications, plans, tasks, implementation from a spec, checklist/analyze workflows, constitution updates, or old /speckit.* command equivalents in Codex.
---

# Spec Kit

Use this skill as the Codex-facing entrypoint for the project's existing Spec Kit setup.

The source Spec Kit assets live in `.specify/`. The original generated command prompts live in `.opencode/command/`; treat those files as workflow references, not as OpenCode-only commands. Ignore OpenCode frontmatter keys such as `handoffs` and `agent` unless their intent is useful as a next-step suggestion.

## Workflow Routing

When the user asks for a Spec Kit operation, read the matching command file before acting:

- Specification: `.opencode/command/speckit.specify.md`
- Clarification: `.opencode/command/speckit.clarify.md`
- Plan: `.opencode/command/speckit.plan.md`
- Tasks: `.opencode/command/speckit.tasks.md`
- Implementation: `.opencode/command/speckit.implement.md`
- Analysis: `.opencode/command/speckit.analyze.md`
- Checklist: `.opencode/command/speckit.checklist.md`
- Constitution: `.opencode/command/speckit.constitution.md`
- Git hooks/utilities: `.opencode/command/speckit.git.*.md`
- Task-to-issues: `.opencode/command/speckit.taskstoissues.md`

For a quick command map and Codex-specific adjustments, read `references/codex-workflows.md`.

## Codex Rules

- Accept natural language requests such as "استخدم Spec Kit اعمل spec للميزة..." or "$speckit plan".
- Prefer normal Codex execution over literal slash-command behavior.
- Use `.specify/scripts/bash/*.sh` when the referenced workflow tells you to run setup or prerequisite scripts.
- Respect `AGENTS.md` and `.specify/memory/constitution.md` as project authority.
- Preserve `.opencode/command/` for compatibility; do not delete it during Codex conversion.
