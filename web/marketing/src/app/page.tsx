import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.12),_transparent_50%)]" />
      <section className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-teal-400">
          South Africa · B2B SaaS
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
          Ship faster without sacrificing quality or compliance.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          EngineIQ reviews pull requests with{" "}
          <strong className="text-slate-200">Claude</strong>, enforces your standards, and keeps
          customer source <strong className="text-slate-200">in memory only</strong> — aligned with
          POPIA expectations for engineering intelligence.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/sign-up"
            className="glow-border rounded-xl bg-teal-500 px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            Start free — self-serve
          </Link>
          <Link
            href="/how-it-works"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-teal-500/50 hover:text-white"
          >
            How it works
          </Link>
        </div>
        <ul className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "No source persistence",
              d: "Diffs processed in memory; we persist metadata only (paths, severities, job state).",
            },
            {
              t: "Tenant isolation",
              d: "Row-level security and strict tenant scoping on every data path.",
            },
            {
              t: "Self-serve onboarding",
              d: "CTO signs up, installs the GitHub App, and is live without an EngineIQ engineer.",
            },
          ].map((x) => (
            <li
              key={x.t}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur"
            >
              <h2 className="font-semibold text-teal-300">{x.t}</h2>
              <p className="mt-2 text-sm text-slate-400">{x.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
