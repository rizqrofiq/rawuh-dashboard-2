import DashboardLayout from "@/components/layout/DashboardLayout";
import AdminOnly from "@/components/auth/AdminOnly";

interface Lecturer {
  id: number;
  name: string;
  nip: string;
  email: string;
  department: string;
  classes_count: number;
  active_sessions: number;
}

// Sample data
const lecturers: Lecturer[] = [
  {
    id: 1,
    name: "Dr. Alan Turing",
    nip: "197001011990031001",
    email: "turing@example.com",
    department: "Computer Science",
    classes_count: 3,
    active_sessions: 1,
  },
  {
    id: 2,
    name: "Dr. Grace Hopper",
    nip: "197001011990031002",
    email: "hopper@example.com",
    department: "Computer Science",
    classes_count: 2,
    active_sessions: 0,
  },
  {
    id: 3,
    name: "Dr. Edgar Codd",
    nip: "197001011990031003",
    email: "codd@example.com",
    department: "Information Systems",
    classes_count: 2,
    active_sessions: 1,
  },
  {
    id: 4,
    name: "Dr. Dennis Ritchie",
    nip: "197001011990031004",
    email: "ritchie@example.com",
    department: "Computer Science",
    classes_count: 4,
    active_sessions: 0,
  },
  {
    id: 5,
    name: "Dr. Ada Lovelace",
    nip: "197001011990031005",
    email: "lovelace@example.com",
    department: "Data Science",
    classes_count: 2,
    active_sessions: 2,
  },
  {
    id: 6,
    name: "Dr. Tim Berners-Lee",
    nip: "197001011990031006",
    email: "berners@example.com",
    department: "Information Systems",
    classes_count: 3,
    active_sessions: 0,
  },
];

export default function LecturersPage() {
  return (
    <AdminOnly>
      <DashboardLayout
        title="Lecturers"
        subtitle="View and manage lecturer records"
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
                placeholder="Search lecturers..."
                className="w-80 h-10 pl-10 pr-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)] focus:border-[var(--rawuh-primary)] focus:outline-none"
              />
            </div>
            <select className="h-10 px-4 bg-white rounded-lg text-sm text-[var(--rawuh-text)] border border-[var(--rawuh-border)]">
              <option value="">All Departments</option>
              <option value="cs">Computer Science</option>
              <option value="is">Information Systems</option>
              <option value="ds">Data Science</option>
            </select>
          </div>
          <button className="flex items-center gap-2 h-10 px-4 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
            <span className="material-symbols-outlined text-xl">
              person_add
            </span>
            Add Lecturer
          </button>
        </div>

        {/* Lecturers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {lecturers.map((lecturer) => (
            <div
              key={lecturer.id}
              className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5 hover:shadow-lg hover:border-[var(--rawuh-primary)] transition-all"
            >
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white text-lg font-semibold">
                  {lecturer.name
                    .split(" ")
                    .slice(1)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--rawuh-text)] truncate">
                    {lecturer.name}
                  </h3>
                  <p className="text-sm text-[var(--rawuh-text-muted)]">
                    {lecturer.department}
                  </p>
                  <p className="text-xs text-[var(--rawuh-text-muted)] font-mono mt-1">
                    {lecturer.nip}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-[var(--rawuh-background)] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-[var(--rawuh-text)]">
                    {lecturer.classes_count}
                  </p>
                  <p className="text-xs text-[var(--rawuh-text-muted)]">
                    Classes
                  </p>
                </div>
                <div className="bg-[var(--rawuh-background)] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-[var(--rawuh-text)]">
                    {lecturer.active_sessions}
                  </p>
                  <p className="text-xs text-[var(--rawuh-text-muted)]">
                    Active Sessions
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 text-sm text-[var(--rawuh-text-muted)] mb-4">
                <span className="material-symbols-outlined text-lg">email</span>
                <span className="truncate">{lecturer.email}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-[var(--rawuh-border)]">
                <button className="flex-1 py-2 rounded-lg border border-[var(--rawuh-border)] text-sm font-medium text-[var(--rawuh-text)] hover:bg-gray-50 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 py-2 rounded-lg bg-[var(--rawuh-primary-muted)] text-sm font-medium text-[var(--rawuh-primary)] hover:bg-blue-100 transition-colors">
                  View Classes
                </button>
              </div>
            </div>
          ))}
        </div>
      </DashboardLayout>
    </AdminOnly>
  );
}
