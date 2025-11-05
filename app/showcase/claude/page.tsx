'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function ClaudeOrchestrationShowcase() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add('in')
    }, { threshold: 0.06, rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const steps = [
    { id: 'observe', title: 'Observe', body: 'Read repo + context, detect goals and constraints.' },
    { id: 'plan', title: 'Plan', body: 'Generate a stepwise plan; keep it live and updated.' },
    { id: 'act', title: 'Act', body: 'Run tools, patch files, scaffold code with guardrails.' },
    { id: 'verify', title: 'Verify', body: 'Build/test and validate against success criteria.' },
    { id: 'adapt', title: 'Adapt', body: 'Incorporate signals and revise plan quickly.' },
  ]

  const layers = [
    { name: 'Design DNA', items: ['Global CSS policy', 'Tokens + components', 'Structure conventions', 'UX tone + density'] },
    { name: 'Session Memory', items: ['Active plan', 'Decisions + rationale', 'Open threads', 'Constraints'] },
    { name: 'Repo Memory', items: ['File graph', 'Patterns', 'Existing APIs', 'Local scripts'] },
  ]

  return (
    <main className="page theme-augen">
      <div className="container">
        {/* Nav */}
        <nav className="nav">
          <div className="nav__brand">
            <span className="accent-dot" aria-hidden />
            <span>Orchestrator</span>
          </div>
          <div className="nav__links">
            <Link href="#pipeline" className="nav__link">Pipeline</Link>
            <Link href="#memory" className="nav__link">Memory</Link>
            <Link href="#artifacts" className="nav__link">Artifacts</Link>
          </div>
        </nav>

        {/* Hero */}
        <header className="hero--augen is-in">
          <div className="split">
            <div data-reveal>
              <span className="kicker">Claude Code</span>
              <h1 className="display">Orchestration + Memory, engineered</h1>
              <p className="lede mt-8">A disciplined agent loop with live planning and layered memory. Built to ship reliable changes in complex repos — fast.</p>
              <div className="row mt-12">
                <Link className="button button--primary" href="#pipeline">See pipeline</Link>
                <Link className="button" href="#memory">View memory</Link>
              </div>
            </div>
            <div className="frame frame--hero" data-reveal>
              {/* Clean, no gradients — quiet panel for future media */}
            </div>
          </div>
        </header>

        {/* Pipeline */}
        <section id="pipeline" className="mt-12" data-reveal>
          <div className="section-header">
            <div>
              <span className="label">Pipeline</span>
              <h2 className="h2">Observe → Plan → Act → Verify → Adapt</h2>
            </div>
          </div>
          <div className="surface pad-6">
            <ol className="grid" data-cols="5" style={{ ['--cols' as any]: 5 }}>
              {steps.map(s => (
                <li key={s.id} className="card card--tight" data-reveal>
                  <div className="label">{s.title}</div>
                  <div className="body">{s.body}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Memory Layers */}
        <section id="memory" className="mt-12" data-reveal>
          <div className="section-header">
            <div>
              <span className="label">Memory</span>
              <h2 className="h2">Three layers, one working model</h2>
            </div>
          </div>
          <div className="grid" data-cols="3">
            {layers.map((layer) => (
              <article key={layer.name} className="card">
                <h3 className="h3">{layer.name}</h3>
                <ul className="bullet-list mt-8">
                  {layer.items.map((it) => (<li key={it} className="muted">{it}</li>))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* Artifacts */}
        <section id="artifacts" className="mt-12" data-reveal>
          <div className="section-header">
            <div>
              <span className="label">Artifacts</span>
              <h2 className="h2">What the agent produces</h2>
            </div>
          </div>
          <div className="card card--tight">
            <div className="surface pad-4">
              <table className="table" aria-label="Artifacts">
                <thead>
                  <tr>
                    <th>Artifact</th>
                    <th>Purpose</th>
                    <th>Where</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Plan</td><td>Live steps and progress</td><td>update_plan feed</td></tr>
                  <tr><td>Patches</td><td>Minimal, focused diffs</td><td>apply_patch</td></tr>
                  <tr><td>Context</td><td>Design DNA / constraints</td><td>.claude-*.md</td></tr>
                  <tr><td>Notes</td><td>Rationale + next actions</td><td>final message</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="footer">
          <Link href="/" className="button">Back</Link>
          <Link href="#top" className="button button--primary">Top</Link>
        </footer>
      </div>
    </main>
  )
}

