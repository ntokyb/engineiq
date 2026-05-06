import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <section className="eq-hero">
        <div className="eq-hero__mesh" aria-hidden="true" />
        <div className="eq-hero__grid" aria-hidden="true" />

        <div className="eq-container">
          <div className="eq-hero__content">
            <div className="eq-pill" role="status" aria-label="Production status">
              <span className="eq-dot" aria-hidden="true" />
              <span>AI-powered code review</span>
              <span className="eq-text-dim">Now in production · engineiq.co.za</span>
            </div>

            <h1 className="eq-h1" style={{ marginTop: 18, maxWidth: 720 }}>
              Every pull request,
              <br />
              reviewed by Claude.
            </h1>

            <p className="eq-hero__sub">
              EngineIQ catches architectural drift, security gaps, and code quality issues before they
              reach production. Zero setup. Works in 60 seconds.
            </p>

            <div className="eq-cta-row" role="group" aria-label="Primary calls to action">
              <Link href="/sign-up" className="eq-btn eq-btn--primary">
                Install GitHub App →
              </Link>
              <Link href="/how-it-works" className="eq-btn eq-btn--secondary">
                See how it works
              </Link>
            </div>

            <p className="eq-kicker">
              Trust layer included: <span className="eq-font-mono">GET /security</span>, per-tenant
              audit metadata, and an explicit “no code stored” footer on every PR comment.
            </p>

            <div style={{ marginTop: 44 }} className="eq-card" aria-label="Social proof">
              <div className="eq-row">
                <div className="eq-text-sm eq-text-muted">Trusted by engineering teams on</div>
                <div className="eq-text-sm eq-text-dim" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <span className="eq-badge eq-badge--grey">GitHub</span>
                  <span className="eq-badge eq-badge--grey">.NET</span>
                  <span className="eq-badge eq-badge--grey">Next.js</span>
                  <span className="eq-badge eq-badge--grey">PostgreSQL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eq-section">
        <div className="eq-container">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
            <div>
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                How it works
              </div>
              <h2 className="eq-h2" style={{ marginTop: 10, maxWidth: 520 }}>
                From install to PR feedback in minutes.
              </h2>
              <p className="eq-text-md eq-text-muted" style={{ margin: "12px 0 0", maxWidth: 560 }}>
                EngineIQ lives in your PR workflow. No repo changes. No agents. No IDE plugins.
              </p>
            </div>
            <div style={{ alignSelf: "flex-end" }}>
              <Link href="/sign-up" className="eq-btn eq-btn--secondary">
                Get started
              </Link>
            </div>
          </div>

          <div className="eq-grid-3" style={{ marginTop: 18 }}>
            {[
              {
                n: "01",
                t: "Install the GitHub App",
                d: "One click. Select your repositories. No code changes required.",
              },
              {
                n: "02",
                t: "Open a pull request",
                d: "EngineIQ receives the webhook and queues a review — fast, async, and reliable.",
              },
              {
                n: "03",
                t: "Get AI review in seconds",
                d: "Claude analyses your diff and posts findings directly on the PR — with a trust footer.",
              },
            ].map((s) => (
              <div key={s.n} className="eq-card">
                <div className="eq-text-2xl eq-font-mono" style={{ color: "var(--eq-accent-light)" }}>
                  {s.n}
                </div>
                <div className="eq-h3" style={{ marginTop: 10 }}>
                  {s.t}
                </div>
                <p className="eq-text-sm eq-text-muted" style={{ margin: "8px 0 0" }}>
                  {s.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="eq-section" style={{ paddingTop: 0 }}>
        <div className="eq-container">
          <div className="eq-divider" />
          <div style={{ marginTop: 56 }}>
            <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Features
            </div>
            <h2 className="eq-h2" style={{ marginTop: 10 }}>
              Built for regulated engineering teams.
            </h2>
            <p className="eq-text-md eq-text-muted" style={{ margin: "12px 0 0", maxWidth: 720 }}>
              Architecture awareness, auditability, and tenant isolation are first-class — not an afterthought.
            </p>

            <div className="eq-grid-3" style={{ marginTop: 18 }}>
              {[
                { t: "Architecture awareness", d: "Detect drift and layering violations across PRs." },
                { t: "Security scanning", d: "Surface obvious secrets and risky patterns early." },
                { t: "Zero data retention", d: "Diffs processed in memory only; no source stored." },
                { t: "Instant GitHub comments", d: "Findings posted where developers work: the PR." },
                { t: "Cost tracking per review", d: "Token usage and ZAR estimates retained as metadata." },
                { t: "Multi-tenant isolation", d: "Strict tenant scoping + PostgreSQL RLS." },
              ].map((f) => (
                <div key={f.t} className="eq-card">
                  <div className="eq-h3">{f.t}</div>
                  <p className="eq-text-sm eq-text-muted" style={{ margin: "8px 0 0" }}>
                    {f.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="eq-section" style={{ paddingTop: 0 }}>
        <div className="eq-container">
          <div className="eq-divider" />
          <div style={{ marginTop: 56 }}>
            <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Pricing
            </div>
            <h2 className="eq-h2" style={{ marginTop: 10 }}>
              Simple pricing in Rand.
            </h2>
            <p className="eq-text-md eq-text-muted" style={{ margin: "12px 0 0", maxWidth: 640 }}>
              Start free, then scale to your engineering footprint.
            </p>

            <div className="eq-grid-3" style={{ marginTop: 18 }}>
              {[
                {
                  tier: "Starter",
                  price: "Free",
                  desc: "50 PRs / month · 1 repo",
                  badge: "New",
                  badgeClass: "eq-badge eq-badge--purple",
                },
                {
                  tier: "Growth",
                  price: "R499 / month",
                  desc: "Unlimited PRs · 5 repos · Priority review",
                  badge: "Most popular",
                  badgeClass: "eq-badge eq-badge--green",
                },
                {
                  tier: "Enterprise",
                  price: "Custom",
                  desc: "Unlimited · SLA · Dedicated support",
                  badge: "Talk to us",
                  badgeClass: "eq-badge eq-badge--grey",
                },
              ].map((p) => (
                <div key={p.tier} className="eq-card">
                  <div className="eq-row">
                    <div className="eq-h3">{p.tier}</div>
                    <span className={p.badgeClass}>{p.badge}</span>
                  </div>
                  <div className="eq-text-xl" style={{ marginTop: 14, fontWeight: 600 }}>
                    {p.price}
                  </div>
                  <p className="eq-text-sm eq-text-muted" style={{ margin: "8px 0 0" }}>
                    {p.desc}
                  </p>
                  <div style={{ marginTop: 18 }}>
                    <Link href="/sign-up" className="eq-btn eq-btn--secondary" style={{ width: "100%" }}>
                      Choose {p.tier}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 18 }}>
              <Link href="/pricing" className="eq-btn eq-btn--secondary">
                See detailed pricing →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="eq-section" style={{ paddingTop: 0 }}>
        <div className="eq-container">
          <div className="eq-divider" />
          <div style={{ marginTop: 56 }} className="eq-card">
            <div className="eq-row" style={{ alignItems: "flex-start" }}>
              <div>
                <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Trust / security
                </div>
                <h2 className="eq-h2" style={{ marginTop: 10 }}>
                  Your code never leaves the diff.
                </h2>
                <p className="eq-text-md eq-text-muted" style={{ margin: "12px 0 0", maxWidth: 720 }}>
                  EngineIQ processes diffs in memory. No source code is stored. Findings metadata only is retained
                  for your dashboard and audit trail.
                </p>
                <div className="eq-cta-row" style={{ marginTop: 16 }}>
                  <Link href="/security" className="eq-btn eq-btn--secondary">
                    Read the security model
                  </Link>
                  <a href="https://api.engineiq.co.za/security" className="eq-btn eq-btn--secondary">
                    Verify via API →
                  </a>
                </div>
              </div>
              <div style={{ minWidth: 280 }}>
                <table className="eq-table" aria-label="Trust checklist">
                  <thead>
                    <tr>
                      <th>Claim</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Ephemeral processing", "true"],
                      ["No code stored", "true"],
                      ["Audit log available", "true"],
                      ["AI provider", "Anthropic"],
                    ].map(([k, v]) => (
                      <tr key={k}>
                        <td className="eq-text-sm eq-text-muted">{k}</td>
                        <td className="eq-text-sm eq-font-mono">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="eq-section" style={{ paddingTop: 0 }}>
        <div className="eq-container">
          <div className="eq-divider" />
          <div className="eq-row" style={{ padding: "44px 0" }}>
            <div>
              <h2 className="eq-h2">Start reviewing in 60 seconds.</h2>
              <p className="eq-text-md eq-text-muted" style={{ margin: "10px 0 0" }}>
                CTO-ready onboarding. No engineer involvement required.
              </p>
            </div>
            <div className="eq-cta-row" style={{ marginTop: 0 }}>
              <Link href="/sign-up" className="eq-btn eq-btn--primary">
                Install GitHub App →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
