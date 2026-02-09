"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Settings } from "lucide-react";
import {
  getBrandingFromDomain,
  getDefaultBranding,
  type Branding,
} from "@/lib/branding";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [branding, setBranding] = useState<Branding>(getDefaultBranding);

  useEffect(() => {
    setBranding(getBrandingFromDomain(window.location.hostname));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                {branding.initial}
              </span>
            </div>
            <span className="text-lg font-semibold text-foreground">
              {branding.name}
            </span>
          </Link>

          <Link
            href="/settings"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-6">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <a
              href={`mailto:${branding.supportEmail}`}
              className="text-primary hover:underline"
            >
              Contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
