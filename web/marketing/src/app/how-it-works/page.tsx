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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">How it works</h1>
      <p className="mt-4 text-slate-400">
        EngineIQ fits into your existing GitHub flow. Registration, billing hooks, and GitHub
        installation are self-serve end-to-end.
      </p>
      <ol className="mt-12 space-y-10">
        {steps.map((s) => (
          <li key={s.n} className="flex gap-6">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-500/20 text-lg font-bold text-teal-400">
              {s.n}
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">{s.title}</h2>
              <p className="mt-2 text-slate-400">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
