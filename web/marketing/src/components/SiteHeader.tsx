import Link from "next/link";

const nav = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/security", label: "POPIA & Security" },
  { href: "/demo", label: "Book a demo" },
  { href: "/sign-up", label: "Sign up" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          Engine<span className="text-teal-400">IQ</span>
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/sign-up"
          className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-400 md:hidden"
        >
          Sign up
        </Link>
      </div>
    </header>
  );
}
