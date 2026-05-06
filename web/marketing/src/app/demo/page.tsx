import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Book a demo — EngineIQ",
};

export default function DemoPage() {
  return (
    <div className="eq-section">
      <div className="eq-container" style={{ maxWidth: 560 }}>
        <h1 className="eq-h1" style={{ fontSize: "clamp(28px, 4vw, 40px)" }}>
          Book a demo
        </h1>
        <p className="eq-text-md eq-text-muted" style={{ marginTop: 16 }}>
          For Enterprise procurement, security questionnaires, or a walkthrough with your CTO — reach out and
          we&apos;ll schedule a session.
        </p>
        <p className="eq-text-md" style={{ marginTop: 24 }}>
          Email{" "}
          <a href="mailto:hello@engineiq.co.za?subject=EngineIQ%20demo%20request" style={{ color: "var(--eq-accent-light)" }}>
            hello@engineiq.co.za
          </a>
        </p>
        <div style={{ marginTop: 28 }}>
          <a href="mailto:hello@engineiq.co.za?subject=EngineIQ%20demo%20request" className="eq-btn eq-btn--primary">
            Email hello@engineiq.co.za
          </a>
        </div>
        <p className="eq-text-sm eq-text-dim" style={{ marginTop: 24 }}>
          Prefer self-serve? Most teams go live in under 10 minutes via{" "}
          <Link href="/sign-up" style={{ color: "var(--eq-accent-light)" }}>
            Sign up
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
