import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientPortalLayout } from "@/components/ClientPortalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EngineIQ Portal",
  description: "Client dashboard for EngineIQ engineering intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-ZA">
      <body className={inter.className}>
        <ClientPortalLayout>{children}</ClientPortalLayout>
      </body>
    </html>
  );
}
