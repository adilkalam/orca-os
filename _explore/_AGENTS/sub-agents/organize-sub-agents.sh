#!/bin/bash
# Organize sub-agents into logical categories
# Based on technology stack and domain expertise

set -euo pipefail

cd "$(dirname "$0")/agents-claude-code-main"

# Create category directories
mkdir -p 01-frontend-frameworks
mkdir -p 02-backend-runtimes
mkdir -p 03-cloud-infrastructure
mkdir -p 04-databases-data
mkdir -p 05-devops-tools
mkdir -p 06-programming-languages
mkdir -p 07-testing-tools
mkdir -p 08-security-privacy
mkdir -p 09-mobile-gaming
mkdir -p 10-web3-blockchain
mkdir -p 11-performance-optimization
mkdir -p 12-specialized-domains

echo "📦 Organizing 100+ agents into categories..."

# Frontend Frameworks
for file in react-wizard.md vue-virtuoso.md angular-authority.md svelte-sorcerer.md remix-rockstar.md nextjs-architect.md jamstack-ninja.md tailwind-artist.md sass-sculptor.md storybook-artist.md pwa-pioneer.md webpack-optimizer.md; do
  [ -f "$file" ] && mv "$file" 01-frontend-frameworks/ 2>/dev/null || true
done

# Backend Runtimes & Frameworks
for file in nodejs-ninja.md deno-developer.md bun-expert.md express-engineer.md nest-specialist.md fastapi-expert.md flask-artisan.md django-master.md rails-architect.md laravel-wizard.md spring-boot-guru.md php-professional.md dotnet-expert.md ruby-craftsman.md; do
  [ -f "$file" ] && mv "$file" 02-backend-runtimes/ 2>/dev/null || true
done

# Cloud Infrastructure
for file in aws-architect.md azure-specialist.md gcp-architect.md kubernetes-pilot.md docker-captain.md terraform-master.md istio-specialist.md cloud-cost-optimizer.md edge-computing-expert.md; do
  [ -f "$file" ] && mv "$file" 03-cloud-infrastructure/ 2>/dev/null || true
done

# Databases & Data
for file in postgresql-guru.md mongodb-master.md redis-specialist.md elasticsearch-expert.md database-wizard.md kafka-commander.md data-detective.md data-storyteller.md; do
  [ -f "$file" ] && mv "$file" 04-databases-data/ 2>/dev/null || true
done

# DevOps Tools
for file in devops-maestro.md github-actions-pro.md gitlab-specialist.md jenkins-expert.md ansible-automation.md linux-admin.md workflow-automator.md; do
  [ -f "$file" ] && mv "$file" 05-devops-tools/ 2>/dev/null || true
done

# Programming Languages
for file in python-alchemist.md typescript-sage.md golang-guru.md rust-evangelist.md java-architect.md kotlin-expert.md swift-specialist.md cpp-master.md elixir-wizard.md solidity-sage.md; do
  [ -f "$file" ] && mv "$file" 06-programming-languages/ 2>/dev/null || true
done

# Testing Tools
for file in jest-ninja.md vitest-virtuoso.md pytest-master.md cypress-champion.md playwright-pro.md; do
  [ -f "$file" ] && mv "$file" 07-testing-tools/ 2>/dev/null || true
done

# Security & Privacy
for file in privacy-architect.md threat-modeler.md accessibility-guardian.md; do
  [ -f "$file" ] && mv "$file" 08-security-privacy/ 2>/dev/null || true
done

# Mobile & Gaming
for file in mobile-architect.md flutter-expert.md game-designer.md ar-vr-developer.md webgl-wizard.md; do
  [ -f "$file" ] && mv "$file" 09-mobile-gaming/ 2>/dev/null || true
done

# Web3 & Blockchain
for file in web3-builder.md blockchain-architect.md; do
  [ -f "$file" ] && mv "$file" 10-web3-blockchain/ 2>/dev/null || true
done

# Performance & Optimization
for file in performance-optimizer.md scale-architect.md reliability-engineer.md chaos-engineer.md incident-commander.md tech-debt-surgeon.md; do
  [ -f "$file" ] && mv "$file" 11-performance-optimization/ 2>/dev/null || true
done

# Specialized Domains
for file in api-archaeologist.md graphql-wizard.md ml-ops-architect.md quantum-developer.md embedded-engineer.md fintech-engineer.md shopify-expert.md stripe-specialist.md supabase-specialist.md openai-integrator.md nginx-wizard.md prometheus-expert.md seo-specialist.md content-strategist.md market-researcher.md growth-hacker.md developer-advocate.md startup-cto.md visual-architect.md; do
  [ -f "$file" ] && mv "$file" 12-specialized-domains/ 2>/dev/null || true
done

echo ""
echo "✅ Organization complete!"
echo ""
echo "Summary:"
for dir in */; do
  if [[ "$dir" =~ ^[0-9] ]]; then
    count=$(find "$dir" -maxdepth 1 -type f -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    echo "  $dir: $count agents"
  fi
done

