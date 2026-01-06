import { ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface AdminOnlyProps {
  children: ReactNode;
}

export default function AdminOnly({ children }: AdminOnlyProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <DashboardLayout title="Access Denied" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-[var(--rawuh-error)] mb-3">
              lock
            </span>
            <h2 className="text-xl font-semibold text-[var(--rawuh-text)] mb-2">
              Access Denied
            </h2>
            <p className="text-[var(--rawuh-text-muted)] mb-4">
              This page is only accessible to administrators.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return <>{children}</>;
}
