"use client";

import { useEffect, useState } from "react";
import { postConfigYaml, tenantGet } from "@/lib/api";
import { loadSession } from "@/lib/auth";

type Account = {
  tenant_id: string;
  company_name: string;
  plan: string;
  status: string;
  github_org: string | null;
  github_app_connected: boolean;
  github_app_installation_id: number | null;
  has_config_yaml: boolean;
};

export default function SettingsPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [yaml, setYaml] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const s = loadSession();
    if (!s) return;
    (async () => {
      const [aRes, cRes] = await Promise.all([
        tenantGet(s.tenantId, s.apiKey, "/account"),
        tenantGet(s.tenantId, s.apiKey, "/config"),
      ]);
      if (aRes.ok) setAccount((await aRes.json()) as Account);
      if (cRes.ok) {
        const j = (await cRes.json()) as { config_yaml: string };
        setYaml(j.config_yaml ?? "");
      }
    })();
  }, []);

  async function saveYaml() {
    const s = loadSession();
    if (!s) return;
    setMsg(null);
    setErr(null);
    const res = await postConfigYaml(s.tenantId, s.apiKey, yaml);
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErr(JSON.stringify(body));
      return;
    }
    setMsg("Config saved.");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400">Standards YAML and account overview.</p>
      </div>
      {account && (
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-semibold text-white">Account &amp; billing</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Company</dt>
              <dd className="text-slate-200">{account.company_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Plan</dt>
              <dd className="text-teal-300">{account.plan}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Status</dt>
              <dd className="text-slate-200">{account.status}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">GitHub org</dt>
              <dd className="text-slate-200">{account.github_org ?? "—"}</dd>
            </div>
          </dl>
        </section>
      )}
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-white">GitHub App</h2>
        <p className="mt-2 text-sm text-slate-400">
          {account?.github_app_connected ? (
            <>
              Connected
              {account.github_app_installation_id != null && (
                <span className="ml-2 text-slate-500">
                  (installation {account.github_app_installation_id})
                </span>
              )}
            </>
          ) : (
            "Not connected — complete the GitHub App install from your welcome email."
          )}
        </p>
      </section>
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-lg font-semibold text-white">Standards config (YAML)</h2>
        <textarea
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
          rows={16}
          className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 font-mono text-sm text-slate-200 outline-none focus:border-teal-500"
          placeholder={`version: 1\nrules:\n  - id: example\n    severity: error\n`}
        />
        {msg && <p className="mt-2 text-sm text-teal-400">{msg}</p>}
        {err && <p className="mt-2 text-sm text-red-400">{err}</p>}
        <button
          type="button"
          onClick={() => saveYaml()}
          className="mt-4 rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-teal-400"
        >
          Validate &amp; save
        </button>
      </section>
    </div>
  );
}
