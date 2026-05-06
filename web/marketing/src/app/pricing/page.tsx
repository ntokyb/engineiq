import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — EngineIQ",
};

const tiers = [
  {
    name: "Starter",
    price: "R1 999",
    period: "/ month",
    desc: "Small teams getting consistent PR reviews.",
    features: ["Up to 15 developers", "Core standards YAML", "GitHub App + portal", "Email support"],
    cta: "Sign up",
    href: "/sign-up",
    highlight: false,
  },
  {
    name: "Growth",
    price: "R4 999",
    period: "/ month",
    desc: "Scaling engineering orgs with higher PR volume.",
    features: [
      "Up to 50 developers",
      "Priority queue hints",
      "Drift & trend dashboards",
      "Slack / webhook hooks (roadmap)",
    ],
    cta: "Sign up",
    href: "/sign-up",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "R15 000",
    period: "/ month",
    desc: "Dedicated support, SSO, and custom policies.",
    features: ["Unlimited seats (fair use)", "Custom contracts", "VPC / private networking options", "Dedicated CSM"],
    cta: "Book a demo",
    href: "/demo",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <div className="eq-section">
      <div className="eq-container">
        <h1 className="eq-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
          Simple pricing in Rand
        </h1>
        <p className="eq-text-md eq-text-muted" style={{ marginTop: 16, maxWidth: 640 }}>
          VAT may apply. Annual billing available on request. All tiers include POPIA-aligned processing and zero source
          code persistence.
        </p>

        <div className="eq-grid-3" style={{ marginTop: 40 }}>
          {tiers.map((t) => (
            <div
              key={t.name}
              className="eq-card"
              style={{
                display: "flex",
                flexDirection: "column",
                ...(t.highlight
                  ? {
                      borderColor: "rgba(124, 58, 237, 0.45)",
                      boxShadow: "0 0 0 1px var(--eq-accent-glow)",
                    }
                  : {}),
              }}
            >
              <div className="eq-row" style={{ justifyContent: "flex-start", gap: 10 }}>
                <h2 className="eq-h3" style={{ color: "var(--eq-accent-light)" }}>
                  {t.name}
                </h2>
                {t.highlight ? (
                  <span className="eq-badge eq-badge--purple">Most popular</span>
                ) : null}
              </div>
              <p className="eq-text-sm eq-text-muted" style={{ marginTop: 10 }}>
                {t.desc}
              </p>
              <p className="eq-text-xl" style={{ marginTop: 20, fontWeight: 600 }}>
                {t.price}
                <span className="eq-text-sm eq-text-dim" style={{ fontWeight: 400 }}>
                  {t.period}
                </span>
              </p>
              <ul
                className="eq-text-sm eq-text-muted"
                style={{ margin: "20px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 12, flex: 1 }}
              >
                {t.features.map((f) => (
                  <li key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--eq-green)", flexShrink: 0 }} aria-hidden="true">
                      ✓
                    </span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 22 }}>
                <Link href={t.href} className={t.highlight ? "eq-btn eq-btn--primary" : "eq-btn eq-btn--secondary"} style={{ width: "100%", justifyContent: "center" }}>
                  {t.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
