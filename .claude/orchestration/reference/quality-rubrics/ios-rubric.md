# iOS Quality Rubric - OS 2.0

**Domain:** iOS (Native Swift/SwiftUI)
**Version:** 1.0
**Last Updated:** 2025-11-20

---

## Scoring Overview

**Total Score:** 0-100 points across 4 dimensions (25 points each)

**Scoring Interpretation:**
- **90-100:** Excellent - Production-ready, best practices followed
- **75-89:** Good - Minor improvements needed
- **60-74:** Fair - Significant issues to address
- **0-59:** Poor - Major rework required

---

## Dimension 1: Swift Standards (0-25 points)

### 1.1 Type Safety (0-10 points)

**Excellent (9-10 points):**
- All optionals handled explicitly (`if let`, `guard let`, nil coalescing)
- No force unwrapping (`!`) except for IBOutlets
- Proper use of `Result` type for error-prone operations
- Generic constraints used appropriately
- Protocol-oriented design with clear type relationships

**Good (7-8 points):**
- Most optionals handled properly
- Occasional force unwrapping with clear justification
- Some generic usage
- Basic protocol usage

**Fair (5-6 points):**
- Multiple force unwraps without justification
- Implicit optional handling
- Limited type safety considerations
- Minimal protocol usage

**Poor (0-4 points):**
- Frequent force unwrapping
- No optional handling
- Type safety largely ignored
- No protocols or generics

**Common Issues:**
- Force unwrapping without crash protection
- Using `as!` instead of `as?`
- Ignoring optional chaining opportunities
- Overuse of implicitly unwrapped optionals

### 1.2 Code Quality (0-8 points)

**Excellent (7-8 points):**
- Follows Swift API Design Guidelines
- Consistent naming conventions (camelCase, descriptive names)
- Proper access control (`private`, `fileprivate`, `internal`, `public`)
- No compiler warnings
- SwiftLint compliant (if used)

**Good (5-6 points):**
- Mostly follows guidelines
- Consistent naming
- Some access control usage
- Few compiler warnings

**Fair (3-4 points):**
- Inconsistent naming
- Missing access control
- Multiple compiler warnings
- Style issues

**Poor (0-2 points):**
- Poor naming conventions
- No access control
- Many compiler warnings
- Doesn't compile

### 1.3 Memory Management (0-7 points)

**Excellent (6-7 points):**
- Proper weak/unowned references in closures
- No retain cycles
- Appropriate use of `@escaping` and `@autoclosure`
- Memory leaks tested and fixed
- Instruments profiling performed

**Good (4-5 points):**
- Most weak references correct
- Few potential retain cycles
- Basic memory awareness

**Fair (2-3 points):**
- Some retain cycle issues
- Inconsistent weak reference usage
- Memory concerns not addressed

**Poor (0-1 points):**
- Multiple retain cycles
- Memory leaks present
- No weak reference usage

---

## Dimension 2: iOS UI Standards (0-25 points)

### 2.1 SwiftUI Best Practices (0-10 points)

**If using SwiftUI:**

**Excellent (9-10 points):**
- Proper view composition (small, reusable views)
- Correct state management (`@State`, `@Binding`, `@ObservedObject`, `@StateObject`)
- View modifiers used appropriately
- Environment values leveraged
- PreferenceKeys for complex layouts

**Good (7-8 points):**
- Good view composition
- Mostly correct state management
- Appropriate modifier usage
- Some environment usage

**Fair (5-6 points):**
- Large, monolithic views
- State management issues
- Inefficient modifier usage
- Missing environment opportunities

**Poor (0-4 points):**
- No view composition
- Incorrect state management
- Poor modifier usage
- No environment awareness

**SwiftUI Anti-Patterns to Flag:**
- `@State` in non-View types
- `@ObservedObject` without proper lifecycle
- Massive view bodies (>100 lines)
- Recreating views unnecessarily
- Missing `id()` in dynamic lists

### 2.2 UIKit Best Practices (0-10 points)

**If using UIKit:**

**Excellent (9-10 points):**
- Proper view controller lifecycle management
- Auto Layout constraints programmatic or IB
- Delegation patterns used correctly
- No massive view controllers (< 300 lines)
- Proper UITableView/UICollectionView cell reuse

**Good (7-8 points):**
- Good lifecycle management
- Constraints mostly correct
- Some delegation usage
- Reasonable VC sizes

**Fair (5-6 points):**
- Lifecycle issues
- Constraint conflicts
- Missing delegation
- Large view controllers (300-500 lines)

**Poor (0-4 points):**
- Major lifecycle problems
- Broken constraints
- No delegation
- Massive view controllers (>500 lines)

**UIKit Anti-Patterns to Flag:**
- Massive view controllers
- Frame-based layout in modern iOS
- Missing Auto Layout
- Blocking main thread
- Force unwrapping IBOutlets outside viewDidLoad

### 2.3 Accessibility (0-5 points)

**Excellent (5 points):**
- All UI elements have accessibility labels
- Proper accessibility traits set
- VoiceOver tested and working
- Dynamic Type supported
- Accessibility hints where appropriate

**Good (3-4 points):**
- Most elements labeled
- Some traits set
- Basic VoiceOver support
- Partial Dynamic Type

**Fair (1-2 points):**
- Few accessibility labels
- Missing traits
- No VoiceOver testing
- No Dynamic Type

**Poor (0 points):**
- No accessibility implementation

**Common Issues:**
- Missing `accessibilityLabel` on buttons with only icons
- No `accessibilityHint` for complex interactions
- No Dynamic Type support
- Insufficient color contrast

---

## Dimension 3: Architecture & Patterns (0-25 points)

### 3.1 Architecture Pattern (0-12 points)

**Excellent (11-12 points):**
- Clear, consistent architecture (MVVM, TCA, VIPER, etc.)
- Proper separation of concerns
- Testable business logic
- Dependency injection used
- Well-defined data flow

**Good (8-10 points):**
- Identifiable architecture
- Mostly separated concerns
- Some testable logic
- Basic DI usage

**Fair (5-7 points):**
- Inconsistent architecture
- Poor separation
- Hard to test
- Tight coupling

**Poor (0-4 points):**
- No architecture
- Everything in one place
- Untestable
- Massive coupling

**Architecture Patterns:**
- MVVM (Model-View-ViewModel)
- TCA (The Composable Architecture)
- VIPER (View-Interactor-Presenter-Entity-Router)
- MVC (Model-View-Controller - if done correctly)
- Redux/Flux patterns

### 3.2 Networking (0-6 points)

**Excellent (5-6 points):**
- Proper URLSession usage with async/await or Combine
- Error handling comprehensive
- Request/response models defined
- Network layer abstracted
- API client testable

**Good (3-4 points):**
- URLSession used correctly
- Basic error handling
- Some model definitions
- Partial abstraction

**Fair (1-2 points):**
- Poor URLSession usage
- Minimal error handling
- No models
- No abstraction

**Poor (0 points):**
- Broken networking
- No error handling

**Common Issues:**
- Blocking main thread with sync requests
- No error handling
- Hardcoded URLs
- No request/response models
- Missing timeout configuration

### 3.3 Data Persistence (0-7 points)

**Excellent (6-7 points):**
- Appropriate storage choice (UserDefaults, Keychain, Core Data, Realm, etc.)
- Keychain for sensitive data
- Core Data relationships correct (if used)
- Migration strategy defined
- Background context for heavy operations

**Good (4-5 points):**
- Reasonable storage choice
- Keychain for secrets
- Basic persistence working
- Some migration awareness

**Fair (2-3 points):**
- Poor storage choice
- UserDefaults for sensitive data
- Broken persistence
- No migration strategy

**Poor (0-1 points):**
- No persistence or completely broken
- Sensitive data in plaintext

**Storage Guidelines:**
- UserDefaults: Small amounts of simple data
- Keychain: Passwords, tokens, sensitive data
- Core Data: Complex object graphs, relationships
- Realm: Alternative to Core Data
- File system: Large files, documents, media

---

## Dimension 4: Performance & Security (0-25 points)

### 4.1 Performance (0-12 points)

**Excellent (11-12 points):**
- No blocking operations on main thread
- Proper GCD/async-await usage for background work
- Image loading optimized (caching, lazy loading)
- List scrolling smooth (60fps)
- Instruments profiling performed
- Network requests optimized

**Good (8-10 points):**
- Most operations off main thread
- Background work used
- Some optimization
- Generally smooth UI

**Fair (5-7 points):**
- Some main thread blocking
- Limited background work
- Performance issues present
- Choppy scrolling

**Poor (0-4 points):**
- Main thread blocked frequently
- No background work
- Severe performance problems
- Unusable UI

**Performance Red Flags:**
- Blocking main thread with network calls
- Heavy computation in view rendering
- No image caching
- Synchronous Core Data on main thread
- Large image files not optimized
- Infinite scrolling without pagination

### 4.2 Security (0-8 points)

**Excellent (7-8 points):**
- Sensitive data in Keychain (not UserDefaults)
- API keys in environment/config (not hardcoded)
- Certificate pinning for critical APIs
- Input validation on all user data
- No sensitive data in logs
- App Transport Security configured

**Good (5-6 points):**
- Keychain used for credentials
- Most API keys not hardcoded
- Basic input validation
- ATS enabled

**Fair (3-4 points):**
- Some sensitive data in UserDefaults
- Some hardcoded keys
- Minimal validation
- ATS partially configured

**Poor (0-2 points):**
- Plaintext passwords
- Hardcoded API keys
- No validation
- ATS disabled

**Security Checklist:**
- [ ] Passwords/tokens in Keychain
- [ ] No API keys in code
- [ ] Certificate pinning (if needed)
- [ ] Input validation present
- [ ] No sensitive logs
- [ ] ATS enabled
- [ ] No insecure HTTP (unless explicitly needed)

### 4.3 Error Handling (0-5 points)

**Excellent (5 points):**
- Comprehensive error handling with `Result` or `throws`
- User-friendly error messages
- Error recovery mechanisms
- Crash reporting integrated (Crashlytics, Sentry, etc.)
- Network error handling graceful

**Good (3-4 points):**
- Most errors handled
- Basic error messages
- Some recovery
- Crash reporting present

**Fair (1-2 points):**
- Minimal error handling
- Poor error messages
- No recovery
- No crash reporting

**Poor (0 points):**
- No error handling
- App crashes frequently

---

## Quality Gate Thresholds

**Gate Status by Score:**

| Score | Status | Action |
|-------|--------|--------|
| 90-100 | ✅ **PASS** | Excellent - Ship it |
| 75-89 | ⚠️ **CAUTION** | Good - Address minor issues before ship |
| 60-74 | 🔴 **FAIL** | Significant issues - Fix before proceeding |
| 0-59 | 🚫 **BLOCK** | Major rework required |

**Critical Issues (Automatic FAIL):**
- Security vulnerabilities (hardcoded credentials, plaintext passwords)
- Memory leaks causing crashes
- App crashes on launch
- Data loss bugs
- Accessibility completely missing

---

## Scoring Example

### Example: Authentication Screen Review

**Dimension 1: Swift Standards (19/25)**
- Type Safety: 8/10 (mostly good, one force unwrap)
- Code Quality: 7/8 (follows guidelines, one warning)
- Memory Management: 4/7 (potential retain cycle in closure)

**Dimension 2: iOS UI Standards (20/25)**
- SwiftUI Best Practices: 8/10 (good composition, minor state issue)
- UIKit: N/A (using SwiftUI)
- Accessibility: 12/15 (missing hints on password field)

**Dimension 3: Architecture & Patterns (18/25)**
- Architecture: 10/12 (clear MVVM, minor coupling)
- Networking: 5/6 (good async/await usage)
- Data Persistence: 3/7 (password in UserDefaults - should be Keychain!)

**Dimension 4: Performance & Security (15/25)**
- Performance: 10/12 (smooth UI, minor optimization)
- Security: 2/8 (password in UserDefaults = critical)
- Error Handling: 3/5 (basic handling present)

**Total: 72/100 - FAIL (Security Issue)**

**Critical Issues:**
1. 🔴 Password stored in UserDefaults instead of Keychain
2. ⚠️ Potential retain cycle in network callback
3. ⚠️ Missing accessibility hints

**Recommendation:** BLOCK until password storage fixed. Security issues are non-negotiable.

---

## Anti-Pattern Library

### 1. Force Unwrapping Everywhere
```swift
// ❌ BAD
let user = users.first!
let name = user.name!
let email = user.email!

// ✅ GOOD
guard let user = users.first,
      let name = user.name,
      let email = user.email else { return }
```

### 2. Massive View Controllers
```swift
// ❌ BAD - 800 line view controller
class ProfileViewController: UIViewController {
    // Everything in one file: networking, UI, business logic
}

// ✅ GOOD - Separated concerns
class ProfileViewController: UIViewController {
    let viewModel: ProfileViewModel  // Business logic
    let networking: NetworkService    // Networking
    // Only UI code here
}
```

### 3. Retain Cycles in Closures
```swift
// ❌ BAD
networkService.fetchData { data in
    self.updateUI(data)  // Strong reference to self
}

// ✅ GOOD
networkService.fetchData { [weak self] data in
    self?.updateUI(data)
}
```

### 4. Blocking Main Thread
```swift
// ❌ BAD
func loadImage() {
    let data = try! Data(contentsOf: imageURL)  // Blocks UI!
    imageView.image = UIImage(data: data)
}

// ✅ GOOD
func loadImage() async {
    let data = try await URLSession.shared.data(from: imageURL)
    await MainActor.run {
        imageView.image = UIImage(data: data.0)
    }
}
```

### 5. Hardcoded Credentials
```swift
// ❌ BAD
let apiKey = "sk_live_abc123xyz"

// ✅ GOOD
let apiKey = ProcessInfo.processInfo.environment["API_KEY"] ?? ""
// Or load from secure Keychain
```

### 6. No Accessibility
```swift
// ❌ BAD
Button(action: { submit() }) {
    Image(systemName: "paperplane")
}

// ✅ GOOD
Button(action: { submit() }) {
    Image(systemName: "paperplane")
}
.accessibilityLabel("Submit")
.accessibilityHint("Submits the form")
```

---

## Automated Checks (Future)

**Scripts to develop:**
- SwiftLint configuration for standards
- Static analyzer for force unwraps
- Accessibility checker
- Security scanner for hardcoded keys
- Memory leak detector (Instruments automation)

---

## Related Documents

- **Orchestrator Framework:** `.claude/orchestration/reference/orchestrator-framework.md`
- **iOS Agent Prompts:** `~/.claude/agents/ios-*.md`
- **iOS Standards:** `.claude/orchestration/reference/ios-standards.md`

---

## Changelog

- **2025-11-20:** Initial iOS rubric created

---

_iOS Quality Rubric v1.0 - Apply to all iOS deliverables_
