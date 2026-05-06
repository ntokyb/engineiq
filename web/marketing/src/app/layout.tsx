import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ToastsProvider } from "@/components/Toasts";

export const metadata: Metadata = {
  title: "EngineIQ — Every pull request, reviewed by Claude",
  description:
    "EngineIQ catches architectural drift, security gaps, and code quality issues before they reach production. Ephemeral processing. Findings metadata only.",
  metadataBase: new URL("https://engineiq.co.za"),
};

type EqFontVars = React.CSSProperties & {
  ["--font-sans"]?: string;
  ["--font-mono"]?: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fontVars: EqFontVars = {
    // Geist is not available in next/font/google; load via <link> and set CSS vars.
    "--font-sans": "'Geist', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
    "--font-mono": "'Geist Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
  };

  return (
    <html lang="en-ZA">
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={
          {
            minHeight: "100vh",
            ...fontVars,
          } as React.CSSProperties
        }
      >
        <SiteHeader />
        <ToastsProvider>
          <main className="eq-page">{children}</main>
        </ToastsProvider>
        <SiteFooter />
      </body>
    </html>
  );
}
