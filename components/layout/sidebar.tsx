"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBrandingFromDomain, getDefaultBranding, type Branding } from "@/lib/branding";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: React.ReactNode;
}

const navItems: ReadonlyArray<NavItem> = [
  {
    href: "/",
    label: "Dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
  },
  {
    href: "/inbox",
    label: "Inbox",
    icon: <Inbox className="h-4 w-4" />,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <Settings className="h-4 w-4" />,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [branding, setBranding] = useState<Branding>(getDefaultBranding);

  useEffect(() => {
    setBranding(getBrandingFromDomain(window.location.hostname));
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-background">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">{branding.initial}</span>
          </div>
          <span className="text-foreground">{branding.name}</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        <div className="text-xs text-muted-foreground">
          Need help?{" "}
          <a
            href={`mailto:${branding.supportEmail}`}
            className="text-primary hover:underline"
          >
            Contact support
          </a>
        </div>
      </div>
    </aside>
  );
}
