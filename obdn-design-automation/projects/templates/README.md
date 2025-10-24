# Project Templates

**How to create design automation for a new project**

---

## Quick Start

### 1. Copy Template Files

```bash
# Create new project directory
mkdir -p projects/[your-project]

# Copy templates
cp projects/templates/design-rules.template.json projects/[your-project]/design-rules.json
cp projects/templates/verify-design-system.template.sh projects/[your-project]/verify-design-system.sh
cp projects/templates/design-specialist.template.md projects/[your-project]/[your-project]-design-specialist.md
```

### 2. Customize for Your Project

**design-rules.json:**
- Replace all `[PROJECT_NAME]` with your project name
- Fill in typography fonts (minimum 2-3 fonts)
- Define color palette (foundation + text + accent)
- Set spacing tokens (use base grid: 4px or 8px)
- Create 5-10 instant-fail rules
- Build decision trees for typography/spacing

**verify-design-system.sh:**
- Update project name
- Customize verification checks for your rules
- Add project-specific grep patterns
- Set minimum passing score (default: 90%)

**[your-project]-design-specialist.md:**
- Burn in your instant-fail rules
- Embed your typography decision tree
- Add your spacing hierarchy
- Document your mental models

### 3. Extract from Existing Design System

If your project HAS design documentation:

```bash
# Use design-system-architect
@design-system-architect

Read design files in [path] and extract:
1. Typography system → fonts, sizes, weights, usage rules
2. Color palette → foundation, text, accents with CSS variables
3. Spacing tokens → base grid, hierarchy, approved values
4. Component specs → cards, buttons, inputs with exact tokens
5. Instant-fail rules → 5-10 critical violations

Output: projects/[your-project]/design-rules.json
```

### 4. Create from Scratch

If your project LACKS design documentation:

```bash
# Use design-system-architect
@design-system-architect

Create a design system for [project] with:
- Brand: [Modern SaaS / Swiss medical / Playful consumer]
- Aesthetic: [Minimalism / Maximalism / Brutalism]
- Precision level: OBDN-level (Swiss medical spa precision)

Output:
1. Complete design guide (typography, colors, spacing, components)
2. Instant-fail rules (5-10 critical violations)
3. Mental models (decision trees, hierarchies, principles)
4. Component specifications (with exact tokens)
5. design-rules.json (structured extraction)
```

---

## Template Placeholders

### design-rules.template.json

- `[PROJECT_NAME]` → Your project name (e.g., "peptidefoxv2")
- `[DATE]` → Current date (YYYY-MM-DD)
- `[Font Family Name]` → Actual font names (e.g., "Inter", "Playfair Display")
- `[#XXXXXX]` → Hex color codes
- `[XXpx]` → Pixel values
- `[grep pattern]` → Regular expressions for violation detection

### verify-design-system.template.sh

- `[PROJECT]` → Project name in lowercase
- `[Font checks]` → Custom font validation logic
- `[Spacing checks]` → Custom spacing token validation
- `[Component checks]` → Project-specific component rules

### design-specialist.template.md

- `[Project Name]` → Capitalized project name
- `[Instant-Fail Rules]` → Your 5-10 critical rules
- `[Mental Models]` → Decision trees, hierarchies, principles
- `[Examples]` → Code samples with correct/incorrect patterns

---

## Validation Checklist

Before using your new project automation:

- [ ] design-rules.json is valid JSON (test with `jq`)
- [ ] All `[PLACEHOLDER]` values replaced
- [ ] Instant-fail rules have grep patterns
- [ ] Typography decision tree is complete
- [ ] Spacing tokens list all approved values
- [ ] Color palette has CSS variables
- [ ] Components have exact specifications

- [ ] verify-design-system.sh is executable (`chmod +x`)
- [ ] Script runs without errors
- [ ] All checks are project-specific
- [ ] Grep patterns match your codebase syntax

- [ ] design-specialist.md has burned-in rules
- [ ] Mental models are documented
- [ ] Examples show correct/incorrect patterns
- [ ] Framework for new scenarios exists

---

## Testing Your Automation

### Step 1: Test Verification Script

```bash
# Run on a known-good file
./projects/[your-project]/verify-design-system.sh ./projects/[your-project]

# Expected: High score (80-100%)
```

### Step 2: Test with Known Violations

```bash
# Create test file with violations
mkdir -p test/violations
echo '[code with hardcoded colors]' > test/violations/colors.css

# Run verification
./projects/[your-project]/verify-design-system.sh ./test/violations

# Expected: Failures detected with specific violation messages
```

### Step 3: Test Designer Agent

```
@[your-project]-design-specialist

Implement a simple component (button/card/input) with:
- [Component requirements]
```

**Expected Agent Behavior:**
1. Reads design-rules.json
2. Creates spec with rule citations
3. Asks for approval
4. Generates code with CSS variables
5. Runs self-verification
6. Reports compliance score

---

## Project Examples

### OBDN (Swiss Medical Spa)
**Location:** `projects/obdn/`
**Aesthetic:** Luxe minimalism, Swiss precision
**Base Grid:** 4px
**Instant-Fail Rules:** 5 (bento grid, Domaine ≥24px, Supreme labels, CSS vars, spacing)

### peptidefoxv2 (Example - To Be Created)
**Location:** `projects/peptidefoxv2/`
**Aesthetic:** [TBD]
**Base Grid:** [TBD]
**Instant-Fail Rules:** [TBD]

---

## Support

**Need help?**
1. Review `UNIVERSAL_DESIGN_AUTOMATION.md` for framework overview
2. Study `projects/obdn/` as reference implementation
3. Use `@design-system-architect` to extract/create design system
4. Run verification early and often

**Common issues:**
- "Grep patterns not matching" → Check your codebase syntax (CSS vs Tailwind)
- "Score unexpectedly low" → Review violation messages for root cause
- "Agent not reading rules" → Verify design-rules.json path in agent prompt

---

**Version:** 1.0.0
**Last Updated:** 2025-01-24
