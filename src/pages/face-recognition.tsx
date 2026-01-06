import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminOnly from "@/components/auth/AdminOnly";

interface EnrollmentRecord {
  id: number;
  student_name: string;
  nim: string;
  enrolled_at: string;
  status: "enrolled" | "pending" | "failed";
}

// Sample data
const enrollments: EnrollmentRecord[] = [
  {
    id: 1,
    student_name: "John Doe",
    nim: "2023010001",
    enrolled_at: "2025-12-01T08:00:00Z",
    status: "enrolled",
  },
  {
    id: 2,
    student_name: "Jane Smith",
    nim: "2023010002",
    enrolled_at: "2025-12-01T09:30:00Z",
    status: "enrolled",
  },
  {
    id: 3,
    student_name: "Bob Johnson",
    nim: "2023010003",
    enrolled_at: "",
    status: "pending",
  },
  {
    id: 4,
    student_name: "Alice Brown",
    nim: "2023010004",
    enrolled_at: "2025-12-02T10:15:00Z",
    status: "enrolled",
  },
  {
    id: 5,
    student_name: "Charlie Wilson",
    nim: "2023010005",
    enrolled_at: "",
    status: "failed",
  },
];

const stats = {
  total: 156,
  enrolled: 142,
  pending: 10,
  failed: 4,
};

function formatDate(dateStr: string): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function FaceRecognitionPage() {
  return (
    <AdminOnly>
      <DashboardLayout
        title="Face Recognition"
        subtitle="Manage student face enrollment"
      >
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--rawuh-text)]">
                  {stats.total}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  Total Students
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-[var(--rawuh-text)]">
                  groups
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--rawuh-success)]">
                  {stats.enrolled}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  Enrolled
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-success-muted)] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-[var(--rawuh-success)]">
                  face
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--rawuh-warning)]">
                  {stats.pending}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  Pending
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-warning-muted)] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-[var(--rawuh-warning)]">
                  hourglass_empty
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[var(--rawuh-error)]">
                  {stats.failed}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">Failed</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-error-muted)] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl text-[var(--rawuh-error)]">
                  error
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[var(--rawuh-text)]">
              Enrollment Progress
            </h3>
            <span className="text-sm font-medium text-[var(--rawuh-primary)]">
              {Math.round((stats.enrolled / stats.total) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--rawuh-primary)] rounded-full transition-all"
              style={{ width: `${(stats.enrolled / stats.total) * 100}%` }}
            />
          </div>
          <p className="text-sm text-[var(--rawuh-text-muted)] mt-2">
            {stats.enrolled} out of {stats.total} students have enrolled their
            face
          </p>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--rawuh-border)] flex items-center justify-between">
            <h3 className="font-semibold text-[var(--rawuh-text)]">
              Recent Enrollments
            </h3>
            <div className="flex items-center gap-2">
              <select className="h-9 px-3 bg-white rounded-lg text-sm border border-[var(--rawuh-border)]">
                <option value="">All Status</option>
                <option value="enrolled">Enrolled</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--rawuh-background)]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  NIM
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Enrolled At
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rawuh-border)]">
              {enrollments.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-[var(--rawuh-background)]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                        {record.student_name.charAt(0)}
                      </div>
                      <span className="font-medium text-[var(--rawuh-text)]">
                        {record.student_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-[var(--rawuh-text)]">
                    {record.nim}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        record.status === "enrolled"
                          ? "bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)]"
                          : record.status === "pending"
                          ? "bg-[var(--rawuh-warning-muted)] text-[var(--rawuh-warning)]"
                          : "bg-[var(--rawuh-error-muted)] text-[var(--rawuh-error)]"
                      }`}
                    >
                      {record.status.charAt(0).toUpperCase() +
                        record.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--rawuh-text-muted)]">
                    {formatDate(record.enrolled_at)}
                  </td>
                  <td className="px-6 py-4">
                    {record.status !== "enrolled" && (
                      <button className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline">
                        Send Reminder
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </AdminOnly>
  );
}
