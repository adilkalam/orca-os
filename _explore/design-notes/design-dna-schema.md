# Design-DNA JSON Schema – OS 2.0

**Status:** Draft schema for implementation/gate agents  
**Source of Truth:** Project-specific `design-system-vX.X.md`, `bento-system-vX.X.md`, `CSS-ARCHITECTURE.md`

This document defines the expected shape of `design-dna.json`, the machine‑readable
design system that OS 2.0 agents use. Human‑authored design docs remain the
authoritative source; `design-dna.json` is the synchronized JSON mirror that
implementation and gate agents consume.

The generator that produces `design-dna.json` from markdown is not implemented
here, but MUST conform to this schema.

---
## 1. Top-Level Structure

```jsonc
{
  "version": "2.3",
  "source_docs": {
    "design_system": "design-system-v2.3.md",
    "bento_system": "bento-system-v2.2.md",
    "css_architecture": "CSS-ARCHITECTURE.md"
  },
  "tokens": { ... },
  "components": { ... },
  "rules": { ... },
  "css_architecture": { ... },
  "metadata": { ... }
}
```

---
## 2. Tokens

### 2.1 Typography Tokens

```jsonc
"tokens": {
  "typography": {
    "fonts": {
      "display": { "token": "--font-display", "family": "Domaine Sans Display", "roles": ["card_title", "page_title"] },
      "title":   { "token": "--font-title",   "family": "GT Pantheon Display",  "roles": ["article_subtitle"] },
      "subtitle":{ "token": "--font-subtitle","family": "GT Pantheon Text",     "roles": ["tagline", "quote"] },
      "body":    { "token": "--font-body",    "family": "Supreme LL",           "roles": ["body_text", "list"] },
      "mono":    { "token": "--font-mono",    "family": "Unica77 Mono",         "roles": ["code"] }
    },
    "scales": {
      "display": [
        { "name": "display-1", "size_px": 96, "line_height": 1.05, "weight": 200 },
        { "name": "display-2", "size_px": 72, "line_height": 1.05, "weight": 200 }
      ],
      "heading": [
        { "name": "h1", "size_px": 40, "line_height": 1.1, "weight": 200 },
        { "name": "h2", "size_px": 32, "line_height": 1.1, "weight": 300 }
      ],
      "body": [
        { "name": "body-1", "size_px": 16, "line_height": 1.5, "weight": 400 },
        { "name": "body-2", "size_px": 14, "line_height": 1.5, "weight": 400 }
      ]
    },
    "minimums": {
      "card_title_px": 32,
      "article_heading_px": 28,
      "body_text_px": 14
    }
  },
```

Agents MUST:
- Use the font tokens (`--font-*`) and named sizes instead of raw families/sizes.
- Respect `minimums` as hard constraints.

### 2.2 Color Tokens

```jsonc
  "colors": {
    "palette": {
      "background": { "token": "--color-bg", "value": "#050509", "role": "page_background" },
      "text_primary": { "token": "--color-text-primary", "value": "#F9FAFB", "role": "body_text" },
      "accent_gold": { "token": "--color-accent-gold", "value": "#E1B45A", "role": "accent" }
    },
    "constraints": {
      "accent_max_percentage": 0.2
    }
  },
```

Agents MUST:
- Use palette tokens rather than raw hex.
- Treat `accent_max_percentage` as a visual design rule when introducing accent usage.

### 2.3 Spacing Tokens

```jsonc
  "spacing": {
    "scale_px": 4,
    "tokens": [
      { "name": "space-1", "token": "--space-1", "value_px": 4 },
      { "name": "space-2", "token": "--space-2", "value_px": 8 },
      { "name": "space-3", "token": "--space-3", "value_px": 12 },
      { "name": "space-4", "token": "--space-4", "value_px": 16 }
    ]
  }
}
```

Agents MUST:
- Snap spacing to declared tokens and the base grid (`scale_px`).

---
## 3. Components

Components describe semantic patterns (e.g. bento cards, article prose wrappers)
that the design system defines.

### 3.1 Bento Components

```jsonc
"components": {
  "bento": {
    "card": {
      "variants": [
        { "name": "default", "roles": ["feature", "explainer"] },
        { "name": "dose", "roles": ["numeric_emphasis"] }
      ],
      "layout": {
        "grid": { "columns": 2, "gap_token": "--space-6" },
        "min_width_px": 320
      },
      "typography": {
        "label": { "font": "subtitle", "size_px": 14 },
        "title": { "font": "display", "min_size_px": 32 },
        "body":  { "font": "body", "size_px": 16 }
      }
    }
  },
```

Agents SHOULD:
- Prefer using these component definitions (and related CSS classes) rather than
  inventing new ad-hoc card/layout patterns for the same concept.

### 3.2 Prose / Article Containers

```jsonc
  "prose": {
    "containers": [
      {
        "name": "article",
        "class": "prose",
        "selectors": [".prose h1", ".prose h2", ".prose p"],
        "body_font": "body",
        "heading_font": "title"
      }
    ]
  }
}
```

---
## 4. Rules

Rules encode hard constraints and soft guidelines derived from the design docs.

```jsonc
"rules": {
  "forbidden": {
    "inline_styles": true,
    "raw_hex_colors": true,
    "arbitrary_spacing": true
  },
  "minimums": {
    "font_size_px": {
      "body": 14,
      "card_title": 32
    }
  },
  "hierarchy": {
    "primary_heading": { "font": "display", "min_size_px": 32 },
    "article_subtitle": { "font": "title", "size_px": 20 }
  }
}
```

Agents MUST treat `forbidden` and `minimums` as hard constraints.

---
## 5. CSS Architecture

`css_architecture` links the design system to concrete CSS files and patterns.

```jsonc
"css_architecture": {
  "global_tokens_files": [
    "css/design-system-tokens.css"
  ],
  "global_utilities_files": [
    "css/styles.css"
  ],
  "module_patterns": {
    "route_local": "**/*.module.css",
    "prose_containers": [
      "app/peptides/[slug]/components/ArticleContent.module.css"
    ]
  }
}
```

Implementation agents MUST:
- Use global token/utility layers for typography, colors, and spacing.
- Use route-local CSS Modules only for page-specific layout and variants.

---
## 6. Metadata

```jsonc
"metadata": {
  "project": "OBDN",
  "generated_at": "2025-11-19T16:37:00Z",
  "generator_version": "1.0.0"
}
```

---
## 7. Generator Expectations

The generator that produces `design-dna.json` from markdown MUST:
- Parse typography, color, spacing, and component sections from
  `design-system-vX.X.md` and `bento-system-vX.X.md`.
- Parse CSS file/architecture references from `CSS-ARCHITECTURE.md`.
- Populate `tokens`, `components`, `rules`, and `css_architecture` fields.
- Preserve enough metadata to trace each JSON field back to its doc origin.

