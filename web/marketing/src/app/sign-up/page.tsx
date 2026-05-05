"use client";

import Link from "next/link";
import { useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_ENGINEIQ_API_URL ?? "http://localhost:5056";
const PORTAL_URL =
  process.env.NEXT_PUBLIC_PORTAL_URL ?? "http://localhost:3001";
const DPA_PDF_URL =
  process.env.NEXT_PUBLIC_DPA_PDF_URL ?? "https://engineiq.co.za/legal/dpa.pdf";

type RegisterResponse = {
  tenant_id: string;
  install_url: string;
  api_key: string;
};

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [plan, setPlan] = useState("Growth");
  const [githubOrg, setGithubOrg] = useState("");
  const [dpaAccepted, setDpaAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [done, setDone] = useState<RegisterResponse | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`${API_BASE}/api/v1/onboarding/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company_name: companyName,
          plan,
          github_org: githubOrg,
          dpa_accepted: dpaAccepted,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(
          typeof data?.errors === "object"
            ? JSON.stringify(data.errors)
            : data?.error ?? `Request failed (${res.status})`,
        );
        return;
      }
      setDone(data as RegisterResponse);
    } catch {
      setErr("Network error — is the EngineIQ API running?");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h1 className="text-2xl font-bold text-white">You&apos;re almost live</h1>
        <p className="mt-4 text-slate-400">
          Install the GitHub App, then open the portal with the API key from your welcome email
          (also shown below — copy it now; it won&apos;t be shown again). Your tenant webhook
          verification secret and DPA PDF link were emailed once only — check your inbox.
        </p>
        <div className="mt-8 space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Tenant ID</p>
            <code className="mt-1 block break-all text-teal-300">{done.tenant_id}</code>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">API key</p>
            <code className="mt-1 block break-all text-amber-200">{done.api_key}</code>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">GitHub App install</p>
            <a
              href={done.install_url}
              className="mt-2 inline-block rounded-lg bg-teal-500 px-4 py-2 font-semibold text-slate-950 hover:bg-teal-400"
            >
              Install GitHub App
            </a>
          </div>
        </div>
        <Link
          href={`${PORTAL_URL}/login?tenant=${encodeURIComponent(done.tenant_id)}`}
          className="mt-8 inline-block text-teal-400 hover:underline"
        >
          Open client portal →
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16">
      <h1 className="text-3xl font-bold text-white">Sign up</h1>
      <p className="mt-2 text-slate-400">
        Self-serve onboarding — no sales call required. Use your GitHub organisation slug.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm text-slate-400">Work email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Company name</label>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-teal-500"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400">Plan</label>
          <select
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-teal-500"
          >
            <option value="Starter">Starter</option>
            <option value="Growth">Growth</option>
            <option value="Enterprise">Enterprise</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-400">GitHub organisation</label>
          <input
            required
            placeholder="acme-corp"
            value={githubOrg}
            onChange={(e) => setGithubOrg(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white outline-none focus:border-teal-500"
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={dpaAccepted}
            onChange={(e) => setDpaAccepted(e.target.checked)}
            className="mt-1 rounded border-slate-600"
          />
          <span>
            I accept the{" "}
            <a
              href={DPA_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-400 underline hover:text-teal-300"
            >
              Data Processing Agreement (DPA)
            </a>
            . Registration requires this acknowledgement.
          </span>
        </label>
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button
          type="submit"
          disabled={loading || !dpaAccepted}
          className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-slate-950 transition hover:bg-teal-400 disabled:opacity-50"
        >
          {loading ? "Creating tenant…" : "Create account"}
        </button>
      </form>
    </div>
  );
}
