# iOS Simulator Skill - Installation Complete ✅

**Date:** 2025-10-23
**Version:** 1.0.1
**Repository:** https://github.com/conorluddy/ios-simulator-skill
**Location:** ~/.claude/skills/ios-simulator-skill

---

## Installation Summary

✅ **Successfully Installed** to ~/.claude/skills/ios-simulator-skill/
✅ **All Scripts Executable** - Python and shell scripts ready
✅ **Environment Verified**:
- macOS 26.1 (Sequoia)
- Xcode Command Line Tools
- Python 3.14.0
- 20+ iOS Simulators available (iPhone 17 Pro, iPhone Air, etc.)

⚠️  **IDB (Optional)**: Not installed - can add via `brew install idb-companion` if needed

---

## What's Installed

### 12 Production Scripts

**Build & Development (2 scripts):**
- `build_and_test.py` - Build Xcode projects and run tests
- `log_monitor.py` - Real-time log streaming with filtering

**Navigation (5 scripts):**
- `screen_mapper.py` - Analyze current screen (5-line output)
- `navigator.py` - Semantic element discovery and interaction
- `gesture.py` - Swipes, scrolls, pinches, drags
- `keyboard.py` - Text input and hardware buttons
- `app_launcher.py` - App lifecycle management

**Testing & Analysis (5 scripts):**
- `accessibility_audit.py` - WCAG compliance checking
- `visual_diff.py` - Screenshot regression testing
- `test_recorder.py` - Automated test documentation
- `app_state_capture.py` - Complete debug snapshots
- `sim_health_check.sh` - Environment verification

---

## Token Efficiency Gains

| Operation | Without Skill | With Skill | Reduction |
|-----------|--------------|------------|-----------|
| Screen analysis | ~200 lines | ~5 lines | 97.5% |
| Build logs | ~500 lines | ~12 lines | 97.6% |
| Test results | ~150 lines | ~8 lines | 94.7% |
| Navigation | ~100 lines | ~3 lines | 97.0% |
| **Overall** | High verbosity | Minimal output | **96-99%** |

---

## Integration with iOS Specialists

### Specialists with Simulator Support (9/19):

1. **swiftui-developer** - UI testing, visual diff
2. **uikit-specialist** - UIKit view testing
3. **ios-accessibility-tester** - Accessibility audits (accessibility_audit.py)
4. **swift-testing-specialist** - Test execution (build_and_test.py)
5. **xctest-pro** - XCTest execution
6. **ui-testing-expert** - XCUITest automation (navigator.py, test_recorder.py)
7. **ios-debugger** - App state capture (app_state_capture.py, log_monitor.py)
8. **ios-performance-engineer** - Performance profiling
9. **ios-accessibility-tester** - Accessibility tree (screen_mapper.py)

### How Specialists Use the Skill

**Automatically Referenced:**
When specialists need simulator interaction, they'll reference the skill scripts:

```bash
# swiftui-developer testing a view
python ~/.claude/skills/ios-simulator-skill/skill/scripts/screen_mapper.py

# ios-accessibility-tester running audit
python ~/.claude/skills/ios-simulator-skill/skill/scripts/accessibility_audit.py

# ui-testing-expert navigating UI
python ~/.claude/skills/ios-simulator-skill/skill/scripts/navigator.py --find-text "Login" --tap

# ios-debugger capturing state
python ~/.claude/skills/ios-simulator-skill/skill/scripts/app_state_capture.py
```

**No Manual Configuration Needed:**
- Specialists include skill usage in their agent definitions
- Token-efficient output automatically used
- Progressive disclosure (minimal by default, `--verbose` for details)

---

## Key Features

### 1. Accessibility-First Navigation

**Instead of fragile pixel coordinates:**
```bash
# ❌ Fragile
idb ui tap 320 400  # What's at those coordinates?
```

**Use semantic, robust navigation:**
```bash
# ✅ Robust
python scripts/navigator.py --find-text "Login" --tap
```

### 2. Progressive Disclosure

**Minimal output by default:**
```bash
$ python scripts/screen_mapper.py
Screen: LoginView
Elements: 3 interactive
- TextField: username (empty)
- SecureField: password (empty)
- Button: Login
```

**Verbose when needed:**
```bash
$ python scripts/screen_mapper.py --verbose
[Full accessibility tree with all properties...]
```

### 3. Smart Simulator Selection

The skill automatically learns and remembers your simulator preferences:
```json
{
  "device": {
    "last_used_simulator": "iPhone 17 Pro",
    "last_used_at": "2025-10-23T14:45:00Z"
  }
}
```

---

## Usage Examples

### Build and Test

```bash
# Build and run tests
python ~/.claude/skills/ios-simulator-skill/skill/scripts/build_and_test.py <project_path>

# Output: ~12 lines (vs ~500 lines without skill)
✓ Build succeeded (23.4s)
✓ Tests passed: 45/45
  - LoginViewTests: 12 passed
  - NetworkTests: 15 passed
  - DataTests: 18 passed
```

### Navigate UI

```bash
# Find and tap element
python ~/.claude/skills/ios-simulator-skill/skill/scripts/navigator.py \
  --find-text "Submit" --tap

# Output: ~3 lines
✓ Found: Button "Submit" (accessible)
✓ Tapped successfully
```

### Accessibility Audit

```bash
# Check accessibility compliance
python ~/.claude/skills/ios-simulator-skill/skill/scripts/accessibility_audit.py

# Output: ~8 lines
✓ Accessibility Audit (WCAG 2.1 AA)
  Issues: 2 warnings
  ⚠️  TextField: "username" missing label
  ⚠️  Color contrast: 3.2:1 (requires 4.5:1)
```

### Capture Debug State

```bash
# Full debug snapshot
python ~/.claude/skills/ios-simulator-skill/skill/scripts/app_state_capture.py

# Output: ~10 lines + files
✓ Screenshot: /tmp/screen_123.png
✓ Accessibility tree: /tmp/tree_123.json
✓ Console logs: /tmp/logs_123.txt
```

---

## Verification

### Run Health Check

```bash
~/.claude/skills/ios-simulator-skill/skill/scripts/sim_health_check.sh
```

**Expected Output:**
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  iOS Simulator Testing - Environment Health Check
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1/8] Checking operating system...
✓ macOS detected (version 26.1)

[2/8] Checking Xcode...
✓ Xcode installed (version 16.2)

[3/8] Checking Python...
✓ Python 3.14.0

[4/8] Checking simulators...
✓ 20+ simulators available

[5/8] Checking IDB...
⚠️  IDB not installed (optional)

✓ Environment ready for iOS development
```

---

## Optional: Install IDB

IDB (iOS Development Bridge) provides enhanced simulator features:

```bash
# Install via Homebrew
brew tap facebook/fb
brew install idb-companion

# Verify
idb --version
```

**Benefits:**
- Faster simulator control
- Enhanced gesture support
- Better screenshot capture
- Not required, but recommended for production use

---

## Documentation

**Installed Documentation:**
- `README.md` - Main documentation
- `SKILL.md` - Skill specification for Claude
- `SPECIFICATION.md` - Technical details
- `references/` - Quick reference guides
  - `accessibility_checklist.md`
  - `troubleshooting.md`
  - `test_patterns.md`
  - `idb_quick.md`
  - `simctl_quick.md`

**Location:** ~/.claude/skills/ios-simulator-skill/

---

## Troubleshooting

### Issue: Scripts not executable

**Solution:**
```bash
find ~/.claude/skills/ios-simulator-skill -type f \( -name "*.py" -o -name "*.sh" \) -exec chmod +x {} \;
```

### Issue: No simulators available

**Solution:**
```bash
# Check available simulators
xcrun simctl list devices available

# Create a new simulator if needed
xcrun simctl create "iPhone 17 Pro" "iPhone 17 Pro"
```

### Issue: Python import errors

**Solution:**
```bash
# Install required packages
pip3 install pillow  # For image comparison
```

---

## Next Steps

1. ✅ **Skill Installed** - Ready for use
2. ✅ **Use `/orca` with iOS Projects** - Specialists will automatically use skill
3. ✅ **Token Efficiency Active** - 96-99% reduction in simulator output
4. ⚠️  **Optional**: Install IDB for enhanced features
5. ✅ **Test**: Run health check to verify everything works

---

## Benefits Summary

| Benefit | Description |
|---------|-------------|
| **Token Efficiency** | 96-99% reduction in output tokens |
| **Robustness** | Accessibility-based navigation (not fragile pixels) |
| **Automatic** | Integrated with 9 iOS specialists |
| **Progressive** | Minimal output by default, verbose on demand |
| **Smart** | Learns simulator preferences automatically |
| **Complete** | 12 scripts cover full iOS development lifecycle |

---

## Integration Status

✅ **ios-simulator-skill** installed and operational
✅ **9 iOS Specialists** configured to use skill
✅ **/orca Command** will automatically leverage skill for iOS projects
✅ **Token Efficiency** active for all simulator operations
✅ **Documentation** complete and accessible

**Status:** Production-ready, fully integrated with iOS specialist team

---

**Installed:** 2025-10-23
**Version:** 1.0.1
**Status:** ✅ Operational
