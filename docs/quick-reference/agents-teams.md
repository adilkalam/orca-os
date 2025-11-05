# Agents and Teams Overview

Vibe Code assembles small, purpose‑built teams. You confirm the team before work begins.

Categories
- Planning: requirement‑analyst, plan‑synthesis — clarify goals, produce blueprints
- Orchestration: workflow‑orchestrator, playbook‑curator, orchestration‑reflector — coordinate phases and learning
- Implementation: iOS (SwiftUI/SwiftData), Frontend (React/Next.js), Backend (Node/Go/Python), Mobile (RN/Flutter)
- Design: design‑system‑architect, UI designer, design‑dna‑linter, design‑reviewer
- Quality: verification‑agent, test‑engineer, quality‑validator

Typical Teams
- iOS feature: system‑architect, swiftdata‑specialist, state‑architect, swiftui‑developer, swift‑testing
- Frontend feature: frontend‑developer, api‑integrator, state‑architect, ui‑reviewer
- Backend feature: backend‑engineer, db‑specialist, api‑designer, test‑engineer
- Design pass: design‑system‑architect, UI designer, design‑reviewer

Selection Rules
- Start minimal. Add specialists only for known risks (security, performance, data migration, i18n).
- Always ask user to confirm the team.
- Swap agents, don’t grow the team, if the plan changes.

Verification Roles
- verification‑agent — proves claims by reading files, running builds/tests, capturing evidence
- test‑engineer — creates and runs tests
- quality‑validator — final readiness checks

Where to look
- agents/ — all agent specs
- commands/orca.md — orchestration behavior and confirmation rules
