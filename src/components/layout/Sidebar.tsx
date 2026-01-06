import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

interface NavItem {
  icon: string;
  label: string;
  href: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: "dashboard", label: "Dashboard", href: "/" },
  { icon: "school", label: "Classes", href: "/classes" },
  { icon: "event_available", label: "Sessions", href: "/sessions" },
  { icon: "fact_check", label: "Attendance", href: "/attendance" },
  { icon: "groups", label: "Students", href: "/students", adminOnly: true },
  { icon: "person", label: "Lecturers", href: "/lecturers", adminOnly: true },
];

const quickAccessItems: NavItem[] = [
  {
    icon: "face",
    label: "Face Recognition",
    href: "/face-recognition",
    adminOnly: true,
  },
  { icon: "bar_chart", label: "Statistics", href: "/statistics" },
  { icon: "calendar_month", label: "Schedule", href: "/schedule" },
  { icon: "settings", label: "Settings", href: "/settings", adminOnly: true },
];

export default function Sidebar() {
  const router = useRouter();
  const { user } = useAuth();

  const isActive = (href: string) => router.pathname === href;
  const isAdmin = user?.role === "admin";

  // Filter items based on role
  const filteredNavItems = navItems.filter(
    (item) => !item.adminOnly || isAdmin
  );
  const filteredQuickAccessItems = quickAccessItems.filter(
    (item) => !item.adminOnly || isAdmin
  );

  return (
    <aside className="fixed left-0 top-0 h-screen w-[var(--rawuh-sidebar-width)] bg-white border-r border-[var(--rawuh-border)] flex flex-col z-40">
      <div className="h-[var(--rawuh-header-height)] flex items-center px-6 border-b border-[var(--rawuh-border)]">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Rawuh" className="w-10 h-10 rounded-lg" />
          <div>
            <h1 className="font-bold text-lg text-[var(--rawuh-text)]">
              Rawuh
            </h1>
            <p className="text-xs text-[var(--rawuh-text-muted)]">
              Attendance System
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {/* Main Menu */}
        <div className="mb-6">
          <p className="px-3 mb-2 text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
            Menu
          </p>
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)]"
                      : "text-[var(--rawuh-text-muted)] hover:bg-gray-100 hover:text-[var(--rawuh-text)]"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Access */}
        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase tracking-wider">
            Quick Access
          </p>
          <ul className="space-y-1">
            {filteredQuickAccessItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)]"
                      : "text-[var(--rawuh-text-muted)] hover:bg-gray-100 hover:text-[var(--rawuh-text)]"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Support Card */}
      <div className="p-4">
        <div className="relative bg-gradient-to-br from-[var(--rawuh-primary)] to-blue-600 rounded-xl p-4 text-white overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/10 rounded-full" />

          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-xl">
                support_agent
              </span>
            </div>
            <h3 className="font-semibold text-sm mb-1">Need Help?</h3>
            <p className="text-xs text-white/80 mb-3">
              Our support team is here for you
            </p>
            <button className="text-sm font-semibold text-[var(--rawuh-primary)] bg-white rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
