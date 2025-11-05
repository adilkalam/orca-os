"use client"

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export const dynamic = 'force-static'

export default function Orchestration() {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Intersection reveal
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add('in')
    }, { threshold: 0.06, rootMargin: '0px 0px -10% 0px' })
    document.querySelectorAll('[data-reveal], .section-header').forEach((el) => io.observe(el))

    // Timeline progress (scroll-linked)
    let raf = 0
    const root = document.documentElement
    const onFrame = () => {
      const max = Math.max(1, root.scrollHeight - root.clientHeight)
      const p = Math.min(1, Math.max(0, window.scrollY / max))
      root.style.setProperty('--progress', String(p))
      raf = requestAnimationFrame(onFrame)
    }
    raf = requestAnimationFrame(onFrame)
    // Sticky pipeline step activation
    const steps = Array.from(document.querySelectorAll('.js-step') as NodeListOf<HTMLElement>)
    const stepIO = new IntersectionObserver((entries) => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0]
      if (visible) {
        for (const s of steps) (s as any).classList.remove('is-active')
        (visible.target as any).classList.add('is-active')
        const idx = steps.indexOf(visible.target as HTMLElement)
        const progress = steps.length>1 ? idx/(steps.length-1) : 0
        document.documentElement.style.setProperty('--progress', String(progress))
      }
    }, { threshold:[0.3,0.6,0.9], rootMargin:'-20% 0px -20% 0px' })
    steps.forEach(s => stepIO.observe(s))

    return () => { cancelAnimationFrame(raf); io.disconnect(); stepIO.disconnect() }
  }, [])
  return (
    <main className="page theme-augen">
      <div className="container">
        <nav className="nav">
          <div className="nav__brand"><span className="accent-dot" /> <span>Claude Code</span></div>
          <div className="nav__links">
            <Link href="#overview" className="nav__link">Overview</Link>
            <Link href="#memory" className="nav__link">Memory</Link>
            <Link href="#flow" className="nav__link">Flow</Link>
            <Link href="#verify" className="nav__link">Verification</Link>
            <Link href="/orchestration/artifacts" className="nav__link">Artifacts</Link>
          </div>
        </nav>

        <header className="hero stack" data-reveal>
          <span className="kicker">Auto‑Orchestration</span>
          <h1 className="display">Orchestration and memory, engineered for real repos</h1>
          <p className="lede muted">Detects your project, assembles the right specialists, remembers decisions across sessions, and blocks chaos while it ships focused changes.</p>
          <div className="row"><Link href="#overview" className="button button--primary">See how it works</Link><Link href="/" className="button">Back</Link></div>
        </header>

        <section id="overview" className="stack-loose" data-reveal>
          <div className="section-header">
            <div className="stack-tight">
              <span className="label">What makes this different</span>
              <h2 className="h2">Zero config, persistent memory, and chaos prevention</h2>
            </div>
          </div>
          <div className="grid" data-cols="3">
            <article className="card stack-tight">
              <h3 className="h3">Zero configuration</h3>
              <ul className="bullet-list muted">
                <li>Detects project type automatically</li>
                <li>Loads appropriate specialist team</li>
                <li>Describe the outcome — it plans</li>
              </ul>
            </article>
            <article className="card stack-tight">
              <h3 className="h3">Cross‑session memory</h3>
              <ul className="bullet-list muted">
                <li>Workshop DB survives restarts</li>
                <li>ACE playbooks learn per session</li>
                <li>Avoids repeated mistakes</li>
              </ul>
            </article>
            <article className="card stack-tight">
              <h3 className="h3">Chaos prevention</h3>
              <ul className="bullet-list muted">
                <li>Monitors file creation patterns</li>
                <li>Blocks destructive operations</li>
                <li>Built‑in cleanup tools</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="memory" className="stack-loose" data-reveal>
          <div className="section-header">
            <div className="stack-tight">
              <span className="label">Memory system</span>
              <h2 className="h2">Three layers that work together</h2>
            </div>
          </div>
          <div className="card">
            <pre className="body" aria-label="Memory diagram">{`┌────────────────────────────────────────────────────────────┐
│                    MEMORY SYSTEM                           │
└────────────────────────────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   WORKSHOP    │    │ ACE PLAYBOOKS │    │  DESIGN DNA   │
│   (Session)   │    │  (Learning)   │    │    (Taste)    │
└───────────────┘    └───────────────┘    └───────────────┘
        │                    │                    │
        │                    │                    │
┌───────┴────────┐  ┌────────┴────────┐  ┌────────┴───────┐
│ .workshop/     │  │ .orchestration/ │  │ .claude/       │
│ workshop.db    │  │ playbooks/      │  │ design-dna/    │
│                │  │                 │  │                │
│ Stores:        │  │ Stores:         │  │ Stores:        │
│ - Decisions    │  │ - Patterns      │  │ - Typography   │
│ - Gotchas      │  │ - Success rate  │  │ - Spacing      │
│ - Goals        │  │ - Failures      │  │ - Colors       │
│ - Notes        │  │ - Strategies    │  │ - Rules        │
└────────────────┘  └─────────────────┘  └────────────────┘`}</pre>
          </div>
        </section>

        <section id="flow" className="stack-loose" data-reveal>
          <div className="section-header">
            <div className="stack-tight">
              <span className="label">Session flow</span>
              <h2 className="h2">Observe → Plan → Act → Verify → Adapt</h2>
            </div>
          </div>
          <div className="sticky-grid">
            <aside className="pin">
              <div className="pipeline-rail">
                <div className="pipeline-title">Pipeline</div>
                <div className="timeline" />
              </div>
            </aside>
            <div className="steps">
              <article className="step js-step stack-tight">
                <span className="label">Step 1</span>
                <h3 className="h3">Observe</h3>
                <p className="muted">Read repo + context, detect goals and constraints.</p>
              </article>
              <article className="step js-step stack-tight">
                <span className="label">Step 2</span>
                <h3 className="h3">Plan</h3>
                <p className="muted">Generate a live, verifiable plan and update it as we work.</p>
              </article>
              <article className="step js-step stack-tight">
                <span className="label">Step 3</span>
                <h3 className="h3">Act</h3>
                <p className="muted">Run tools, patch files, scaffold code with guardrails.</p>
              </article>
              <article className="step js-step stack-tight">
                <span className="label">Step 4</span>
                <h3 className="h3">Verify</h3>
                <p className="muted">Build/test and validate against success criteria.</p>
              </article>
              <article className="step js-step stack-tight">
                <span className="label">Step 5</span>
                <h3 className="h3">Adapt</h3>
                <p className="muted">Incorporate signals and revise plan quickly.</p>
              </article>
            </div>
          </div>
        </section>

        <section id="verify" className="stack-loose" data-reveal>
          <div className="section-header">
            <div className="stack-tight">
              <span className="label">Verification</span>
              <h2 className="h2">Evidence over claims</h2>
            </div>
          </div>
          <div className="grid" data-cols="3">
            <article className="card stack-tight">
              <h3 className="h3">Screenshots</h3>
              <p className="muted">For UI changes; diffs reviewed before merge.</p>
            </article>
            <article className="card stack-tight">
              <h3 className="h3">Build logs</h3>
              <p className="muted">Compiles clean or it doesn’t ship.</p>
            </article>
            <article className="card stack-tight">
              <h3 className="h3">Tests</h3>
              <p className="muted">Runnable proof — unit and UI where applicable.</p>
            </article>
          </div>
        </section>

        {/* Timeline progress bar */}
        <div className="stack" data-reveal>
          <div className="timeline" />
          <div className="timeline__dots">
            <span className="timeline__dot" />
            <span className="timeline__dot" />
            <span className="timeline__dot" />
            <span className="timeline__dot" />
            <span className="timeline__dot" />
          </div>
        </div>

        <footer className="footer">
          <Link href="/" className="button">Back</Link>
          <Link href="#top" className="button button--primary">Top</Link>
        </footer>
      </div>
    </main>
  )
}
