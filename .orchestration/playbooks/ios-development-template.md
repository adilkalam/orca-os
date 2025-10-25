# iOS Development Playbook Template

**Version:** 1.0.0
**Project Type:** iOS
**Last Updated:** 2025-10-24

This playbook contains curated patterns for iOS development with Swift 6.2, SwiftUI, and modern iOS frameworks. Patterns are organized by confidence level and updated based on real-world outcomes.

---

## Legend

- **✓** Proven helpful patterns (use these)
- **✗** Harmful anti-patterns (avoid these)
- **○** Neutral patterns (context-dependent)

Each pattern includes:
- **Context**: When this pattern applies
- **Strategy**: What to do (or avoid)
- **Evidence**: Why it works/fails
- **Counts**: helpful_count / harmful_count (updated by curator)

---

## ✓ Production-Ready Patterns

### Modern Architecture & Data

**✓ SwiftUI + SwiftData + State-First for iOS 17+**
*Pattern ID: ios-pattern-001 | Counts: 0/0*

**Context:** iOS 17+ apps with local data persistence

**Strategy:** Dispatch swiftui-developer + swiftdata-specialist + state-architect

**Evidence:** Modern iOS development best practice, 30% faster than MVVM (template)

---

**✓ State-First Architecture Over MVVM**
*Pattern ID: ios-pattern-011 | Counts: 0/0*

**Context:** New iOS 17+ projects

**Strategy:** Use state-architect for state-first patterns, not traditional MVVM

**Evidence:** Aligns with SwiftUI's declarative nature, less boilerplate (template)

---

**✓ Observation Framework Over Combine**
*Pattern ID: ios-pattern-006 | Counts: 0/0*

**Context:** iOS 17+ with state observation needs

**Strategy:** Use observation-specialist with @Observable macro

**Evidence:** Simpler than Combine, better compiler support (template)

---

**✓ SwiftData for iOS 17+, Core Data for iOS 16**
*Pattern ID: ios-pattern-008 | Counts: 0/0*

**Context:** Choosing data persistence layer

**Strategy:** iOS 17+: swiftdata-specialist | iOS 16: coredata-expert

**Evidence:** SwiftData is modern but iOS 17+ only (template)

---

**✓ TCA for Complex Apps with Deep State**
*Pattern ID: ios-pattern-014 | Counts: 0/0*

**Context:** Complex iOS apps (banking, e-commerce)

**Strategy:** Use tca-specialist for The Composable Architecture

**Evidence:** Provides predictable state management for complex flows (template)

---

### Testing & Quality

**✓ Swift Testing Framework for iOS 17+**
*Pattern ID: ios-pattern-003 | Counts: 0/0*

**Context:** iOS 17+ projects

**Strategy:** Use swift-testing-specialist (NOT xctest-pro)

**Evidence:** Modern framework with Swift 6 support, better async testing (template)

---

**✓ UI Testing with Accessibility IDs**
*Pattern ID: ios-pattern-007 | Counts: 0/0*

**Context:** iOS apps requiring UI automation

**Strategy:** Use ui-testing-expert with accessibility-based selectors

**Evidence:** More reliable than view hierarchy queries (template)

---

**✓ Swift Code Review Before Quality Validator**
*Pattern ID: ios-pattern-009 | Counts: 0/0*

**Context:** All iOS projects

**Strategy:** Always dispatch swift-code-reviewer before quality-validator

**Evidence:** Catches Swift-specific issues (concurrency, optionals) early (template)

---

**✓ Design Review MANDATORY for Production Apps**
*Pattern ID: ios-pattern-002 | Counts: 0/0*

**Context:** iOS apps for App Store release

**Strategy:** ALWAYS include design-reviewer in team composition

**Evidence:** Catches HIG violations, visual bugs, spacing issues before QA (template)

---

**✓ VoiceOver Testing for Accessibility**
*Pattern ID: ios-pattern-010 | Counts: 0/0*

**Context:** Production iOS apps

**Strategy:** Include ios-accessibility-tester for VoiceOver compliance

**Evidence:** App Store requires accessibility, catches issues before rejection (template)

---

### Networking & APIs

**✓ URLSession with Async/Await for Networking**
*Pattern ID: ios-pattern-004 | Counts: 0/0*

**Context:** iOS 15+ apps with REST APIs

**Strategy:** Use urlsession-expert with Swift async/await patterns

**Evidence:** Cleaner than Combine, built-in, no dependencies (template)

---

### CI/CD & DevOps

**✓ Xcode Cloud for CI/CD Over Fastlane**
*Pattern ID: ios-pattern-005 | Counts: 0/0*

**Context:** iOS projects with continuous integration needs

**Strategy:** Prefer xcode-cloud-expert over fastlane-specialist for modern projects

**Evidence:** Native Xcode integration, simpler setup, Apple-maintained (template)

---

### Performance & Security

**✓ Performance Profiling with Instruments**
*Pattern ID: ios-pattern-012 | Counts: 0/0*

**Context:** Apps with performance concerns

**Strategy:** Use ios-performance-engineer to profile with Instruments

**Evidence:** Identifies CPU, memory, energy bottlenecks (template)

---

**✓ Security Testing for Sensitive Data**
*Pattern ID: ios-pattern-013 | Counts: 0/0*

**Context:** Apps handling passwords, financial data

**Strategy:** Include ios-security-tester for Keychain, biometric auth validation

**Evidence:** Prevents data leaks, ensures proper encryption (template)

---

### Orchestration Optimization

**✓ Parallel Specialist Dispatch for Independent Work**
*Pattern ID: ios-pattern-015 | Counts: 0/0*

**Context:** Tasks with independent UI and networking

**Strategy:** Dispatch swiftui-developer + urlsession-expert in parallel

**Evidence:** Reduces orchestration time by 40% for independent tasks (template)

---

## ✗ Anti-Patterns to Avoid

**✗ Avoid XCTest for iOS 17+ Projects**
*Pattern ID: ios-antipattern-001 | Counts: 0/0*

**Context:** iOS 17+ projects

**Strategy:** AVOID using xctest-pro instead of swift-testing-specialist

**Evidence:** XCTest lacks modern Swift 6 features, harder async testing (template)

---

**✗ Avoid Combine for New Projects**
*Pattern ID: ios-antipattern-002 | Counts: 0/0*

**Context:** iOS 17+ projects

**Strategy:** AVOID combine-networking, use Swift async/await instead

**Evidence:** Combine is legacy, async/await is simpler and native (template)

---

**✗ Don't Skip Design Review for Production**
*Pattern ID: ios-antipattern-003 | Counts: 0/0*

**Context:** Apps intended for App Store

**Strategy:** AVOID omitting design-reviewer to save time

**Evidence:** Leads to App Store rejections for HIG violations (template)

---

**✗ Avoid UIKit for New iOS 17+ Apps**
*Pattern ID: ios-antipattern-004 | Counts: 0/0*

**Context:** New iOS 17+ projects without legacy constraints

**Strategy:** AVOID uikit-specialist, use swiftui-developer instead

**Evidence:** UIKit is legacy, SwiftUI is the future, easier development (template)

---

**✗ Don't Use Core Data for iOS 17+ New Projects**
*Pattern ID: ios-antipattern-005 | Counts: 0/0*

**Context:** New iOS 17+ projects

**Strategy:** AVOID coredata-expert, use swiftdata-specialist instead

**Evidence:** SwiftData is simpler, better Swift integration (template)

---

## ○ Context-Dependent Patterns

**○ TCA Overkill for Simple Apps**
*Pattern ID: ios-neutral-001 | Counts: 0/0*

**Context:** Simple calculator, notes apps

**Strategy:** tca-specialist adds complexity; state-architect may suffice

**Evidence:** TCA powerful but heavy for simple state (template)

---

**○ Fastlane vs Xcode Cloud Trade-offs**
*Pattern ID: ios-neutral-002 | Counts: 0/0*

**Context:** CI/CD choice for teams

**Strategy:** fastlane-specialist for complex pipelines, xcode-cloud-expert for simplicity

**Evidence:** Fastlane more flexible, Xcode Cloud easier (template)

---

**○ UIKit for Legacy Support**
*Pattern ID: ios-neutral-003 | Counts: 0/0*

**Context:** Apps supporting iOS 14-15

**Strategy:** uikit-specialist required for older iOS versions

**Evidence:** SwiftUI limited on iOS 14-15, UIKit necessary (template)

---

**○ Combine for Existing Codebases**
*Pattern ID: ios-neutral-004 | Counts: 0/0*

**Context:** Maintaining existing Combine-based apps

**Strategy:** combine-networking appropriate for legacy maintenance

**Evidence:** Don't rewrite working Combine code, maintain consistency (template)

---

**○ Core Data for Complex Migrations**
*Pattern ID: ios-neutral-005 | Counts: 0/0*

**Context:** Apps with existing Core Data stores

**Strategy:** coredata-expert appropriate for migration scenarios

**Evidence:** SwiftData migration from Core Data requires careful planning (template)

---

## How This Playbook Evolves

This template serves as the starting point. As /orca executes iOS projects:

1. **orchestration-reflector** analyzes successful/failed specialist choices after each session
2. **playbook-curator** updates helpful/harmful counts based on outcomes
3. Patterns with `helpful_count > 5` get promoted (higher confidence)
4. Patterns with `harmful_count > helpful_count × 3` trigger apoptosis (deletion after 7-day grace period)
5. New patterns discovered in production get appended with evidence

**Next update:** Automatically after first iOS project completion
