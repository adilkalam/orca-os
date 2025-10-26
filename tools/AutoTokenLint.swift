#!/usr/bin/env swift

//
// AutoTokenLint.swift
// Automated token compliance linter for iOS projects
//
// Usage:
//   ./tools/AutoTokenLint.swift path/to/project
//
// Returns:
//   Exit 0 if all checks pass
//   Exit 1 if violations found (blocks build)
//

import Foundation

// ANSI colors
let red = "\u{001B}[0;31m"
let green = "\u{001B}[0;32m"
let yellow = "\u{001B}[1;33m"
let reset = "\u{001B}[0m"

// Configuration
struct LintConfig {
    let projectPath: String
    let excludePatterns: [String] = [
        ".build/",
        "DerivedData/",
        ".git/",
        "Pods/",
        "DesignTokens.swift"  // Don't lint the tokens file itself
    ]
}

struct Violation {
    let file: String
    let line: Int
    let code: String
    let message: String
    let severity: Severity
    
    enum Severity: String {
        case error = "ERROR"
        case warning = "WARNING"
    }
}

class TokenLinter {
    let config: LintConfig
    var violations: [Violation] = []
    
    init(config: LintConfig) {
        self.config = config
    }
    
    func run() -> Int {
        print("🔍 AutoTokenLint - Scanning for hardcoded values...")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("")

        // Rule 0: Check Design DNA exists (No DNA, no design)
        let designDNACheck = checkDesignDNA()
        if !designDNACheck.passed {
            print("\(red)❌ BLOCKING: Design DNA missing\(reset)")
            print("Project: \(designDNACheck.projectName)")
            print("")
            print("Rule: No DNA, no design. Design DNA schemas are MANDATORY.")
            print("")
            print("Required files:")
            print("  - .claude/design-dna/\(designDNACheck.projectName).json (project-specific)")
            print("  - .claude/design-dna/universal-taste.json (fallback)")
            print("")
            print("\(red)❌ BUILD BLOCKED: Create Design DNA schema before UI implementation\(reset)")
            print("")
            return 1
        }
        print("\(green)✅ Design DNA: \(designDNACheck.schemaPath)\(reset)")
        print("")

        // Find all Swift files
        let swiftFiles = findSwiftFiles(in: config.projectPath)
        print("Found \(swiftFiles.count) Swift files to scan")
        print("")
        
        // Lint each file
        for file in swiftFiles {
            lintFile(file)
        }
        
        // Report results
        printReport()
        
        // Return exit code
        let errorCount = violations.filter { $0.severity == .error }.count
        return errorCount > 0 ? 1 : 0
    }
    
    struct DNACheckResult {
        let passed: Bool
        let projectName: String
        let schemaPath: String
    }

    func checkDesignDNA() -> DNACheckResult {
        let fileManager = FileManager.default

        // Try to detect project name from directory or files
        let projectName = (config.projectPath as NSString).lastPathComponent.lowercased()

        // Check for project-specific DNA
        let projectDNA = ".claude/design-dna/\(projectName).json"
        let universalDNA = ".claude/design-dna/universal-taste.json"

        if fileManager.fileExists(atPath: projectDNA) {
            return DNACheckResult(passed: true, projectName: projectName, schemaPath: projectDNA)
        } else if fileManager.fileExists(atPath: universalDNA) {
            return DNACheckResult(passed: true, projectName: projectName, schemaPath: universalDNA)
        } else {
            return DNACheckResult(passed: false, projectName: projectName, schemaPath: "")
        }
    }

    func findSwiftFiles(in path: String) -> [String] {
        var files: [String] = []
        let fileManager = FileManager.default

        guard let enumerator = fileManager.enumerator(atPath: path) else {
            return files
        }

        while let file = enumerator.nextObject() as? String {
            // Skip excluded paths
            if config.excludePatterns.contains(where: { file.contains($0) }) {
                continue
            }

            // Include .swift files only
            if file.hasSuffix(".swift") {
                files.append((path as NSString).appendingPathComponent(file))
            }
        }

        return files
    }
    
    func lintFile(_ filePath: String) {
        guard let content = try? String(contentsOfFile: filePath, encoding: .utf8) else {
            return
        }
        
        let lines = content.components(separatedBy: .newlines)
        
        for (index, line) in lines.enumerated() {
            let lineNumber = index + 1
            
            // Check for hardcoded fonts
            checkHardcodedFonts(line: line, lineNumber: lineNumber, file: filePath)
            
            // Check for hardcoded colors
            checkHardcodedColors(line: line, lineNumber: lineNumber, file: filePath)
            
            // Check for hardcoded spacing (non-token values)
            checkHardcodedSpacing(line: line, lineNumber: lineNumber, file: filePath)
        }
    }
    
    func checkHardcodedFonts(line: String, lineNumber: Int, file: String) {
        // Pattern: .font(.system(size:
        let fontSystemPattern = #"\.font\(\.system\(size:"#
        
        if line.range(of: fontSystemPattern, options: .regularExpression) != nil {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded font size using .font(.system(size:). Use Tokens.Typography.font() instead.",
                severity: .error
            ))
        }
        
        // Pattern: Font.system(size:
        let fontInitPattern = #"Font\.system\(size:"#
        
        if line.range(of: fontInitPattern, options: .regularExpression) != nil {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded font size using Font.system(size:). Use Tokens.Typography constants instead.",
                severity: .error
            ))
        }
    }
    
    func checkHardcodedColors(line: String, lineNumber: Int, file: String) {
        // Skip if line uses Tokens.Color
        if line.contains("Tokens.Color") {
            return
        }
        
        // Pattern: Color(red:
        let colorRGBPattern = #"Color\(red:"#
        
        if line.range(of: colorRGBPattern, options: .regularExpression) != nil {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded color using Color(red:green:blue:). Use Tokens.Color constants instead.",
                severity: .error
            ))
        }
        
        // Pattern: Color(hue:
        let colorHSBPattern = #"Color\(hue:"#
        
        if line.range(of: colorHSBPattern, options: .regularExpression) != nil {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded color using Color(hue:saturation:brightness:). Use Tokens.Color constants instead.",
                severity: .error
            ))
        }
        
        // Pattern: Color(hex: OR Color.init(hex:
        // This is ALLOWED if it's in DesignTokens.swift (excluded above)
        // but not elsewhere
        let hexColorPattern = #"Color(?:\.init)?\(hex:"#
        
        if line.range(of: hexColorPattern, options: .regularExpression) != nil,
           !file.contains("DesignTokens.swift") {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded hex color. Define in DesignTokens.swift and use Tokens.Color instead.",
                severity: .error
            ))
        }
        
        // Pattern: UIColor(red:
        let uiColorPattern = #"UIColor\(red:"#
        
        if line.range(of: uiColorPattern, options: .regularExpression) != nil {
            violations.append(Violation(
                file: file,
                line: lineNumber,
                code: line.trimmingCharacters(in: .whitespaces),
                message: "Hardcoded UIColor. Use Tokens.Color (SwiftUI) instead.",
                severity: .error
            ))
        }
    }
    
    func checkHardcodedSpacing(line: String, lineNumber: Int, file: String) {
        // Skip if line uses Tokens.Space or Tokens.Layout
        if line.contains("Tokens.Space") || line.contains("Tokens.Layout") {
            return
        }
        
        // Pattern: .padding(number) where number is NOT a multiple of 4
        // This is a warning, not an error, since some valid cases exist
        let paddingPattern = #"\.padding\((\d+)\)"#
        
        if let match = line.range(of: paddingPattern, options: .regularExpression) {
            let matchedText = String(line[match])
            if let number = Int(matchedText.filter { $0.isNumber }) {
                if number % 4 != 0 {
                    violations.append(Violation(
                        file: file,
                        line: lineNumber,
                        code: line.trimmingCharacters(in: .whitespaces),
                        message: "Padding value \(number) is not a multiple of 4. Use Tokens.Space constants (4px grid).",
                        severity: .warning
                    ))
                }
            }
        }
    }
    
    func printReport() {
        let errors = violations.filter { $0.severity == .error }
        let warnings = violations.filter { $0.severity == .warning }
        
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("")
        
        if violations.isEmpty {
            print("\(green)✅ No token violations found!\(reset)")
            print("")
            return
        }
        
        // Print errors
        if !errors.isEmpty {
            print("\(red)❌ ERRORS (\(errors.count)):\(reset)")
            print("")
            for violation in errors {
                printViolation(violation)
            }
        }
        
        // Print warnings
        if !warnings.isEmpty {
            print("\(yellow)⚠️  WARNINGS (\(warnings.count)):\(reset)")
            print("")
            for violation in warnings {
                printViolation(violation)
            }
        }
        
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        
        if !errors.isEmpty {
            print("\(red)❌ BUILD BLOCKED: Fix \(errors.count) error(s) before building\(reset)")
        } else if !warnings.isEmpty {
            print("\(yellow)⚠️  \(warnings.count) warning(s) found (build will continue)\(reset)")
        }
        
        print("")
    }
    
    func printViolation(_ violation: Violation) {
        let fileName = (violation.file as NSString).lastPathComponent
        let color = violation.severity == .error ? red : yellow
        
        print("\(color)\(violation.severity.rawValue):\(reset) \(fileName):\(violation.line)")
        print("  \(violation.message)")
        print("  Code: \(violation.code)")
        print("")
    }
}

// Main execution
let arguments = CommandLine.arguments

guard arguments.count > 1 else {
    print("\(red)Error: Project path required\(reset)")
    print("Usage: ./AutoTokenLint.swift path/to/project")
    exit(1)
}

let projectPath = arguments[1]
let config = LintConfig(projectPath: projectPath)
let linter = TokenLinter(config: config)

exit(Int32(linter.run()))
