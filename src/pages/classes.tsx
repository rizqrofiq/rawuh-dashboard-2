import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiClient, Class } from "@/lib/api";

export default function ClassesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dayFilter, setDayFilter] = useState("");

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

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.class_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDay = !dayFilter || cls.day === dayFilter;
    return matchesSearch && matchesDay;
  });

  const handleStartSession = (classId: number) => {
    router.push(`/classes/${classId}?startSession=true`);
  };

  return (
    <DashboardLayout
      title="Classes"
      subtitle="Manage your classes and schedules"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)] text-xl">
              search
            </span>
            <input
              type="text"
              placeholder="Search classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 h-10 pl-10 pr-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:outline-none transition-colors"
            />
          </div>
          <select
            value={dayFilter}
            onChange={(e) => setDayFilter(e.target.value)}
            className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:outline-none"
          >
            <option value="">All Days</option>
            <option value="Senin">Senin</option>
            <option value="Selasa">Selasa</option>
            <option value="Rabu">Rabu</option>
            <option value="Kamis">Kamis</option>
            <option value="Jumat">Jumat</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading classes...</span>
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
      {!isLoading && !error && filteredClasses.length === 0 && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
              school
            </span>
            <p className="text-[var(--rawuh-text-muted)]">
              {classes.length === 0
                ? "No classes found"
                : "No classes match your filters"}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && filteredClasses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5 hover:shadow-lg hover:border-[var(--rawuh-primary)] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--rawuh-primary-muted)] flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-2xl text-[var(--rawuh-primary)]"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                  >
                    school
                  </span>
                </div>
                <span className="inline-flex px-2.5 py-1 rounded-lg bg-gray-100 text-xs font-semibold text-[var(--rawuh-text)]">
                  {cls.class_code}
                </span>
              </div>

              <h3 className="font-semibold text-[var(--rawuh-text)] mb-1 line-clamp-2">
                {cls.name}
              </h3>
              <p className="text-sm text-[var(--rawuh-text-muted)] mb-4">
                Section {cls.class_section} • {cls.lecturer}
              </p>

              <div className="flex items-center gap-2 text-sm text-[var(--rawuh-text-muted)] mb-4">
                <span className="material-symbols-outlined text-lg">
                  schedule
                </span>
                <span>
                  {cls.day}, {cls.start_time} - {cls.end_time}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-[var(--rawuh-border)]">
                <button
                  onClick={() => handleStartSession(cls.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--rawuh-primary)] text-white text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    play_circle
                  </span>
                  Start Session
                </button>
                <Link
                  href={`/classes/${cls.id}`}
                  className="py-2 px-2 flex items-center justify-center rounded-lg border border-[var(--rawuh-border)] text-[var(--rawuh-text-muted)] hover:bg-gray-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-xl">
                    visibility
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
