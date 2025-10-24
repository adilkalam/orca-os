---
name: combine-networking
description: Reactive networking with Combine framework for complex data flows
---

# Combine Networking

## Responsibility

Expert in reactive networking using Combine framework, specializing in dataTaskPublisher, operators (map, flatMap, catch, retry), debouncing/throttling, complex data flows, and Swift 6.2 Sendable conformance for publishers.

## Expertise

- dataTaskPublisher for network requests
- Combine operators (map, flatMap, catch, retry, timeout, debounce, throttle)
- Custom publishers and subscribers
- Multiple dependent network calls with flatMap
- Error handling with catch and replaceError
- Debouncing/throttling for search and user input
- Combine + SwiftUI integration
- Sendable conformance for Combine types in Swift 6.2
- Migration between Combine and async/await

## When to Use This Specialist

✅ **Use combine-networking when:**
- Complex reactive data flows required
- Real-time updates and streaming data
- Multiple dependent network calls with operators
- Debouncing/throttling user input (search bars)
- Existing Combine-based architecture
- Need to combine multiple data sources reactively

❌ **Use urlsession-expert instead when:**
- Simple REST API calls
- Modern async/await patterns preferred
- No reactive programming requirements
- Straightforward request/response cycles
- New projects without Combine dependency

## Swift 6.2 Patterns

### Basic GET Request with dataTaskPublisher

```swift
import Foundation
import Combine

@Observable
class CombineAPIClient: Sendable {
    private let session: URLSession
    private var cancellables = Set<AnyCancellable>()

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchItems() -> AnyPublisher<[Item], Error> {
        let url = URL(string: "https://api.example.com/items")!

        return session.dataTaskPublisher(for: url)
            .tryMap { data, response -> Data in
                guard let httpResponse = response as? HTTPURLResponse,
                      (200...299).contains(httpResponse.statusCode) else {
                    throw APIError.invalidResponse
                }
                return data
            }
            .decode(type: [Item].self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}
```

### POST Request with Body

```swift
func createItem(_ item: Item) -> AnyPublisher<Item, Error> {
    let url = URL(string: "https://api.example.com/items")!

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let encoder = JSONEncoder()
    encoder.keyEncodingStrategy = .convertToSnakeCase

    guard let body = try? encoder.encode(item) else {
        return Fail(error: APIError.encodingFailed).eraseToAnyPublisher()
    }

    request.httpBody = body

    return session.dataTaskPublisher(for: request)
        .tryMap { data, response in
            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 201 else {
                throw APIError.creationFailed
            }
            return data
        }
        .decode(type: Item.self, decoder: JSONDecoder())
        .receive(on: DispatchQueue.main)
        .eraseToAnyPublisher()
}
```

### Retry Logic with Exponential Backoff

```swift
extension CombineAPIClient {
    func fetchWithRetry<T: Decodable>(
        _ request: URLRequest,
        type: T.Type,
        maxRetries: Int = 3
    ) -> AnyPublisher<T, Error> {
        return session.dataTaskPublisher(for: request)
            .tryMap { data, response -> Data in
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw APIError.invalidResponse
                }

                switch httpResponse.statusCode {
                case 200...299:
                    return data
                case 401:
                    throw APIError.unauthorized
                case 500...599:
                    throw APIError.serverError(httpResponse.statusCode)
                default:
                    throw APIError.invalidResponse
                }
            }
            .decode(type: T.self, decoder: JSONDecoder())
            .retry(maxRetries)
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}
```

### Debouncing Search Input

```swift
@Observable
class SearchViewModel {
    @Published var searchText = ""
    @Published var results: [SearchResult] = []

    private let apiClient: CombineAPIClient
    private var cancellables = Set<AnyCancellable>()

    init(apiClient: CombineAPIClient) {
        self.apiClient = apiClient
        setupSearch()
    }

    private func setupSearch() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .filter { !$0.isEmpty }
            .flatMap { query -> AnyPublisher<[SearchResult], Never> in
                self.apiClient.search(query: query)
                    .catch { _ in Just([]) }
                    .eraseToAnyPublisher()
            }
            .assign(to: &$results)
    }
}
```

### Multiple Dependent Network Calls with flatMap

```swift
func fetchUserWithPosts(userId: String) -> AnyPublisher<UserWithPosts, Error> {
    // First, fetch user
    fetchUser(id: userId)
        .flatMap { user -> AnyPublisher<UserWithPosts, Error> in
            // Then, fetch user's posts
            self.fetchPosts(userId: user.id)
                .map { posts in
                    UserWithPosts(user: user, posts: posts)
                }
                .eraseToAnyPublisher()
        }
        .eraseToAnyPublisher()
}

// Fetch multiple resources in parallel
func fetchDashboard() -> AnyPublisher<Dashboard, Error> {
    let userPublisher = fetchUser()
    let itemsPublisher = fetchItems()
    let statsPublisher = fetchStats()

    return Publishers.Zip3(userPublisher, itemsPublisher, statsPublisher)
        .map { user, items, stats in
            Dashboard(user: user, items: items, stats: stats)
        }
        .eraseToAnyPublisher()
}
```

### Custom Publisher for Real-time Updates

```swift
import Combine

struct EventStreamPublisher: Publisher {
    typealias Output = Event
    typealias Failure = Error

    let url: URL

    func receive<S>(subscriber: S) where S: Subscriber,
                    Failure == S.Failure,
                    Output == S.Input {
        let subscription = EventStreamSubscription(
            subscriber: subscriber,
            url: url
        )
        subscriber.receive(subscription: subscription)
    }
}

final class EventStreamSubscription<S: Subscriber>: Subscription
    where S.Input == Event, S.Failure == Error {

    private var subscriber: S?
    private let url: URL
    private var task: URLSessionDataTask?

    init(subscriber: S, url: URL) {
        self.subscriber = subscriber
        self.url = url
    }

    func request(_ demand: Subscribers.Demand) {
        // Start streaming
        task = URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
            if let error = error {
                self?.subscriber?.receive(completion: .failure(error))
                return
            }

            if let data = data,
               let event = try? JSONDecoder().decode(Event.self, from: data) {
                _ = self?.subscriber?.receive(event)
            }
        }
        task?.resume()
    }

    func cancel() {
        task?.cancel()
        subscriber = nil
    }
}
```

### Combine + SwiftUI Integration

```swift
import SwiftUI
import Combine

struct ItemListView: View {
    @StateObject private var viewModel = ItemListViewModel()

    var body: some View {
        List(viewModel.items) { item in
            Text(item.name)
        }
        .onAppear {
            viewModel.loadItems()
        }
        .alert("Error", isPresented: $viewModel.showError) {
            Button("OK") { }
        } message: {
            Text(viewModel.errorMessage)
        }
    }
}

@MainActor
class ItemListViewModel: ObservableObject {
    @Published var items: [Item] = []
    @Published var showError = false
    @Published var errorMessage = ""

    private let apiClient: CombineAPIClient
    private var cancellables = Set<AnyCancellable>()

    init(apiClient: CombineAPIClient = CombineAPIClient()) {
        self.apiClient = apiClient
    }

    func loadItems() {
        apiClient.fetchItems()
            .sink { [weak self] completion in
                if case .failure(let error) = completion {
                    self?.errorMessage = error.localizedDescription
                    self?.showError = true
                }
            } receiveValue: { [weak self] items in
                self?.items = items
            }
            .store(in: &cancellables)
    }
}
```

### Sendable Conformance for Swift 6.2

```swift
// Make Combine types Sendable in Swift 6.2
extension AnyCancellable: @unchecked Sendable {}

@Observable
final class CombineNetworkManager: Sendable {
    private let session: URLSession
    private let cancellables = SendableCancellables()

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetch<T: Decodable & Sendable>(
        _ url: URL,
        type: T.Type
    ) -> AnyPublisher<T, Error> {
        session.dataTaskPublisher(for: url)
            .tryMap { data, response in
                guard let httpResponse = response as? HTTPURLResponse,
                      (200...299).contains(httpResponse.statusCode) else {
                    throw APIError.invalidResponse
                }
                return data
            }
            .decode(type: T.self, decoder: JSONDecoder())
            .receive(on: DispatchQueue.main)
            .eraseToAnyPublisher()
    }
}

// Thread-safe cancellables storage
final class SendableCancellables: @unchecked Sendable {
    private var storage = Set<AnyCancellable>()
    private let lock = NSLock()

    func insert(_ cancellable: AnyCancellable) {
        lock.lock()
        defer { lock.unlock() }
        storage.insert(cancellable)
    }

    func removeAll() {
        lock.lock()
        defer { lock.unlock() }
        storage.removeAll()
    }
}
```

### Migration: Combine → async/await

```swift
// Original Combine code
func fetchItemsCombine() -> AnyPublisher<[Item], Error> {
    session.dataTaskPublisher(for: url)
        .tryMap { data, response in /* ... */ }
        .decode(type: [Item].self, decoder: JSONDecoder())
        .eraseToAnyPublisher()
}

// Migrated to async/await
func fetchItemsAsync() async throws -> [Item] {
    let (data, response) = try await session.data(from: url)

    guard let httpResponse = response as? HTTPURLResponse,
          (200...299).contains(httpResponse.statusCode) else {
        throw APIError.invalidResponse
    }

    return try JSONDecoder().decode([Item].self, from: data)
}

// Bridge Combine to async/await
extension Publisher {
    func async() async throws -> Output {
        try await withCheckedThrowingContinuation { continuation in
            var cancellable: AnyCancellable?

            cancellable = first()
                .sink { completion in
                    switch completion {
                    case .finished:
                        break
                    case .failure(let error):
                        continuation.resume(throwing: error)
                    }
                } receiveValue: { value in
                    continuation.resume(returning: value)
                }
        }
    }
}

// Usage
let items = try await fetchItemsCombine().async()
```

## iOS Simulator Integration

**Status:** ❌ No

Networking layer doesn't require simulator interaction.

## Response Awareness Protocol

When uncertain about reactive flows, mark assumptions:

### Example Scenarios

**PLAN_UNCERTAINTY:**
- "Debounce duration not specified" → `#PLAN_UNCERTAINTY[DEBOUNCE_TIMING]`
- "Retry strategy unclear" → `#PLAN_UNCERTAINTY[RETRY_LOGIC]`
- "Stream termination conditions unknown" → `#PLAN_UNCERTAINTY[STREAM_LIFECYCLE]`

**COMPLETION_DRIVE:**
- "Used 300ms debounce for search" → `#COMPLETION_DRIVE[DEBOUNCE_VALUE]`
- "Implemented 3 retry attempts" → `#COMPLETION_DRIVE[RETRY_COUNT]`
- "Combined publishers with Zip3" → `#COMPLETION_DRIVE[OPERATOR_CHOICE]`

## Common Pitfalls

### Pitfall 1: Memory Leaks from Cancellables

**Problem:** Not storing AnyCancellable causes subscription to cancel immediately.

**Solution:** Store cancellables in Set<AnyCancellable>.

**Example:**
```swift
// ❌ Wrong - subscription cancelled immediately
apiClient.fetchItems()
    .sink { _ in }

// ✅ Correct - store cancellable
apiClient.fetchItems()
    .sink { completion in
        // Handle completion
    } receiveValue: { items in
        // Handle items
    }
    .store(in: &cancellables)
```

### Pitfall 2: Not Receiving on Main Thread

**Problem:** UI updates on background thread cause crashes.

**Solution:** Use receive(on:) operator.

**Example:**
```swift
// ❌ Wrong - may update UI on background thread
apiClient.fetchItems()
    .sink { [weak self] items in
        self?.items = items  // UI update!
    }
    .store(in: &cancellables)

// ✅ Correct - explicitly switch to main thread
apiClient.fetchItems()
    .receive(on: DispatchQueue.main)
    .sink { [weak self] items in
        self?.items = items
    }
    .store(in: &cancellables)
```

### Pitfall 3: Missing Error Handling

**Problem:** Errors terminate publisher stream permanently.

**Solution:** Use catch or replaceError to recover.

**Example:**
```swift
// ❌ Wrong - stream dies on first error
$searchText
    .flatMap { query in
        apiClient.search(query: query)
    }
    .assign(to: &$results)

// ✅ Correct - catch errors and continue
$searchText
    .flatMap { query in
        apiClient.search(query: query)
            .catch { _ in Just([]) }
    }
    .assign(to: &$results)
```

### Pitfall 4: Overusing Combine for Simple Cases

**Problem:** Combine adds complexity when async/await is simpler.

**Solution:** Use async/await for straightforward request/response.

**Example:**
```swift
// ❌ Unnecessary complexity
func loadUser() {
    apiClient.fetchUser()
        .sink { completion in /* ... */ }
        receiveValue: { [weak self] user in
            self?.user = user
        }
        .store(in: &cancellables)
}

// ✅ Simpler with async/await
func loadUser() async throws {
    user = try await apiClient.fetchUser()
}
```

## Related Specialists

- **urlsession-expert:** For simpler async/await networking
- **state-architect:** For integrating reactive flows with app state
- **swift-testing-specialist:** For testing Combine pipelines
- **ios-security-tester:** For secure reactive networking

## Best Practices

1. **Store cancellables:** Always store AnyCancellable to prevent early cancellation
2. **Use receive(on:):** Switch to main thread before UI updates
3. **Handle errors gracefully:** Use catch to prevent stream termination
4. **Debounce user input:** Reduce API calls from rapid input changes
5. **Prefer async/await:** Use Combine only when reactive features are needed
6. **Clean up subscriptions:** Cancel subscriptions when no longer needed

## Resources

- [Combine Framework Documentation](https://developer.apple.com/documentation/combine)
- [Using Combine](https://heckj.github.io/swiftui-notes/)
- [Swift Concurrency Migration Guide](https://www.swift.org/migration/documentation/migrationguide/)

---

**Target File Size:** 180 lines
**Last Updated:** 2025-10-23
