# Discovery Answers

## Q1: Scope - Which commands?
**Answer:** All commands (nextjs, ios, expo, shopify)
**Implication:** Consistent behavior across all domains

## Q2: -tweak flag handling?
**Answer:** -tweak becomes "no verification" mode, NOT removed
**Implication:** THREE tiers, not two:
- Default = light path WITH design verification
- -tweak = light path WITHOUT design verification (pure speed)
- --complex = full pipeline

## Q3: Pixel measurement strictness?
**Answer:** Hard block
**Implication:** Measurement mismatch = FAIL gate, requires fix before passing

## Q4: Light path design gates?
**Answer:** Light path STILL runs design verification gates
**Implication:** Only -tweak skips visual review. Default light path is NOT "pure speed" - it's "light orchestration WITH quality gates"

## Key Insight

The user wants:
- **Default:** Faster than current (skip grand-architect, spec gating) but STILL quality-gated
- **-tweak:** Pure speed mode for when you just need to iterate fast
- **--complex:** Full ceremony when architecture decisions are involved
