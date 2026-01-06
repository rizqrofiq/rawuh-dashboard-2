import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminOnly from "@/components/auth/AdminOnly";

interface Student {
  id: number;
  name: string;
  nim: string;
  email: string;
  major: string;
  cohort: string;
  status: "active" | "inactive";
  face_enrolled: boolean;
}

// Sample data
const students: Student[] = [
  {
    id: 1,
    name: "John Doe",
    nim: "2023010001",
    email: "john@example.com",
    major: "Computer Science",
    cohort: "2023",
    status: "active",
    face_enrolled: true,
  },
  {
    id: 2,
    name: "Jane Smith",
    nim: "2023010002",
    email: "jane@example.com",
    major: "Computer Science",
    cohort: "2023",
    status: "active",
    face_enrolled: true,
  },
  {
    id: 3,
    name: "Bob Johnson",
    nim: "2023010003",
    email: "bob@example.com",
    major: "Information Systems",
    cohort: "2023",
    status: "active",
    face_enrolled: false,
  },
  {
    id: 4,
    name: "Alice Brown",
    nim: "2023010004",
    email: "alice@example.com",
    major: "Computer Science",
    cohort: "2022",
    status: "active",
    face_enrolled: true,
  },
  {
    id: 5,
    name: "Charlie Wilson",
    nim: "2023010005",
    email: "charlie@example.com",
    major: "Data Science",
    cohort: "2023",
    status: "inactive",
    face_enrolled: false,
  },
  {
    id: 6,
    name: "Diana Lee",
    nim: "2023010006",
    email: "diana@example.com",
    major: "Computer Science",
    cohort: "2023",
    status: "active",
    face_enrolled: true,
  },
  {
    id: 7,
    name: "Edward Chen",
    nim: "2023010007",
    email: "edward@example.com",
    major: "Information Systems",
    cohort: "2022",
    status: "active",
    face_enrolled: true,
  },
  {
    id: 8,
    name: "Fiona Garcia",
    nim: "2023010008",
    email: "fiona@example.com",
    major: "Computer Science",
    cohort: "2023",
    status: "active",
    face_enrolled: false,
  },
];

export default function StudentsPage() {
  return (
    <AdminOnly>
      <DashboardLayout
        title="Students"
        subtitle="View and manage student records"
      >
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)] text-xl">
                search
              </span>
              <input
                type="text"
                placeholder="Search students..."
                className="w-80 h-10 pl-10 pr-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:outline-none"
              />
            </div>
            <select className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)]">
              <option value="">All Majors</option>
              <option value="cs">Computer Science</option>
              <option value="is">Information Systems</option>
              <option value="ds">Data Science</option>
            </select>
            <select className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)]">
              <option value="">All Cohorts</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
            </select>
          </div>
          <button className="flex items-center gap-2 h-10 px-4 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
            Add Student
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
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
                  Major
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Cohort
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Face ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rawuh-border)]">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[var(--rawuh-background)]"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                        {student.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--rawuh-text)]">
                          {student.name}
                        </p>
                        <p className="text-sm text-[var(--rawuh-text-muted)]">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-[var(--rawuh-text)]">
                      {student.nim}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                    {student.major}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 rounded-md bg-gray-100 text-sm font-medium text-[var(--rawuh-text)]">
                      {student.cohort}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                        student.status === "active"
                          ? "bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)]"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {student.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {student.face_enrolled ? (
                      <span className="inline-flex items-center gap-1 text-[var(--rawuh-success)]">
                        <span className="material-symbols-outlined text-lg">
                          check_circle
                        </span>
                        <span className="text-xs font-medium">Enrolled</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[var(--rawuh-text-muted)]">
                        <span className="material-symbols-outlined text-lg">
                          cancel
                        </span>
                        <span className="text-xs font-medium">
                          Not Enrolled
                        </span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)]">
                        <span className="material-symbols-outlined text-xl">
                          visibility
                        </span>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-100 text-[var(--rawuh-text-muted)]">
                        <span className="material-symbols-outlined text-xl">
                          edit
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-[var(--rawuh-border)] flex items-center justify-between">
            <p className="text-sm text-[var(--rawuh-text-muted)]">
              Showing 1 to 8 of 156 students
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text-muted)] hover:bg-gray-100 rounded-lg">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm font-medium bg-[var(--rawuh-primary)] text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text)] hover:bg-gray-100 rounded-lg">
                2
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text)] hover:bg-gray-100 rounded-lg">
                3
              </button>
              <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text-muted)] hover:bg-gray-100 rounded-lg">
                Next
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </AdminOnly>
  );
}
