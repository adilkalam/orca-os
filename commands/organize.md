---
name: organize (DEPRECATED)
description: "DEPRECATED — Use /cleanup. Organization verification is included there."
---

# /organize (DEPRECATED)

Use `/cleanup` instead. It now includes an organization verification pass to ensure:
- Files are in correct canonical locations
- Documentation is consistent with actual structure
- Directory structure meets standards
- No files in wrong locations (evidence, logs, loose files)

## What This Command Does

1. **Checks File Locations**
   - Evidence files must be in `.orchestration/evidence/` ONLY
   - Log files must be in `.orchestration/logs/` ONLY
   - No loose markdown files in project root (except README, QUICK_REFERENCE, CLAUDE, etc.)

2. **Checks Documentation Consistency**
   - Agent count in `agents/` matches QUICK_REFERENCE.md
   - Command count in `commands/` matches QUICK_REFERENCE.md
   - Counts in QUICK_REFERENCE.md match README.md

3. **Checks Directory Structure**
   - Required directories exist (`.orchestration/`, etc.)
   - `.gitignore` has correct entries for ephemeral data

4. **Reports Issues**
   - ❌ Errors: Must fix before committing
   - ⚠️ Warnings: Should fix to maintain clean structure

## Usage

Use `/cleanup` for both organization verification and stale evidence/log cleanup.

## When to Use

✅ **Run /cleanup:**
- Before committing changes
- After adding/removing agents or commands
- After creating files (to verify correct location)
- When git hooks blocked your commit (to see what's wrong)
- Periodically to maintain clean project structure

## Example Output

```
🔍 Verifying project organization...

📁 Checking file locations...
   ✅ No evidence files outside .orchestration/evidence/
   ✅ No log files outside .orchestration/logs/

📄 Checking for loose files in project root...
   ✅ No unexpected markdown files in root

📂 Checking required directories...
   ✅ .orchestration/ exists
   ✅ .gitignore has .orchestration/evidence/
   ✅ .gitignore has .orchestration/logs/

🤖 Checking agent consistency...
   Found 48 agent files
   ✅ Agent count matches QUICK_REFERENCE.md

⚡ Checking command consistency...
   Found 10 command files
   ✅ Command count matches QUICK_REFERENCE.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Organization verification PASSED

   All files in correct locations
   Documentation consistent
   Directory structure correct
```

## If Verification Fails

When verification fails, you'll see specific errors like:

```
❌ Evidence files found outside .orchestration/evidence/:
     ./screenshot.png
     ./before-login.png

   Fix: mv [file] .orchestration/evidence/

❌ Agent count mismatch:
     Files in agents/: 48
     QUICK_REFERENCE.md: 47

   Fix: Update QUICK_REFERENCE.md with correct count
```

Follow the fix suggestions, then run `/cleanup` again.

## Documentation Standards

**When adding agents or commands:**

1. Create agent file in `agents/[category]/[agent-name].md`
2. Update QUICK_REFERENCE.md (increment count, add to listing)
3. Update README.md (if total counts changed)
4. Run `/organize` to verify
5. Commit everything together

See: `~/.claude/docs/DOCUMENTATION_PROTOCOL.md`

## File Organization Standards

**Canonical file locations:**

```
.orchestration/evidence/     ← ALL screenshots, images
.orchestration/logs/         ← ALL build logs, test output
.orchestration/verification/ ← Verification reports
.orchestration/playbooks/    ← ACE playbooks (committed)

agents/                      ← Agent definitions (committed)
commands/                    ← Slash commands (committed)
docs/                        ← Permanent documentation (committed)

README.md                    ← Primary docs (committed)
QUICK_REFERENCE.md           ← Master reference (committed)
CLAUDE.md                    ← Project memory (committed)
```

See: `~/.claude/docs/FILE_ORGANIZATION.md`

## Installation

If this is a new project, install the organization system:

```bash
bash ~/.claude/scripts/install-organization-system.sh
```

This creates:
- `.git/hooks/pre-commit` (runs /organize automatically)
- `.git/hooks/pre-push` (final safety check)
- Required directories
- `.gitignore` entries

## Integration with Git Hooks

After installation, git hooks will run `/organize` automatically:

**pre-commit hook:**
- Runs before every commit
- Blocks commit if verification fails
- Checks if documentation updated when agents/commands changed

**pre-push hook:**
- Runs before every push
- Final safety check
- Warns about recent commits with wrong file locations

## Bypass (Not Recommended)

If you MUST bypass verification:

```bash
git commit --no-verify
git push --no-verify
```

**WARNING:** Only bypass if you know what you're doing. Bypassing leads to chaos.

## Related Commands

- `/session-save` - Save session context
- `/cleanup` - Clean up generated files
- `/force` - Force verification workflows

## Technical Details

**Script location:** `~/.claude/scripts/verify-organization.sh`
**Exit codes:**
- 0 = PASSED (all checks passed)
- 1 = FAILED (errors found, must fix)

**Files checked:**
- All `.png`, `.jpg`, `.jpeg`, `screenshot*` files
- All `.log` files
- All loose `.md` files in root
- Agent count (`find agents/ -name "*.md"`)
- Command count (`find commands/ -name "*.md"`)

**What it doesn't check:**
- Code quality (use quality-validator)
- Test coverage (use test-engineer)
- Design quality (use design-reviewer)

---

**This command ensures your project stays organized and documentation stays consistent. Run it often!**
