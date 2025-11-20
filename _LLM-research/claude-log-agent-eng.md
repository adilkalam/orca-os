---
title: "Agent Engineering"
source: "https://claudelog.com/mechanics/agent-engineering/"
author:
  - "[[ClaudeLog]]"
published: 2025-07-04
created: 2025-11-06
description: "Understanding Claude Code's custom agent system fundamentals - what they are, when to use them, and essential best practices."
tags:
  - "clippings"
---
We've evolved through three distinct eras of AI interaction:from Prompt Engineering (crafting perfect individual prompts) to Context Engineering (optimizing the context,what goes into it and what remains in it through `CLAUDE.md` files) and now to Agent Engineering (designing specialized,reusable,efficient AI agents).At each stage,our ability to share deliverables and grow as a community has expanded:from sharing individual prompts,to sharing comprehensive context configurations and tactics,to now sharing complete portable agent definitions that work across any project.

`Custom agents` represent this latest paradigm shift in Claude Code workflows from manual orchestration to automatic delegation,from project-specific solutions to portable specialist tools.This guide covers the essential foundations you need to understand before diving into advanced tactics.

---

---

## Understanding the Agent Ecosystem

Comparison:Custom Agents vs.Sub-agents vs.Task Tools

| Aspect | Custom Agents | Split Role Sub-agents | Task/Agent Tools |
| --- | --- | --- | --- |
| **Token Efficiency** |  |  |  |
| **Activation** | Automatic delegation | Manual delegation | Manual delegation |
| **Shared System Prompt** | No | Yes | Yes |
| **Portability** | Highly portable (single.md file) | Impractical | Impractical |
| **Configuration** | YAML frontmatter + system prompt | Task description only | Task description only |
| **System Prompt** | Custom system prompt access | Inherits system prompt | Inherits system prompt |
| **Custom Tool Selection** | Yes | No | No |
| **Claude.md Inheritance** | Yes | Yes | Yes |
| **Use Case** | Specialized repeatable tasks | Multi-perspective analysis | Parallel task execution |

`Custom agents` deliver **automatic activation**,**isolated contexts**,and **surgical tool selection**,eliminating the token bloat and manual orchestration of previous approaches.

---

---

## Custom Agent Design

I believe one of the most important aspects when designing `custom agents` is to carefully engineer how many tokens your `custom agent` needs to initialize.Optimizing this serves multiple purposes:to improve initialization speed,reduce cost,maintain [peak performance](https://claudelog.com/mechanics/context-window-depletion/),and enable efficient chaining.

Each `custom agent` invocation carries a **variable initialization cost** based on tool count and configuration complexity.Design decisions should account for this:

**Performance Analysis by Tool Count (Anecdotal experiment):**

| Tool Count | Token Usage | Relative Initialization Time | Claude.md Empty |
| --- | --- | --- | --- |
| 0 | 640 | 2.6s | true |
| 1 | 2.6k | 3.9s | false |
| 2 | 2.9k | 4.3s | false |
| 3 | 3.2k | 6.0s | false |
| 4 | 3.4k | 6.1s | false |
| 5 | 3.9k | 5.1s | false |
| 6 | 4.1k | 7.0s | false |
| 7 | 5.0k | 6.9s | false |
| 8 | 7.1k | 5.6s | false |
| 9 | 7.5k | 5.1s | false |
| 10 | 7.9k | 6.2s | false |
| 15+ | 13.9k - 25k | 6.4s | false |

*Note:The 0 tool experiment was conducted with a completely empty `Claude.md` and thus reflects the best case scenario.Experiments for 1-15+ tools were conducted with a non-empty `Claude.md`.Token cost and initialization time were affected by the specific tools which were added.*

**Agent Weight Classifications:**

- **Lightweight agents:**Under 3k tokens \- Low initialization cost.
- **Medium-weight agents:**10-15k tokens \- Moderate initialization cost.
- **Heavy agents:**25k+ tokens \- High initialization cost.

**Subscription and Model Optimization:**A lightweight,performant `custom agent` will be used and experimented with more than a heavyweight `custom agent` due to subscription constraints.They are by far the most composable and effortless to use.We should strive to make our `custom agents` as performant and composable as possible.

**Model Selection Strategy:**With the introduction of the `model` parameter in v1.0.64,you can now specify which model each agent should use (sonnet,opus,haiku).Claude Haiku 4.5 (released October 2025) has transformed agent engineering economics by delivering 90% of Sonnet 4.5's agentic coding performance at 2x the speed and 3x cost savings ($1/$5 vs $3/$15).

**Access Haiku 4.5:**

- **Command line:**`--model claude-haiku-4-5`
- **Agent configuration:**`model: haiku` in YAML frontmatter

**Proven Pairings (Based on Haiku 4.5 Performance):**

- **Haiku 4.5 + Lightweight Agent:**Achieves 90% of Sonnet 4.5's agentic performance with 2x speed and 3x cost savings \- ideal for frequent-use agents requiring near-frontier capabilities at minimal cost.
- **Sonnet 4.5 + Medium Agent:**Balanced approach for moderate complexity tasks requiring maximum reasoning capability.
- **Opus 4 + Heavy Agent:**Complex analysis requiring deepest reasoning and context understanding.

**Advanced Experimentation Patterns (Emerging Best Practices):**

- **Haiku 4.5 + Medium Agent:**Given 90% agentic performance,Haiku 4.5 can handle medium-weight agents efficiently \- experiment with expanding this boundary.
- **Opus 4 + Lightweight Agent:**May unlock surprising depth in specialized reasoning tasks \- unproven but worth testing.
- **Model Rotation:**Same agent with different models for A/B testing to quantify the 10% capability gap in your specific use case.
- **Dynamic Model Selection:**Start with Haiku 4.5,escalate to Sonnet 4.5 if validation fails \- emerging pattern for cost optimization.

**Community Knowledge (October 2025 onwards):**Haiku 4.5's release established concrete performance baselines,reducing some uncertainty.However,optimal model-agent pairings remain highly context-dependent.Continue benchmarking and sharing discoveries \- what works for one use case may revolutionize another.

**Agent Chainability Impact:**The complexity of a `custom agent` significantly affects its chainability due to startup time and token usage.Heavy `custom agents` (25k+ tokens) create bottlenecks in multi-agent workflows,while lightweight `custom agents` (under 3k tokens) enable fluid orchestration.As future **Agent Engineers**,we must optimize both individual `custom agent` metrics and their composability:

- **Individual Optimization:**Minimize tool count while preserving capability.
- **Composition Strategy:**Balance specialized high-cost `custom agents` with efficient ones (Similar to the [big.LITTLE](https://en.wikipedia.org/wiki/ARM_big.LITTLE) concept from CPU design).
- **Workflow Design:**Consider cumulative token costs when chaining multiple `custom agents`.
- **Performance Monitoring:**Track `custom agent` efficiency metrics across different use cases.

**Proven Multi-Agent Orchestration Pattern:**

The Haiku 4.5 release validated a specific orchestration architecture that maximizes efficiency:

- **Sonnet 4.5 as orchestrator:**Handles complex task decomposition,coordination,and quality validation.
- **Haiku 4.5 as worker agents:**Executes specialized subtasks with 90% of Sonnet 4.5's capability at 3x cost savings.
- **Cost efficiency:**This pattern reduces overall token costs by 2-2.5x while maintaining 85-95% overall quality.
- **Speed advantage:**Parallel Haiku 4.5 workers operating at 2x speed create significant throughput gains.

**Example orchestration workflow:**

1. Sonnet 4.5 analyzes requirements and creates execution plan
2. Sonnet 4.5 delegates discrete tasks to multiple Haiku 4.5 agents in parallel
3. Haiku 4.5 workers execute at 2x speed with 90% capability
4. Sonnet 4.5 validates outputs and integrates results

---

---

## Cost-Benefit Analysis for Model Selection

Understanding the economics of agent model selection is critical for sustainable agent engineering.Haiku 4.5's release provides concrete data for cost-benefit analysis:

**Token Cost Comparison (per 1M tokens):**

| Model | Input | Output | Total Cost\* | Performance | Cost Efficiency |
| --- | --- | --- | --- | --- | --- |
| Haiku 4.5 | $1 | $5 | ~$3.00 | 90% agentic | **Baseline** |
| Sonnet 4.5 | $3 | $15 | ~$9.00 | 100% agentic | 3x more expensive for 11% gain |
| Opus 4 | $15 | $75 | ~$45.00 | Maximum reasoning | 15x more expensive |

\*Assumes typical 50% input / 50% output ratio

**Break-Even Analysis for Lightweight Agents:**

For lightweight agents (under 3k tokens initialization):

- **Haiku 4.5:**3k tokens ≈ $0.009 per invocation at $3/M blended rate
- **Sonnet 4.5:**3k tokens ≈ $0.027 per invocation at $9/M blended rate
- **Savings:**3x cost reduction per invocation

**When the 10% capability gap matters:**

- High-stakes code review requiring maximum safety validation
- Complex architectural decisions with significant downstream impact
- Tasks where quality degradation cascades through multi-agent workflows
- Orchestrator roles coordinating multiple sub-agents

**When the 10% gap is acceptable:**

- Frequent-use agents (invoked 10+ times per session)
- Pair programming assistance and code generation
- Chat interfaces and customer service responses
- Computer use tasks requiring speed over perfection
- Worker agents in multi-agent systems (Sonnet 4.5 orchestrator validates)

**Subscription Constraint Strategy:**

For users on Claude Code Pro subscription limits,strategic model selection dramatically extends usage:

- 100 Sonnet 4.5 invocations \= 300 Haiku 4.5 invocations (approximate token equivalent)
- This 3x multiplier effect makes Haiku 4.5 agents substantially more composable
- Design agent collections with Haiku 4.5 as default,Sonnet 4.5 for validation

---

---

## When to Use Custom Agents

`Custom agents` excel in the same scenarios as [split role sub-agents](https://claudelog.com/mechanics/split-role-sub-agents/),but with enhanced portability and automatic activation:

### Specialized Domain Tasks

- **Code Review** \- Security,performance,maintainability analysis.
- **Research Tasks** \- API documentation,library comparison,best practices.
- **Quality Assurance** \- Testing strategies,edge case identification.
- **Documentation** \- Technical writing,SEO optimization,accessibility.
- **Design Analysis** \- UX review,layout assessment,design consistency.
- **Content Quality** \- Legibility expert,grammar expert,brand voice expert.

### Portable Workflows

Unlike `sub-agents` tied to specific projects,`custom agents` can be refined once and utilized across multiple projects,making them ideal for:

- Cross-project standards enforcement.
- Team workflow standardization.
- Personal expertise amplification.
- Community knowledge sharing.

---

---

## Essential Features

### No CLAUDE.md Inheritance

**Major Advantage:**Unlike traditional sub-agents,custom agents are designed to not automatically inherit the project's `CLAUDE.md` configuration.This prevents context pollution and ensures consistent behavior across projects.You can verify this with a [sanity check](https://claudelog.com/mechanics/sanity-check/).

### Coloring Your Custom Agent

Custom agents can be visually distinguished through terminal color formatting in their indicator,making it easier to track which agent is responding during complex workflows.This helps maintain clarity when multiple agents are active or when reviewing conversation history.

### Agent Nicknaming for Efficiency

Configure short nicknames for frequently used agents:

- **UX agent (`A1`)** \- Quick UX analysis.
- **Security agent (`S1`)** \- Rapid security review.
- **Performance agent (`P1`)** \- Performance optimization.

Example configuration with nickname:

```yaml
---
name: UX Agent (A1)
description: UX specialist for user experience analysis. Use this agent when evaluating interfaces and user workflows.
tools: Read, Grep, Glob
---

You are a UX specialist focused on user experience analysis and interface evaluation.

When invoked:
1. Analyze user interface elements and workflows
2. Identify usability issues and improvement opportunities
3. Provide actionable UX recommendations
4. Consider accessibility and user journey optimization
```

**Calling the agent with nickname:**

or:

### Advanced Nickname Workflows

The ability to provide nicknames to `custom agents` helps to improve manual invocation and opens up possibilities like calling `custom agents` via nicknames `A1, P2, C1`.

```markdown
ask A1, P2, C1 to review the changes
```

### Configuring Automatic Delegation

`Custom agents` are automatically utilized by the `delegating agent` based on the task description within your prompt,the description field within your `custom agent` configuration,the current context and available tools.

When crafting your `custom agents` you will need to evaluate Claude's reliability at invoking your `custom agent`.If you need to improve the reliability,explore updating your agent's name,description or system prompt.Configuringyour `custom agent` tobepromptlyutilizedbyClaudeisaformof `Tool SEO`.

Anthropichasmentionedthattoencourageproactive `custom agent` useweshouldincludetermslike `use PROACTIVELY` or `MUST BE USED` inthe `description` fieldsofour `custom agents`.ThisfunctionssimilarlytohowyouwouldusesuchtermstogetgoodadherenceoutofClaudebycorrectlyformattingyour `Claude.md`.

---

---

## Design Considerations

### Getting Started Strategy

**Token-FirstDesign:**

- Createfocused,single-purposeagentsinitially.
- Startwithlightweightagents(minimalornotools)formaximumcomposability.
- Carefullyengineerhowmanytokensyourcustomagentneedstoinitialize.
- Prioritizeefficiencyovercapabilityforfrequent-useagents.

**ConfigurationBestPractices:**

- Useclear,specificdescriptionsforreliableauto-activation.
- Grantonlynecessarytoolsinitially,expandasneeded.
- **Chooseappropriatemodels:**StartwithHaiku4.5formostagents(90%agenticcapability),useSonnet4.5fororchestrationandmaximumqualityvalidation.
- Testagentreliabilitybeforeexpanding.
- Includeexamplesinsystempromptsforbetterpatternrecognition.
- Testagentsinisolationbeforedeployinginworkflows.
- Designforchainabilityandmulti-agentpiping.
- **Matchmodeltoagentweight:**Haiku4.5nowhandleslightweightANDmanymedium-weightagentsefficiently-onlyescalatetoSonnet4.5whenthe10%capabilitygapimpactsoutcomes.
- Frequentlytestagentsandsharethemwithotherstohelpvalidateeffectiveness.

### Model Selection Strategy

The `model` parameteropensunexploredpossibilitiesinagentengineering.**Thisisfrontierterritory** -approachwithexperimentalcuriosityratherthanrigidrules.

**PerformanceCapabilities(BasedonHaiku4.5Data):**

- **Haiku4.5agents:**Near-frontieragenticcoding(90%ofSonnet4.5),pairprogramming,codegeneration,chatassistants,customerservice,computerusetasks- **significantlymorecapablethanpreviousassumptions**.Bestforfrequent-useagentswhere2xspeedand3xcostsavingsjustify10%capabilitytradeoff.
- **Sonnet4.5agents:**Maximumagenticperformance,complexorchestration,deepreasoning,qualityvalidation-idealfororchestratorrolesandtasksrequiringfrontiercapabilities.
- **Opus4agents:**Deepestreasoningforresearch,complexanalysis,andtasksrequiringmaximumcontextunderstandingandnuanceddecision-making.

**Cost-BenefitDecisionFramework:**

- Choose **Haiku4.5** when:Frequencyofuseishigh,90%capabilityissufficient,speedmatters,subscriptioncostsareconstrained.
- Choose **Sonnet4.5** when:Maximumcapabilityrequired,orchestratingmulti-agentworkflows,qualityvalidationcritical.
- Choose **Opus4** when:Deepestreasoningneeded,complexresearchtasks,maximumcontextcomprehensionessential.

**ExperimentalDiscoveryFramework:**

- **Challengeassumptions:**Testwhether"simple"tasksbenefitfromopusintelligence.
- **Reverseexpectations:**TryHaikuoncomplexagentstofindefficiencybreakthroughs.
- **Benchmarksystematically:**Measureactualperformancevs.theoreticalpredictions.

**Discovery-OrientedLifecycle:**

1. **Startwithconventionalpairing:**Establishbaselineperformance.
2. **Cross-experiment:**Testunconventionalmodel/agentcombinations.
3. **Measureeverything:**Tokenusage,tokencost,speed,quality,usersatisfaction.
4. **Sharebreakthroughdiscoveries:**Contributefindingstoexpandcollectiveknowledge.
5. **Iteratebasedonrealdata:**Letempiricalresultsguideoptimization,notassumptions.

**CommunityCollaboration:**Theagentengineeringcommunityshouldactivelysharebenchmarkingresultsandsurprisingdiscoveries.Whatworksforoneusecasemightrevolutionizeanother.

---

---

See Also:[Custom Agents](https://claudelog.com/mechanics/custom-agents/) | [Task Agent Tools](https://claudelog.com/mechanics/task-agent-tools/)

**Author**: [![](https://claudelog.com/img/claudes-greatest-soldier-44w.webp) InventorBlack](https://www.linkedin.com/in/wilfredkasekende/) | CTO at [Command Stick](https://commandstick.com/) | Mod at [r/ClaudeAi](https://reddit.com/r/ClaudeAI)