import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function DashboardLayout({
  children,
  title = "Dashboard",
  subtitle = "Welcome back, Admin",
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--rawuh-background)]">
      <Sidebar />

      <div className="flex flex-1 flex-col ml-[var(--rawuh-sidebar-width)]">
        <Header title={title} subtitle={subtitle} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
