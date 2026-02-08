import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { getBrandingFromDomain } from "@/lib/branding";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const branding = getBrandingFromDomain(host);

  return {
    title: `${branding.name} - Project Workspace`,
    description: "Track your project progress and collaborate with your team",
  };
}

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
