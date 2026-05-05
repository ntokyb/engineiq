"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearSession, loadSession } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/findings", label: "Findings" },
  { href: "/settings", label: "Settings" },
  { href: "/reports", label: "Reports" },
];

export function ClientPortalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (pathname === "/login") return;
    const s = loadSession();
    if (!s) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (pathname === "/login") return <>{children}</>;

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading…
      </div>
    );
  }

  if (!loadSession()) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="hidden w-52 shrink-0 border-r border-slate-800 bg-slate-900/50 p-4 md:block">
        <div className="mb-8 text-lg font-semibold">
          Engine<span className="text-teal-400">IQ</span>
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm ${
                pathname === l.href
                  ? "bg-teal-500/20 text-teal-300"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => {
            clearSession();
            router.push("/login");
          }}
          className="mt-8 w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-sm text-slate-400 hover:border-red-500/40 hover:text-red-300"
        >
          Sign out
        </button>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3 md:hidden">
          <span className="font-semibold text-white">EngineIQ</span>
          <button
            type="button"
            onClick={() => {
              clearSession();
              router.push("/login");
            }}
            className="text-sm text-slate-400"
          >
            Out
          </button>
        </header>
        <div className="flex flex-wrap gap-2 border-b border-slate-800 p-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-2 py-1 text-xs ${
                pathname === l.href ? "bg-teal-500/20 text-teal-300" : "text-slate-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
