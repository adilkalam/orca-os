# How to Invoke OBDN Design Specialist

## Simple Invocation (Copy/Paste This)

In your OBDN work session, paste this:

```
You are the OBDN Design Specialist.

Read and follow this agent prompt:
/Users/adilkalam/claude-vibe-code/obdn-design-automation/projects/obdn/obdn-design-specialist.md

CRITICAL: The first thing in that prompt tells you to read design-rules.json.
Do it NOW with the Read tool before responding to me.
```

---

## What Should Happen

**Step 1:** Agent uses Read tool on `design-rules.json`

**Step 2:** Agent responds with:
```
✅ OBDN Design Rules Loaded

I've read design-rules.json (700 lines).

Quick validation:
- Instant-fail rules: 5 loaded
- Typography fonts: 5 fonts
- Spacing tokens: 16 tokens
- etc.

Ready to analyze your code/request. What would you like me to work on?
```

**Step 3:** You tell the agent what to do

---

## Example Usage

After the agent confirms rules are loaded:

```
Fix the CSS variable violations in:
/Users/adilkalam/Desktop/OBDN/obdn_site/app/protocols/tracker/page.module.css

Lines 200, 201, and 481 have hardcoded #D4AF37 colors.
Replace with the appropriate CSS variable.
```

Agent will:
1. ✅ Create a spec with rule citations
2. ⏸️ Ask for your approval
3. ✅ Make the fixes
4. ✅ Run verification script
5. ✅ Report new compliance score

---

## Verification Only (No Agent)

If you just want to check compliance:

```bash
~/claude-vibe-code/obdn-design-automation/projects/obdn/verify-design-system.sh ~/Desktop/OBDN/obdn_site/app/protocols/tracker
```

---

## Troubleshooting

**If agent says "rules loaded" without showing the validation:**
→ It didn't actually read the file
→ Say: "Use the Read tool on design-rules.json NOW and show me the first 50 lines"

**If agent can't find design-rules.json:**
→ Check the file exists: `ls -la ~/claude-vibe-code/obdn-design-automation/projects/obdn/`
→ File should be ~30KB

**If verification script fails:**
→ Make script executable: `chmod +x ~/claude-vibe-code/obdn-design-automation/projects/obdn/verify-design-system.sh`

---

## Quick Test

Paste this to test the agent:

```
You are the OBDN Design Specialist.

Read: /Users/adilkalam/claude-vibe-code/obdn-design-automation/projects/obdn/obdn-design-specialist.md

Then analyze this code and tell me what instant-fail rules it violates:

.button {
  color: #D4AF37;
  padding: 23px;
  font-family: 'Domaine Sans Display';
  font-size: 18px;
}

.label {
  font-family: 'Supreme LL';
  font-weight: 400;
  font-style: italic;
  text-transform: uppercase;
}
```

**Expected violations:**
- Hardcoded color (#D4AF37) → Use var(--color-accent-gold-bright)
- Random spacing (23px) → Use var(--space-6) or var(--space-8)
- Domaine below 24px (18px) → Minimum 24px
- Supreme label italic → NEVER italic

If agent catches all 4, it's working correctly!
