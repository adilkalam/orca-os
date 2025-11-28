# OS 2.4 Shopify Lane Readme

**Lane:** Shopify Themes  
**Domain:** `shopify`  
**Entrypoints:** `/plan`, `/orca`, `/orca-shopify`, `/project-memory`, `/project-code`

This readme describes the Shopify lane, which handles Shopify theme
development (Liquid, sections, theme structure).

---

## 1. When to Use the Shopify Lane

Use for Shopify theme work:

- Liquid templates (`layout/theme.liquid`, `sections/*.liquid`, `snippets/*.liquid`)
- Section schema changes
- Theme CSS/JS used in Shopify

Examples:

- “Add a new hero section with configurable background”
- “Fix cart drawer behavior on mobile”
- “Update product grid styling”

---

## 2. Core Commands

### 2.1 Planning – `/plan`

- For larger theme changes:
  - Use `/plan "..."` to create a spec under `.claude/requirements/`.
  - Complex theme features should have specs.

### 2.2 Global Orchestrator – `/orca`

- Detects Shopify work and routes to `/orca-shopify` after memory and
  ProjectContext.

### 2.3 Shopify Orchestrator – `/orca-shopify`

File: `commands/orca-shopify.md`

- Accepts:

  ```bash
  /orca-shopify "fix card spacing"                     # Default: light + gates
  /orca-shopify -tweak "try different padding"        # Tweak: light, no gates
  /orca-shopify --complex "implement cart drawer"     # Complex: full pipeline
  ```

- **Three-Tier Routing (OS 2.4):**

  | Mode | Flag | Path | Gates |
  |------|------|------|-------|
  | **Default** | (none) | Light + Gates | YES |
  | **Tweak** | `-tweak` | Light (pure) | NO |
  | **Complex** | `--complex` | Full pipeline | YES |

- Routes to specialists:
  - `shopify-css-specialist`
  - `shopify-liquid-specialist`
  - `shopify-section-builder`
  - `shopify-js-specialist`
  - `shopify-theme-checker`

Pipeline doc:

- `docs/pipelines/shopify-pipeline.md`
- `docs/reference/phase-configs/shopify-phase-config.yaml`

---

## 3. Agents and Skills

### Heavy Lane Agents (Complex Mode)

- `agents/shopify/shopify-grand-architect.md` - Coordinates full pipeline
- `agents/shopify/shopify-css-specialist.md`
- `agents/shopify/shopify-liquid-specialist.md`
- `agents/shopify/shopify-section-builder.md`
- `agents/shopify/shopify-js-specialist.md`
- `agents/shopify/shopify-theme-checker.md`

### Light Lane Agent

- `agents/shopify/shopify-light-orchestrator.md`
  - Handles **default** and **tweak** modes.
  - Direct delegation to specialists.
  - **Default mode**: Runs gate (`shopify-theme-checker`)
  - **Tweak mode** (`-tweak`): Skips gates (user verifies)

Skills:

- `skills/liquid-quick/SKILL.md`
- `skills/shopify-theme/SKILL.md`

---

## 4. Memory & RA

- `/project-memory` collects theme incidents and decisions.
- `/project-code` indexes theme files and can be used to quickly find
  reusable section/snippet patterns.
- RA integration is lighter here today than in Next.js/iOS/Expo but can
  be extended using the same patterns.

---

## 5. Mental Model

For Shopify work in OS 2.4 (three-tier routing):

| Mode | Command | Path |
|------|---------|------|
| **Default** | `/orca-shopify "fix spacing"` | Light + gates |
| **Tweak** | `/orca-shopify -tweak "try color"` | Light, no gates |
| **Complex** | `/orca-shopify --complex "new section"` | Full pipeline |

- **Most work**: Default mode (light path WITH gates)
- **Exploration**: Tweak mode (light path, no gates, you verify)
- **Features**: Complex mode (full pipeline, spec required)
