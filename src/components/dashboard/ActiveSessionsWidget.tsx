import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient, Session } from "@/lib/api";

export default function ActiveSessionsWidget() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      try {
        const response = await apiClient.getActiveSessions();
        setSessions(response.data || []);
      } catch (err) {
        console.error("Failed to fetch active sessions:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load sessions"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchSessions();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
        <div className="flex items-center justify-center gap-3 text-[var(--rawuh-text-muted)] py-8">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          <span>Loading sessions...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-[var(--rawuh-text)]">
            Active Sessions
          </h3>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Currently running attendance sessions
          </p>
        </div>
        <span className="inline-flex items-center justify-center w-6 h-6 bg-[var(--rawuh-primary)] text-white text-xs font-bold rounded-full">
          {sessions.length}
        </span>
      </div>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <span
              className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              event_busy
            </span>
            <p className="text-sm text-[var(--rawuh-text-muted)]">
              No active sessions
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div
              key={session.session_id}
              className="p-4 rounded-lg border border-[var(--rawuh-border)] hover:border-[var(--rawuh-primary)] transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-medium text-[var(--rawuh-text)]">
                    {session.class_name || "Class Session"}
                  </p>
                  <p className="text-sm text-[var(--rawuh-text-muted)]">
                    {session.class_code} - Section {session.class_section}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)] text-xs font-medium">
                  <span className="w-1.5 h-1.5 bg-[var(--rawuh-success)] rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {session.total_students && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-[var(--rawuh-text-muted)]">
                      Attendance
                    </span>
                    <span className="font-medium text-[var(--rawuh-text)]">
                      {session.present_count || 0}/{session.total_students}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--rawuh-primary)] rounded-full transition-all duration-300"
                      style={{
                        width: `${
                          ((session.present_count || 0) /
                            session.total_students) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--rawuh-text-muted)]">
                  Week {session.week}
                </span>
                <Link
                  href={`/classes/${session.class_id}`}
                  className="font-medium text-[var(--rawuh-primary)] hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      <Link
        href="/sessions"
        className="block w-full mt-4 py-2.5 text-sm font-medium text-[var(--rawuh-primary)] bg-[var(--rawuh-primary-muted)] rounded-lg hover:bg-blue-100 transition-colors text-center"
      >
        View All Sessions
      </Link>
    </div>
  );
}
