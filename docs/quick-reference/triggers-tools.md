# Natural Language Triggers and Tools

Say what you want; map to the right command.

Common Triggers → Actions
- “Build X end‑to‑end” → `/orca Build X`
- “Plan this carefully first” → `/response-awareness-plan ...`
- “Implement the approved blueprint” → `/response-awareness-implement <path>`
- “Is this safe? What’s risky here?” → `/introspect ...`
- “Check how it looks” → `/visual-review <url or component>`
- “Prove it’s done” → `/finalize`
- “Find our past decision about ...” → `/memory-search ...`
- “Small UI tweak” → `/enhance ...`
- “I have ten questions for you” → `/survey`
- “Help me think this through” → `/ultra-think ...`
- “I want a better layout” → `/concept ...`
- “Explore a new design” → `/concept-new ...`

Tips
- Start with `/orca` for most feature work; add `/introspect` and Response Awareness as risk rises.
- Use `/finalize` before claiming “done.” Evidence beats opinion.
- Prefer `/memory-search` over manual hunting; Workshop remembers decisions and gotchas.

Where to find details
- Commands: `docs/quick-reference/commands.md`
- Agents/Teams: `docs/quick-reference/agents-teams.md`
