import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  apiClient,
  Class,
  Session,
  SessionStudent,
  attendanceStatusColors,
  attendanceStatusLabels,
} from "@/lib/api";

interface AttendanceRecord {
  id: string;
  student_id: number;
  student_name: string;
  nim: string;
  class_id: number;
  class_name: string;
  class_code: string;
  session_id: string;
  week: number;
  status: "p" | "i" | "s" | "a" | null;
  recorded_at: string | null;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string | null): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const classesRes = await apiClient.getMyClasses();
        const myClasses = classesRes.data || [];
        setClasses(myClasses);

        if (myClasses.length === 0) {
          setIsLoading(false);
          return;
        }

        const allRecords: AttendanceRecord[] = [];

        for (const cls of myClasses) {
          const historyRes = await apiClient
            .getSessionHistory(cls.id)
            .catch(() => ({ data: [] }));
          const sessions = historyRes.data || [];

          for (const session of sessions) {
            const studentsRes = await apiClient
              .getSessionStudents(session.session_id)
              .catch(() => ({ data: { students: [] } }));
            const students =
              studentsRes.data?.students || studentsRes.data || [];

            if (Array.isArray(students)) {
              students.forEach((student: SessionStudent) => {
                allRecords.push({
                  id: `${session.session_id}-${
                    student.student_id || student.id
                  }`,
                  student_id: student.student_id || student.id || 0,
                  student_name: student.name,
                  nim: student.nim,
                  class_id: cls.id,
                  class_name: cls.name,
                  class_code: cls.class_code,
                  session_id: session.session_id,
                  week: session.week,
                  status: student.status,
                  recorded_at: student.recorded_at,
                });
              });
            }
          }
        }

        allRecords.sort((a, b) => {
          const dateA = a.recorded_at ? new Date(a.recorded_at).getTime() : 0;
          const dateB = b.recorded_at ? new Date(b.recorded_at).getTime() : 0;
          return dateB - dateA;
        });

        setRecords(allRecords);
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load attendance data"
        );
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredRecords = records.filter((record) => {
    if (selectedClass && record.class_code !== selectedClass) return false;
    if (selectedStatus && record.status !== selectedStatus) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !record.student_name.toLowerCase().includes(query) &&
        !record.nim.toLowerCase().includes(query)
      ) {
        return false;
      }
    }
    return true;
  });

  const stats = {
    present: filteredRecords.filter((r) => r.status === "p").length,
    absent: filteredRecords.filter((r) => r.status === "a").length,
    sick: filteredRecords.filter((r) => r.status === "s").length,
    permission: filteredRecords.filter((r) => r.status === "i").length,
    notRecorded: filteredRecords.filter((r) => r.status === null).length,
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Attendance" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading attendance data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Attendance" subtitle="Error">
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
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Attendance"
      subtitle="View and manage attendance records"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-success-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-success)]">
                check_circle
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                {stats.present}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">Present</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-error-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-error)]">
                cancel
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                {stats.absent}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">Absent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-warning-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-warning)]">
                sick
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                {stats.sick}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">Sick</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-primary-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-primary)]">
                event_busy
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                {stats.permission}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">
                Permission
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-gray-500">
                help
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                {stats.notRecorded}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">
                Not Recorded
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search by student name or NIM..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:outline-none"
          />
        </div>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)]"
        >
          <option value="">All Classes</option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.class_code}>
              {cls.class_code} - {cls.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)]"
        >
          <option value="">All Status</option>
          <option value="p">Present</option>
          <option value="a">Absent</option>
          <option value="s">Sick</option>
          <option value="i">Permission</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
        {filteredRecords.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
              fact_check
            </span>
            <p className="text-[var(--rawuh-text-muted)]">
              No attendance records found
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--rawuh-background)]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rawuh-border)]">
              {filteredRecords.slice(0, 50).map((record) => {
                const statusColors = record.status
                  ? attendanceStatusColors[record.status]
                  : { bg: "#f3f4f6", text: "#6b7280" };
                const statusLabel = record.status
                  ? attendanceStatusLabels[record.status]
                  : "Not Recorded";
                return (
                  <tr
                    key={record.id}
                    className="hover:bg-[var(--rawuh-background)]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                          {record.student_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--rawuh-text)]">
                            {record.student_name}
                          </p>
                          <p className="text-sm text-[var(--rawuh-text-muted)]">
                            {record.nim}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--rawuh-text)]">
                        {record.class_name}
                      </p>
                      <p className="text-xs text-[var(--rawuh-text-muted)]">
                        {record.class_code}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-sm font-medium">
                        {record.week}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: statusColors.bg,
                          color: statusColors.text,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[var(--rawuh-text)]">
                        {formatDate(record.recorded_at)}
                      </p>
                      <p className="text-xs text-[var(--rawuh-text-muted)]">
                        {formatTime(record.recorded_at)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/classes/${record.class_id}`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-[var(--rawuh-text-muted)] inline-flex"
                      >
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {filteredRecords.length > 50 && (
          <div className="px-6 py-4 border-t border-[var(--rawuh-border)] text-center text-sm text-[var(--rawuh-text-muted)]">
            Showing 50 of {filteredRecords.length} records
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
