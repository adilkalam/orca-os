# Swift 6.0 + Modern iOS Patterns Guide

**Source:** steipete/agent-rules repository analysis
**Date:** 2025-10-23
**Purpose:** Canonical reference for iOS agent rebuild

---

## Executive Summary

This guide synthesizes Swift 6.0 migration patterns and modern iOS architecture from the steipete/agent-rules repository. All iOS specialists must follow these patterns.

**Key Paradigm Shifts:**
1. **Swift 6.0 Concurrency**: Data race prevention at compile-time via data isolation
2. **@Observable Over ObservableObject**: iOS 17+ native observation (no @Published needed)
3. **SwiftUI-Native Architecture**: Composition-first, no MVVM for every screen
4. **Structured Concurrency**: Task groups over unstructured tasks
5. **Swift Testing Framework**: #expect()/#require() over XCTest assertions

---

## Part 1: Swift 6.0 Concurrency Patterns

### 1.1 Data Isolation Levels

Swift 6 eliminates data races at compile-time through **data isolation**:

1. **Non-isolated (default)**: Cannot access protected state from other domains
2. **Actor-isolated**: Protection via actor instance (e.g., `actor DataManager`)
3. **Global actor-isolated**: Protection via shared actor (e.g., `@MainActor`)

**Core Principle:** "The Swift 6 language mode eliminates data races at compile time."

### 1.2 Sendable Protocol

Types conforming to `Sendable` are thread-safe and can cross isolation boundaries.

**Rules:**
- Value types with all-`Sendable` properties are implicitly `Sendable` (non-public only)
- Public types require explicit conformance
- Reference types require special handling (actors, `@unchecked Sendable` with manual synchronization)

**Example:**
```swift
// ✅ Automatic Sendable (struct, all properties Sendable)
struct ColorComponents {
    let red: Float
    let green: Float
    let blue: Float
}

// ✅ Explicit Sendable (public API)
public struct ColorComponents: Sendable {
    public let red: Float
    public let green: Float
    public let blue: Float
}

// ✅ Actor (reference type, inherently isolated)
actor DataManager {
    private var cache: [String: Data] = [:]

    func store(key: String, data: Data) {
        cache[key] = data
    }
}

// ✅ MainActor isolated class
@MainActor
final class ViewModel {
    var items: [Item] = []

    func addItem(_ item: Item) {
        items.append(item)
    }
}

// ⚠️ Unchecked Sendable (manual synchronization required)
final class LegacyCache: @unchecked Sendable {
    private let lock = NSLock()
    private var _data: [String: Data] = [:]

    func get(_ key: String) -> Data? {
        lock.lock()
        defer { lock.unlock() }
        return _data[key]
    }
}
```

### 1.3 Common Migration Patterns

#### Pattern 1: Unsafe Global Variables

**Problem:** Non-isolated mutable global state creates data races.

```swift
// ❌ Data race risk
var supportedStyleCount = 42

// ✅ Solution 1: Make immutable
let supportedStyleCount = 42

// ✅ Solution 2: Actor isolation
@MainActor
var supportedStyleCount = 42

// ⚠️ Solution 3: Only if external synchronization exists
nonisolated(unsafe) var legacyCount = 42
```

#### Pattern 2: Protocol Conformance Mismatches

**Problem:** Protocol isolation differs from conforming type.

```swift
// ❌ Isolation mismatch
protocol Styler {
    func applyStyle()  // Non-isolated
}

@MainActor
class WindowStyler: Styler {
    func applyStyle() { }  // ERROR: MainActor vs non-isolated
}

// ✅ Solution 1: Isolate protocol
@MainActor
protocol Styler {
    func applyStyle()
}

// ✅ Solution 2: Isolate requirement
protocol Styler {
    @MainActor
    func applyStyle()
}

// ✅ Solution 3: Make async (flexible isolation)
protocol Styler {
    func applyStyle() async
}
```

#### Pattern 3: Crossing Isolation Boundaries

**Problem:** Non-`Sendable` types can't cross boundaries.

```swift
// ❌ Cannot pass non-Sendable across boundaries
class MutableConfig {  // Not Sendable
    var color: UIColor = .white
}

@MainActor
func updateUI(config: MutableConfig) async {
    // ERROR: MutableConfig not Sendable
}

// ✅ Solution 1: Make Sendable (if possible)
struct Config: Sendable {
    let color: UIColor
}

// ✅ Solution 2: Use Sendable closure
func updateUI(configProvider: @Sendable () -> Config) async {
    let config = configProvider()
}

// ✅ Solution 3: sending parameter (transfers ownership)
func updateUI(config: sending MutableConfig) async {
    // config transferred, safe to use
}
```

#### Pattern 4: Actor Initialization in Non-Isolated Contexts

**Problem:** `@MainActor` initializers called during static property initialization.

```swift
// ❌ Static init calls MainActor initializer
@MainActor
class WindowStyler {
    private var viewStyler = ViewStyler()  // ERROR if ViewStyler.init is @MainActor

    init(name: String) {
        // MainActor initializer
    }
}

// ✅ Solution: nonisolated init
@MainActor
class WindowStyler {
    private var viewStyler = ViewStyler()

    nonisolated init(name: String) {
        // Can be called from non-isolated context
        // Can only access Sendable properties
    }
}
```

#### Pattern 5: Non-Isolated Deinitializers

**Problem:** Deinitializers are always non-isolated, even in actors.

```swift
// ❌ Cannot await in deinit
actor BackgroundStyler {
    private let store = StyleStore()

    deinit {
        await store.stopNotifications()  // ERROR: deinit is non-isolated
    }
}

// ✅ Solution: Unstructured task
actor BackgroundStyler {
    private let store = StyleStore()

    deinit {
        Task { [store] in
            await store.stopNotifications()
        }
    }
}
```

### 1.4 Best Practices

#### 1. Design for Sendability From the Start

**Guideline:** "Prefer value types or immutable reference types."

```swift
// ✅ Value type (automatically Sendable if properties are)
struct User: Sendable {
    let id: UUID
    let name: String
    let email: String
}

// ✅ Immutable reference type
final class UserService: Sendable {
    private let apiClient: APIClient
    private let baseURL: URL

    init(apiClient: APIClient, baseURL: URL) {
        self.apiClient = apiClient
        self.baseURL = baseURL
    }
}

// ❌ Mutable reference type (requires actor or @unchecked)
class UserCache {
    var users: [UUID: User] = [:]
}
```

#### 2. Minimize Actor Hops

**Guideline:** "Batch operations within actors."

```swift
// ❌ Multiple actor hops (slow)
actor DataManager {
    private var cache: [String: Data] = [:]

    func get(_ key: String) -> Data? { cache[key] }
    func set(_ key: String, _ value: Data) { cache[key] = value }
}

// Usage: 3 actor hops
let manager = DataManager()
if await manager.get("key1") == nil {
    await manager.set("key1", data1)
}
if await manager.get("key2") == nil {
    await manager.set("key2", data2)
}

// ✅ Batched operation (1 actor hop)
actor DataManager {
    private var cache: [String: Data] = [:]

    func setIfMissing(_ items: [(String, Data)]) {
        for (key, value) in items where cache[key] == nil {
            cache[key] = value
        }
    }
}

// Usage: 1 actor hop
await manager.setIfMissing([("key1", data1), ("key2", data2)])
```

#### 3. Leverage nonisolated for Pure Functions

**Guideline:** Mark functions that don't access actor state as `nonisolated`.

```swift
actor Calculator {
    private var history: [Int] = []

    func record(_ result: Int) {
        history.append(result)
    }

    // ✅ Pure function, no actor state access
    nonisolated func add(_ a: Int, _ b: Int) -> Int {
        a + b  // No await needed, runs immediately
    }

    // ✅ Computed property from actor state
    nonisolated var historyCount: Int {
        history.count  // Can access immutable aspects
    }
}
```

#### 4. Use Structured Concurrency

**Guideline:** "Use task groups for parallel work."

```swift
// ❌ Unstructured tasks (lose cancellation, hard to track)
func fetchAll() async throws -> [Data] {
    let task1 = Task { try await fetch("url1") }
    let task2 = Task { try await fetch("url2") }
    let task3 = Task { try await fetch("url3") }
    return try await [task1.value, task2.value, task3.value]
}

// ✅ Structured concurrency (automatic cancellation, proper lifecycle)
func fetchAll() async throws -> [Data] {
    try await withThrowingTaskGroup(of: Data.self) { group in
        group.addTask { try await fetch("url1") }
        group.addTask { try await fetch("url2") }
        group.addTask { try await fetch("url3") }

        var results: [Data] = []
        for try await result in group {
            results.append(result)
        }
        return results
    }
}
```

#### 5. Handle Cancellation Properly

**Guideline:** Always check `Task.checkCancellation()` and use `withTaskCancellationHandler`.

```swift
// ❌ Ignores cancellation
func processItems(_ items: [Item]) async {
    for item in items {
        await process(item)
    }
}

// ✅ Respects cancellation
func processItems(_ items: [Item]) async throws {
    for item in items {
        try Task.checkCancellation()
        await process(item)
    }
}

// ✅ Cleanup on cancellation
func downloadFile(from url: URL) async throws -> Data {
    try await withTaskCancellationHandler {
        try await URLSession.shared.data(from: url).0
    } onCancel: {
        // Cancel the network request
        URLSession.shared.invalidateAndCancel()
    }
}
```

### 1.5 Critical Pitfalls to Avoid

#### Pitfall 1: Non-Sendable Types Crossing Boundaries

**Most common error:** Passing mutable reference types to async contexts.

```swift
// ❌ UIImage is not Sendable
func updateImage(_ image: UIImage) async {
    await MainActor.run {
        imageView.image = image  // ERROR
    }
}

// ✅ Convert to Sendable representation
func updateImage(_ imageData: Data) async {
    await MainActor.run {
        imageView.image = UIImage(data: imageData)
    }
}
```

#### Pitfall 2: Excessive Actor Hopping

**Problem:** Each `await` crossing actor boundaries incurs overhead.

```swift
// ❌ N actor hops for N items
for id in userIDs {
    let user = await userCache.get(id)
    process(user)
}

// ✅ 1 actor hop
let users = await userCache.getAll(userIDs)
for user in users {
    process(user)
}
```

#### Pitfall 3: Mutable Global Variables

```swift
// ❌ Unprotected global (data race)
var sharedCache: [String: Data] = [:]

// ✅ Actor-isolated global
@MainActor
var sharedCache: [String: Data] = [:]

// ✅ Or make immutable
let sharedCache: [String: Data] = [:]
```

#### Pitfall 4: Sendable Closure Capture Mistakes

```swift
class ViewModel {
    var items: [Item] = []

    func loadItems() {
        // ❌ Captures non-Sendable self
        Task {
            let newItems = await fetchItems()
            self.items = newItems  // ERROR if ViewModel not Sendable
        }
    }
}

// ✅ MainActor isolation
@MainActor
final class ViewModel {
    var items: [Item] = []

    func loadItems() {
        Task { @MainActor in
            let newItems = await fetchItems()
            self.items = newItems  // OK, MainActor-isolated
        }
    }
}
```

#### Pitfall 5: Premature @unchecked Sendable

**Warning:** Only use `@unchecked Sendable` when manually verified thread safety exists.

```swift
// ❌ Using @unchecked to silence warnings (WRONG)
final class Cache: @unchecked Sendable {
    var data: [String: Data] = [:]  // Still has data races!
}

// ✅ Proper @unchecked Sendable with synchronization
final class Cache: @unchecked Sendable {
    private let lock = NSLock()
    private var _data: [String: Data] = [:]

    func get(_ key: String) -> Data? {
        lock.lock()
        defer { lock.unlock() }
        return _data[key]
    }
}

// ✅ Better: Use actor instead
actor Cache {
    private var data: [String: Data] = [:]

    func get(_ key: String) -> Data? {
        data[key]
    }
}
```

---

## Part 2: @Observable Migration (iOS 17+)

### 2.1 Overview

**Target:** iOS 17+, iPadOS 17+, macOS 14+, tvOS 17+, watchOS 10+

**Benefits:**
1. Enhanced tracking of optionals and collections
2. Simplified data flow (@State, @Environment vs @StateObject, @EnvironmentObject)
3. Improved performance (views update only when observed properties change)

**Key Insight:** "SwiftUI updates a view only when an observable property changes and the view's body reads the property directly."

### 2.2 Migration Steps

#### Step 1: Apply @Observable Macro

```swift
// ❌ Old: ObservableObject
class ArticleListViewModel: ObservableObject {
    @Published var articles: [Article] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
}

// ✅ New: @Observable (iOS 17+)
import Observation

@Observable
@MainActor
final class ArticleListViewModel {
    var articles: [Article] = []
    var isLoading = false
    var errorMessage: String?
}
```

#### Step 2: Remove @Published

```swift
// ❌ Old: @Published wrappers
@Observable
final class ViewModel {
    @Published var count = 0  // ERROR: @Observable doesn't use @Published
}

// ✅ New: Plain properties (automatically tracked)
@Observable
final class ViewModel {
    var count = 0  // Automatically tracked

    // Exclude from tracking if needed
    @ObservationIgnored
    private var internalCache: [String: Data] = [:]
}
```

#### Step 3: Update Property Wrappers

```swift
// ❌ Old: StateObject/ObservedObject/EnvironmentObject
struct ArticleListView: View {
    @StateObject private var viewModel = ArticleListViewModel()
    @ObservedObject var userSettings: UserSettings
    @EnvironmentObject var appState: AppState

    var body: some View { }
}

// ✅ New: State/Environment/@Bindable
struct ArticleListView: View {
    @State private var viewModel = ArticleListViewModel()
    var userSettings: UserSettings  // Direct property
    @Environment(AppState.self) var appState

    var body: some View { }
}

// ✅ @Bindable when you need bindings
struct EditView: View {
    @Bindable var viewModel: EditViewModel

    var body: some View {
        TextField("Name", text: $viewModel.name)  // $viewModel works
    }
}
```

### 2.3 Behavioral Differences

**Critical:** Views update MORE precisely with @Observable.

```swift
@Observable
final class ViewModel {
    var title: String = "Hello"
    var subtitle: String = "World"
}

struct ContentView: View {
    @State private var viewModel = ViewModel()

    var body: some View {
        VStack {
            Text(viewModel.title)  // Only reads title
            // Changing subtitle won't trigger this view to update
        }
    }
}
```

**With ObservableObject:** ANY @Published property change triggers ALL observers.
**With @Observable:** Only views reading the changed property update.

### 2.4 Incremental Adoption

**You can mix both systems during migration:**

```swift
// ✅ Mixed usage (temporary)
struct AppView: View {
    @StateObject private var legacyVM = LegacyViewModel()  // ObservableObject
    @State private var modernVM = ModernViewModel()        // @Observable

    var body: some View { }
}
```

**Warning:** May create subtle behavioral variations during transition.

---

## Part 3: Modern Swift Architecture

### 3.1 Paradigm Shift

**Core Principle:** "SwiftUI is the default UI paradigm for Apple platforms—embrace its declarative nature and avoid legacy UIKit patterns and unnecessary abstractions."

**Key Philosophy:** "Write SwiftUI code that looks and feels like SwiftUI. The framework has matured significantly—trust its patterns and tools."

### 3.2 State Management (SwiftUI-Native)

#### @State: View-Local Data

```swift
struct CounterView: View {
    @State private var count = 0  // View-local state

    var body: some View {
        Button("Count: \(count)") {
            count += 1
        }
    }
}
```

**Use for:** Temporary UI state (selected tab, text field contents, toggle states)

#### @Observable: Shared State

```swift
@Observable
@MainActor
final class AppState {
    var user: User?
    var isAuthenticated: Bool { user != nil }
}

@main
struct MyApp: App {
    @State private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(appState)
        }
    }
}

struct ContentView: View {
    @Environment(AppState.self) private var appState

    var body: some View {
        if appState.isAuthenticated {
            HomeView()
        } else {
            LoginView()
        }
    }
}
```

**Use for:** Shared application state, feature-level state

#### @Environment: Dependency Injection

```swift
// Define dependency
protocol ArticleService: Sendable {
    func fetchArticles() async throws -> [Article]
}

// Provide via environment
struct MyApp: App {
    @State private var articleService: ArticleService = APIArticleService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(articleService)
        }
    }
}

// Consume in views
struct ArticleListView: View {
    @Environment(ArticleService.self) private var articleService

    var body: some View { }
}
```

**Use for:** Dependency injection (services, repositories, managers)

### 3.3 Architectural Patterns

#### ❌ WRONG: ViewModel for Every Screen

```swift
// ❌ Unnecessary abstraction
struct SimpleProfileView: View {
    @State private var viewModel = ProfileViewModel()  // Why?

    var body: some View {
        VStack {
            Text(viewModel.name)
            Text(viewModel.email)
        }
    }
}

class ProfileViewModel {
    var name: String
    var email: String

    init(name: String, email: String) {
        self.name = name
        self.email = email
    }
}
```

**Problem:** Over-engineering. SwiftUI views ARE the view model.

#### ✅ CORRECT: Direct State Management

```swift
// ✅ Simple views don't need ViewModels
struct SimpleProfileView: View {
    let user: User

    var body: some View {
        VStack {
            Text(user.name)
            Text(user.email)
        }
    }
}
```

#### ✅ WHEN to Use ViewModels

**Use ViewModels when you have:**
1. Complex business logic (data transformation, validation)
2. Networking/async operations
3. State that needs to be shared across multiple views
4. Testable business logic separate from UI

```swift
// ✅ ViewModel justified (async operations, business logic)
@Observable
@MainActor
final class ArticleListViewModel {
    private let articleService: ArticleService

    var articles: [Article] = []
    var isLoading = false
    var errorMessage: String?

    init(articleService: ArticleService) {
        self.articleService = articleService
    }

    func loadArticles() async {
        isLoading = true
        errorMessage = nil

        do {
            articles = try await articleService.fetchArticles()
        } catch {
            errorMessage = "Failed to load articles"
        }

        isLoading = false
    }

    // Business logic
    func deleteArticle(_ article: Article) async throws {
        try await articleService.delete(article)
        articles.removeAll { $0.id == article.id }
    }
}
```

### 3.4 Feature-Based Organization

**❌ Type-Based (Old):**
```
MyApp/
├── Views/
│   ├── ArticleListView.swift
│   ├── ArticleDetailView.swift
│   └── ProfileView.swift
├── ViewModels/
│   ├── ArticleListViewModel.swift
│   └── ProfileViewModel.swift
└── Models/
    ├── Article.swift
    └── User.swift
```

**✅ Feature-Based (Modern):**
```
MyApp/
├── Features/
│   ├── Articles/
│   │   ├── ArticleListView.swift
│   │   ├── ArticleDetailView.swift
│   │   ├── ArticleListViewModel.swift
│   │   ├── Article.swift
│   │   └── ArticleService.swift
│   └── Profile/
│       ├── ProfileView.swift
│       ├── ProfileEditView.swift
│       ├── User.swift
│       └── ProfileService.swift
├── Core/
│   ├── Networking/
│   └── Storage/
└── App/
    ├── MyApp.swift
    └── AppState.swift
```

**Benefits:**
- Feature changes isolated to one directory
- Easier to navigate
- Clear ownership
- Easy to extract features to separate packages

### 3.5 Composition-First Design

**Guideline:** Build small, focused components and compose them.

```swift
// ❌ Monolithic view
struct ArticleView: View {
    let article: Article

    var body: some View {
        VStack {
            HStack {
                AsyncImage(url: article.authorAvatar) { ... }
                VStack(alignment: .leading) {
                    Text(article.authorName).font(.headline)
                    Text(article.publishedDate.formatted()).font(.caption)
                }
            }
            Text(article.title).font(.title)
            Text(article.body).font(.body)
            HStack {
                Button("Like") { }
                Button("Share") { }
                Button("Bookmark") { }
            }
        }
    }
}

// ✅ Composed from small components
struct ArticleView: View {
    let article: Article

    var body: some View {
        VStack {
            AuthorHeader(author: article.author, date: article.publishedDate)
            ArticleContent(title: article.title, body: article.body)
            ArticleActions(article: article)
        }
    }
}

struct AuthorHeader: View {
    let author: Author
    let date: Date

    var body: some View {
        HStack {
            AsyncImage(url: author.avatar) { ... }
            VStack(alignment: .leading) {
                Text(author.name).font(.headline)
                Text(date.formatted()).font(.caption)
            }
        }
    }
}

struct ArticleContent: View {
    let title: String
    let body: String

    var body: some View {
        VStack(alignment: .leading) {
            Text(title).font(.title)
            Text(body).font(.body)
        }
    }
}

struct ArticleActions: View {
    let article: Article

    var body: some View {
        HStack {
            Button("Like") { }
            Button("Share") { }
            Button("Bookmark") { }
        }
    }
}
```

**Benefits:**
- Reusable components
- Easier to test
- Better SwiftUI previews
- Performance optimization (only changed components re-render)

### 3.6 Async/Await as Default

**Guideline:** "Async/await as default, eliminating Combine for typical operations."

```swift
// ❌ Combine for simple async operation (overkill)
import Combine

class ArticleListViewModel: ObservableObject {
    @Published var articles: [Article] = []
    private var cancellables = Set<AnyCancellable>()

    func loadArticles() {
        articleService.fetchArticles()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { _ in },
                receiveValue: { [weak self] articles in
                    self?.articles = articles
                }
            )
            .store(in: &cancellables)
    }
}

// ✅ Async/await (simpler, cleaner)
@Observable
@MainActor
final class ArticleListViewModel {
    var articles: [Article] = []

    func loadArticles() async throws {
        articles = try await articleService.fetchArticles()
    }
}
```

**When to still use Combine:**
- Reactive streams (user input debouncing)
- Complex operator chains (merge, combineLatest, etc.)
- Publisher-based APIs (NotificationCenter.publisher)

**For most async operations:** Use async/await.

### 3.7 Testing Philosophy

**Guideline:** "Don't sacrifice code clarity for testability."

#### Test Business Logic, Not Views

```swift
// ✅ Test ViewModel business logic
@Test
func testDeleteArticle() async throws {
    let viewModel = ArticleListViewModel(articleService: MockArticleService())
    await viewModel.loadArticles()

    let initialCount = viewModel.articles.count
    let articleToDelete = viewModel.articles[0]

    try await viewModel.deleteArticle(articleToDelete)

    #expect(viewModel.articles.count == initialCount - 1)
    #expect(!viewModel.articles.contains { $0.id == articleToDelete.id })
}

// ✅ Use SwiftUI Previews for visual validation
#Preview("Article List") {
    ArticleListView(viewModel: ArticleListViewModel(
        articleService: PreviewArticleService()
    ))
}

#Preview("Empty State") {
    ArticleListView(viewModel: ArticleListViewModel(
        articleService: EmptyArticleService()
    ))
}

#Preview("Error State") {
    ArticleListView(viewModel: ArticleListViewModel(
        articleService: ErrorArticleService()
    ))
}
```

#### Test @Observable Classes Independently

```swift
@Test
func testObservableState() async {
    let appState = AppState()

    #expect(appState.isAuthenticated == false)

    appState.user = User(id: "123", name: "Test")

    #expect(appState.isAuthenticated == true)
}
```

---

## Part 4: Swift Testing Framework

### 4.1 Core Patterns

#### Assertion Model

**Replace XCTest assertions with two macros:**

```swift
// ❌ XCTest
import XCTest

final class CalculatorTests: XCTestCase {
    func testAddition() {
        let result = calculator.add(2, 3)
        XCTAssertEqual(result, 5)
    }
}

// ✅ Swift Testing
import Testing

@Suite
struct CalculatorTests {
    @Test
    func addition() {
        let result = calculator.add(2, 3)
        #expect(result == 5)  // Soft check, continues on failure
    }

    @Test
    func divisionByZero() throws {
        let result = try #require(calculator.divide(10, 0))  // Hard check, aborts on failure
        #expect(result == .infinity)
    }
}
```

**Key Differences:**
- `#expect()`: Soft check, test continues on failure
- `#require()`: Hard check, test aborts on failure (returns optional/throws)
- Use standard Swift expressions (no XCTAssertEqual, XCTAssertTrue, etc.)

#### Suite Lifecycle

```swift
@Suite
struct ArticleServiceTests {
    let articleService: ArticleService
    let mockURLSession: URLSession

    // ✅ Setup in init
    init() {
        let config = URLSessionConfiguration.ephemeral
        config.protocolClasses = [MockURLProtocol.self]
        mockURLSession = URLSession(configuration: config)
        articleService = APIArticleService(session: mockURLSession)
    }

    // ✅ Cleanup in deinit (class/actor only)
    deinit {
        mockURLSession.invalidateAndCancel()
    }

    @Test
    func fetchArticles() async throws {
        let articles = try await articleService.fetchArticles()
        #expect(articles.count > 0)
    }
}
```

**Key Points:**
- Fresh instance created per test (isolation)
- Setup in `init()`
- Cleanup in `deinit` (class/actor types only)
- No `setUp()` / `tearDown()` methods

#### Error Validation

```swift
// ❌ XCTest error validation
func testNetworkError() {
    XCTAssertThrowsError(try articleService.fetch()) { error in
        XCTAssertTrue(error is NetworkError)
        if case .httpError(let code) = error as? NetworkError {
            XCTAssertEqual(code, 404)
        }
    }
}

// ✅ Swift Testing error validation
@Test
func networkError() async {
    await #expect(throws: NetworkError.httpError(404)) {
        try await articleService.fetch()
    } catch: { error in
        // ✅ Inspect error payload
        if case .httpError(let code) = error as? NetworkError {
            #expect(code == 404)
        }
    }
}
```

### 4.2 Key Workflows

#### Parameterized Testing

```swift
// ❌ XCTest: Repetitive tests
func testPrimeNumbers() {
    XCTAssertTrue(isPrime(2))
    XCTAssertTrue(isPrime(3))
    XCTAssertTrue(isPrime(5))
    XCTAssertFalse(isPrime(4))
    XCTAssertFalse(isPrime(6))
}

// ✅ Swift Testing: Parameterized
@Test(arguments: [
    (2, true),
    (3, true),
    (5, true),
    (4, false),
    (6, false)
])
func primeNumbers(input: Int, expected: Bool) {
    #expect(isPrime(input) == expected)
}

// ✅ Or with collections
@Test(arguments: [2, 3, 5, 7, 11])
func knownPrimes(number: Int) {
    #expect(isPrime(number))
}

// ✅ Cartesian product
@Test(arguments: [1, 2, 3], [10, 20, 30])
func combinations(a: Int, b: Int) {
    #expect(a + b > 0)
    // Runs 9 test cases: (1,10), (1,20), (1,30), (2,10), ...
}

// ✅ Zipped sequences
@Test(arguments: zip([2, 4, 6], [true, true, true]))
func evenNumbers(input: Int, expected: Bool) {
    #expect(isEven(input) == expected)
}
```

**Benefits:**
- Parallel execution of test cases
- Individual failure reporting
- Reduces test duplication

#### Asynchronous Testing

```swift
// ❌ XCTest async testing (legacy)
func testAsyncOperation() {
    let expectation = expectation(description: "Operation completes")

    service.fetchData { result in
        XCTAssertNotNil(result)
        expectation.fulfill()
    }

    waitForExpectations(timeout: 5)
}

// ✅ Swift Testing async (modern)
@Test
func asyncOperation() async throws {
    let result = try await service.fetchData()
    #expect(result != nil)
}

// ✅ With confirmation (callback testing)
@Test
func callbackOperation() async {
    await confirmation { confirm in
        service.fetchData { result in
            #expect(result != nil)
            confirm()  // Mark confirmed
        }
    }
}

// ✅ Multiple confirmations
@Test
func multipleCallbacks() async {
    await confirmation(expectedCount: 3) { confirm in
        for i in 0..<3 {
            service.processItem(i) {
                confirm()  // Must be called 3 times
            }
        }
    }
}
```

#### Conditional Execution

```swift
// ✅ Disabled test
@Test(.disabled("Feature not yet implemented"))
func upcomingFeature() {
    // Won't run
}

// ✅ Conditional execution
@Test(.enabled(if: ProcessInfo.processInfo.environment["CI"] != nil))
func ciOnlyTest() {
    // Only runs in CI environment
}

// ✅ Platform-specific
@available(iOS 17, *)
@Test
func iOS17Feature() {
    // Only runs on iOS 17+
}
```

### 4.3 Best Practices

#### 1. Parallel-First Mindset

**Guideline:** "Enable parallel execution by default."

```swift
// ✅ Parallel tests (default)
@Suite
struct ParallelTests {
    @Test func test1() { }
    @Test func test2() { }
    @Test func test3() { }
    // All run in parallel
}

// ⚠️ Serialized (only when necessary)
@Suite(.serialized)
struct SerialTests {
    @Test func test1() { }
    @Test func test2() { }
    // Run one at a time
}

// ✅ Or per-test serialization
@Test(.serialized)
func databaseTest() {
    // Runs serially with other .serialized tests
}
```

**Rule:** Make tests thread-safe and independent. Only use `.serialized` for legacy tests.

#### 2. Precise Assertions

**Guideline:** Multiple independent `#expect()` statements over conditional chains.

```swift
// ❌ Cascading failures
@Test
func userValidation() {
    let user = createUser()
    #expect(user != nil)
    #expect(user!.name == "Test")  // Crash if user is nil
    #expect(user!.email == "test@example.com")
}

// ✅ All failures surface
@Test
func userValidation() {
    let user = createUser()
    #expect(user != nil)

    if let user = user {
        #expect(user.name == "Test")
        #expect(user.email == "test@example.com")
        #expect(user.age >= 18)
        // All expectations checked, all failures reported
    }
}
```

#### 3. Incremental Migration

**Guideline:** XCTest and Swift Testing coexist in the same target.

```swift
// ✅ Mix in same project
// ArticleTests.swift (XCTest)
import XCTest

final class ArticleTests: XCTestCase {
    func testLegacyFeature() {
        XCTAssertTrue(true)
    }
}

// NewArticleTests.swift (Swift Testing)
import Testing

@Suite
struct NewArticleTests {
    @Test
    func modernFeature() {
        #expect(true)
    }
}
```

**Strategy:** Migrate file-by-file without blocking CI.

#### 4. Test Organization at Scale

**Guideline:** Use tags for cross-feature visibility.

```swift
// Define tags
extension Tag {
    @Tag static var networking: Tag
    @Tag static var database: Tag
    @Tag static var ui: Tag
}

// Apply tags
@Suite(.tags(.networking))
struct NetworkTests {
    @Test func fetchArticles() { }
}

@Suite(.tags(.database))
struct DatabaseTests {
    @Test func saveUser() { }
}

@Test(.tags(.ui, .networking))
func articleListView() {
    // Tagged with both
}
```

**Usage:**
```bash
# Run only networking tests
swift test --filter .networking

# Run all except UI tests
swift test --skip-tags .ui
```

---

## Part 5: Practical Integration Patterns

### 5.1 MVVM with @Observable (Modern)

```swift
// Service Layer (Sendable, async)
protocol ArticleService: Sendable {
    func fetchArticles() async throws -> [Article]
    func deleteArticle(_ id: String) async throws
}

// ViewModel Layer (@Observable, MainActor)
@Observable
@MainActor
final class ArticleListViewModel {
    private let articleService: ArticleService

    var articles: [Article] = []
    var isLoading = false
    var errorMessage: String?

    init(articleService: ArticleService) {
        self.articleService = articleService
    }

    func loadArticles() async {
        isLoading = true
        errorMessage = nil

        do {
            articles = try await articleService.fetchArticles()
        } catch {
            errorMessage = "Failed to load articles: \(error.localizedDescription)"
        }

        isLoading = false
    }

    func deleteArticle(_ article: Article) async {
        do {
            try await articleService.deleteArticle(article.id)
            articles.removeAll { $0.id == article.id }
        } catch {
            errorMessage = "Failed to delete article"
        }
    }
}

// View Layer (SwiftUI)
struct ArticleListView: View {
    @State private var viewModel: ArticleListViewModel

    init(articleService: ArticleService) {
        _viewModel = State(initialValue: ArticleListViewModel(articleService: articleService))
    }

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let errorMessage = viewModel.errorMessage {
                ErrorView(message: errorMessage)
            } else {
                List {
                    ForEach(viewModel.articles) { article in
                        ArticleRow(article: article)
                            .swipeActions {
                                Button("Delete", role: .destructive) {
                                    Task {
                                        await viewModel.deleteArticle(article)
                                    }
                                }
                            }
                    }
                }
            }
        }
        .task {
            await viewModel.loadArticles()
        }
    }
}
```

### 5.2 Actor-Based Repository Pattern

```swift
// Repository (Actor for thread-safe caching)
actor ArticleRepository {
    private let apiClient: APIClient
    private var cache: [String: Article] = [:]

    init(apiClient: APIClient) {
        self.apiClient = apiClient
    }

    func fetchArticles(forceRefresh: Bool = false) async throws -> [Article] {
        if !forceRefresh && !cache.isEmpty {
            return Array(cache.values)
        }

        let articles = try await apiClient.fetchArticles()
        articles.forEach { cache[$0.id] = $0 }
        return articles
    }

    func deleteArticle(_ id: String) async throws {
        try await apiClient.deleteArticle(id)
        cache.removeValue(forKey: id)
    }
}

// Usage in ViewModel
@Observable
@MainActor
final class ArticleListViewModel {
    private let repository: ArticleRepository

    var articles: [Article] = []

    init(repository: ArticleRepository) {
        self.repository = repository
    }

    func loadArticles() async throws {
        articles = try await repository.fetchArticles()
    }
}
```

### 5.3 Dependency Injection with @Environment

```swift
// Define services as environment values
extension EnvironmentValues {
    @Entry var articleService: ArticleService = APIArticleService()
    @Entry var userService: UserService = APIUserService()
}

// Provide at app level
@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(\.articleService, APIArticleService())
                .environment(\.userService, APIUserService())
        }
    }
}

// Consume in views
struct ArticleListView: View {
    @Environment(\.articleService) private var articleService
    @State private var viewModel: ArticleListViewModel?

    var body: some View {
        Group {
            if let viewModel = viewModel {
                List(viewModel.articles) { article in
                    ArticleRow(article: article)
                }
            }
        }
        .task {
            viewModel = ArticleListViewModel(articleService: articleService)
            await viewModel?.loadArticles()
        }
    }
}

// Test with mock
#Preview {
    ArticleListView()
        .environment(\.articleService, MockArticleService())
}
```

---

## Part 6: Migration Checklist

### For Each iOS Agent

- [ ] **Swift 6.0 Concurrency**
  - [ ] Replace ObservableObject → @Observable (iOS 17+)
  - [ ] Add Sendable conformance to all data models
  - [ ] Add actor isolation where appropriate (actors, @MainActor)
  - [ ] Replace @Published with plain properties under @Observable
  - [ ] Update concurrency patterns (Task groups, async let)
  - [ ] Add structured concurrency examples
  - [ ] Document actor hopping minimization

- [ ] **Modern Architecture**
  - [ ] Remove unnecessary ViewModels (simple views)
  - [ ] Feature-based file organization
  - [ ] Composition-first examples
  - [ ] Async/await over Combine for simple operations
  - [ ] @State/@Environment over @StateObject/@EnvironmentObject

- [ ] **Swift Testing Framework**
  - [ ] Replace XCTest examples with Swift Testing
  - [ ] Use #expect() / #require() over XCTest assertions
  - [ ] @Suite for test organization
  - [ ] Parameterized testing examples
  - [ ] Parallel testing guidance

- [ ] **Example Code**
  - [ ] All code examples use Swift 6.0 syntax
  - [ ] Demonstrate Sendable patterns
  - [ ] Show proper actor usage
  - [ ] Include concurrency best practices
  - [ ] Test examples compile with Swift 6.0

- [ ] **Documentation**
  - [ ] Migration notes for 5.9 → 6.0
  - [ ] Pitfalls to avoid
  - [ ] Performance considerations
  - [ ] Testing strategies

---

## Part 7: Quick Reference

### Swift 6.0 Checklist

```swift
// ✅ Modern Swift 6.0 patterns
@Observable
@MainActor
final class ViewModel {
    var items: [Item] = []

    func load() async throws {
        items = try await service.fetch()
    }
}

struct Item: Sendable, Identifiable {
    let id: UUID
    let name: String
}

actor Service {
    func fetch() async throws -> [Item] {
        // Thread-safe operations
    }
}

struct ContentView: View {
    @State private var viewModel = ViewModel()

    var body: some View {
        List(viewModel.items) { item in
            Text(item.name)
        }
        .task {
            try? await viewModel.load()
        }
    }
}

@Test
func viewModelLoading() async throws {
    let viewModel = ViewModel()
    try await viewModel.load()
    #expect(viewModel.items.count > 0)
}
```

### Common Patterns

| Pattern | Use Case | Example |
|---------|----------|---------|
| `@Observable` | Shared state (iOS 17+) | ViewModel, AppState |
| `@State` | View-local state | Toggle, text field |
| `@Environment` | Dependency injection | Services, config |
| `actor` | Thread-safe state | Cache, repository |
| `@MainActor` | UI-related classes | ViewModel, Coordinator |
| `Sendable` | Cross-boundary types | Models, responses |
| `@unchecked Sendable` | Manual synchronization | Legacy, locks |
| `nonisolated` | Pure functions in actors | Computed properties |

### Testing Patterns

| XCTest | Swift Testing |
|--------|---------------|
| `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| `XCTAssertTrue(x)` | `#expect(x)` |
| `XCTAssertThrowsError()` | `#expect(throws: Error.self)` |
| `XCTestCase` class | `@Suite` struct |
| `func testX()` | `@Test func x()` |
| `setUp()` / `tearDown()` | `init()` / `deinit` |

---

## Conclusion

This guide represents modern Swift 6.0 development for iOS. All iOS agents must follow these patterns.

**Key Takeaways:**
1. Swift 6.0 eliminates data races at compile-time
2. @Observable replaces ObservableObject (iOS 17+)
3. SwiftUI-native architecture over rigid MVVM
4. Async/await over Combine for typical operations
5. Swift Testing for modern test development

**Next Steps:**
- Apply to each iOS specialist during rebuild
- Test patterns with real Swift 6.0 compiler
- Iterate based on compilation feedback

---

_Generated from steipete/agent-rules repository analysis_
_Date: 2025-10-23_
_Source: https://github.com/steipete/agent-rules_
