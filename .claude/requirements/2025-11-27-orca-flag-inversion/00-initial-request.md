# Initial Request: /orca-* Flag Inversion + Tighter Design Verification

## User Request

Invert the `/orca-*` command defaults so that:
- **Light path becomes the default** (no flag needed)
- **`--complex` flag triggers full pipeline** (spec gating, all gates, grand-architect)

Additionally, **design verification must be tighter**:
- Pixels MUST be calculated when looking at spacing/alignment
- No more "looks correct" without actual measurement
- Explicit pixel-level comparison against user reference screenshots

## Problem Analysis

Current state:
- `/orca-* "task"` → Complexity heuristics → Usually FULL pipeline
- `/orca-* -tweak "task"` → Force light path

The system is biased toward ceremony when developers want speed. Most tasks are "fix this component" level but get routed through full pipeline with grand-architect, spec gating, and all gates.

## Desired State

- `/orca-* "task"` → Default LIGHT path (direct to builder)
- `/orca-* --complex "task"` → Full pipeline with spec gating
- `-tweak` flag removed (redundant)
- Design verification requires PIXEL MEASUREMENTS for spacing/alignment claims

## Scope

Affects:
- `/orca-nextjs`
- `/orca-ios`
- `/orca-expo`
- `/orca-shopify`
- All reviewer agents (pixel measurement enforcement)
- Light orchestrators (become primary path)
