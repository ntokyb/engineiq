import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="eq-footer">
      <div className="eq-container">
        <div className="eq-row" style={{ alignItems: "flex-start" }}>
          <div>
            <div className="eq-brand" style={{ gap: 10 }}>
              <span className="eq-brand__mark" aria-hidden="true" />
              <span>EngineIQ</span>
            </div>
            <p className="eq-text-sm eq-text-dim" style={{ margin: "10px 0 0", maxWidth: 520 }}>
              Premium AI code review for teams that care about architecture, compliance, and shipping
              quality. Built by Codist.
            </p>
            <p className="eq-text-xs eq-text-dim" style={{ margin: "14px 0 0" }}>
              © {new Date().getFullYear()} EngineIQ. Built in South Africa.
            </p>
          </div>

          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <div style={{ minWidth: 160 }}>
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Product
              </div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <Link href="/pricing" className="eq-text-sm">
                  Pricing
                </Link>
                <Link href="/how-it-works" className="eq-text-sm">
                  How it works
                </Link>
                <Link href="/docs" className="eq-text-sm">
                  Docs
                </Link>
              </div>
            </div>

            <div style={{ minWidth: 160 }}>
              <div className="eq-text-xs eq-text-muted" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Trust
              </div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                <Link href="/security" className="eq-text-sm">
                  Security model
                </Link>
                <a className="eq-text-sm" href="https://api.engineiq.co.za/security">
                  API trust JSON
                </a>
                <a className="eq-text-sm" href="mailto:hello@engineiq.co.za">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
