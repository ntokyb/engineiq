import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "POPIA & Security — EngineIQ",
};

export default function SecurityPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">POPIA &amp; Security</h1>
      <p className="mt-4 text-slate-400">
        EngineIQ is designed for South African B2B buyers who need clear data boundaries and
        defensible AI practices.
      </p>
      <section className="mt-10 space-y-6 text-slate-300">
        <div>
          <h2 className="text-lg font-semibold text-teal-300">No source code persistence</h2>
          <p className="mt-2 text-slate-400">
            Customer repositories are not stored on EngineIQ disks or databases. Diffs are held{" "}
            <strong className="text-slate-200">in memory</strong> for the duration of a review job.
            We may persist non-sensitive metadata such as file paths, line numbers, finding
            categories, and job state — suitable for POPIA minimisation discussions with your
            information officer.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-teal-300">Tenant isolation</h2>
          <p className="mt-2 text-slate-400">
            PostgreSQL row-level security aligns with application-level <code>tenant_id</code>{" "}
            filters so cross-tenant access is not possible through the product data path.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-teal-300">Secrets &amp; subprocessors</h2>
          <p className="mt-2 text-slate-400">
            API keys and integration secrets are loaded from environment variables or your secret
            manager. Anthropic is used for review generation; data processing agreements should be
            reflected in your vendor register.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-teal-300">Transparency on PR comments</h2>
          <p className="mt-2 text-slate-400">
            Every automated PR comment includes a footer stating that the review used in-memory
            processing only and did not store customer source code — visible to developers and
            auditors.
          </p>
        </div>
      </section>
    </div>
  );
}
