# Claude Vibe Code - Deployment Manifest

**Purpose:** Canonical definition of what should be deployed to `~/.claude`

**Last Generated:** 2025-11-01

---

## Source of Truth

**Repository:** `/Users/adilkalam/claude-vibe-code`
**Deployment Target:** `~/.claude`

This file defines the EXACT state that `~/.claude` should match.

---

## System Counts (Verified from Repo)

- **Agents:** 53 total (excludes 3 template/policy files)
- **Commands:** 23 total (all active)
- **Hooks:** 8 total
- **Scripts:** 3 total
- **Playbooks:** 7 JSON files

---

## Files to Deploy

### 1. Root Configuration Files

**Deploy these files to ~/.claude:**
- `CLAUDE.md` → `~/.claude/CLAUDE.md` (project memory - PUBLIC)
- `QUICK_REFERENCE.md` → `~/.claude/QUICK_REFERENCE.md`
- `README.md` → DO NOT DEPLOY (repo documentation only)

**Note:** Global user memory (`~/.claude/CLAUDE.md` for system-wide settings) is managed separately and should NOT be overwritten by project deployment.

### 2. Agents (51 total)

**Deploy entire agents/ directory:**
```
agents/ → ~/.claude/agents/
├── implementation/
│   ├── backend-engineer.md
│   ├── infrastructure-engineer.md
│   ├── android-engineer.md
│   └── cross-platform-mobile.md
├── orchestration/
│   ├── workflow-orchestrator.md
│   ├── orchestration-reflector.md
│   ├── playbook-curator.md
│   └── meta-orchestrator.md
├── planning/
│   ├── requirement-analyst.md
│   ├── system-architect.md
│   └── plan-synthesis-agent.md
├── quality/
│   ├── verification-agent.md
│   ├── quality-validator.md
│   ├── test-engineer.md
│   └── content-awareness-validator.md
└── specialists/
    ├── design-specialists/ (12 agents including design-ocd-enforcer)
    ├── frontend-specialists/ (5 agents)
    └── ios-specialists/ (21 agents)
```

**Agent Categories:**
- Implementation: 4
- Orchestration: 4
- Planning: 3
- Quality: 4
- Design: 12
- Frontend: 5
- iOS: 21

**Total: 53**

### 3. Commands (23 total)

**Deploy entire commands/ directory:**
```
commands/ → ~/.claude/commands/
├── all-tools.md
├── ascii-mockup.md
├── clarify.md
├── cleanup.md
├── completion-drive.md
├── concept-new.md
├── concept.md
├── creative-strategist.md
├── enhance.md
├── finalize.md
├── force.md
├── ios-debug.md
├── memory-learn.md
├── memory-pause.md
├── mode-off.md
├── mode-strict.md
├── mode-tweak.md
├── orca.md
├── organize.md
├── session-resume.md
├── session-save.md
├── ultra-think.md
└── visual-review.md
```

**Active Commands:** 23
**Deprecated:** 0

### 4. Hooks (8 total)

**Deploy hooks:**
```
hooks/ → ~/.claude/hooks/
├── auto-activate-skills.sh
├── detect-project-type.sh
├── load-design-dna.sh
├── load-playbooks.sh
├── orchestrator-firewall.sh
├── session-start.sh
├── SessionEnd.sh
└── SessionStart.sh
```

### 5. Scripts (3 total)

**Deploy scripts:**
```
scripts/ → ~/.claude/scripts/
├── statusline-README.md
├── statusline.js
└── verify-file-organization.sh
```

### 6. Orchestration System

**Deploy .orchestration/ runtime directories:**
```
.orchestration/ → ~/.claude/.orchestration/
├── playbooks/
│   ├── universal-patterns.json
│   ├── frontend-patterns.json
│   ├── git-patterns.json
│   ├── ios-development-template.json
│   ├── nextjs-patterns-template.json
│   ├── universal-patterns-template.json
│   └── taste-obdn-template.json
├── sessions/ (preserve existing)
├── signals/ (preserve existing)
└── verification-system/ (deploy if exists)
```

**Note:** Some .orchestration subdirectories contain runtime data (sessions/, signals/) that should be PRESERVED during deployment, not overwritten.

---

## Files to EXCLUDE from Deployment

**Never deploy these to ~/.claude:**

### Development Files
- `.git/` (version control)
- `node_modules/` (dependencies)
- `.workshop/` (project-specific memory)
- `.next/` (build artifacts)

### Documentation (Repo-only)
- `README.md` (repo documentation, not user-facing)
- `.claude-*-context.md` (session artifacts)
- `.diagram-*.md` (verification reports)
- `.rebuilt-diagrams.md`

### Planning/Session Documents in .orchestration/
- All `.md` files in `.orchestration/` root (session reports, plans, analyses)
- `.orchestration/.backup/`
- `.orchestration/stage-*/` directories
- `.orchestration/evidence/` (session-specific screenshots)

---

## Cleanup Rules for ~/.claude

### DELETE These Directories/Files

**Stale Documentation (non-canonical):**
- Root-level audit reports (`QA_AUDIT_*.md`, `ORCA_FIXES_*.md`, etc.)
- `SETUP_REFERENCE.md` (outdated)
- `USER_PROFILE.md` (merged into global CLAUDE.md)
- `CLAUDE.md.backup-*` (old backups)
- `test-scenario-*.md` (test files)

**Design System (if not actively used):**
- `design-inspiration/` (if not referenced by active agents)
- `OBDN_DESIGN_SYSTEM_UNDERSTANDING.md`
- `DESIGN_AGENT_TESTING_METHODOLOGY.md`

**Context Files (session artifacts):**
- `.claude-design-dna-context.md`
- `.claude-orchestration-context.md`
- `.claude-playbook-context.md`
- `.claude-session-context.md`

### ARCHIVE These Directories

**Project Histories (203 sessions - very large):**
- `projects/` → Archive to `~/.claude-archive/projects-$(date +%Y%m%d)/`

**Debug Logs (215 files):**
- `debug/` → Archive to `~/.claude-archive/debug-$(date +%Y%m%d)/`

**Shell Snapshots (108 files):**
- `shell-snapshots/` → Archive to `~/.claude-archive/shell-snapshots-$(date +%Y%m%d)/`

**File History (2226 files):**
- `file-history/` → Archive to `~/.claude-archive/file-history-$(date +%Y%m%d)/`

### PRESERVE These Directories

**Runtime Data (do not touch):**
- `.orchestration/sessions/`
- `.orchestration/signals/`
- `.orchestration/agent-skill-vectors/`
- `.orchestration/knowledge-graph/`
- `todos/` (active todo tracking)
- `session-env/` (session variables)
- `ide/` (IDE state)
- `statsig/` (analytics)
- `history.jsonl` (session history)

**Plugin System:**
- `plugins/` (entire directory - contains installed plugins)
- `skills/` (entire directory - user skills)

---

## Deployment Strategy

### Phase 1: Safety Backup
```bash
# Create timestamped backup
tar -czf ~/.claude-backup-$(date +%Y%m%d-%H%M%S).tar.gz ~/.claude/
```

### Phase 2: Archive Large Directories
```bash
mkdir -p ~/.claude-archive
mv ~/.claude/projects ~/.claude-archive/projects-$(date +%Y%m%d)/
mv ~/.claude/debug ~/.claude-archive/debug-$(date +%Y%m%d)/
mv ~/.claude/shell-snapshots ~/.claude-archive/shell-snapshots-$(date +%Y%m%d)/
mv ~/.claude/file-history ~/.claude-archive/file-history-$(date +%Y%m%d)/
```

### Phase 3: Delete Stale Files
```bash
# Remove stale documentation
rm ~/.claude/QA_*.md
rm ~/.claude/ORCA_*.md
rm ~/.claude/*_COMPLETE.md
rm ~/.claude/SETUP_REFERENCE.md
rm ~/.claude/USER_PROFILE.md
rm ~/.claude/CLAUDE.md.backup-*
```

### Phase 4: Deploy Canonical System
```bash
# Deploy agents
rsync -av --delete /Users/adilkalam/claude-vibe-code/agents/ ~/.claude/agents/

# Deploy commands
rsync -av --delete /Users/adilkalam/claude-vibe-code/commands/ ~/.claude/commands/

# Deploy hooks
rsync -av --delete /Users/adilkalam/claude-vibe-code/hooks/ ~/.claude/hooks/

# Deploy scripts
rsync -av --delete /Users/adilkalam/claude-vibe-code/scripts/ ~/.claude/scripts/

# Deploy playbooks (careful not to overwrite runtime data)
rsync -av /Users/adilkalam/claude-vibe-code/.orchestration/playbooks/ ~/.claude/.orchestration/playbooks/

# Deploy reference docs
cp /Users/adilkalam/claude-vibe-code/QUICK_REFERENCE.md ~/.claude/
cp /Users/adilkalam/claude-vibe-code/CLAUDE.md ~/.claude/CLAUDE.md.project
```

### Phase 5: Verify Deployment
```bash
# Count agents (excluding template/policy files)
find ~/.claude/agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY\|context" | wc -l  # Should be 53

# Count commands
find ~/.claude/commands -name "*.md" | wc -l  # Should be 23

# Verify hooks
ls ~/.claude/hooks/*.sh  # Should show 8 files

# Check session commands are present (active - reliable memory tools)
ls ~/.claude/commands/session-*.md  # Should show 2 files (session-save.md, session-resume.md)
```

---

## Automated Sync Script

**Location:** `claude-vibe-code/scripts/deploy-to-global.sh`

**Usage:**
```bash
# From claude-vibe-code repo root:
./scripts/deploy-to-global.sh

# With verification only (dry-run):
./scripts/deploy-to-global.sh --dry-run
```

**What it does:**
1. Verifies you're in the repo root
2. Creates safety backup
3. Archives large directories (first run only)
4. Removes stale/deprecated files
5. Syncs canonical system using rsync
6. Verifies deployment (counts match manifest)
7. Reports changes

**When to run:**
- After adding/removing agents
- After adding/removing commands
- After updating hooks or scripts
- Before major system changes (to ensure clean state)

---

## Future: Git Hooks Integration

**Potential automation:**
- `post-commit` hook: Auto-deploy on commit to main
- `post-merge` hook: Auto-deploy after pulling changes
- CI/CD: Automated verification that counts match manifest

**Trade-off:** Automatic deployment could be disruptive during active development. Consider manual trigger for now, automation later.

---

## Verification Checklist

After deployment, verify:
- [ ] `find ~/.claude/agents -name "*.md" | grep -v "TEMPLATE\|README\|POLICY\|context" | wc -l` returns 53
- [ ] `find ~/.claude/commands -name "*.md" | wc -l` returns 23
- [ ] `ls ~/.claude/hooks/*.sh | wc -l` returns 8
- [ ] `ls ~/.claude/commands/session-*.md` shows 2 files (session-save.md, session-resume.md - active)
- [ ] `ls ~/.claude/QA_*.md` shows no files (stale docs removed)
- [ ] `ls ~/.claude/.orchestration/playbooks/*.json | wc -l` returns 7
- [ ] `ls ~/.claude/projects` shows "No such file or directory" (archived)
- [ ] `du -sh ~/.claude` shows reasonable size (< 100MB without project histories)

---

**This manifest is the source of truth for deployment. Update this file when the canonical system changes.**
