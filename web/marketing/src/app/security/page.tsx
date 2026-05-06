import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POPIA & Security — EngineIQ",
};

const sections = [
  {
    title: "No source code persistence",
    body: (
      <>
        Customer repositories are not stored on EngineIQ disks or databases. Diffs are held{" "}
        <strong style={{ color: "var(--eq-text)" }}>in memory</strong> for the duration of a review job. We may persist
        non-sensitive metadata such as file paths, line numbers, finding categories, and job state — suitable for POPIA
        minimisation discussions with your information officer.
      </>
    ),
  },
  {
    title: "Tenant isolation",
    body: (
      <>
        PostgreSQL row-level security aligns with application-level <span className="eq-font-mono">tenant_id</span>{" "}
        filters so cross-tenant access is not possible through the product data path.
      </>
    ),
  },
  {
    title: "Secrets & subprocessors",
    body: (
      <>
        API keys and integration secrets are loaded from environment variables or your secret manager. Anthropic is used
        for review generation; data processing agreements should be reflected in your vendor register.
      </>
    ),
  },
  {
    title: "Transparency on PR comments",
    body: (
      <>
        Every automated PR comment includes a footer stating that the review used in-memory processing only and did not
        store customer source code — visible to developers and auditors.
      </>
    ),
  },
];

export default function SecurityPage() {
  return (
    <div className="eq-section">
      <div className="eq-container" style={{ maxWidth: 720 }}>
        <h1 className="eq-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
          POPIA &amp; Security
        </h1>
        <p className="eq-text-md eq-text-muted" style={{ marginTop: 16 }}>
          EngineIQ is designed for South African B2B buyers who need clear data boundaries and defensible AI practices.
        </p>

        <div style={{ marginTop: 40, display: "grid", gap: 28 }}>
          {sections.map((sec) => (
            <section key={sec.title}>
              <h2 className="eq-h3" style={{ color: "var(--eq-accent-light)" }}>
                {sec.title}
              </h2>
              <p className="eq-text-sm eq-text-muted" style={{ margin: "12px 0 0" }}>
                {sec.body}
              </p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
