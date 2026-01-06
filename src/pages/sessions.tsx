import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiClient, Session, Class } from "@/lib/api";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");

  useEffect(() => {
    async function fetchSessions() {
      try {
        // Fetch active sessions and classes
        const [activeRes, classesRes] = await Promise.all([
          apiClient.getActiveSessions(),
          apiClient.getMyClasses(),
        ]);

        console.log("Active sessions:", activeRes.data);
        console.log("Classes:", classesRes.data);

        const activeSessions = activeRes.data || [];
        const myClasses = classesRes.data || [];
        setClasses(myClasses);

        // Fetch session history for each class
        const historyPromises = myClasses.map((cls) =>
          apiClient.getSessionHistory(cls.id).catch(() => ({ data: [] }))
        );
        const historyResults = await Promise.all(historyPromises);

        // Flatten all session histories and add class info
        const allHistorySessions: Session[] = [];
        historyResults.forEach((res, index) => {
          const classInfo = myClasses[index];
          const sessions = (res.data || []).map((s: Session) => ({
            ...s,
            class_name: classInfo.name,
            class_code: classInfo.class_code,
            class_section: classInfo.class_section,
            class_id: classInfo.id,
          }));
          allHistorySessions.push(...sessions);
        });

        // Merge active sessions with history (deduplicate by session_id)
        const sessionMap = new Map<string, Session>();
        [...activeSessions, ...allHistorySessions].forEach((s) => {
          if (!sessionMap.has(s.session_id)) {
            sessionMap.set(s.session_id, s);
          }
        });

        const allSessions = Array.from(sessionMap.values()).sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        });

        console.log("All sessions:", allSessions);
        setSessions(allSessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load sessions"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((s) => {
    if (filter === "active") return s.is_active !== false;
    if (filter === "closed") return s.is_active === false;
    return true;
  });

  const handleCloseSession = async (sessionId: string) => {
    try {
      await apiClient.closeSessionV2(sessionId);
      // Refresh sessions
      const response = await apiClient.getActiveSessions();
      setSessions(response.data || []);
    } catch (err) {
      console.error("Failed to close session:", err);
      alert(err instanceof Error ? err.message : "Failed to close session");
    }
  };

  return (
    <DashboardLayout title="Sessions" subtitle="Manage attendance sessions">
      {/* Filter Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center bg-white rounded-lg border border-[var(--rawuh-border)] p-1">
          {[
            { value: "all", label: "All Sessions" },
            { value: "active", label: "Active" },
            { value: "closed", label: "Closed" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value as typeof filter)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === tab.value
                  ? "bg-[var(--rawuh-primary)] text-white"
                  : "text-[var(--rawuh-text-muted)] hover:text-[var(--rawuh-text)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading sessions...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--rawuh-error)] mb-2">
              error
            </span>
            <p className="text-[var(--rawuh-error)]">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && filteredSessions.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
              event_busy
            </span>
            <p className="text-[var(--rawuh-text-muted)]">No sessions found</p>
          </div>
        </div>
      )}

      {/* Sessions Table */}
      {!isLoading && !error && filteredSessions.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--rawuh-background)]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rawuh-border)]">
              {filteredSessions.map((session) => (
                <tr
                  key={session.session_id}
                  className="hover:bg-[var(--rawuh-background)] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-[var(--rawuh-text)]">
                        {session.class_name || "Class Session"}
                      </p>
                      <p className="text-sm text-[var(--rawuh-text-muted)]">
                        {session.class_code} - Section {session.class_section}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold text-[var(--rawuh-text)]">
                      {session.week}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {session.is_active !== false ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)] text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-[var(--rawuh-success)] rounded-full animate-pulse" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                        Closed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {session.total_students ? (
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[var(--rawuh-success)] rounded-full"
                            style={{
                              width: `${
                                ((session.present_count || 0) /
                                  session.total_students) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-[var(--rawuh-text)]">
                          {session.present_count || 0}/{session.total_students}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-[var(--rawuh-text-muted)]">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--rawuh-text-muted)]">
                    {session.created_at ? formatDate(session.created_at) : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/classes/${session.class_id}`}
                        className="p-2 flex items-center justify-center rounded-lg hover:bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)] transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </Link>
                      {session.is_active !== false && (
                        <button
                          onClick={() => handleCloseSession(session.session_id)}
                          className="p-2 rounded-lg hover:bg-[var(--rawuh-error-muted)] text-[var(--rawuh-error)] transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            stop_circle
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
