import type { Metadata } from "next";
import "./globals.css";
import { ClientPortalLayout } from "@/components/ClientPortalLayout";
import { ToastsProvider } from "@/components/Toasts";

export const metadata: Metadata = {
  title: "EngineIQ — Client Portal",
  description: "Engineering intelligence dashboard for your organisation.",
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
      <body style={{ ...fontVars } as React.CSSProperties}>
        <ToastsProvider>
          <ClientPortalLayout>{children}</ClientPortalLayout>
        </ToastsProvider>
      </body>
    </html>
  );
}
