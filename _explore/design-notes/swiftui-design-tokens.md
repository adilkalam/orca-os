# SwiftUI Design Tokens (CSS-like)

Simple, CSS-like tokens to make spacing/typography/color edits easy in SwiftUI.

Files:
- `templates/ios/DesignTokens.swift` — drop into your iOS app target

Concepts:
- Spacing: multiples of 4pt (Spacing.s4/s8/s12/s16, etc.)
- Typography: `Typography.display(size:, weight:)` and `Typography.body(size:, weight:)`
- Font weights: `FontWeightName` mapped to `Font.Weight`
- Colors: reference Asset Catalog colors (e.g., `Colors.textPrimary`)

Example:
```swift
import SwiftUI

struct ExampleView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: Spacing.s12) {
            Text("Headline")
                .font(Typography.display(24, weight: .semibold))
                .foregroundStyle(Colors.textPrimary)
            Text("Body")
                .font(Typography.body(16, weight: .regular))
                .foregroundStyle(Colors.textPrimary)
        }
        .tokenPadding(Spacing.s16)
        .background(Colors.bg)
        .cornerRadius(Spacing.s12)
    }
}
```

Notes:
- Pair with the Design UI Guard to catch raw Color numeric initializers and non-4pt multiples.
- Use Asset Catalog for color tokens and name them consistently with your web tokens (if possible).

DNA integration:
- `.claude/design-dna/design-dna.json` → `allowed_font_weight_names` (e.g., ["light","regular","medium","semibold","bold"]) and `swift_typography` limits for kerning/tracking.

