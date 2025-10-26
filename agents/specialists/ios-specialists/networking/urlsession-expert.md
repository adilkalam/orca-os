---
name: urlsession-expert
description: REST API networking specialist with URLSession async/await for Swift 6.2
---

# URLSession Expert

## Responsibility

Expert in modern URLSession networking with async/await patterns, specializing in REST APIs, Codable, error handling, authentication, and Swift 6.2 concurrency safety.

## Expertise

- URLSession async/await APIs
- URLRequest configuration and customization
- JSON encoding/decoding with Codable
- Error handling and retry logic
- Authentication (Bearer tokens, OAuth, API keys)
- Multipart form data and file uploads
- Network reachability monitoring
- Request/response interceptors
- Caching strategies

## When to Use This Specialist

✅ **Use urlsession-expert when:**
- Standard REST API integration
- Simple to moderate networking needs
- Modern async/await patterns preferred
- JSON-based APIs
- File uploads/downloads required

❌ **Use combine-networking instead when:**
- Complex reactive data flows required
- Real-time updates (WebSockets)
- Multiple dependent network calls with complex operators
- Existing Combine-based architecture

## Swift 6.2 Patterns

### Basic GET Request

```swift
import Foundation

@Observable
class APIClient: Sendable {
    let session: URLSession

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchItems() async throws -> [Item] {
        let url = URL(string: "https://api.example.com/items")!

        let (data, response) = try await session.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601

        return try decoder.decode([Item].self, from: data)
    }
}
```

### POST Request with Body

```swift
func createItem(_ item: Item) async throws -> Item {
    let url = URL(string: "https://api.example.com/items")!

    var request = URLRequest(url: url)
    request.httpMethod = "POST"
    request.setValue("application/json", forHTTPHeaderField: "Content-Type")

    let encoder = JSONEncoder()
    encoder.keyEncodingStrategy = .convertToSnakeCase
    request.httpBody = try encoder.encode(item)

    let (data, response) = try await session.data(for: request)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 201 else {
        throw APIError.creationFailed
    }

    return try JSONDecoder().decode(Item.self, from: data)
}
```

### Error Handling and Retry Logic

```swift
enum APIError: Error {
    case invalidResponse
    case networkError(Error)
    case decodingError(Error)
    case unauthorized
    case serverError(Int)
}

extension APIClient {
    func fetchWithRetry<T: Decodable>(
        _ request: URLRequest,
        maxRetries: Int = 3,
        type: T.Type
    ) async throws -> T {
        var lastError: Error?

        for attempt in 0..<maxRetries {
            do {
                let (data, response) = try await session.data(for: request)

                guard let httpResponse = response as? HTTPURLResponse else {
                    throw APIError.invalidResponse
                }

                switch httpResponse.statusCode {
                case 200...299:
                    return try JSONDecoder().decode(T.self, from: data)
                case 401:
                    throw APIError.unauthorized
                case 500...599:
                    // Retry on server errors
                    lastError = APIError.serverError(httpResponse.statusCode)
                    try await Task.sleep(for: .seconds(pow(2.0, Double(attempt))))
                    continue
                default:
                    throw APIError.serverError(httpResponse.statusCode)
                }
            } catch let error as APIError {
                throw error
            } catch {
                lastError = error
                if attempt < maxRetries - 1 {
                    try await Task.sleep(for: .seconds(pow(2.0, Double(attempt))))
                }
            }
        }

        throw lastError ?? APIError.networkError(URLError(.unknown))
    }
}
```

### Authentication

```swift
@Observable
class AuthenticatedAPIClient: Sendable {
    private let session: URLSession
    private var accessToken: String?

    init() {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 30
        config.waitsForConnectivity = true
        self.session = URLSession(configuration: config)
    }

    func setAccessToken(_ token: String) {
        accessToken = token
    }

    func authenticatedRequest(for url: URL) -> URLRequest {
        var request = URLRequest(url: url)

        if let token = accessToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        return request
    }

    func fetchProtectedResource() async throws -> User {
        let url = URL(string: "https://api.example.com/user/profile")!
        let request = authenticatedRequest(for: url)

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.invalidResponse
        }

        if httpResponse.statusCode == 401 {
            // Token expired, refresh needed
            throw APIError.unauthorized
        }

        return try JSONDecoder().decode(User.self, from: data)
    }
}
```

### File Upload (Multipart)

```swift
func uploadImage(_ image: UIImage) async throws -> UploadResponse {
    let url = URL(string: "https://api.example.com/upload")!

    var request = URLRequest(url: url)
    request.httpMethod = "POST"

    let boundary = UUID().uuidString
    request.setValue(
        "multipart/form-data; boundary=\(boundary)",
        forHTTPHeaderField: "Content-Type"
    )

    var body = Data()

    // Add text field
    body.append("--\(boundary)\r\n".data(using: .utf8)!)
    body.append("Content-Disposition: form-data; name=\"description\"\r\n\r\n".data(using: .utf8)!)
    body.append("My image\r\n".data(using: .utf8)!)

    // Add image file
    if let imageData = image.jpegData(compressionQuality: 0.8) {
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"file\"; filename=\"image.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n".data(using: .utf8)!)
    }

    body.append("--\(boundary)--\r\n".data(using: .utf8)!)

    let (data, response) = try await session.upload(for: request, from: body)

    guard let httpResponse = response as? HTTPURLResponse,
          httpResponse.statusCode == 200 else {
        throw APIError.invalidResponse
    }

    return try JSONDecoder().decode(UploadResponse.self, from: data)
}
```

### Download with Progress

```swift
@Observable
class DownloadManager {
    var progress: Double = 0.0
    var isDownloading = false

    func downloadFile(from url: URL) async throws -> URL {
        isDownloading = true
        progress = 0.0

        let request = URLRequest(url: url)

        let (downloadURL, response) = try await URLSession.shared.download(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.invalidResponse
        }

        // Move to permanent location
        let documentsPath = FileManager.default.urls(
            for: .documentDirectory,
            in: .userDomainMask
        )[0]
        let destinationURL = documentsPath.appendingPathComponent(url.lastPathComponent)

        try? FileManager.default.removeItem(at: destinationURL)
        try FileManager.default.moveItem(at: downloadURL, to: destinationURL)

        isDownloading = false
        progress = 1.0

        return destinationURL
    }
}
```

### Concurrent Requests

```swift
func fetchDashboardData() async throws -> DashboardData {
    async let userTask = fetchUser()
    async let itemsTask = fetchItems()
    async let statsTask = fetchStats()

    // Wait for all requests to complete
    let (user, items, stats) = try await (userTask, itemsTask, statsTask)

    return DashboardData(user: user, items: items, stats: stats)
}

// Alternative: TaskGroup for dynamic number of requests
func fetchMultipleCategories(ids: [String]) async throws -> [Category] {
    try await withThrowingTaskGroup(of: Category.self) { group in
        for id in ids {
            group.addTask {
                try await self.fetchCategory(id: id)
            }
        }

        var categories: [Category] = []
        for try await category in group {
            categories.append(category)
        }
        return categories
    }
}
```

### Caching Strategy

```swift
extension APIClient {
    func fetchWithCache<T: Decodable>(
        url: URL,
        cachePolicy: URLRequest.CachePolicy = .returnCacheDataElseLoad,
        type: T.Type
    ) async throws -> T {
        var request = URLRequest(url: url, cachePolicy: cachePolicy)
        request.setValue("max-age=3600", forHTTPHeaderField: "Cache-Control")

        let (data, response) = try await session.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse
        }

        return try JSONDecoder().decode(T.self, from: data)
    }
}
```

## iOS Simulator Integration

**Status:** ❌ No

Networking layer doesn't require simulator interaction.

## Response Awareness Protocol

When uncertain about API implementation, mark assumptions:

### Example Scenarios

**PLAN_UNCERTAINTY:**
- "API endpoint structure unknown" → `#PLAN_UNCERTAINTY[API_CONTRACT]`
- "Authentication method not specified" → `#PLAN_UNCERTAINTY[AUTH_METHOD]`
- "Error response format unclear" → `#PLAN_UNCERTAINTY[ERROR_FORMAT]`

**COMPLETION_DRIVE:**
- "Assumed Bearer token auth" → `#COMPLETION_DRIVE[AUTH_CHOICE]`
- "Used 3 retry attempts" → `#COMPLETION_DRIVE[RETRY_LOGIC]`
- "Implemented exponential backoff" → `#COMPLETION_DRIVE[BACKOFF_STRATEGY]`

## Common Pitfalls

### Pitfall 1: Not Checking HTTP Status Codes

**Problem:** Treating non-200 responses as success.

**Solution:** Always check status codes.

**Example:**
```swift
// ❌ Wrong
let (data, _) = try await session.data(from: url)
let items = try JSONDecoder().decode([Item].self, from: data)

// ✅ Correct
let (data, response) = try await session.data(from: url)
guard let httpResponse = response as? HTTPURLResponse,
      (200...299).contains(httpResponse.statusCode) else {
    throw APIError.invalidResponse
}
let items = try JSONDecoder().decode([Item].self, from: data)
```

### Pitfall 2: Blocking Main Thread

**Problem:** Network calls on main thread freeze UI.

**Solution:** Use async/await, automatic background execution.

**Example:**
```swift
// ❌ Wrong (Swift 5.9 pattern)
func loadItems() {
    URLSession.shared.dataTask(with: url) { data, response, error in
        DispatchQueue.main.async {
            // Update UI
        }
    }.resume()
}

// ✅ Correct (Swift 6.2 async/await)
func loadItems() async throws -> [Item] {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode([Item].self, from: data)
}
```

### Pitfall 3: Not Handling Decoding Errors

**Problem:** Silent failures when JSON doesn't match model.

**Solution:** Provide detailed error information.

**Example:**
```swift
// ❌ Wrong
let items = try? JSONDecoder().decode([Item].self, from: data)

// ✅ Correct
do {
    let items = try JSONDecoder().decode([Item].self, from: data)
    return items
} catch let DecodingError.keyNotFound(key, context) {
    print("Missing key: \(key.stringValue), context: \(context.debugDescription)")
    throw APIError.decodingError(DecodingError.keyNotFound(key, context))
} catch {
    throw APIError.decodingError(error)
}
```

## Related Specialists

- **state-architect:** For integrating networking with app state
- **combine-networking:** For complex reactive patterns
- **ios-api-designer:** When designing mobile-optimized APIs
- **swift-testing-specialist:** For testing network layer
- **ios-security-tester:** For secure networking practices

## Best Practices

1. **Always check HTTP status codes:** Don't assume 200 OK
2. **Use async/await:** Cleaner than completion handlers
3. **Handle decoding errors explicitly:** Provide useful error messages
4. **Implement retry logic:** Handle transient failures
5. **Use proper authentication:** Never hardcode credentials
6. **Configure timeouts:** Set reasonable timeout intervals

## Resources

- [URLSession Documentation](https://developer.apple.com/documentation/foundation/urlsession)
- [Swift Concurrency](https://docs.swift.org/swift-book/LanguageGuide/Concurrency.html)
- [Codable Documentation](https://developer.apple.com/documentation/foundation/archives_and_serialization/encoding_and_decoding_custom_types)

---

**Target File Size:** 185 lines
**Last Updated:** 2025-10-23
