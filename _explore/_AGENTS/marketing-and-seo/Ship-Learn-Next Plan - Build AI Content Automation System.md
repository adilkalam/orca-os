# Your Ship-Learn-Next Quest: Build AI Content Automation System

## Quest Overview
**Goal**: Build and deploy a working AI-powered content automation system that generates SEO-optimized blog posts in 6 weeks

**Source**: "AI Content Research & SEO on Auto-Pilot. Try This System! (n8n)" (YouTube)

**Core Lessons from Source**:
1. Multi-tool orchestration (Perplexity + ChatGPT + Claude + SEO APIs) beats single-tool approaches
2. 5-stage content pipeline: Research → Summarize → Deep research → Brief → Generate
3. Airtable + n8n = powerful automation dashboard with webhook triggers
4. Specialized AI agents (research, brief, headline, intro, content, conclusion, editor) produce better results than one generic agent
5. Always analyze top-ranking content BEFORE writing (don't copy, but understand what works)

---

## Rep 1: Build Basic n8n Workflow (This Week)

**Ship Goal**: Create a working n8n workflow that takes a keyword, finds top 3 Google results, and extracts their content

**Timeline**: By Friday (5 days)

**Success Criteria**:
- [ ] n8n installed and running locally
- [ ] Workflow accepts a keyword as input
- [ ] Workflow calls Google search API (Tav or alternative)
- [ ] Workflow extracts content from top 3 URLs
- [ ] Content saved to file or database
- [ ] You can trigger it manually and get results

**What You'll Practice** (from the video):
- Setting up n8n environment (Part 1: workflow basics)
- HTTP API calls (Tav for Google search)
- Web scraping (Jina AI or alternative)
- Data aggregation (combining multiple results)

**Action Steps**:
1. Install n8n locally: `npx n8n` or Docker setup
2. Create Tav API account (or use alternative: SerpAPI, ScraperAPI)
3. Build workflow:
   - Start with Manual Trigger node
   - Add HTTP Request node for search API
   - Add Loop node to process top 3 results
   - Add HTTP Request node for content scraping (Jina AI or Browserless)
   - Add Aggregate node to combine results
4. Test with one keyword (e.g., "best CRM platforms 2025")
5. Save extracted content to JSON file
6. Document what worked and what didn't

**Minimal Resources** (only for this rep):
- [n8n Documentation](https://docs.n8n.io/)
- [Tav API](https://apify.com/apify/google-search-scraper) or [SerpAPI](https://serpapi.com/)
- [Jina AI Reader](https://jina.ai/reader) for content extraction

**After Shipping - Reflection**:
Answer these questions:
- What actually happened? (Did workflow run successfully?)
- What worked? What didn't?
- What surprised you about n8n/API integration?
- Rate this rep: _/10
- What's one thing to try differently next time?

---

## Rep 2: Add AI Summarization Layer

**Builds on**: Rep 1 + workflow with extracted content

**New element**: ChatGPT/Claude API for content analysis

**Ship goal**: Workflow now analyzes extracted content and generates summary + insights

**Timeline**: Week 2

**Success Criteria**:
- [ ] Integrated ChatGPT or Claude API
- [ ] Workflow sends extracted content to AI
- [ ] AI returns structured summary (JSON format)
- [ ] AI extracts 10-15 key insights from top articles
- [ ] Results saved alongside original content

**Action Steps**:
1. Get API key (OpenAI or Anthropic)
2. Add AI node after content extraction
3. Write system prompt (from video: "Content analyst and structure specialist")
4. Request JSON output: `{summary: string, insights: string[]}`
5. Test with same keyword from Rep 1
6. Compare AI analysis quality

**What You'll Learn**:
- AI prompt engineering for content analysis
- JSON parsing and structured outputs
- Combining web data with AI processing

---

## Rep 3: Generate Content Outline

**Builds on**: Rep 2 + AI analysis of top articles

**New element**: Outline generation agent

**Ship goal**: System generates SEO blog post outline based on competitor analysis

**Timeline**: Week 3

**Success Criteria**:
- [ ] AI agent creates blog post outline
- [ ] Outline includes: hook, intro, main sections (H2/H3), conclusion
- [ ] Outline references insights from Rep 2
- [ ] Outline is markdown formatted
- [ ] You can use outline to manually write a blog post

**Action Steps**:
1. Create new AI node: "Outline Generator"
2. Write system prompt: "Helpful intelligent writing assistant"
3. Feed it: topic + keyword + insights from Rep 2
4. Include examples of good outlines in prompt
5. Request markdown format output
6. Test and refine prompt until outline is usable
7. Manually write one blog post from generated outline to validate quality

**What You'll Learn**:
- Prompt engineering for structured content
- How to pass context between AI agents
- What makes a good blog outline

---

## Rep 4: Add Airtable Dashboard + Perplexity Research

**Builds on**: Rep 3 + working outline generation

**New element**: Airtable as control panel + deep research layer

**Ship goal**: Trigger workflows from Airtable, add Perplexity for enhanced research

**Timeline**: Week 4

**Success Criteria**:
- [ ] Airtable base created with fields: keyword, topic, competitor URLs, language
- [ ] Button field triggers n8n workflow via webhook
- [ ] Workflow includes Perplexity API for deep research
- [ ] Research results saved back to Airtable
- [ ] You can manage multiple content projects from Airtable

**Action Steps**:
1. Create Airtable base (copy structure from video)
2. Add webhook in n8n (replace manual trigger)
3. Configure Airtable button to call webhook
4. Get Perplexity API access
5. Add Perplexity node after outline generation
6. Use outline to generate research queries for Perplexity
7. Combine Perplexity results with earlier insights
8. Write results back to Airtable

**What You'll Learn**:
- Webhook integration
- Airtable as automation hub
- Research augmentation with Perplexity
- Bi-directional data flow (Airtable → n8n → Airtable)

---

## Rep 5: Full Content Generation Pipeline

**Builds on**: Rep 4 + research-enhanced workflow

**New element**: Multi-agent content writing system

**Ship goal**: Complete automation - keyword in, full blog post out

**Timeline**: Weeks 5-6 (2 weeks for this rep)

**Success Criteria**:
- [ ] Workflow has specialized agents: Headline, Intro, Main Content, Conclusion, Editor
- [ ] Each agent receives tailored brief from "Brief Agent"
- [ ] Content is SEO-optimized with keywords from research
- [ ] Final output is 5-7 page blog post
- [ ] Post is saved to Google Docs
- [ ] You've generated at least 3 complete articles

**Action Steps**:
1. Create "Brief Agent" (orchestrates other agents)
2. Create specialized agents:
   - Headline Brief Creator
   - Intro Brief Creator
   - Main Content Brief Creator
   - Conclusion Brief Creator
3. Each agent gets: research + outline + specific instructions
4. Add Editor Agent (reviews all content for SEO + quality)
5. Integrate Google Docs API for final output
6. Test end-to-end with 3 different keywords
7. Refine prompts based on output quality
8. Document your prompt library

**What You'll Learn**:
- Multi-agent orchestration
- Agent specialization vs. general agents
- Prompt engineering for different content types
- Quality control with editor agents
- Google Docs API integration

---

## Rep 6-10: Future Path (Evolves Based on Your Learnings)

**Rep 6**: Add SEO keyword research API (identify related keywords, search volume, competition)

**Rep 7**: Implement competitor analysis workflow (analyze specific competitor articles)

**Rep 8**: Add content calendar scheduling (batch generate content for month)

**Rep 9**: Integrate content publishing (WordPress, Ghost, or custom CMS)

**Rep 10**: Build analytics dashboard (track which AI-generated content performs best)

*(Details will evolve based on what you learn in Reps 1-5)*

---

## Technical Stack (Based on Video)

**Core Tools**:
- **n8n** - Workflow automation platform
- **Airtable** - Content dashboard and project management
- **Claude 3.5 Sonnet** - Main content writing (used for most agents in video)
- **ChatGPT-4** - Alternative AI model (used for summary/outline in video)

**APIs & Services**:
- **Tav API** - Google search scraping (alternative: SerpAPI)
- **Jina AI** - Content extraction from URLs
- **Perplexity API** - Deep research and market analysis
- **Rapid API** - SEO keyword research
- **Google Docs API** - Final document creation

**Optional Enhancements**:
- Ahrefs or SEMrush API (more robust SEO data)
- Make.com (alternative to n8n with easier markdown formatting)
- Webhook services for triggering workflows

---

## Cost Estimates (Monthly)

**Minimum to Start (Rep 1-2)**:
- n8n: Free (self-hosted)
- Tav/SerpAPI: $0-50 (free tier + pay-as-you-go)
- Claude API: $20-50 (for testing)
- **Total**: $20-100/month

**Full System (Rep 5)**:
- n8n: Free (self-hosted) or $20 (cloud)
- APIs (Tav, Perplexity, SEO): $50-150
- Claude API: $100-200 (depends on volume)
- Airtable: Free (for small use) or $20/month
- **Total**: $170-390/month

**At Scale (Client Work)**:
- Premium APIs (Ahrefs, SEMrush): $100-200
- Increased AI usage: $300-500
- **Total**: $500-800/month

---

## Common Pitfalls to Avoid

**From the video creator's experience**:

1. **Don't use generic prompts** - Each agent needs specific instructions, examples, and structure
2. **Don't skip the brief stage** - Brief Agent dramatically improves output quality
3. **Don't copy competitor content** - Extract insights, then create original content
4. **Don't use one AI for everything** - Specialized agents > one general agent
5. **Don't forget error handling** - APIs fail, webhooks timeout, add retry logic
6. **Don't optimize prematurely** - Build basic workflow first, then optimize

---

## Success Metrics

**You'll know this is working when**:
- ✅ You can generate a 5-7 page blog post in under 5 minutes
- ✅ Content includes genuine insights (not just rephrased competitor content)
- ✅ SEO keywords are naturally integrated
- ✅ You've reduced content creation time by 80%+
- ✅ AI-generated content needs minimal editing
- ✅ You can scale to 10+ articles/week

---

## Remember

- This is about DOING, not studying n8n tutorials forever
- Aim for 100 reps over time (not perfection on rep 1)
- Each rep = Plan → Do → Reflect → Next
- You learn by shipping workflows, not by watching more YouTube videos
- **Start with Rep 1 this week** - don't wait for perfect conditions

**The video creator built this system iteratively. So will you.**

---

## After Each Rep

**Reflection Protocol**:
1. What worked? (specific workflows/prompts that succeeded)
2. What failed? (API errors, prompt issues, quality problems)
3. What surprised me? (unexpected behaviors, better results than expected)
4. What would I change? (specific improvements for next rep)
5. Rate 1-10: How close is this to production-ready?

**Then**:
- Update this plan based on learnings
- Adjust Rep 2 based on what you discovered in Rep 1
- Share results with a friend or community (accountability)

---

## Ready to ship Rep 1?

**Your commitment**:
- **When will you ship Rep 1?** [Write date: ___________]
- **What might stop you?** _______________________
- **How will you handle it?** _______________________

**Come back after you ship Rep 1 and we'll reflect + plan the next iteration.**

---

**Let's build this system. One rep at a time.**

*Quest created*: November 5, 2025
*Source video*: AI Content Research & SEO on Auto-Pilot. Try This System! (n8n)
*Framework*: Ship-Learn-Next
