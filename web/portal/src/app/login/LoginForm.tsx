"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { saveSession } from "@/lib/auth";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [tenantId, setTenantId] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    const t = params.get("tenant");
    if (t) setTenantId(t);
  }, [params]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    saveSession(tenantId, apiKey);
    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
        <h1 className="text-2xl font-bold text-white">Client portal</h1>
        <p className="mt-2 text-sm text-slate-400">
          Use the tenant ID and API key from your onboarding email.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-slate-400">Tenant ID</label>
            <input
              required
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-teal-500"
              placeholder="00000000-0000-0000-0000-000000000000"
            />
          </div>
          <div>
            <label className="text-sm text-slate-400">API key</label>
            <input
              required
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none focus:border-teal-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-teal-500 py-3 font-semibold text-slate-950 hover:bg-teal-400"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
