import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--rawuh-background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[var(--rawuh-primary)] rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <div className="flex items-center gap-2 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
