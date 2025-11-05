'use client'

import Link from 'next/link'

export default function InjuryProtocolV2() {
  return (
    <main className="ds-container" id="top">
      {/* Header */}
      <header>
        <span className="ds-label">Tendon & Soft Tissue Healing</span>
        <h1 className="ds-display">Injury Repair</h1>
        <p className="ds-description">
          Structured peptide protocol aligned to the natural healing cascade: restart signals, rebuild collagen, and reintegrate function.
        </p>
      </header>

      {/* Quick overview cards */}
      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="ds-h3">3‑Phase Recovery Overview</h2>
        <div className="cards-grid">
          <article className="ds-card ds-card-hover" aria-label="Phase 1">
            <span className="ds-label">Weeks 1–2</span>
            <h3 className="ds-h4">Activation</h3>
            <p className="ds-body">Restart angiogenesis and early cellular migration while lowering cytokine noise.</p>
            <div className="row-with-action">
              <span className="ds-badge ds-badge-active">Core</span>
              <a href="#phase-1" className="ds-button ds-button-secondary">View details</a>
            </div>
          </article>

          <article className="ds-card ds-card-hover" aria-label="Phase 2">
            <span className="ds-label">Weeks 3–6</span>
            <h3 className="ds-h4">Remodeling</h3>
            <p className="ds-body">Build collagen, align fibers, and restore load‑bearing capacity with controlled eccentrics.</p>
            <div className="row-with-action">
              <span className="ds-badge ds-badge-active">Core</span>
              <a href="#phase-2" className="ds-button ds-button-secondary">View details</a>
            </div>
          </article>

          <article className="ds-card ds-card-hover" aria-label="Phase 3">
            <span className="ds-label">Weeks 7–10+</span>
            <h3 className="ds-h4">Integration</h3>
            <p className="ds-body">Consolidate tissue quality, reintegrate neuromuscular control, and prevent re‑injury.</p>
            <div className="row-with-action">
              <span className="ds-badge ds-badge-pending">Taper</span>
              <a href="#phase-3" className="ds-button ds-button-secondary">View details</a>
            </div>
          </article>
        </div>
      </section>

      <div className="ds-divider" />

      {/* Protocol Phases (dense, scannable tables) */}
      <section id="phase-1" aria-labelledby="p1-heading">
        <span className="ds-label">The Protocol</span>
        <h2 id="p1-heading" className="ds-h3">Phase 1 — Activation / Inflammation Reset (Weeks 1–2)</h2>
        <div className="card-grid">
          <article className="ds-card">
            <div className="table-wrapper">
              <table className="ds-table">
                <thead>
                  <tr>
                    <th>Compound</th>
                    <th>Dose</th>
                    <th>Frequency</th>
                    <th>Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>BPC‑157</td><td>500–750 µg</td><td>Daily</td><td>Angiogenesis; fibroblast activation</td></tr>
                  <tr><td>KPV</td><td>500 µg</td><td>Daily</td><td>NF‑κB downregulation; mast‑cell control</td></tr>
                  <tr><td>TB‑500</td><td>3–5 mg</td><td>2× / wk</td><td>Actin mobilization; early migration</td></tr>
                  <tr><td>GHK‑Cu</td><td>2 mg</td><td>3× / wk</td><td>Collagen gene expression; SOD</td></tr>
                  <tr><td>NAD+ (opt.)</td><td>200 mg</td><td>3× / wk</td><td>Mitochondrial support</td></tr>
                </tbody>
              </table>
            </div>
            <div className="accent-left">
              <p className="ds-body">
                Rehab focus: light mobility + isometrics. Avoid ice/NSAIDs; prioritize sleep (GH pulses → collagen synthesis).
              </p>
            </div>
          </article>
        </div>
      </section>

      <section id="phase-2" aria-labelledby="p2-heading">
        <h2 id="p2-heading" className="ds-h3">Phase 2 — Proliferation / Tissue Remodeling (Weeks 3–6)</h2>
        <article className="ds-card">
          <div className="table-wrapper">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Compound</th>
                  <th>Dose</th>
                  <th>Frequency</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>BPC‑157</td><td>500 µg</td><td>Daily</td><td>Vascular support</td></tr>
                <tr><td>TB‑500</td><td>2–3 mg</td><td>2× / wk</td><td>Maintain migration & alignment</td></tr>
                <tr><td>GHK‑Cu</td><td>3 mg</td><td>3× / wk</td><td>COL1A1 ↑; elastin, SOD</td></tr>
                <tr><td>KPV</td><td>250–500 µg</td><td>Daily/EOD</td><td>Keep inflammation low, not absent</td></tr>
                <tr><td>NAD+</td><td>150 mg</td><td>3× / wk</td><td>Mitochondrial support</td></tr>
              </tbody>
            </table>
          </div>
          <div className="accent-left">
            <p className="ds-body">
              Rehab: controlled eccentrics. Massage or scraping ~24h post TB‑500 to encourage fiber alignment.
            </p>
          </div>
        </article>
      </section>

      <section id="phase-3" aria-labelledby="p3-heading">
        <h2 id="p3-heading" className="ds-h3">Phase 3 — Consolidation / Integration (Weeks 7–10+)</h2>
        <article className="ds-card">
          <div className="table-wrapper">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Compound</th>
                  <th>Dose</th>
                  <th>Frequency</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>BPC‑157</td><td>250 µg</td><td>3× / wk</td><td>Maintenance; prevent micro‑re‑injury</td></tr>
                <tr><td>GHK‑Cu</td><td>2 mg</td><td>2× / wk</td><td>Skin/tendon quality; scar aesthetics</td></tr>
                <tr><td>NAD+ (opt.)</td><td>100 mg</td><td>2× / wk</td><td>Energy availability</td></tr>
              </tbody>
            </table>
          </div>
          <div className="accent-left">
            <p className="ds-body">
              Return to sport with progressive plyometrics and sport‑specific loading; keep RPE ≤7/10 for two weeks.
            </p>
          </div>
        </article>
      </section>

      <div className="ds-divider" />

      {/* Core Compounds */}
      <section aria-labelledby="compounds-heading">
        <h2 id="compounds-heading" className="ds-h3">Core Compounds</h2>
        <div className="cards-grid">
          {[
            { name: 'BPC‑157', tag: 'angiogenesis', body: 'Peri‑lesional dosing near injury or systemic.' },
            { name: 'TB‑500', tag: 'actin mobilization', body: 'Cell migration; supports alignment with loading.' },
            { name: 'GHK‑Cu', tag: 'collagen genes', body: 'COL1A1 ↑; elastin and antioxidant signaling.' },
            { name: 'KPV', tag: 'NF‑κB', body: 'Inflammation control without blunting remodeling.' },
            { name: 'NAD+', tag: 'mito support', body: 'Fuel availability for repair; optional taper.' },
          ].map((c) => (
            <article key={c.name} className="ds-card ds-card-hover">
              <span className="ds-label">{c.tag}</span>
              <h3 className="ds-h4">{c.name}</h3>
              <p className="ds-body">{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="ds-divider" />

      {/* Safety & Contraindications */}
      <section aria-labelledby="safety-heading">
        <h2 id="safety-heading" className="ds-h3">Safety & Contraindications</h2>
        <div className="card-grid">
          <div className="accent-left">
            <ul className="bullet-list ds-body">
              <li>Anticoagulants/bleeding disorders → medical supervision required</li>
              <li>Active infection at or near injection site → defer</li>
              <li>Pregnancy/breastfeeding → avoid unless prescribed</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Navigation footer */}
      <footer className="footer">
        <Link href="/protocols/injury" className="ds-button ds-button-secondary">Back to Injury v1</Link>
        <a href="#top" className="ds-button ds-button-primary">Back to Top</a>
      </footer>
    </main>
  )
}
