import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Engine - Project Workspace",
  description: "Track your project progress and collaborate with your team",
};

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
