/**
 * Task Classification System
 *
 * Analyzes user requests, conversation context, and file paths to determine:
 * - Task type (iOS UI, Frontend UI, Backend API, etc.)
 * - Required verification tools
 * - Evidence budget (points required)
 *
 * Uses rule-based classification with keyword matching and file path analysis.
 */

import {
  TaskType,
  TaskClassification,
  ToolType,
  VerificationRequest
} from './types'

// ============================================================================
// Classification Rules
// ============================================================================

interface ClassificationRule {
  taskType: TaskType
  keywords: string[]
  filePatterns: RegExp[]
  requiredTools: ToolType[]
  evidenceBudget: number
  priority: number // Higher priority wins in conflicts
}

const CLASSIFICATION_RULES: ClassificationRule[] = [
  // iOS UI Changes
  {
    taskType: 'ios-ui',
    keywords: [
      'layout', 'ui', 'view', 'button', 'chip', 'card', 'swiftui',
      'spacing', 'width', 'height', 'color', 'font', 'design',
      'visual', 'appearance', 'style', 'equal', 'align', 'screen'
    ],
    filePatterns: [
      /\.swift$/,
      /Views?\//,
      /Components?\//,
      /Design\//,
      /UI/
    ],
    requiredTools: ['xcodebuild', 'simulator', 'screenshot', 'xcuitest'],
    evidenceBudget: 5,
    priority: 10
  },

  // iOS Logic Changes
  {
    taskType: 'ios-logic',
    keywords: [
      'calculate', 'function', 'method', 'logic', 'algorithm',
      'data', 'model', 'service', 'manager', 'handler'
    ],
    filePatterns: [
      /\.swift$/,
      /Models?\//,
      /Services?\//,
      /Managers?\//,
      /Utils?\//
    ],
    requiredTools: ['xcodebuild'],
    evidenceBudget: 3,
    priority: 8
  },

  // Frontend UI Changes
  {
    taskType: 'frontend-ui',
    keywords: [
      'layout', 'ui', 'component', 'button', 'card', 'css',
      'spacing', 'width', 'height', 'color', 'font', 'design',
      'visual', 'style', 'tailwind', 'daisyui', 'responsive'
    ],
    filePatterns: [
      /\.(tsx?|jsx?)$/,
      /\.(css|scss|sass)$/,
      /components?\//i,
      /styles?\//i,
      /pages?\//i
    ],
    requiredTools: ['npm-build', 'playwright', 'browser-screenshot'],
    evidenceBudget: 5,
    priority: 10
  },

  // Frontend Logic Changes
  {
    taskType: 'frontend-logic',
    keywords: [
      'state', 'hook', 'context', 'reducer', 'api', 'fetch',
      'function', 'handler', 'utility', 'helper', 'logic'
    ],
    filePatterns: [
      /\.(tsx?|jsx?)$/,
      /hooks?\//i,
      /utils?\//i,
      /lib\//i,
      /api\//i
    ],
    requiredTools: ['npm-build'],
    evidenceBudget: 3,
    priority: 8
  },

  // Backend API Changes
  {
    taskType: 'backend-api',
    keywords: [
      'api', 'endpoint', 'route', 'controller', 'handler',
      'request', 'response', 'http', 'rest', 'graphql'
    ],
    filePatterns: [
      /\.(py|ts|js)$/,
      /routes?\//i,
      /controllers?\//i,
      /api\//i,
      /endpoints?\//i
    ],
    requiredTools: ['curl', 'pytest'],
    evidenceBudget: 5,
    priority: 10
  },

  // Backend Logic Changes
  {
    taskType: 'backend-logic',
    keywords: [
      'database', 'model', 'service', 'business logic',
      'validation', 'utility', 'helper', 'function'
    ],
    filePatterns: [
      /\.(py|ts|js)$/,
      /models?\//i,
      /services?\//i,
      /utils?\//i,
      /lib\//i
    ],
    requiredTools: ['pytest'],
    evidenceBudget: 3,
    priority: 8
  },

  // Documentation Changes
  {
    taskType: 'documentation',
    keywords: [
      'readme', 'documentation', 'docs', 'guide', 'tutorial',
      'update', 'agent count', 'command', 'reference'
    ],
    filePatterns: [
      /\.md$/,
      /README/i,
      /docs?\//i,
      /\.mdx$/
    ],
    requiredTools: ['markdown-lint', 'link-checker'],
    evidenceBudget: 2,
    priority: 9
  },

  // Configuration Changes
  {
    taskType: 'configuration',
    keywords: [
      'config', 'configuration', 'settings', 'environment',
      'package.json', 'tsconfig', '.gitignore'
    ],
    filePatterns: [
      /\.json$/,
      /\.ya?ml$/,
      /\.toml$/,
      /\.env/,
      /config/i,
      /\.gitignore$/
    ],
    requiredTools: [],
    evidenceBudget: 1,
    priority: 5
  }
]

// ============================================================================
// Task Classifier
// ============================================================================

export class TaskClassifier {
  /**
   * Classify a verification request
   */
  classify(request: VerificationRequest): TaskClassification {
    const scores = this.scoreAllRules(request)
    const bestMatch = this.selectBestMatch(scores)

    if (!bestMatch || bestMatch.score < 0.3) {
      return this.createUnknownClassification(request)
    }

    return this.createClassification(bestMatch.rule, bestMatch.score, request)
  }

  /**
   * Score all rules against the request
   */
  private scoreAllRules(request: VerificationRequest): Array<{
    rule: ClassificationRule
    score: number
  }> {
    return CLASSIFICATION_RULES.map(rule => ({
      rule,
      score: this.scoreRule(rule, request)
    }))
  }

  /**
   * Score a single rule against the request
   */
  private scoreRule(
    rule: ClassificationRule,
    request: VerificationRequest
  ): number {
    let score = 0
    let maxScore = 0

    // Keyword matching (40% weight)
    const keywordScore = this.scoreKeywords(
      rule.keywords,
      request.taskDescription,
      request.userRequest
    )
    score += keywordScore * 0.4
    maxScore += 0.4

    // File path matching (40% weight)
    const filePathScore = this.scoreFilePaths(
      rule.filePatterns,
      request.filePaths
    )
    score += filePathScore * 0.4
    maxScore += 0.4

    // Priority boost (20% weight)
    score += (rule.priority / 10) * 0.2
    maxScore += 0.2

    return maxScore > 0 ? score / maxScore : 0
  }

  /**
   * Score keyword matches
   */
  private scoreKeywords(
    keywords: string[],
    taskDescription: string,
    userRequest: string
  ): number {
    const text = (taskDescription + ' ' + userRequest).toLowerCase()
    const matches = keywords.filter(keyword =>
      text.includes(keyword.toLowerCase())
    )

    return keywords.length > 0 ? matches.length / keywords.length : 0
  }

  /**
   * Score file path matches
   */
  private scoreFilePaths(
    patterns: RegExp[],
    filePaths: string[]
  ): number {
    if (patterns.length === 0 || filePaths.length === 0) {
      return 0
    }

    const matches = filePaths.filter(path =>
      patterns.some(pattern => pattern.test(path))
    )

    return matches.length / filePaths.length
  }

  /**
   * Select best matching rule
   */
  private selectBestMatch(scores: Array<{
    rule: ClassificationRule
    score: number
  }>): { rule: ClassificationRule; score: number } | null {
    if (scores.length === 0) {
      return null
    }

    return scores.reduce((best, current) =>
      current.score > best.score ? current : best
    )
  }

  /**
   * Create classification from matched rule
   */
  private createClassification(
    rule: ClassificationRule,
    confidence: number,
    request: VerificationRequest
  ): TaskClassification {
    return {
      type: rule.taskType,
      confidence,
      requiredTools: rule.requiredTools,
      evidenceBudget: rule.evidenceBudget,
      reasoning: this.generateReasoning(rule, request),
      keywords: this.extractMatchedKeywords(rule.keywords, request),
      filePaths: this.extractMatchedFilePaths(rule.filePatterns, request.filePaths)
    }
  }

  /**
   * Create unknown classification
   */
  private createUnknownClassification(
    request: VerificationRequest
  ): TaskClassification {
    return {
      type: 'unknown',
      confidence: 0,
      requiredTools: [],
      evidenceBudget: 0,
      reasoning: 'Unable to classify task type with sufficient confidence',
      keywords: [],
      filePaths: request.filePaths
    }
  }

  /**
   * Generate reasoning for classification
   */
  private generateReasoning(
    rule: ClassificationRule,
    request: VerificationRequest
  ): string {
    const matchedKeywords = this.extractMatchedKeywords(rule.keywords, request)
    const matchedFiles = this.extractMatchedFilePaths(
      rule.filePatterns,
      request.filePaths
    )

    const parts: string[] = []

    if (matchedKeywords.length > 0) {
      parts.push(`Keywords: ${matchedKeywords.join(', ')}`)
    }

    if (matchedFiles.length > 0) {
      parts.push(`Files: ${matchedFiles.join(', ')}`)
    }

    return parts.join(' | ')
  }

  /**
   * Extract matched keywords
   */
  private extractMatchedKeywords(
    keywords: string[],
    request: VerificationRequest
  ): string[] {
    const text = (request.taskDescription + ' ' + request.userRequest).toLowerCase()
    return keywords.filter(keyword => text.includes(keyword.toLowerCase()))
  }

  /**
   * Extract matched file paths
   */
  private extractMatchedFilePaths(
    patterns: RegExp[],
    filePaths: string[]
  ): string[] {
    return filePaths.filter(path =>
      patterns.some(pattern => pattern.test(path))
    )
  }
}

// ============================================================================
// Factory Function
// ============================================================================

export function createTaskClassifier(): TaskClassifier {
  return new TaskClassifier()
}

// ============================================================================
// Exports
// ============================================================================

export { CLASSIFICATION_RULES }
