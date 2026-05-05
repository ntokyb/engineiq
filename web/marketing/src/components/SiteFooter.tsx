import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-10 text-sm text-slate-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} EngineIQ. Built for South African engineering teams.</p>
        <div className="flex flex-wrap gap-4">
          <Link href="/security" className="hover:text-teal-400">
            POPIA &amp; Security
          </Link>
          <Link href="/pricing" className="hover:text-teal-400">
            Pricing
          </Link>
          <a href="mailto:hello@engineiq.co.za" className="hover:text-teal-400">
            hello@engineiq.co.za
          </a>
        </div>
      </div>
    </footer>
  );
}
