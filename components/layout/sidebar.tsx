"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBrandingFromDomain,
  getDefaultBranding,
  type Branding,
} from "@/lib/branding";

interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly icon: React.ReactNode;
}

interface NavSection {
  readonly title?: string;
  readonly items: ReadonlyArray<NavItem>;
}

const navSections: ReadonlyArray<NavSection> = [
  {
    items: [
      {
        href: "/",
        label: "Dashboard",
        icon: <LayoutDashboard className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        href: "/projects",
        label: "Projects",
        icon: <FolderKanban className="h-4 w-4" />,
      },
      {
        href: "/conversations",
        label: "Conversations",
        icon: <MessageSquare className="h-4 w-4" />,
      },
      {
        href: "/files",
        label: "Files",
        icon: <FileText className="h-4 w-4" />,
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        href: "/billing",
        label: "Billing",
        icon: <CreditCard className="h-4 w-4" />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
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
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">
              {branding.initial}
            </span>
          </div>
          <span className="font-semibold text-foreground">{branding.name}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={sectionIndex > 0 ? "mt-6" : ""}>
            {section.title && (
              <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
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
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link
          href="/help"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <HelpCircle className="h-4 w-4" />
          Help & Support
        </Link>
        <p className="mt-2 px-3 text-xs text-muted-foreground">
          {branding.supportEmail}
        </p>
      </div>
    </aside>
  );
}
