import Image from "next/image";

interface Employee {
  id: string;
  name: string;
  avatar: string;
  department: string;
  nip: string;
  status: "active" | "inactive" | "on-leave";
  joinDate: string;
  clockIn: string | null;
  clockOut: string | null;
  workHours: string;
}

const employees: Employee[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "",
    department: "Engineering",
    nip: "EMP001",
    status: "active",
    joinDate: "2024-01-15",
    clockIn: "08:30",
    clockOut: "17:30",
    workHours: "9h 0m",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "",
    department: "Design",
    nip: "EMP002",
    status: "active",
    joinDate: "2024-02-20",
    clockIn: "09:00",
    clockOut: "18:00",
    workHours: "9h 0m",
  },
  {
    id: "3",
    name: "Emily Davis",
    avatar: "",
    department: "Marketing",
    nip: "EMP003",
    status: "on-leave",
    joinDate: "2024-03-10",
    clockIn: null,
    clockOut: null,
    workHours: "-",
  },
  {
    id: "4",
    name: "James Wilson",
    avatar: "",
    department: "Finance",
    nip: "EMP004",
    status: "active",
    joinDate: "2024-01-05",
    clockIn: "08:45",
    clockOut: "17:45",
    workHours: "9h 0m",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    avatar: "",
    department: "HR",
    nip: "EMP005",
    status: "active",
    joinDate: "2024-04-01",
    clockIn: "08:15",
    clockOut: null,
    workHours: "5h 30m",
  },
];

const statusStyles = {
  active: "bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)]",
  inactive: "bg-gray-100 text-gray-600",
  "on-leave": "bg-[var(--rawuh-warning-muted)] text-[var(--rawuh-warning)]",
};

const statusLabels = {
  active: "Active",
  inactive: "Inactive",
  "on-leave": "On Leave",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EmployeeTable() {
  return (
    <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
      <div className="px-6 py-4 border-b border-[var(--rawuh-border)] flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--rawuh-text)]">
            Employee Attendance
          </h2>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Today&apos;s attendance overview
          </p>
        </div>
        <button className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--rawuh-background)]">
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                NIP
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Join Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Clock In
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Clock Out
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
                Work Hours
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--rawuh-border)]">
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-[var(--rawuh-background)] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm overflow-hidden">
                      {employee.avatar ? (
                        <Image
                          src={employee.avatar}
                          alt={employee.name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      ) : (
                        getInitials(employee.name)
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--rawuh-text)]">
                        {employee.name}
                      </p>
                      <p className="text-sm text-[var(--rawuh-text-muted)]">
                        {employee.department}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                  {employee.nip}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                      statusStyles[employee.status]
                    }`}
                  >
                    {statusLabels[employee.status]}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                  {formatDate(employee.joinDate)}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                  {employee.clockIn || "-"}
                </td>
                <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                  {employee.clockOut || "-"}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-[var(--rawuh-text)]">
                  {employee.workHours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-[var(--rawuh-border)] flex items-center justify-between">
        <p className="text-sm text-[var(--rawuh-text-muted)]">
          Showing 1 to 5 of 25 entries
        </p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text-muted)] hover:bg-[var(--rawuh-background)] rounded-lg transition-colors">
            Previous
          </button>
          <button className="px-3 py-1.5 text-sm font-medium bg-[var(--rawuh-primary)] text-white rounded-lg">
            1
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text)] hover:bg-[var(--rawuh-background)] rounded-lg transition-colors">
            2
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text)] hover:bg-[var(--rawuh-background)] rounded-lg transition-colors">
            3
          </button>
          <button className="px-3 py-1.5 text-sm font-medium text-[var(--rawuh-text-muted)] hover:bg-[var(--rawuh-background)] rounded-lg transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
