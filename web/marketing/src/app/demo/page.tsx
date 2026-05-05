import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book a demo — EngineIQ",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16">
      <h1 className="text-3xl font-bold text-white">Book a demo</h1>
      <p className="mt-4 text-slate-400">
        For Enterprise procurement, security questionnaires, or a walkthrough with your CTO —
        reach out and we&apos;ll schedule a session.
      </p>
      <a
        href="mailto:hello@engineiq.co.za?subject=EngineIQ%20demo%20request"
        className="mt-8 inline-block rounded-xl bg-teal-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-teal-400"
      >
        Email hello@engineiq.co.za
      </a>
      <p className="mt-6 text-sm text-slate-500">
        Prefer self-serve? Most teams go live in under 10 minutes via{" "}
        <a href="/sign-up" className="text-teal-400 hover:underline">
          Sign up
        </a>
        .
      </p>
    </div>
  );
}
