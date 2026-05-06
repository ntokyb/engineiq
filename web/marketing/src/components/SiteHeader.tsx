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
    <header className="eq-header">
      <div className="eq-container">
        <div className="eq-header__inner">
          <Link href="/" className="eq-brand" aria-label="EngineIQ home">
            <span className="eq-brand__mark" aria-hidden="true" />
            <span>EngineIQ</span>
          </Link>

          <nav className="eq-nav" aria-label="Primary navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link href="/sign-up" className="eq-btn eq-btn--primary">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
