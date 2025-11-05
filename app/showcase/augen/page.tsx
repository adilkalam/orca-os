'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function AugenInspiredShowcase() {
  const bars = [20, 35, 50, 65, 80, 100, 50, 35, 65, 80]
  const rootRef = useRef<HTMLDivElement | null>(null)

  // Motion: scroll-linked variables + reveal
  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let curr = 0
    const lerp = (a: number, b: number, n: number) => a + (b - a) * n
    const onFrame = () => {
      const max = Math.max(1, root.scrollHeight - root.clientHeight)
      const target = window.scrollY / max
      curr = lerp(curr, target, 0.08)
      // Update CSS vars for parallax/orb
      root.style.setProperty('--scrollP', String(curr))
      root.style.setProperty('--orb-x', String((curr * 140) - 20))
      root.style.setProperty('--orb-y', String((-curr * 90) - 20))
      raf = requestAnimationFrame(onFrame)
    }
    raf = requestAnimationFrame(onFrame)

    // Intersection reveal
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('in')
        }
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [])
  return (
    <main className="page theme-augen" ref={rootRef as any}>
      <div className="container">
        {/* Top nav */}
        <nav className="nav">
          <div className="nav__brand">
            <span className="accent-dot" aria-hidden />
            <span>Signal</span>
          </div>
          <div className="nav__links">
            <span className="pill">Beta</span>
            <Link href="#specs" className="nav__link">Tokens</Link>
            <Link href="#metrics" className="nav__link">Metrics</Link>
          </div>
        </nav>

        {/* Hero: split layout with framed visual */}
        <header className="hero--augen is-in">
          <div className="split">
            <div data-reveal>
              <span className="kicker">Case Study</span>
              <h1 className="display">Augen‑grade precision, with pure global CSS</h1>
              <p className="lede mt-8">Editorial density, restrained depth, and hairline detail. Built from a compact set of primitives—no utility chains, no frameworks.</p>
              <div className="row mt-12">
                <Link className="button button--primary" href="#metrics">View metrics</Link>
                <Link className="button" href="#features">See primitives</Link>
              </div>
            </div>
            <div className="frame frame--hero" data-reveal="zoom" />
          </div>
          <div className="row mt-12" data-reveal>
            <div className="stat">
              <span className="stat__label">Latency (p95)</span>
              <span className="stat__value mono">112ms</span>
              <span className="stat__delta">‑8.4% WoW</span>
            </div>
            <div className="stat">
              <span className="stat__label">Uptime</span>
              <span className="stat__value mono">99.982%</span>
              <span className="stat__delta">+0.01% MoM</span>
            </div>
            <div className="stat">
              <span className="stat__label">Throughput</span>
              <span className="stat__value mono">42k rps</span>
              <span className="stat__delta">+1.2k d/d</span>
            </div>
          </div>
        </header>

        {/* Feature grid */}
        <section id="features" aria-labelledby="features-heading" className="mt-12">
          <div className="section-header">
            <div>
              <span className="label">System Primitives</span>
              <h2 id="features-heading" className="h2">Cards + Grids + Badges</h2>
            </div>
            <Link className="button button--primary" href="#specs">View tokens</Link>
          </div>

          <div className="grid" data-cols="3" data-reveal>

            <article className="card">
              <div className="row">
                <h3 className="h3">Latency</h3>
                <span className="badge">p50/p95/p99</span>
              </div>
              <table className="table mt-8" aria-label="Latency percentiles">
                <thead>
                  <tr><th>Slice</th><th>ms</th><th>Target</th></tr>
                </thead>
                <tbody>
                  <tr><td>p50</td><td>41</td><td><div className="progress" style={{ ['--value' as any]: 78 }} /></td></tr>
                  <tr><td>p95</td><td>112</td><td><div className="progress" style={{ ['--value' as any]: 62 }} /></td></tr>
                  <tr><td>p99</td><td>231</td><td><div className="progress" style={{ ['--value' as any]: 48 }} /></td></tr>
                </tbody>
              </table>
            </article>

            <article className="card">
              <div className="row">
                <h3 className="h3">Reliability</h3>
                <span className="badge">SLO</span>
              </div>
              <p className="muted mt-8">Rolling 30‑day burn rate vs SLO; incremental error budget shown.</p>
              <div className="progress mt-8" style={{ ['--value' as any]: 84 }} aria-label="Error budget used" />
              <div className="row mt-8 tight">
                <span className="label">Budget used</span>
                <span className="body">16%</span>
              </div>
            </article>
          </div>
        </section>

        {/* Dense table section */}
        <section id="metrics" className="mt-12" data-reveal>
          <div className="section-header">
            <div>
              <span className="label">Detail</span>
              <h2 className="h2">Top services (7d)</h2>
            </div>
            <Link href="#" className="button">Export CSV</Link>
          </div>
          <div className="card card--tight">
            <div className="surface pad-4">
              <table className="table" aria-label="Service metrics">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>RPS</th>
                    <th>p95</th>
                    <th>Errors</th>
                    <th>Budget</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'ingest', rps: '12.1k', p95: 104, err: '0.12%', bud: 92 },
                    { name: 'vectorizer', rps: '8.4k', p95: 187, err: '0.08%', bud: 88 },
                    { name: 'search', rps: '6.9k', p95: 76, err: '0.04%', bud: 81 },
                    { name: 'chat-gateway', rps: '3.5k', p95: 142, err: '0.16%', bud: 73 },
                  ].map((s) => (
                    <tr key={s.name}>
                      <td><span className="badge">{s.name}</span></td>
                      <td>{s.rps}</td>
                      <td>{s.p95}ms</td>
                      <td>{s.err}</td>
                      <td><div className="progress" style={{ ['--value' as any]: s.bud }} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tokens snapshot */}
        <section id="specs" className="mt-12" data-reveal>
          <div className="section-header">
            <div>
              <span className="label">Tokens</span>
              <h2 className="h2">Core design tokens</h2>
            </div>
          </div>
          <div className="grid" data-cols="3">
            <article className="card">
              <h3 className="h4">Typography</h3>
              <ul className="bullet-list mt-8">
                <li>Sans: <code>var(--font-sans)</code></li>
                <li>Mono: <code>var(--font-mono)</code></li>
                <li>Scale: <code>--fs-1…--fs-8</code></li>
              </ul>
            </article>
            <article className="card">
              <h3 className="h4">Spacing & Radii</h3>
              <ul className="bullet-list mt-8">
                <li>Space: <code>--space-1…--space-20</code></li>
                <li>Radii: <code>--radius-1…--radius-3</code></li>
                <li>Round: <code>--radius-round</code></li>
              </ul>
            </article>
            <article className="card">
              <h3 className="h4">Color & Motion</h3>
              <ul className="bullet-list mt-8">
                <li>Brand: <code>--brand</code></li>
                <li>Borders: <code>--border</code></li>
                <li>Ease: <code>--ease-emph</code></li>
              </ul>
            </article>
          </div>
        </section>

        <footer className="footer">
          <Link href="/" className="button">Back</Link>
          <Link href="#" className="button button--primary">Open in sandbox</Link>
        </footer>
      </div>
    </main>
  )
}
