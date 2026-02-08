import type { Metadata } from "next";
import Link from "next/link";
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
        <nav className="ml-auto flex items-center space-x-6">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="container flex h-14 max-w-7xl items-center justify-center">
        <p className="text-sm text-muted-foreground">
          &copy; {currentYear} Service Engine. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
