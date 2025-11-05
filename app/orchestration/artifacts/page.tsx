"use client"

import Link from 'next/link'
import { useEffect } from 'react'

export default function Artifacts() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add('in')
    }, { threshold: 0.08 })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <main className="page theme-augen">
      <div className="container">
        <nav className="nav">
          <div className="nav__brand"><span className="accent-dot" /> <span>Artifacts</span></div>
          <div className="nav__links">
            <Link href="/orchestration" className="nav__link">Back to Overview</Link>
          </div>
        </nav>

        <header className="hero stack" data-reveal>
          <span className="kicker">Artifacts</span>
          <h1 className="display">Real changes from this repo</h1>
          <p className="lede muted">Patches and plan snapshot used to build this site.</p>
        </header>

        <section className="stack-loose" data-reveal>
          <div className="code-grid">
            <div className="code-block reveal-mask" aria-label="Patch: add layout.tsx">
{`// Patch: add app/layout.tsx
import type { Metadata } from 'next'
import '../src/styles/globals.css'

export const metadata: Metadata = {
  title: 'Design Showcase',
  description: 'Token-driven UI showcase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang=\"en\">
      <body>{children}</body>
    </html>
  )
}`}
            </div>
            <div className="code-block reveal-mask" aria-label="Patch: switch to app/globals.css">
{`// Patch: update app/layout.tsx (CSS import)
-- import '../src/styles/globals.css'
+ import './globals.css'`}
            </div>
          </div>
        </section>

        <section className="stack-loose" data-reveal>
          <div className="card reveal-mask stack-tight" aria-label="Plan snapshot">
            <div className="label">Plan snapshot</div>
            <ul className="bullet-list">
              <li>✓ Add global CSS tokens + base</li>
              <li>✓ Wire globals in app/layout</li>
              <li>✓ Build demo pages (augen/claude)</li>
              <li>✓ Refactor injury v2 to globals</li>
              <li>• Orchestration site — sticky timeline + artifacts</li>
            </ul>
          </div>
        </section>

        <footer className="footer">
          <Link href="/orchestration" className="button">Back</Link>
          <Link href="#top" className="button button--primary">Top</Link>
        </footer>
      </div>
    </main>
  )
}

