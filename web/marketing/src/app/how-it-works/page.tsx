import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How it works — EngineIQ",
};

const steps = [
  {
    n: "1",
    title: "Connect GitHub",
    body: "Install the EngineIQ GitHub App on your organisation. Webhooks enqueue review jobs — nothing heavy runs on the HTTP thread.",
  },
  {
    n: "2",
    title: "Standards + AI",
    body: "Your YAML standards config guides reviews. Claude (claude-sonnet-4-6) analyses the in-memory diff and posts structured feedback on the PR.",
  },
  {
    n: "3",
    title: "Insights in the portal",
    body: "The client portal shows trends, findings, and drift signals — without storing customer source code in our database.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="eq-section">
      <div className="eq-container" style={{ maxWidth: 720 }}>
        <h1 className="eq-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
          How it works
        </h1>
        <p className="eq-text-md eq-text-muted" style={{ marginTop: 16 }}>
          EngineIQ fits into your existing GitHub flow. Registration, billing hooks, and GitHub installation are
          self-serve end-to-end.
        </p>

        <ol className="eq-card" style={{ marginTop: 40, padding: 28, listStyle: "none", display: "grid", gap: 0 }}>
          {steps.map((s, i) => (
            <li
              key={s.n}
              style={{
                display: "flex",
                gap: 20,
                alignItems: "flex-start",
                paddingTop: i > 0 ? 28 : 0,
                marginTop: i > 0 ? 28 : 0,
                borderTop: i > 0 ? "1px solid var(--eq-border)" : "none",
              }}
            >
              <span
                aria-hidden="true"
                className="eq-font-mono eq-text-sm"
                style={{
                  flexShrink: 0,
                  width: 40,
                  height: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  background: "rgba(124, 58, 237, 0.12)",
                  border: "1px solid rgba(124, 58, 237, 0.28)",
                  color: "var(--eq-accent-light)",
                  fontWeight: 600,
                }}
              >
                {s.n}
              </span>
              <div style={{ minWidth: 0 }}>
                <h2 className="eq-h3">{s.title}</h2>
                <p className="eq-text-sm eq-text-muted" style={{ margin: "10px 0 0" }}>
                  {s.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
