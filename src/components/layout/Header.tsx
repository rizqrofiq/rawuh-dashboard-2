import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient, UserProfile } from "@/lib/api";

interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await apiClient.getProfile();
        setProfile(res.data);
      } catch (e) {
        console.error("Failed to fetch profile:", e);
      }
    }
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const displayName =
    profile?.student_info?.name ||
    profile?.lecturer_info?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const displayRole =
    user?.role === "lecturer"
      ? "Lecturer"
      : user?.role === "student"
      ? "Student"
      : "User";
  const initials = displayName
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-50 h-[var(--rawuh-header-height)] bg-white border-b border-[var(--rawuh-border)] px-6 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-semibold text-[var(--rawuh-text)]">
          {title}
        </h1>
        <p className="text-sm text-[var(--rawuh-text-muted)]">{subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--rawuh-text-muted)] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 pl-10 pr-4 bg-[var(--rawuh-background)] rounded-lg text-sm text-[var(--rawuh-text)] placeholder:text-[var(--rawuh-text-muted)] border border-transparent focus:border-[var(--rawuh-primary)] focus:outline-none transition-colors"
          />
        </div>

        <button className="relative w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--rawuh-background)] transition-colors">
          <span className="material-symbols-outlined text-[var(--rawuh-text-muted)] text-2xl">
            notifications
          </span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--rawuh-error)] rounded-full" />
        </button>

        <div className="w-px h-8 bg-[var(--rawuh-border)]" />

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-[var(--rawuh-background)] transition-colors"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
              {initials}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-[var(--rawuh-text)]">
                {displayName}
              </p>
              <p className="text-xs text-[var(--rawuh-text-muted)]">
                {displayRole}
              </p>
            </div>
            <span className="material-symbols-outlined text-[var(--rawuh-text-muted)] text-lg hidden md:block">
              expand_more
            </span>
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-[var(--rawuh-border)] shadow-lg py-2 z-50">
              <div className="px-4 py-3 border-b border-[var(--rawuh-border)]">
                <p className="text-sm font-medium text-[var(--rawuh-text)]">
                  {displayName}
                </p>
                <p className="text-xs text-[var(--rawuh-text-muted)]">
                  {user?.email}
                </p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--rawuh-text)] hover:bg-[var(--rawuh-background)] transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    person
                  </span>
                  Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--rawuh-text)] hover:bg-[var(--rawuh-background)] transition-colors">
                  <span className="material-symbols-outlined text-lg">
                    settings
                  </span>
                  Settings
                </button>
              </div>
              <div className="pt-1 border-t border-[var(--rawuh-border)]">
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-[var(--rawuh-error)] hover:bg-[var(--rawuh-error-muted)] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    logout
                  </span>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
