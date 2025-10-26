/**
 * Behavioral Oracle System
 *
 * Generates and executes programmatic tests for objective verification.
 * Oracles measure actual behavior - can't be faked.
 *
 * Supports:
 * - iOS: XCUITest for layout equality, dimensions, interactions
 * - Frontend: Playwright for element dimensions, visual regression
 * - Backend: curl for API responses, performance
 */

import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import {
  OracleType,
  OracleDefinition,
  OracleResult
} from './types'

const execAsync = promisify(exec)
const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

// ============================================================================
// Oracle Templates
// ============================================================================

const IOS_LAYOUT_EQUALITY_TEMPLATE = `
import XCTest

class GeneratedLayoutEqualityTest: XCTestCase {
    func testElementsEqualWidth() {
        let app = XCUIApplication()
        app.launch()

        // Navigate to target screen
        {{NAVIGATION_CODE}}

        // Get elements
        let elements = app.buttons.matching(identifier: "{{ELEMENT_IDENTIFIER}}")

        XCTAssertGreaterThan(elements.count, 0, "No elements found with identifier {{ELEMENT_IDENTIFIER}}")

        // Measure widths
        var widths: [CGFloat] = []
        for i in 0..<elements.count {
            let element = elements.element(boundBy: i)
            widths.append(element.frame.width)
        }

        // Assert all equal
        let uniqueWidths = Set(widths)
        XCTAssertEqual(uniqueWidths.count, 1,
                       "All {{ELEMENT_TYPE}} must have same width. Found widths: \\(widths)")
    }
}
`

const IOS_ELEMENT_DIMENSIONS_TEMPLATE = `
import XCTest

class GeneratedDimensionsTest: XCTestCase {
    func testElementDimensions() {
        let app = XCUIApplication()
        app.launch()

        // Navigate to target screen
        {{NAVIGATION_CODE}}

        // Get element
        let element = app.{{ELEMENT_TYPE}}.matching(identifier: "{{ELEMENT_IDENTIFIER}}").firstMatch

        XCTAssertTrue(element.exists, "Element {{ELEMENT_IDENTIFIER}} not found")

        // Measure dimensions
        let width = element.frame.width
        let height = element.frame.height

        // Assert dimensions
        XCTAssertEqual(width, {{EXPECTED_WIDTH}}, accuracy: 1.0,
                       "Width should be {{EXPECTED_WIDTH}}, got \\(width)")
        XCTAssertEqual(height, {{EXPECTED_HEIGHT}}, accuracy: 1.0,
                       "Height should be {{EXPECTED_HEIGHT}}, got \\(height)")
    }
}
`

const PLAYWRIGHT_ELEMENT_DIMENSIONS_TEMPLATE = `
import { test, expect } from '@playwright/test';

test('element dimensions', async ({ page }) => {
  await page.goto('{{URL}}');

  // Get element
  const element = page.locator('{{SELECTOR}}');
  await expect(element).toBeVisible();

  // Measure dimensions
  const box = await element.boundingBox();

  expect(box).not.toBeNull();
  expect(box!.width).toBeCloseTo({{EXPECTED_WIDTH}}, 1);
  expect(box!.height).toBeCloseTo({{EXPECTED_HEIGHT}}, 1);
});
`

const PLAYWRIGHT_LAYOUT_EQUALITY_TEMPLATE = `
import { test, expect } from '@playwright/test';

test('elements equal width', async ({ page }) => {
  await page.goto('{{URL}}');

  // Get elements
  const elements = page.locator('{{SELECTOR}}');
  const count = await elements.count();

  expect(count).toBeGreaterThan(0);

  // Measure widths
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    const box = await elements.nth(i).boundingBox();
    if (box) {
      widths.push(box.width);
    }
  }

  // Assert all equal
  const uniqueWidths = new Set(widths);
  expect(uniqueWidths.size).toBe(1);
});
`

const CURL_API_RESPONSE_TEMPLATE = `
#!/bin/bash

# Test API response
response=$(curl -s -w "\\n%{http_code}" {{CURL_ARGS}} {{URL}})
status=\${response##*$'\\n'}
body=\${response%$'\\n'*}

# Check status code
if [ "$status" != "{{EXPECTED_STATUS}}" ]; then
  echo "FAIL: Expected status {{EXPECTED_STATUS}}, got $status"
  exit 1
fi

# Check response body
{{BODY_VALIDATION}}

echo "PASS"
exit 0
`

// ============================================================================
// Oracle Generator
// ============================================================================

export class OracleGenerator {
  /**
   * Generate iOS layout equality oracle
   */
  generateIOSLayoutEquality(
    elementIdentifier: string,
    elementType: string = 'chip buttons',
    navigationCode: string = ''
  ): OracleDefinition {
    const code = IOS_LAYOUT_EQUALITY_TEMPLATE
      .replace(/{{ELEMENT_IDENTIFIER}}/g, elementIdentifier)
      .replace(/{{ELEMENT_TYPE}}/g, elementType)
      .replace(/{{NAVIGATION_CODE}}/g, navigationCode || '// No navigation needed')

    return {
      type: 'ios-layout-equality',
      name: `test-${elementIdentifier}-equality`,
      description: `Verify all ${elementType} have equal width`,
      code,
      language: 'swift',
      expectedResult: 'pass'
    }
  }

  /**
   * Generate iOS element dimensions oracle
   */
  generateIOSElementDimensions(
    elementIdentifier: string,
    elementType: string,
    expectedWidth: number,
    expectedHeight: number,
    navigationCode: string = ''
  ): OracleDefinition {
    const code = IOS_ELEMENT_DIMENSIONS_TEMPLATE
      .replace(/{{ELEMENT_IDENTIFIER}}/g, elementIdentifier)
      .replace(/{{ELEMENT_TYPE}}/g, elementType)
      .replace(/{{EXPECTED_WIDTH}}/g, expectedWidth.toString())
      .replace(/{{EXPECTED_HEIGHT}}/g, expectedHeight.toString())
      .replace(/{{NAVIGATION_CODE}}/g, navigationCode || '// No navigation needed')

    return {
      type: 'ios-element-dimensions',
      name: `test-${elementIdentifier}-dimensions`,
      description: `Verify ${elementIdentifier} dimensions: ${expectedWidth}x${expectedHeight}`,
      code,
      language: 'swift',
      expectedResult: 'pass'
    }
  }

  /**
   * Generate Playwright element dimensions oracle
   */
  generatePlaywrightElementDimensions(
    url: string,
    selector: string,
    expectedWidth: number,
    expectedHeight: number
  ): OracleDefinition {
    const code = PLAYWRIGHT_ELEMENT_DIMENSIONS_TEMPLATE
      .replace(/{{URL}}/g, url)
      .replace(/{{SELECTOR}}/g, selector)
      .replace(/{{EXPECTED_WIDTH}}/g, expectedWidth.toString())
      .replace(/{{EXPECTED_HEIGHT}}/g, expectedHeight.toString())

    return {
      type: 'frontend-element-dimensions',
      name: `test-element-dimensions`,
      description: `Verify element ${selector} dimensions: ${expectedWidth}x${expectedHeight}`,
      code,
      language: 'typescript',
      expectedResult: 'pass'
    }
  }

  /**
   * Generate Playwright layout equality oracle
   */
  generatePlaywrightLayoutEquality(
    url: string,
    selector: string
  ): OracleDefinition {
    const code = PLAYWRIGHT_LAYOUT_EQUALITY_TEMPLATE
      .replace(/{{URL}}/g, url)
      .replace(/{{SELECTOR}}/g, selector)

    return {
      type: 'frontend-element-dimensions',
      name: `test-layout-equality`,
      description: `Verify all elements matching ${selector} have equal width`,
      code,
      language: 'typescript',
      expectedResult: 'pass'
    }
  }

  /**
   * Generate curl API response oracle
   */
  generateCurlAPIResponse(
    url: string,
    expectedStatus: number = 200,
    bodyValidation: string = '',
    curlArgs: string = ''
  ): OracleDefinition {
    const code = CURL_API_RESPONSE_TEMPLATE
      .replace(/{{URL}}/g, url)
      .replace(/{{EXPECTED_STATUS}}/g, expectedStatus.toString())
      .replace(/{{BODY_VALIDATION}}/g, bodyValidation || 'echo "No body validation"')
      .replace(/{{CURL_ARGS}}/g, curlArgs)

    return {
      type: 'backend-api-response',
      name: `test-api-${url.replace(/[^a-zA-Z0-9]/g, '-')}`,
      description: `Verify API ${url} returns ${expectedStatus}`,
      code,
      language: 'bash',
      expectedResult: 'pass'
    }
  }

  /**
   * Auto-generate oracle from task description
   */
  autoGenerate(taskDescription: string, taskType: string): OracleDefinition | null {
    const lower = taskDescription.toLowerCase()

    // iOS chip equality (THIS SESSION'S USE CASE!)
    if (lower.includes('chip') && lower.includes('equal') && lower.includes('width')) {
      return this.generateIOSLayoutEquality('chip-button', 'chip buttons')
    }

    // Generic iOS layout equality
    if (lower.includes('equal width') || lower.includes('same width')) {
      const elementMatch = lower.match(/(button|chip|card|cell|view)s?/)
      const elementType = elementMatch ? elementMatch[1] + 's' : 'elements'
      return this.generateIOSLayoutEquality(elementType.toLowerCase(), elementType)
    }

    // Frontend layout equality
    if (taskType === 'frontend-ui' && (lower.includes('equal') || lower.includes('same'))) {
      return this.generatePlaywrightLayoutEquality(
        'http://localhost:3000',
        '.chip-button' // Default selector
      )
    }

    // API response
    if (lower.includes('api') && lower.includes('endpoint')) {
      return this.generateCurlAPIResponse(
        'http://localhost:8080/api/test',
        200
      )
    }

    return null
  }
}

// ============================================================================
// Oracle Executor
// ============================================================================

export class OracleExecutor {
  private tempDir: string = '/tmp/claude-oracles'

  constructor() {
    // Create temp directory for oracle files
    try {
      fs.mkdirSync(this.tempDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }
  }

  /**
   * Execute an oracle
   */
  async execute(oracle: OracleDefinition): Promise<OracleResult> {
    const startTime = Date.now()

    try {
      switch (oracle.language) {
        case 'swift':
          return await this.executeSwiftOracle(oracle, startTime)
        case 'typescript':
          return await this.executePlaywrightOracle(oracle, startTime)
        case 'bash':
          return await this.executeBashOracle(oracle, startTime)
        default:
          throw new Error(`Unsupported oracle language: ${oracle.language}`)
      }
    } catch (error: any) {
      return {
        oracle,
        status: 'error',
        output: error.message || 'Unknown error',
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }
  }

  /**
   * Execute Swift/XCUITest oracle
   */
  private async executeSwiftOracle(
    oracle: OracleDefinition,
    startTime: number
  ): Promise<OracleResult> {
    // Write test file
    const testFile = path.join(this.tempDir, `${oracle.name}.swift`)
    await writeFile(testFile, oracle.code, 'utf-8')

    try {
      // Run via xcodebuild
      const { stdout, stderr } = await execAsync(
        `xcodebuild test -scheme PeptideFox ` +
        `-destination "platform=iOS Simulator,name=iPhone 15 Pro" ` +
        `-only-testing:GeneratedLayoutEqualityTest`,
        { timeout: 180000 } // 3 minutes
      )

      const output = stdout + stderr
      const passed = output.includes('Test Suite \'All tests\' passed')

      // Parse measurements if available
      const measurements = this.parseSwiftMeasurements(output)

      return {
        oracle,
        status: passed ? 'pass' : 'fail',
        output,
        measurements,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } finally {
      // Cleanup
      try {
        await unlink(testFile)
      } catch {}
    }
  }

  /**
   * Execute Playwright oracle
   */
  private async executePlaywrightOracle(
    oracle: OracleDefinition,
    startTime: number
  ): Promise<OracleResult> {
    // Write test file
    const testFile = path.join(this.tempDir, `${oracle.name}.spec.ts`)
    await writeFile(testFile, oracle.code, 'utf-8')

    try {
      // Run via playwright
      const { stdout, stderr } = await execAsync(
        `npx playwright test ${testFile}`,
        { timeout: 180000 } // 3 minutes
      )

      const output = stdout + stderr
      const passed = output.includes('passed') && !output.includes('failed')

      // Parse measurements if available
      const measurements = this.parsePlaywrightMeasurements(output)

      return {
        oracle,
        status: passed ? 'pass' : 'fail',
        output,
        measurements,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } finally {
      // Cleanup
      try {
        await unlink(testFile)
      } catch {}
    }
  }

  /**
   * Execute bash oracle
   */
  private async executeBashOracle(
    oracle: OracleDefinition,
    startTime: number
  ): Promise<OracleResult> {
    // Write test script
    const scriptFile = path.join(this.tempDir, `${oracle.name}.sh`)
    await writeFile(scriptFile, oracle.code, 'utf-8')

    try {
      // Make executable
      await execAsync(`chmod +x ${scriptFile}`)

      // Execute
      const { stdout, stderr } = await execAsync(
        scriptFile,
        { timeout: 60000 } // 1 minute
      )

      const output = stdout + stderr
      const passed = output.includes('PASS') || stdout.includes('PASS')

      return {
        oracle,
        status: passed ? 'pass' : 'fail',
        output,
        duration: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    } finally {
      // Cleanup
      try {
        await unlink(scriptFile)
      } catch {}
    }
  }

  /**
   * Parse measurements from Swift test output
   */
  private parseSwiftMeasurements(output: string): Record<string, any> {
    const measurements: Record<string, any> = {}

    // Try to extract width measurements from failure messages
    const widthMatch = output.match(/Found widths?: \[([\d.,\s]+)\]/i)
    if (widthMatch) {
      const widths = widthMatch[1].split(',').map(w => parseFloat(w.trim()))
      measurements.widths = widths
      measurements.uniqueWidths = [...new Set(widths)]
    }

    return measurements
  }

  /**
   * Parse measurements from Playwright test output
   */
  private parsePlaywrightMeasurements(output: string): Record<string, any> {
    const measurements: Record<string, any> = {}

    // Try to extract dimension measurements
    const dimensionMatch = output.match(/width:\s*([\d.]+).*height:\s*([\d.]+)/i)
    if (dimensionMatch) {
      measurements.width = parseFloat(dimensionMatch[1])
      measurements.height = parseFloat(dimensionMatch[2])
    }

    return measurements
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

export function createOracleGenerator(): OracleGenerator {
  return new OracleGenerator()
}

export function createOracleExecutor(): OracleExecutor {
  return new OracleExecutor()
}
