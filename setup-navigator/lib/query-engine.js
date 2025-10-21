/**
 * Setup Navigator - Query Engine
 *
 * Natural language search for agents, skills, and commands
 */

class QueryEngine {
  constructor(registry) {
    this.registry = registry;

    // Build search index
    this.buildSearchIndex();
  }

  /**
   * Build searchable index from registry
   */
  buildSearchIndex() {
    this.searchIndex = {
      agents: this.registry.agents.map(agent => ({
        ...agent,
        searchText: this.buildSearchText(agent, 'agent')
      })),
      skills: this.registry.skills.map(skill => ({
        ...skill,
        searchText: this.buildSearchText(skill, 'skill')
      })),
      commands: this.registry.commands.map(cmd => ({
        ...cmd,
        searchText: this.buildSearchText(cmd, 'command')
      }))
    };
  }

  /**
   * Build searchable text from item
   */
  buildSearchText(item, type) {
    const parts = [
      item.name || '',
      item.description || '',
      item.category || '',
      type
    ];

    if (type === 'agent') {
      parts.push(item.model || '');
      parts.push((item.capabilities || []).join(' '));
      parts.push((Array.isArray(item.tools) ? item.tools : [item.tools]).join(' '));
    }

    return parts.join(' ').toLowerCase();
  }

  /**
   * Main query method - natural language search
   */
  query(searchText) {
    const query = searchText.toLowerCase();
    const results = {
      agents: [],
      skills: [],
      commands: [],
      totalScore: 0
    };

    // Search agents
    for (const agent of this.searchIndex.agents) {
      const score = this.calculateScore(query, agent.searchText, agent);
      if (score > 0) {
        results.agents.push({ ...agent, score });
        results.totalScore += score;
      }
    }

    // Search skills
    for (const skill of this.searchIndex.skills) {
      const score = this.calculateScore(query, skill.searchText, skill);
      if (score > 0) {
        results.skills.push({ ...skill, score });
        results.totalScore += score;
      }
    }

    // Search commands
    for (const cmd of this.searchIndex.commands) {
      const score = this.calculateScore(query, cmd.searchText, cmd);
      if (score > 0) {
        results.commands.push({ ...cmd, score });
        results.totalScore += score;
      }
    }

    // Sort by score
    results.agents.sort((a, b) => b.score - a.score);
    results.skills.sort((a, b) => b.score - a.score);
    results.commands.sort((a, b) => b.score - a.score);

    return results;
  }

  /**
   * Calculate relevance score for search
   */
  calculateScore(query, text, item) {
    let score = 0;

    // Extract keywords from query
    const queryWords = query.split(/\s+/).filter(w => w.length > 2);

    // Keyword patterns for domain-specific matching
    const patterns = {
      ios: ['ios', 'swift', 'swiftui', 'apple', 'iphone', 'ipad', 'xcode', 'uikit'],
      design: ['design', 'ui', 'ux', 'interface', 'layout', 'pixel', 'aesthetic', 'visual', 'mockup'],
      frontend: ['frontend', 'react', 'nextjs', 'vue', 'angular', 'component', 'jsx', 'tsx'],
      backend: ['backend', 'api', 'server', 'database', 'endpoint', 'rest', 'graphql'],
      architecture: ['architect', 'architecture', 'system', 'design', 'pattern', 'structure'],
      seo: ['seo', 'search', 'optimization', 'ranking', 'google', 'meta', 'keywords'],
      testing: ['test', 'testing', 'unit', 'integration', 'e2e', 'coverage', 'jest', 'vitest'],
      optimization: ['optimize', 'performance', 'speed', 'efficiency', 'improve'],
      workflow: ['workflow', 'orchestrat', 'pipeline', 'automation', 'process'],
      content: ['content', 'article', 'blog', 'writing', 'copy', 'documentation']
    };

    // Direct keyword matches (high score)
    for (const word of queryWords) {
      if (text.includes(word)) {
        score += 10;

        // Extra points for name matches
        if (item.name && item.name.toLowerCase().includes(word)) {
          score += 15;
        }
      }
    }

    // Pattern-based matching (medium score)
    for (const [category, keywords] of Object.entries(patterns)) {
      const queryMatchesCategory = queryWords.some(w => keywords.includes(w));
      const textMatchesCategory = keywords.some(k => text.includes(k));

      if (queryMatchesCategory && textMatchesCategory) {
        score += 8;

        // Extra points if item category matches
        if (item.category && item.category.includes(category)) {
          score += 12;
        }
      }
    }

    // Model-specific queries
    if (query.includes('opus') && item.model === 'opus') score += 20;
    if (query.includes('sonnet') && item.model === 'sonnet') score += 20;
    if (query.includes('haiku') && item.model === 'haiku') score += 20;

    // Fuzzy matching for typos (low score)
    for (const word of queryWords) {
      if (this.fuzzyMatch(word, text)) {
        score += 3;
      }
    }

    return score;
  }

  /**
   * Simple fuzzy matching (allows 1-2 character differences)
   */
  fuzzyMatch(word, text) {
    if (word.length < 4) return false;

    // Check for substring matches with 1-2 char differences
    const regex = new RegExp(word.split('').join('.?'), 'i');
    return regex.test(text);
  }

  /**
   * Find best match for a specific task description
   */
  findBestFor(task) {
    const results = this.query(task);

    // Combine all results
    const all = [
      ...results.agents.map(a => ({ ...a, type: 'agent' })),
      ...results.skills.map(s => ({ ...s, type: 'skill' })),
      ...results.commands.map(c => ({ ...c, type: 'command' }))
    ].sort((a, b) => b.score - a.score);

    return all.slice(0, 5); // Top 5 matches
  }

  /**
   * Quick filters
   */
  filterByModel(model) {
    return this.searchIndex.agents.filter(a => a.model === model.toLowerCase());
  }

  filterByCategory(category) {
    const agents = this.searchIndex.agents.filter(a =>
      a.category.toLowerCase().includes(category.toLowerCase())
    );
    const skills = this.searchIndex.skills.filter(s =>
      s.category.toLowerCase().includes(category.toLowerCase())
    );

    return { agents, skills };
  }

  /**
   * Get all agents with specific capabilities
   */
  findByCapability(capability) {
    const capLower = capability.toLowerCase();

    return this.searchIndex.agents.filter(agent =>
      agent.capabilities && agent.capabilities.some(c =>
        c.toLowerCase().includes(capLower)
      )
    );
  }

  /**
   * Format results for display
   */
  formatResults(results, limit = 10) {
    const output = [];

    if (results.agents && results.agents.length > 0) {
      output.push('🤖 AGENTS:\n');
      results.agents.slice(0, limit).forEach((agent, i) => {
        output.push(`${i + 1}. ${agent.name} (${agent.model.toUpperCase()}) - Score: ${agent.score}`);
        output.push(`   ${agent.description.substring(0, 120)}...`);
        output.push(`   Category: ${agent.category}\n`);
      });
    }

    if (results.skills && results.skills.length > 0) {
      output.push('\n🎨 SKILLS:\n');
      results.skills.slice(0, limit).forEach((skill, i) => {
        output.push(`${i + 1}. ${skill.name} - Score: ${skill.score}`);
        output.push(`   ${skill.description.substring(0, 120)}...`);
        output.push(`   Category: ${skill.category}\n`);
      });
    }

    if (results.commands && results.commands.length > 0) {
      output.push('\n⚡ COMMANDS:\n');
      results.commands.slice(0, limit).forEach((cmd, i) => {
        output.push(`${i + 1}. /${cmd.name} - Score: ${cmd.score}`);
        output.push(`   ${cmd.description.substring(0, 120)}...`);
        output.push(`   Category: ${cmd.category}\n`);
      });
    }

    if (output.length === 0) {
      return 'No results found. Try different keywords.';
    }

    return output.join('\n');
  }

  /**
   * Format best matches for a task
   */
  formatBestMatches(matches) {
    if (matches.length === 0) {
      return 'No matches found.';
    }

    const output = ['🎯 BEST MATCHES:\n'];

    matches.forEach((match, i) => {
      const icon = match.type === 'agent' ? '🤖' : match.type === 'skill' ? '🎨' : '⚡';

      output.push(`${i + 1}. ${icon} ${match.name} (${match.type.toUpperCase()})`);

      if (match.type === 'agent') {
        output.push(`   Model: ${match.model.toUpperCase()} | Category: ${match.category}`);
      } else {
        output.push(`   Category: ${match.category}`);
      }

      output.push(`   ${match.description.substring(0, 150)}...`);
      output.push(`   Relevance Score: ${match.score}\n`);
    });

    return output.join('\n');
  }
}

module.exports = QueryEngine;
