# Custom Claude Code Status Bar

**Location:** `~/.claude/scripts/statusline.js`
**Config:** `~/.claude/settings.json`

---

## What It Shows

### Line 1: Model | Tokens | Auto-Compact
```
Sonnet 4.5 | 📊 (68.2%) 136,476/200,000 | 23.5k until auto-compact
```

- **Model name** (purple)
- **Token usage:** `(percentage) used/total` - percentage first, then counts
- **Auto-compact text:** `XX.Xk until auto-compact` - grey text, no icon, abbreviated format
  - Shows abbreviated token count remaining until auto-compact at 160K tokens

### Line 2: System | Location | Git Status
```
󰻠 25% • 󰍛 68% | 📁 claude-vibe-code •  main | [1 󰄬 • 2 󰛿 • 3 󰋗] • 5 󰜷 • 2 󰜮
```

- **CPU usage:** `󰻠 XX%` - green <60%, yellow 60-80%, red >80%
- **Memory usage:** `󰍛 XX%` - always shown, green <75%, yellow 75-90%, red >90%

- **Current folder** (cyan)
- **Git branch** (green) - using  icon
- **Git status:**
  - `# 󰄬` - staged files (green)
  - `# 󰛿` - modified files (yellow)
  - `# 󰋗` - untracked files (red)
- **Git ahead/behind:**
  - `# 󰜷` - commits ahead (green)
  - `# 󰜮` - commits behind (red)

---

## What Changed

### Removed ❌
- Session ID (not useful)
- Python venv indicator (not used)
- Docker container count (not used)
- Shell level indicator (confusing)
- GPU usage (requires sudo, not feasible)

### Added ✅
- **Auto-compact text** - shows `XX.Xk until auto-compact` in grey (abbreviated format)
- **CPU usage** - always shown with color coding
- **Fixed memory calculation** - now always shows, using active + wired + compressed pages
- **Improved spacing** - space between number and icon in git status

### Changed 🔄
- **Token display:** Format is now `(%) used/total` - percentage first, then counts
- **Git branch icon:** Changed from 󰊢 to  (standard git branch icon)
- **Git status:** Now shows `# icon` instead of `icon#` for better readability
- **Layout:** Two-line format - system metrics moved to line 2 before folder info

---

## Icons Reference

| Icon | Meaning |
|------|---------|
| 📊 | Token usage |
| 󰻠 | CPU usage |
| 󰍛 | Memory usage |
| 📁 | Current folder |
|  | Git branch |
| 󰄬 | Staged files |
| 󰛿 | Modified files |
| 󰋗 | Untracked files |
| 󰜷 | Commits ahead |
| 󰜮 | Commits behind |

---

## Auto-Compact Explained

Claude Code automatically compacts the conversation when it reaches **~160K tokens (80% of 200K window)**. The status bar shows abbreviated token count remaining:

- **60.0k** = plenty of headroom
- **40.0k** = getting close
- **20.0k** = compact approaching
- **5.0k** = compact imminent
- **<1.0k** = compacting now

---

## Future: /show-agents Command

**Planned feature:** Toggle display of active agents in session

```
Sonnet 4.5 | 📊 (50.2%) 100,427/200,000 | 59.6k until auto-compact
󰻠 25% • 󰍛 68% | 📁 project •  main | [1 󰄬 • 2 󰛿]
🤖 system-architect • frontend-engineer • test-engineer
```

Implementation would require:
- Hook to track agent invocations
- State file to store active agents
- `/show-agents` slash command to toggle visibility

---

**Last updated:** 2025-01-24
**Status:** ✅ Production
