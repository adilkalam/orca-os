# Claude Code Setup Documentation

**Generated:** October 20, 2025
**Total Agents:** 29
**Total Skills:** 12
**Total Commands:** 1
**Enabled Plugins:** 10

---

## 📋 TABLE OF CONTENTS

1. [Global Agents](#global-agents)
2. [Model Strategy](#model-strategy)
3. [Agent Capability Matrix](#agent-capability-matrix)
4. [Skills Inventory](#skills-inventory)
5. [Slash Commands](#slash-commands)
6. [Enabled Plugins](#enabled-plugins)
7. [Quick Reference](#quick-reference)

---

## 🤖 GLOBAL AGENTS

### Agent Overview

| Agent | Model | Size | Category |
|-------|-------|------|----------|
| **agent-organizer** | sonnet | 7.1 KB | orchestration |
| **design-master** | sonnet | 16.6 KB | design |
| **dx-optimizer** | sonnet | 1.8 KB | general |
| **ios-dev** | sonnet | 22.0 KB | ios-development |
| **content-writer** | sonnet | 4.0 KB | leamas |
| **security-auditor** | sonnet | 7.9 KB | leamas |
| **vibe-coding-coach** | sonnet | 4.9 KB | leamas |
| **agent-organizer** | sonnet | 43.2 KB | leamas |
| **code-reviewer-pro** | sonnet | 9.6 KB | leamas |
| **frontend-developer** | sonnet | 4.5 KB | leamas |
| **nextjs-pro** | sonnet | 7.3 KB | leamas |
| **react-pro** | sonnet | 7.4 KB | leamas |
| **ui-designer** | sonnet | 6.9 KB | leamas |
| **ux-designer** | sonnet | 6.7 KB | leamas |
| **business-analyst** | haiku | 1.0 KB | leamas |
| **context-manager** | opus | 1.9 KB | leamas |
| **data-scientist** | haiku | 0.9 KB | leamas |
| **debugger** | sonnet | 0.8 KB | leamas |
| **ios-developer** | sonnet | 1.2 KB | leamas |
| **javascript-pro** | sonnet | 1.2 KB | leamas |
| **legal-advisor** | haiku | 1.9 KB | leamas |
| **mobile-developer** | sonnet | 1.1 KB | leamas |
| **payment-integration** | sonnet | 1.2 KB | leamas |
| **prompt-engineer** | opus | 3.0 KB | leamas |
| **python-pro** | sonnet | 1.3 KB | leamas |
| **quant-analyst** | opus | 1.3 KB | leamas |
| **seo-specialist** | sonnet | 8.8 KB | seo |
| **swift-architect** | opus | 5.4 KB | ios-development |
| **swiftui-specialist** | sonnet | 34.2 KB | ios-development |

### Agents by Category

#### DESIGN (1 agents)

- **design-master** (sonnet)

#### GENERAL (1 agents)

- **dx-optimizer** (sonnet)

#### IOS-DEVELOPMENT (3 agents)

- **ios-dev** (sonnet)
- **swift-architect** (opus)
- **swiftui-specialist** (sonnet)

#### LEAMAS (22 agents)

- **content-writer** (sonnet)
- **security-auditor** (sonnet)
- **vibe-coding-coach** (sonnet)
- **agent-organizer** (sonnet)
- **code-reviewer-pro** (sonnet)
- **frontend-developer** (sonnet)
- **nextjs-pro** (sonnet)
- **react-pro** (sonnet)
- **ui-designer** (sonnet)
- **ux-designer** (sonnet)
- **business-analyst** (haiku)
- **context-manager** (opus)
- **data-scientist** (haiku)
- **debugger** (sonnet)
- **ios-developer** (sonnet)
- **javascript-pro** (sonnet)
- **legal-advisor** (haiku)
- **mobile-developer** (sonnet)
- **payment-integration** (sonnet)
- **prompt-engineer** (opus)
- **python-pro** (sonnet)
- **quant-analyst** (opus)

#### ORCHESTRATION (1 agents)

- **agent-organizer** (sonnet)

#### SEO (1 agents)

- **seo-specialist** (sonnet)

### Agent Details

### agent-organizer

**Model:** SONNET
**Category:** orchestration
**Size:** 7.1 KB

Expert agent organizer specializing in multi-agent orchestration, team assembly, and workflow optimization. Masters task decomposition, agent selection, and coordination strategies with focus on achieving optimal team performance and resource utilization.

**Tools:** Read, Write, agent-registry, task-queue, monitoring

---

### design-master

**Model:** SONNET
**Category:** design
**Size:** 16.6 KB

Comprehensive UI/UX design expert combining pixel-perfect precision engineering, user experience optimization, premium interface design, and scalable design systems. Integrates mathematical spacing discipline, Tailwind CSS mastery, Highcharts visualization, and business-driven decision frameworks. Use PROACTIVELY for any design work from concept to implementation.
**Capabilities:**
- Simplify confusing user flows and reduce friction
- Transform complex multi-step processes into streamlined experiences
- Make interfaces obvious and intuitive
- Eliminate unnecessary clicks and cognitive load
- Apply cognitive load theory and Hick's Law

**Tools:** Read, Write, Edit, MultiEdit, Grep, Glob, Bash, TodoWrite, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_refiner, mcp__context7__resolve-library-id, mcp__context7__get-library-docs

---

### dx-optimizer

**Model:** SONNET
**Category:** general
**Size:** 1.8 KB

Developer Experience specialist for tooling, setup, and workflow optimization. Use PROACTIVELY when setting up projects, reducing friction, or improving development workflows and automation.

**Tools:** Read, Write, Edit, Bash

---

### ios-dev

**Model:** SONNET
**Category:** ios-development
**Size:** 22.0 KB

Comprehensive iOS development expert combining feature implementation, Swift 6.0 development, advanced iOS ecosystem features, Apple platform integrations, and App Store optimization. Use for iOS app development, widgets, Live Activities, cross-platform Apple development, and production deployments.
**Capabilities:**
- **Swift 6.0 Development**: Modern Swift syntax, concurrency, and best practices
- **Feature Implementation**: Building complete iOS features from requirements to code
- **UIKit & SwiftUI**: Mixed UI development with protocol-based theming
- **Networking & Data**: RESTful APIs, JSON parsing, and data persistence
- **Performance Optimization**: Memory-efficient code and smooth user experiences

**Tools:** Read, Edit, Glob, Grep, Bash, MultiEdit

---

### content-writer

**Model:** SONNET
**Category:** leamas
**Size:** 4.0 KB

Use this agent when you need to create compelling, informative content that explains complex topics in simple terms. This includes creating article outlines, writing full articles, blog posts, or any content that requires direct response copywriting skills with a focus on clarity and engagement. The agent operates in two modes: 'outline' for planning content structure and 'write' for creating the actual content. Examples: <example>Context: User needs to create an article about a technical topic for a general audience. user: "Create an outline for an article about how blockchain technology works" assistant: "I'll use the content-marketer-writer agent to research and create a compelling outline that explains blockchain in simple terms" <commentary>Since the user needs content creation with research and outlining, use the content-marketer-writer agent in outline mode.</commentary></example> <example>Context: User has an outline and needs to write the full article. user: "Now write the full article based on the blockchain outline" assistant: "I'll use the content-marketer-writer agent to write each section of the article with engaging, informative content" <commentary>Since the user needs to write content based on an existing outline, use the content-marketer-writer agent in write mode.</commentary></example>

**Tools:** 

---

### security-auditor

**Model:** SONNET
**Category:** leamas
**Size:** 7.9 KB

Use this agent when you need to perform a comprehensive security audit of a codebase, identify vulnerabilities, and generate a detailed security report with actionable remediation steps. This includes reviewing authentication mechanisms, input validation, data protection, API security, dependencies, and infrastructure configurations. Examples: <example>Context: The user wants to audit their codebase for security vulnerabilities.\nuser: "Can you perform a security audit of my application?"\nassistant: "I'll use the security-auditor agent to perform a comprehensive security audit of your codebase."\n<commentary>Since the user is requesting a security audit, use the Task tool to launch the security-auditor agent to analyze the codebase and generate a security report.</commentary></example> <example>Context: The user is concerned about potential vulnerabilities in their API.\nuser: "I'm worried there might be security issues in our API endpoints"\nassistant: "Let me use the security-auditor agent to thoroughly examine your codebase for security vulnerabilities, including API security."\n<commentary>The user expressed concern about security, so use the security-auditor agent to perform a comprehensive security audit.</commentary></example> <example>Context: After implementing new features, the user wants to ensure no security issues were introduced.\nuser: "We just added user authentication to our app. Can you check if it's secure?"\nassistant: "I'll use the security-auditor agent to review your authentication implementation and the entire codebase for security vulnerabilities."\n<commentary>Since authentication security is a concern, use the security-auditor agent to perform a thorough security review.</commentary></example>

**Tools:** Task, Bash, Edit, MultiEdit, Write, NotebookEdit

---

### vibe-coding-coach

**Model:** SONNET
**Category:** leamas
**Size:** 4.9 KB

Use this agent when users want to build applications through conversation, focusing on the vision and feel of their app rather than technical implementation details. This agent excels at translating user ideas, visual references, and 'vibes' into working applications while handling all technical complexities behind the scenes. <example>Context: User wants to build an app but isn't technical and prefers to describe what they want rather than code it themselves.\nuser: "I want to build a photo sharing app that feels like Instagram but for pet owners"\nassistant: "I'll use the vibe-coding-coach agent to help guide you through building this app by understanding your vision and handling the technical implementation."\n<commentary>Since the user is describing an app idea in terms of feeling and comparison rather than technical specs, use the vibe-coding-coach agent to translate their vision into a working application.</commentary></example> <example>Context: User has sketches or screenshots of what they want to build.\nuser: "Here's a screenshot of an app I like. Can we build something similar but for tracking workouts?"\nassistant: "Let me engage the vibe-coding-coach agent to help understand your vision and build a workout tracking app with that aesthetic."\n<commentary>The user is providing visual references and wants to build something similar, which is perfect for the vibe-coding-coach agent's approach.</commentary></example>

**Tools:** 

---

### agent-organizer

**Model:** SONNET
**Category:** leamas
**Size:** 43.2 KB

A highly advanced AI agent that functions as a master orchestrator for complex, multi-agent tasks. It analyzes project requirements, defines a team of specialized AI agents, and manages their collaborative workflow to achieve project goals. Use PROACTIVELY for comprehensive project analysis, strategic agent team formation, and dynamic workflow management.

**Tools:** Read, Write, Edit, Grep, Glob, Bash, TodoWrite, Task

---

### code-reviewer-pro

**Model:** SONNET
**Category:** leamas
**Size:** 9.6 KB

An AI-powered senior engineering lead that conducts comprehensive code reviews. It analyzes code for quality, security, maintainability, and adherence to best practices, providing clear, actionable, and educational feedback. Use immediately after writing or modifying code.

**Tools:** Read, Write, Edit, Grep, Glob, Bash, mcp__context7__resolve-library-id, mcp__context7__get-library-docs, mcp__sequential-thinking__sequentialthinking

---

### frontend-developer

**Model:** SONNET
**Category:** leamas
**Size:** 4.5 KB

Acts as a senior frontend engineer and AI pair programmer. Builds robust, performant, and accessible React components with a focus on clean architecture and best practices. Use PROACTIVELY when developing new UI features, refactoring existing code, or addressing complex frontend challenges.

**Tools:** Read, Write, Edit, MultiEdit, Grep, Glob, Bash, TodoWrite, mcp__magic__21st_magic_component_builder, mcp__magic__21st_magic_component_refiner, mcp__context7__resolve-library-id, mcp__context7__get-library-docs, mcp__playwright__browser_snapshot, mcp__playwright__browser_click


---

## 🎯 MODEL STRATEGY

### Model Distribution

| Model | Agents | Percentage |
|-------|--------|------------|
| **HAIKU** | 3 | 10.3% |
| **OPUS** | 4 | 13.8% |
| **SONNET** | 22 | 75.9% |

### Cost Optimization

Based on your current setup:

- **Opus usage:** 13.8% (4 agents) @ $15/$75 per million tokens
- **Sonnet usage:** 75.9% (22 agents) @ $3/$15 per million tokens
- **Estimated monthly cost:** $50-150 for heavy usage (assuming 98% Sonnet, 2% Opus)

**Recommended Strategy:**
- **Opus agents** (4 total): Use for architecture, complex design decisions
- **Sonnet agents** (22 total): Use for implementation, iteration, most tasks
- **Haiku agents** (3 total): Use for quick, simple tasks

---

## 📊 AGENT CAPABILITY MATRIX

### iOS Development

- **ios-dev** (sonnet): Comprehensive iOS development expert combining feature implementation, Swift 6.0 development, advanced iOS ecosystem features, Apple platform integrat...
- **ios-developer** (sonnet): Develop native iOS applications with Swift/SwiftUI. Masters UIKit/SwiftUI, Core Data, networking, and app lifecycle. Use PROACTIVELY for iOS-specific ...
- **swift-architect** (opus): Specialized in Swift 6.0 architecture patterns, async/await, actors, and modern iOS development...
- **swiftui-specialist** (sonnet): Expert in SwiftUI app development, state management, and modern iOS UI patterns...

### Design & UX

- **design-master** (sonnet): Comprehensive UI/UX design expert combining pixel-perfect precision engineering, user experience optimization, premium interface design, and scalable ...
- **ui-designer** (sonnet): A creative and detail-oriented AI UI Designer focused on creating visually appealing, intuitive, and user-friendly interfaces for digital products. Us...
- **ux-designer** (sonnet): A creative and empathetic professional focused on enhancing user satisfaction by improving the usability, accessibility, and pleasure provided in the ...
- **swiftui-specialist** (sonnet): Expert in SwiftUI app development, state management, and modern iOS UI patterns...

### Development & Engineering

- **frontend-developer** (sonnet): Acts as a senior frontend engineer and AI pair programmer. Builds robust, performant, and accessible...
- **nextjs-pro** (sonnet): An expert Next.js developer specializing in building high-performance, scalable, and SEO-friendly we...
- **react-pro** (sonnet): An expert React developer specializing in creating modern, performant, and scalable web applications...
- **ios-developer** (sonnet): Develop native iOS applications with Swift/SwiftUI. Masters UIKit/SwiftUI, Core Data, networking, an...
- **javascript-pro** (sonnet): Master modern JavaScript with ES6+, async patterns, and Node.js APIs. Handles promises, event loops,...
- **mobile-developer** (sonnet): Develop React Native or Flutter apps with native integrations. Handles offline sync, push notificati...

---

## 🎨 SKILLS INVENTORY

Total Skills: 12

### article-extractor

Extract clean article content from URLs (blog posts, articles, tutorials) and save as readable text. Use when user wants to download, extract, or save an article/blog post from a URL without ads, navigation, or clutter.

**Category:** content  
**Files:** 1

### design-with-precision

Apply obsessive, pixel-perfect design discipline to any content (READMEs, blogs, docs). Enforces mathematical spacing systems, typography scales, optical alignment, and zero-tolerance precision. Use for design review OR establishing new design systems.

**Category:** design  
**Files:** 1

### ship-learn-next

Transform learning content (like YouTube transcripts, articles, tutorials) into actionable implementation plans using the Ship-Learn-Next framework. Use when user wants to turn advice, lessons, or educational content into concrete action steps, reps, or a learning quest.

**Category:** general  
**Files:** 1

### smart-iteration

Use when receiving repeated similar feedback (iteration 2-3+), user shows frustration ("still confusing", "missing the forest"), or requests conflict - paraphrases real intent, confirms understanding, then executes against the goal instead of literal requests

**Category:** general  
**Files:** 1

### tapestry

Unified content extraction and action planning. Use when user says "tapestry <URL>", "weave <URL>", "help me plan <URL>", "extract and plan <URL>", "make this actionable <URL>", or similar phrases indicating they want to extract content and create an action plan. Automatically detects content type (YouTube video, article, PDF) and processes accordingly.

**Category:** general  
**Files:** 1

### UXscii Component Creator

Create uxscii components with ASCII art and structured metadata when user wants to create, build, or design UI components like buttons, inputs, cards, forms, modals, or navigation

**Category:** design  
**Files:** 1

### UXscii Component Expander

Add interaction states like hover, focus, disabled, active, error to existing uxscii components when user wants to expand, enhance, or add states to components

**Category:** design  
**Files:** 1

### UXscii Component Viewer

View detailed information about a specific uxscii component including metadata, states, props, and ASCII preview when user wants to see, view, inspect, or get details about a component

**Category:** design  
**Files:** 1

### UXscii Library Browser

Browse and view all available uxscii components including bundled templates, user components, and screens when user wants to see, list, browse, or search components

**Category:** design  
**Files:** 1

### UXscii Screen Scaffolder

Build complete UI screens by composing multiple components when user wants to create, scaffold, or build screens like login, dashboard, profile, settings, checkout pages

**Category:** design  
**Files:** 1

### UXscii Screenshot Importer

Import UI screenshots and generate uxscii components automatically using vision analysis when user wants to import, convert, or generate components from screenshots or images

**Category:** design  
**Files:** 1

### youtube-transcript

Download YouTube video transcripts when user provides a YouTube URL or asks to download/get/fetch a transcript from YouTube. Also use when user wants to transcribe or get captions/subtitles from a YouTube video.

**Category:** content  
**Files:** 1

### Skills by Category

#### CONTENT

- **article-extractor**
- **youtube-transcript**

#### DESIGN

- **design-with-precision**
- **UXscii Component Creator**
- **UXscii Component Expander**
- **UXscii Component Viewer**
- **UXscii Library Browser**
- **UXscii Screen Scaffolder**
- **UXscii Screenshot Importer**

#### GENERAL

- **ship-learn-next**
- **smart-iteration**
- **tapestry**

---

## ⚡ SLASH COMMANDS

### `/agent-workflow`

Automated multi-agent development workflow with quality gates from idea to production code

**Allowed Tools:** Task, Read, Write, Edit, MultiEdit, Grep, Glob, TodoWrite

---

## 🔌 ENABLED PLUGINS

- ✅ **claude-mem@thedotmack**
- ✅ **commit-commands@claude-code-plugins**
- ✅ **elements-of-style@superpowers-marketplace**
- ✅ **frontend-mobile-development@claude-code-workflows**
- ✅ **git@claude-code-plugins**
- ✅ **javascript-typescript@claude-code-workflows**
- ✅ **seo-analysis-monitoring@claude-code-workflows**
- ✅ **seo-content-creation@claude-code-workflows**
- ✅ **seo-technical-optimization@claude-code-workflows**
- ✅ **superpowers@superpowers-marketplace**

---

## 🔑 QUICK REFERENCE

### When to Use Which Agent

**iOS Development:** `ios-dev`, `ios-developer`, `swift-architect`, `swiftui-specialist`

**Design & UX:** `design-master`, `content-writer`, `vibe-coding-coach`, `agent-organizer`, `frontend-developer`, `nextjs-pro`, `react-pro`, `ui-designer`, `ux-designer`, `business-analyst`, `ios-developer`, `legal-advisor`, `prompt-engineer`, `python-pro`, `quant-analyst`, `swiftui-specialist`

**Frontend Development:** `frontend-developer`, `nextjs-pro`, `react-pro`, `mobile-developer`

**Content Creation:** `content-writer`, `nextjs-pro`, `seo-specialist`

**Orchestration:** `agent-organizer`, `agent-organizer`

### Common Workflows

### iOS App Development Workflow

1. **Architecture:** Use `swift-architect` (Opus) for system design decisions
2. **Implementation:** Use `ios-dev` (Sonnet) for feature development
3. **Optimization:** Use `swiftui-specialist` (Sonnet) for UI optimization

### Design → Code Pipeline

1. **Sketch:** Use Fluxwing skills for ASCII mockups
2. **Refine:** Use `design-master` (Sonnet) for pixel-perfect design
3. **Implement:** Use appropriate dev agent based on stack

### Full Production Workflow

1. **Requirements:** Use `/agent-workflow` command
2. **Specs → Architecture → Implementation → Tests**
3. **Quality gate validation (95% threshold)**

---

## 📁 SETUP LOCATION

Your global Claude Code setup is located at: `~/.claude/`

```
~/.claude/
├── agents/          # 29 agents
├── skills/          # 12 skills
├── commands/        # 1 commands
├── settings.json    # Configuration
└── scripts/         # Custom scripts
```

---

**Generated by Setup Navigator** | [View Registry](./registry.json)
