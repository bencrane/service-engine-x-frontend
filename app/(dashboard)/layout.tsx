import { Sidebar } from "@/components/layout/sidebar";

interface DashboardLayoutProps {
  readonly children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 pl-64">
        <div className="container max-w-5xl px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
