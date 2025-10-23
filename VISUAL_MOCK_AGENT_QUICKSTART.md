# Visual Mock Agent - Quick Start Guide

Get your personal design language learning agent up and running in 15 minutes.

## What You're Building

A design agent that learns YOUR unique aesthetic and generates mockups in YOUR style - not generic templates.

## Prerequisites

- Claude Code with agent system set up
- Chrome DevTools MCP (optional, for analyzing live sites)
- 5-10 examples of designs you love
- 3-5 examples of designs you dislike

## Step-by-Step Setup

### 1. Initial Training (5 minutes)

```bash
/train-design --initial
```

This will guide you through:
1. Collecting examples you love
2. Collecting examples you dislike
3. Extracting patterns
4. Validating understanding

**What to provide:**
- Screenshots or URLs of designs you love
- Specific reasons WHY you love them
- Measurements if possible (padding, colors, etc.)
- Context about where you'd use similar designs

### 2. First Test Generation (2 minutes)

```bash
/generate-mockup "user dashboard with metrics"
```

You'll get 3 variations:
- **A (Conservative)**: Safe, proven patterns
- **B (Balanced)**: Creative within your style
- **C (Exploratory)**: Pushes boundaries to test understanding

### 3. Refine Based on Feedback (3 minutes)

```bash
/refine-mockup mockup_001 "increase whitespace by 20%"
```

The agent:
1. Adjusts the mockup
2. Updates learned patterns
3. Explains what changed and why

### 4. View Your Design System (2 minutes)

```bash
/show-design-system
```

See:
- Extracted color patterns
- Spacing system
- Typography scale
- Design rules
- Confidence scores

### 5. Generate Production Assets (3 minutes)

```bash
/show-design-system --generate
```

Creates:
- `tokens.json` for code
- `tailwind.config.js` for Tailwind
- Component patterns
- Design guidelines

## Complete Workflow Example

### Scenario: Building a Dashboard

**Step 1: Train with dashboard examples**
```bash
/train-design --add-liked "stripe-dashboard.png" \
  --context "Love the card-based layout, minimal color, generous spacing"

/train-design --add-liked "linear-dashboard.png" \
  --context "Clean information hierarchy, subtle shadows, restrained blue accent"
```

**Step 2: Generate dashboard mockup**
```bash
/generate-mockup "analytics dashboard with KPI cards, chart, and recent activity table"
```

**Response:**
```markdown
# Mockup Generation: Analytics Dashboard

## Variation A: Conservative
[Shows 3-column card layout, 32px padding, blue accent <10%, etc.]

Based on your patterns:
- Card layout: 92% confidence (from stripe-dashboard, linear-dashboard)
- Spacing: 32px padding (88% confidence)
- Color restraint: <10% blue (92% confidence)
```

**Step 3: Refine if needed**
```bash
/refine-mockup mockup_001 "perfect! just make chart slightly larger"
```

**Step 4: Hand off to implementation**
```bash
Task frontend-engineer:
"Implement mockup_001_refined using specs in .design-memory/generated/"
```

## Training Tips

### DO:
✅ Be specific: "32px padding creates breathing room"
✅ Explain WHY: "Blue only for CTAs maintains focus"
✅ Provide measurements: "Information density around 45%"
✅ Show context: "This works for dashboards, not forms"
✅ Include diverse examples: Different use cases

### DON'T:
❌ Be vague: "Looks clean"
❌ Skip reasoning: "Good colors"
❌ Forget measurements: Just saying "spacious"
❌ Provide only one type: Only show dashboards
❌ Use low-quality images: Blurry screenshots

## Understanding Confidence Scores

- **90-100%**: Rock solid (apply automatically)
- **75-89%**: Very strong (apply with confidence)
- **60-74%**: Good (apply, explore boundaries)
- **40-59%**: Uncertain (ask for confirmation)
- **<40%**: Insufficient data (need more examples)

## Common Questions

### "How many examples do I need?"

**Minimum:** 5 liked, 3 disliked
**Better:** 10 liked, 5 disliked
**Ideal:** 15+ liked, 8+ disliked, covering different contexts

### "Can I train on live websites?"

Yes! With Chrome DevTools MCP:
```bash
/train-design --add-liked "https://stripe.com/dashboard" \
  --analyze-live \
  --context "Card-based dashboard layout I want to emulate"
```

### "What if my taste changes?"

The system adapts! Just add new examples or provide feedback:
```bash
/refine-mockup mockup_005 "actually I prefer more color now"
```

Patterns evolve with every interaction.

### "Can I use this for different projects?"

Absolutely! The agent learns YOUR general taste, not project-specific designs. It maintains consistency across all your work.

### "How do I share with team?"

Export your design system:
```bash
/show-design-system --generate
```

Then share generated files:
- `tokens.json` - For developers
- `components.md` - For designers
- `rules.md` - For everyone

## File Structure

After setup, you'll have:
```
.design-memory/
├── visual-library/
│   ├── liked/
│   │   ├── example_001.png
│   │   ├── example_001.md
│   │   └── ...
│   ├── disliked/
│   │   └── antiexample_001.png
│   └── generated/
│       └── mockup_001.md
├── pattern-analysis/
│   ├── patterns.json
│   ├── color-patterns.json
│   ├── spacing-patterns.json
│   └── typography-patterns.json
├── design-rules/
│   ├── learned-rules.md
│   └── confidence-scores.json
└── design-system/
    ├── tokens.json
    ├── components.md
    ├── tailwind.config.js
    └── guidelines.md
```

## Integration with Existing Workflow

### With Other Agents

**Planning Phase:**
```
requirement-analyst → visual-mock-agent → system-architect
```

**Implementation Phase:**
```
visual-mock-agent → frontend-engineer → quality-validator
```

### With Quality Gates

- Training completeness gate: >= 5 examples
- Pattern confidence gate: >= 60% for use
- Mockup validation gate: Evidence for all decisions

## Advanced Features

### Context-Specific Patterns

```bash
/train-design --add-liked "mobile-nav.png" \
  --context "mobile:navigation" \
  --note "Different from desktop patterns"
```

Creates context-aware rules:
- Desktop dashboards use sidebar
- Mobile dashboards use bottom tabs

### Pattern Override

```bash
/generate-mockup "festive holiday landing page" \
  --override color-restraint \
  --context "marketing:seasonal"
```

Temporarily loosens color restrictions for specific contexts.

### Team Learning

```bash
/train-design --import-from teammate-design-memory/
```

Learn from teammate's patterns (optional feature).

## Troubleshooting

### "Mockups don't match my taste"

**Check:**
1. Training completeness: `cat .design-memory/pattern-analysis/patterns.json`
2. Example quality: Are examples clear and representative?
3. Feedback history: Have you provided refinement feedback?

**Fix:**
- Add more examples: `/train-design --add-liked`
- Provide specific feedback: `/refine-mockup with specific changes`
- Review confidence scores: `/show-design-system --confidence`

### "Patterns contradict each other"

This is normal during early training. The agent will ask:

```markdown
"I notice potential contradiction:

Example A: 24px padding preferred
Example B: 32px padding preferred

Options:
1. Update to 32px everywhere
2. Context rule: dashboards use 32px, forms use 24px
3. This was an exception

Which matches your intent?"
```

### "Low confidence scores"

**Cause:** Insufficient or inconsistent examples
**Fix:** Add 3-5 more examples showing consistent patterns

## Next Steps

1. ✅ Complete initial training
2. ✅ Generate first test mockup
3. ✅ Provide refinement feedback
4. ✅ View design system
5. ✅ Generate production assets
6. → Integrate into workflow
7. → Train team members
8. → Expand to more contexts

## Resources

- **Agent Definition:** `/agents/specialized/visual-mock-agent.md`
- **Commands:** `/commands/train-design.md`, `/commands/generate-mockup.md`
- **Implementation Guide:** `VISUAL_MOCK_AGENT_IMPLEMENTATION.md`
- **Full Documentation:** `VISUAL_MOCK_AGENT_SUMMARY.md`

## Getting Help

### Common Commands

```bash
/train-design --help        # Training options
/generate-mockup --help     # Generation options
/show-design-system         # View current state
/refine-mockup --help       # Refinement options
```

### Check Status

```bash
# View training progress
cat .design-memory/pattern-analysis/patterns.json | grep "totalExamples"

# View confidence levels
cat .design-memory/design-rules/confidence-scores.json

# List examples
ls .design-memory/visual-library/liked/
```

Start building your personal design agent now! 🎨