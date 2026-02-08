import type { Metadata } from "next";
import Link from "next/link";
import { Package, MessageSquare, ClipboardList, Settings } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Engine - Customer Portal",
  description: "View and manage your proposals and orders",
};

interface RootLayoutProps {
  readonly children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <div className="container max-w-7xl py-8">{children}</div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-7xl items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 font-semibold text-foreground"
        >
          <span>Service Engine</span>
        </Link>
        <nav className="ml-8 flex items-center space-x-1">
          <NavLink href="/" icon={<Package className="h-4 w-4" />}>
            Orders
          </NavLink>
          <NavLink href="/messages" icon={<MessageSquare className="h-4 w-4" />}>
            Messages
          </NavLink>
          <NavLink href="/tasks" icon={<ClipboardList className="h-4 w-4" />}>
            Tasks
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <NavLink href="/settings" icon={<Settings className="h-4 w-4" />}>
            Settings
          </NavLink>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  readonly href: string;
  readonly icon: React.ReactNode;
  readonly children: React.ReactNode;
}

function NavLink({ href, icon, children }: NavLinkProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {icon}
      {children}
    </Link>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container flex h-14 max-w-7xl items-center justify-between">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Service Engine
        </p>
        <a
          href="mailto:support@serviceengine.xyz"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          support@serviceengine.xyz
        </a>
      </div>
    </footer>
  );
}
