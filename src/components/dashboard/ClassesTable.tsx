import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient, Class } from "@/lib/api";

export default function ClassesTable() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await apiClient.getMyClasses();
        setClasses(response.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
        setError(err instanceof Error ? err.message : "Failed to load classes");
      } finally {
        setIsLoading(false);
      }
    }
    fetchClasses();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-8">
        <div className="flex items-center justify-center gap-3 text-[var(--rawuh-text-muted)]">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          <span>Loading classes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-8">
        <div className="text-center text-[var(--rawuh-error)]">
          <span className="material-symbols-outlined text-2xl mb-2">error</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-8">
        <div className="text-center text-[var(--rawuh-text-muted)]">
          <span className="material-symbols-outlined text-4xl mb-2">
            school
          </span>
          <p>No classes found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--rawuh-border)] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--rawuh-text)]">
            My Classes
          </h2>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Classes you are teaching this semester
          </p>
        </div>
        <Link
          href="/classes"
          className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--rawuh-background)]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Section
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rawuh-border)]">
            {classes.slice(0, 5).map((cls) => (
              <tr
                key={cls.id}
                className="hover:bg-[var(--rawuh-background)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-primary-muted)] flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-xl text-[var(--rawuh-primary)]"
                        style={{
                          fontVariationSettings: "'FILL' 0, 'wght' 400",
                        }}
                      >
                        school
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-[var(--rawuh-text)]">
                        {cls.name}
                      </p>
                      <p className="text-sm text-[var(--rawuh-text-muted)]">
                        {cls.lecturer}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-sm font-medium text-[var(--rawuh-text)]">
                    {cls.class_code}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                  {cls.class_section}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <p className="font-medium text-[var(--rawuh-text)]">
                      {cls.day}
                    </p>
                    <p className="text-[var(--rawuh-text-muted)]">
                      {cls.start_time} - {cls.end_time}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/classes/${cls.id}?startSession=true`}
                      className="p-2 rounded-lg hover:bg-[var(--rawuh-primary-muted)] flex items-center justify-center text-[var(--rawuh-primary)] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{
                          fontVariationSettings: "'FILL' 0, 'wght' 400",
                        }}
                      >
                        play_circle
                      </span>
                    </Link>
                    <Link
                      href={`/classes/${cls.id}`}
                      className="p-2 rounded-lg hover:bg-gray-100 flex items-center justify-center text-[var(--rawuh-text-muted)] transition-colors"
                    >
                      <span
                        className="material-symbols-outlined text-xl"
                        style={{
                          fontVariationSettings: "'FILL' 0, 'wght' 400",
                        }}
                      >
                        visibility
                      </span>
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {classes.length > 5 && (
        <div className="px-6 py-4 border-t border-[var(--rawuh-border)] text-center">
          <Link
            href="/classes"
            className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline"
          >
            View all {classes.length} classes →
          </Link>
        </div>
      )}
    </div>
  );
}
