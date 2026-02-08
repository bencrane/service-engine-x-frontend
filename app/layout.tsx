import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Engine - Customer Portal",
  description: "View and manage your proposals and orders",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <a href="/" className="text-xl font-semibold text-gray-900">
                Service Engine
              </a>
              <nav className="flex items-center gap-6">
                <a
                  href="/"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Home
                </a>
              </nav>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-sm text-gray-500 text-center">
              &copy; {new Date().getFullYear()} Service Engine. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
