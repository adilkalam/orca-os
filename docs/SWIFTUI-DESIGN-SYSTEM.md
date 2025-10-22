# SwiftUI Design System
**Professional UI/UX Patterns for iOS Apps**

---

## Quick Reference

### Core Principles

1. **4px Grid**: Everything aligns to 4pt multiples
2. **Eyes Test**: Close eyes, open - primary element should grab attention instantly
3. **Optical > Mathematical**: Trust visual perception over exact measurements

---

## Typography System

### Font Roles & SwiftUI Implementation

```swift
// Define your font roles
extension Font {
    // Display - Heroes, card titles (min 24pt)
    static let displayLarge = Font.system(size: 48, weight: .thin, design: .default)
    static let displayMedium = Font.system(size: 36, weight: .thin)
    static let displaySmall = Font.system(size: 24, weight: .light)

    // Headings - Section titles
    static let heading1 = Font.system(size: 34, weight: .regular)
    static let heading2 = Font.system(size: 28, weight: .regular)
    static let heading3 = Font.system(size: 22, weight: .medium)

    // Body - Content
    static let bodyLarge = Font.system(size: 18, weight: .regular)
    static let bodyDefault = Font.system(size: 16, weight: .regular)
    static let bodySmall = Font.system(size: 14, weight: .regular)

    // Labels - UI elements
    static let labelLarge = Font.system(size: 14, weight: .medium)
    static let labelDefault = Font.system(size: 12, weight: .medium)
    static let labelSmall = Font.system(size: 11, weight: .medium)

    // Mono - Code, data
    static let monoDefault = Font.system(size: 14, design: .monospaced)
}
```

### Typography Rules

- **Minimum body text**: 14pt
- **Maximum line width**: ~45-75 characters
- **Uppercase labels**: Add `.tracking(0.08)`
- **Line spacing**: Use `.lineSpacing()` for readability

```swift
Text("LABEL")
    .font(.labelDefault)
    .textCase(.uppercase)
    .tracking(0.08)
    .foregroundColor(.secondary)

Text("Body content with optimal reading experience")
    .font(.bodyDefault)
    .lineSpacing(4)
    .frame(maxWidth: 700) // Optimal reading width
```

---

## Color System

### Semantic Colors (Light/Dark Adaptive)

```swift
extension Color {
    // Backgrounds
    static let backgroundPrimary = Color(UIColor.systemBackground)
    static let backgroundSecondary = Color(UIColor.secondarySystemBackground)
    static let backgroundTertiary = Color(UIColor.tertiarySystemBackground)

    // Text hierarchy using opacity
    static let textPrimary = Color.primary           // 100%
    static let textHigh = Color.primary.opacity(0.9)  // 90%
    static let textMedium = Color.primary.opacity(0.85) // 85%
    static let textBody = Color.primary.opacity(0.75)  // 75%
    static let textSubdued = Color.secondary          // ~60%
    static let textSubtle = Color.secondary.opacity(0.8) // ~50%

    // Surfaces
    static let surfaceRaised = Color.gray.opacity(0.05)
    static let surfaceBase = Color.gray.opacity(0.03)

    // Borders
    static let borderDefault = Color.gray.opacity(0.2)
    static let borderSubtle = Color.gray.opacity(0.15)
    static let borderFaint = Color.gray.opacity(0.1)
}
```

### Using System Colors

```swift
// Prefer system colors for automatic dark mode
Color.accentColor      // User's chosen tint
Color.primary          // Primary text
Color.secondary        // Secondary text
Color(UIColor.systemGray)
Color(UIColor.systemGray2)
// etc.
```

---

## Spacing System

### 4pt Base Grid

```swift
enum Spacing {
    static let pt4 = 4.0   // Micro
    static let pt8 = 8.0   // Tight
    static let pt12 = 12.0  // Small
    static let pt16 = 16.0  // Default
    static let pt20 = 20.0  // Medium
    static let pt24 = 24.0  // Comfortable
    static let pt32 = 32.0  // Section
    static let pt40 = 40.0  // Large
    static let pt48 = 48.0  // XLarge
    static let pt64 = 64.0  // XXLarge
    static let pt80 = 80.0  // Hero
}

// Usage
VStack(spacing: Spacing.pt16) {
    // Content
}
.padding(.horizontal, Spacing.pt24)
.padding(.vertical, Spacing.pt32)
```

### Container Padding (Responsive)

```swift
extension View {
    func containerPadding() -> some View {
        self.padding(.horizontal, UIDevice.current.userInterfaceIdiom == .pad ? 40 : 20)
            .padding(.vertical, UIDevice.current.userInterfaceIdiom == .pad ? 32 : 24)
    }
}
```

---

## Component Patterns

### Cards

```swift
struct CardView<Content: View>: View {
    let content: Content

    init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }

    var body: some View {
        content
            .padding(Spacing.pt24)
            .background(Color.surfaceBase)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.borderDefault, lineWidth: 1)
            )
            .shadow(color: .black.opacity(0.05), radius: 8, y: 2)
    }
}

// Usage
CardView {
    VStack(alignment: .leading, spacing: Spacing.pt16) {
        Text("Card Title")
            .font(.heading3)
        Text("Card content")
            .font(.bodyDefault)
            .foregroundColor(.textBody)
    }
}
```

### Buttons

```swift
struct PrimaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.labelLarge)
                .fontWeight(.medium)
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 48) // Touch target
                .background(Color.accentColor)
                .cornerRadius(8)
        }
    }
}

struct SecondaryButton: View {
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.labelLarge)
                .fontWeight(.medium)
                .foregroundColor(.primary)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color.clear)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.borderDefault, lineWidth: 1)
                )
        }
    }
}
```

### Forms

```swift
struct FormField: View {
    let label: String
    @Binding var text: String

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.pt8) {
            Text(label.uppercased())
                .font(.labelSmall)
                .tracking(0.08)
                .foregroundColor(.textSubdued)

            TextField("", text: $text)
                .font(.bodyDefault)
                .padding(Spacing.pt12)
                .background(Color.surfaceBase)
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(Color.borderDefault, lineWidth: 1)
                )
        }
    }
}
```

### Lists with Proper Spacing

```swift
struct ContentList: View {
    let items: [String]

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.pt8) {
            ForEach(items, id: \.self) { item in
                HStack(alignment: .top, spacing: Spacing.pt12) {
                    Text("•")
                        .font(.bodyDefault)
                        .foregroundColor(.accentColor)
                        .offset(y: -2) // Optical alignment

                    Text(item)
                        .font(.bodyDefault)
                        .foregroundColor(.textBody)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }
}
```

---

## Alignment Patterns

### Grid-Based Card Alignment

```swift
// Equal height cards using preference keys
struct AlignedCardsView: View {
    @State private var cardHeight: CGFloat?

    var body: some View {
        HStack(spacing: Spacing.pt16) {
            CardContent(title: "Card 1", text: "Short")
                .frame(minHeight: cardHeight)
                .background(GeometryReader { geo in
                    Color.clear.preference(
                        key: HeightPreferenceKey.self,
                        value: geo.size.height
                    )
                })

            CardContent(title: "Card 2", text: "Much longer content here")
                .frame(minHeight: cardHeight)
                .background(GeometryReader { geo in
                    Color.clear.preference(
                        key: HeightPreferenceKey.self,
                        value: geo.size.height
                    )
                })
        }
        .onPreferenceChange(HeightPreferenceKey.self) { height in
            self.cardHeight = height
        }
    }
}

struct HeightPreferenceKey: PreferenceKey {
    static var defaultValue: CGFloat?
    static func reduce(value: inout CGFloat?, nextValue: () -> CGFloat?) {
        value = max(value ?? 0, nextValue() ?? 0)
    }
}
```

### Optical Alignment

```swift
// Icon with text - optical alignment
HStack(spacing: Spacing.pt12) { // 50% more space for icons
    Image(systemName: "star.fill")
        .font(.system(size: 20)) // Max icon size
        .offset(y: -1) // Nudge up for optical alignment

    Text("Featured")
        .font(.bodyDefault)
}

// Play button - shift toward point
Image(systemName: "play.fill")
    .offset(x: 2) // Shift 5-8% right for optical center
```

---

## Animation Guidelines

### Subtle & Purposeful

```swift
// Standard transitions
extension AnyTransition {
    static var cardLift: AnyTransition {
        .asymmetric(
            insertion: .scale(scale: 0.95).combined(with: .opacity),
            removal: .scale(scale: 1.05).combined(with: .opacity)
        )
    }
}

// Hover effect (iOS 17+)
struct HoverCard: View {
    @State private var isHovered = false

    var body: some View {
        CardView {
            // Content
        }
        .scaleEffect(isHovered ? 1.02 : 1)
        .offset(y: isHovered ? -2 : 0)
        .animation(.easeOut(duration: 0.2), value: isHovered)
        .onHover { hovering in
            isHovered = hovering
        }
    }
}

// Loading state
struct LoadingSpinner: View {
    @State private var isRotating = false

    var body: some View {
        Circle()
            .stroke(Color.borderDefault, lineWidth: 3)
            .overlay(
                Circle()
                    .trim(from: 0, to: 0.25)
                    .stroke(Color.accentColor, lineWidth: 3)
                    .rotationEffect(.degrees(isRotating ? 360 : 0))
                    .animation(.linear(duration: 0.8).repeatForever(autoreverses: false), value: isRotating)
            )
            .frame(width: 40, height: 40)
            .onAppear { isRotating = true }
    }
}
```

---

## Responsive Design

### Size Classes

```swift
struct ResponsiveView: View {
    @Environment(\.horizontalSizeClass) var horizontalSizeClass

    var body: some View {
        if horizontalSizeClass == .compact {
            // iPhone layout
            VStack { content }
        } else {
            // iPad/Mac layout
            HStack { content }
        }
    }
}
```

### Adaptive Typography

```swift
extension View {
    func adaptiveFont(_ style: Font.TextStyle) -> some View {
        self.font(.system(style))
            .dynamicTypeSize(...DynamicTypeSize.xxxLarge) // Limit max size
    }
}
```

---

## Accessibility

### Required for Every View

```swift
Button(action: submitForm) {
    Text("Submit")
}
.accessibilityLabel("Submit form")
.accessibilityHint("Double tap to submit your information")
.accessibilityAddTraits(.isButton)

// Dynamic Type support
Text("Content")
    .font(.bodyDefault)
    .dynamicTypeSize(...DynamicTypeSize.accessibility3)

// VoiceOver grouping
VStack {
    Text("Price")
    Text("$99")
}
.accessibilityElement(children: .combine)
.accessibilityLabel("Price $99")
```

---

## Quality Checklist

### Before Shipping Any View

- [ ] **Typography**: Minimum 14pt for body text
- [ ] **Touch targets**: Minimum 44pt
- [ ] **Spacing**: All values from 4pt grid
- [ ] **Colors**: Use semantic colors for dark mode
- [ ] **Alignment**: Eyes Test passes
- [ ] **Loading states**: Implemented for async operations
- [ ] **Error states**: User-friendly messages
- [ ] **Accessibility**: VoiceOver tested
- [ ] **Performance**: No view body recalculations
- [ ] **Animation**: Under 0.3s, uses .easeOut

---

## Common Patterns

### Section with Label

```swift
struct LabeledSection<Content: View>: View {
    let label: String
    let content: Content

    init(_ label: String, @ViewBuilder content: () -> Content) {
        self.label = label
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.pt8) {
            Text(label.uppercased())
                .font(.labelSmall)
                .tracking(0.12)
                .foregroundColor(.textSubdued)

            content
        }
    }
}
```

### Error State

```swift
struct ErrorView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: Spacing.pt24) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundColor(.orange)

            Text(message)
                .font(.bodyDefault)
                .foregroundColor(.textBody)
                .multilineTextAlignment(.center)

            Button("Try Again", action: retry)
                .buttonStyle(.bordered)
        }
        .padding(Spacing.pt32)
    }
}
```

### Empty State

```swift
struct EmptyStateView: View {
    let title: String
    let message: String
    let actionTitle: String?
    let action: (() -> Void)?

    var body: some View {
        VStack(spacing: Spacing.pt16) {
            Image(systemName: "tray")
                .font(.system(size: 64))
                .foregroundColor(.textSubtle)

            Text(title)
                .font(.heading3)
                .foregroundColor(.textMedium)

            Text(message)
                .font(.bodyDefault)
                .foregroundColor(.textSubdued)
                .multilineTextAlignment(.center)

            if let actionTitle = actionTitle, let action = action {
                Button(actionTitle, action: action)
                    .buttonStyle(.borderedProminent)
                    .padding(.top, Spacing.pt8)
            }
        }
        .padding(Spacing.pt40)
        .frame(maxWidth: 400)
    }
}
```

---

## Key Takeaways

1. **Use the system**: Leverage SwiftUI's built-in design system
2. **Be consistent**: Same spacings, fonts, colors throughout
3. **Think in components**: Build reusable view modifiers and styles
4. **Test visually**: The Eyes Test catches what metrics miss
5. **Respect the platform**: Follow iOS Human Interface Guidelines

Remember: Great iOS apps feel native, responsive, and effortless. This system helps achieve that without sacrificing your unique design vision.