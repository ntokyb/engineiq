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
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "R15 000",
    period: "/ month",
    desc: "Dedicated support, SSO, and custom policies.",
    features: ["Unlimited seats (fair use)", "Custom contracts", "VPC / private networking options", "Dedicated CSM"],
    cta: "Book a demo",
    highlight: false,
    demo: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-center text-3xl font-bold text-white">Simple pricing in Rand</h1>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-400">
        VAT may apply. Annual billing available on request. All tiers include POPIA-aligned
        processing and zero source code persistence.
      </p>
      <div className="mt-14 grid gap-8 md:grid-cols-3">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`flex flex-col rounded-2xl border p-8 ${
              t.highlight
                ? "border-teal-500/60 bg-teal-500/5 glow-border"
                : "border-slate-800 bg-slate-900/30"
            }`}
          >
            <h2 className="text-lg font-semibold text-teal-300">{t.name}</h2>
            <p className="mt-2 text-sm text-slate-400">{t.desc}</p>
            <p className="mt-6 text-3xl font-bold text-white">
              {t.price}
              <span className="text-base font-normal text-slate-500">{t.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-teal-400">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={t.demo ? "/demo" : "/sign-up"}
              className={`mt-8 block rounded-xl py-3 text-center text-sm font-semibold transition ${
                t.highlight
                  ? "bg-teal-500 text-slate-950 hover:bg-teal-400"
                  : "border border-slate-600 text-white hover:border-teal-500/50"
              }`}
            >
              {t.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
