//
// DesignTokens.swift
// Single source of truth for all visual constants
//
// Usage:
// 1. Copy this file to your Xcode project
// 2. Customize colors/fonts for your brand
// 3. Use ONLY these tokens in SwiftUI views (no hardcoded values)
//
// Example:
//   Text("Hello")
//     .foregroundColor(Tokens.Color.textBody)
//     .padding(Tokens.Space.md)
//

import SwiftUI

enum Tokens {
    
    // MARK: - Spacing (4px base grid, 2pt in iOS)
    enum Space {
        static let base: CGFloat = 4      // 2pt - minimum unit
        static let xs: CGFloat = 8        // 4pt
        static let sm: CGFloat = 12       // 6pt
        static let md: CGFloat = 16       // 8pt
        static let lg: CGFloat = 24       // 12pt
        static let xl: CGFloat = 32       // 16pt
        static let xxl: CGFloat = 48      // 24pt
        
        // Layout-specific
        static let gutter: CGFloat = 16   // Page gutter (one padding)
        static let cardPadding: CGFloat = 20  // Card internal padding
        static let sectionGap: CGFloat = 32   // Between major sections
    }
    
    // MARK: - Radius
    enum Radius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let pill: CGFloat = 999   // Fully rounded
    }
    
    // MARK: - Colors
    enum Color {
        // Background
        static let background = SwiftUI.Color(hex: "#0C051C")
        static let surface = SwiftUI.Color(hex: "#1A1625")
        static let surfaceElevated = SwiftUI.Color(hex: "#2A2435")
        
        // Text
        static let textPrimary = SwiftUI.Color.white
        static let textBody = SwiftUI.Color.white.opacity(0.75)
        static let textSecondary = SwiftUI.Color.white.opacity(0.5)
        static let textTertiary = SwiftUI.Color.white.opacity(0.3)
        
        // Accent
        static let accentGold = SwiftUI.Color(hex: "#C9A961")
        static let accentPurple = SwiftUI.Color(hex: "#8B5CF6")
        
        // Semantic
        static let success = SwiftUI.Color(hex: "#10B981")
        static let warning = SwiftUI.Color(hex: "#F59E0B")
        static let error = SwiftUI.Color(hex: "#EF4444")
        
        // Borders & dividers
        static let border = SwiftUI.Color.white.opacity(0.1)
        static let divider = SwiftUI.Color.white.opacity(0.05)
    }
    
    // MARK: - Typography
    enum Typography {
        // Sizes (using iOS Dynamic Type as base)
        static let displayLarge: CGFloat = 34
        static let displayMedium: CGFloat = 28
        static let displaySmall: CGFloat = 24
        
        static let headingLarge: CGFloat = 20
        static let headingMedium: CGFloat = 17
        static let headingSmall: CGFloat = 15
        
        static let bodyLarge: CGFloat = 17
        static let bodyMedium: CGFloat = 15
        static let bodySmall: CGFloat = 13
        
        static let labelLarge: CGFloat = 15
        static let labelMedium: CGFloat = 13
        static let labelSmall: CGFloat = 11
        
        // Weights
        static let light: Font.Weight = .light
        static let regular: Font.Weight = .regular
        static let medium: Font.Weight = .medium
        static let semibold: Font.Weight = .semibold
        static let bold: Font.Weight = .bold
        
        // Helper: Create font with weight
        static func font(size: CGFloat, weight: Font.Weight = .regular) -> Font {
            .system(size: size, weight: weight)
        }
    }
    
    // MARK: - Motion (animation timing)
    enum Motion {
        static let instant: Double = 0.1      // Micro-interactions
        static let fast: Double = 0.15        // Button press
        static let base: Double = 0.2         // Default
        static let slow: Double = 0.3         // Max recommended
        
        // Easing (use with .animation())
        static let easeOut = Animation.easeOut(duration: base)
        static let easeInOut = Animation.easeInOut(duration: base)
        static let spring = Animation.spring(response: 0.3, dampingFraction: 0.7)
    }
    
    // MARK: - Layout Constants
    enum Layout {
        static let minTouchTarget: CGFloat = 44  // Apple HIG minimum
        static let maxContentWidth: CGFloat = 600  // Readable line length
        static let safeAreaPadding: CGFloat = Space.md
    }
}

// MARK: - Color Helper (Hex support)
extension SwiftUI.Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Usage Examples (delete before production)
#if DEBUG
struct TokenExamples: View {
    var body: some View {
        VStack(spacing: Tokens.Space.lg) {
            // Example: Card with proper spacing
            VStack(alignment: .leading, spacing: Tokens.Space.md) {
                Text("Title")
                    .font(Tokens.Typography.font(size: Tokens.Typography.headingLarge, weight: .semibold))
                    .foregroundColor(Tokens.Color.textPrimary)
                
                Text("Body text with proper opacity")
                    .font(Tokens.Typography.font(size: Tokens.Typography.bodyMedium))
                    .foregroundColor(Tokens.Color.textBody)
            }
            .padding(Tokens.Space.cardPadding)
            .background(Tokens.Color.surface)
            .cornerRadius(Tokens.Radius.md)
            
            // Example: Button with minimum touch target
            Button(action: {}) {
                Text("Tap Me")
                    .font(Tokens.Typography.font(size: Tokens.Typography.labelLarge, weight: .medium))
                    .foregroundColor(Tokens.Color.textPrimary)
                    .frame(minWidth: Tokens.Layout.minTouchTarget, minHeight: Tokens.Layout.minTouchTarget)
            }
            .background(Tokens.Color.accentPurple)
            .cornerRadius(Tokens.Radius.md)
            .animation(Tokens.Motion.easeOut, value: true)
        }
        .padding(Tokens.Space.gutter)
        .background(Tokens.Color.background)
    }
}
#endif
