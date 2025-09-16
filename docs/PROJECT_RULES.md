# PROJECT_RULES.md — Paste into Cursor Rules (Project)

## Project Awareness & Context
- Always read `PLANNING.md` at the start of a session.
- Check and update `TASK.md` before/after each task.
- Keep naming and structure consistent with the plan.

## Code Structure & Modularity
- Never exceed 500 LOC per file—split into modules.
- Group by feature; prefer clear relative imports.

## Testing & Reliability
- For new components, add at least one test (unit or snapshot).
- After logic changes, update affected tests.

## Task Completion
- Mark tasks done in `TASK.md` and log discoveries in “Discovered During Work”.

## Style & Conventions
- Use Prettier; keep components typed; document props.
- Comment non‑obvious logic with a brief “// Reason: …” note.

## AI Behavior
- Don’t assume missing context—ask.
- Don’t invent libraries or paths—verify existence first.
- Don’t delete code unless the task says so.
