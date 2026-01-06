import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import ClassesTable from "@/components/dashboard/ClassesTable";
import AttendanceChart from "@/components/dashboard/AttendanceChart";
import ActiveSessionsWidget from "@/components/dashboard/ActiveSessionsWidget";
import {
  apiClient,
  LecturerStats,
  UserProfile,
  Class,
  Session,
} from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<LecturerStats | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [avgAttendance, setAvgAttendance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [statsRes, profileRes, classesRes, activeSessionsRes] =
          await Promise.all([
            apiClient.getMyStats().catch(() => ({ data: null })),
            apiClient.getProfile(),
            apiClient.getMyClasses(),
            apiClient.getActiveSessions().catch(() => ({ data: [] })),
          ]);

        console.log("Stats response:", statsRes);
        console.log("Classes response:", classesRes);
        console.log("Active sessions response:", activeSessionsRes);

        const classes = classesRes.data || [];
        const activeSessions = activeSessionsRes.data || [];

        // If API stats are 0 or missing, calculate from classes data
        const apiStats = statsRes.data as LecturerStats;
        const calculatedStats: LecturerStats = {
          total_classes: apiStats?.total_classes || classes.length,
          active_sessions: apiStats?.active_sessions || activeSessions.length,
          total_students: apiStats?.total_students || 0,
        };

        // If total_students is 0, we can calculate from session history
        setStats(calculatedStats);
        setProfile(profileRes.data);

        // Calculate average attendance from session history
        if (classes.length > 0) {
          const historyPromises = classes.map((cls: Class) =>
            apiClient.getSessionHistory(cls.id).catch(() => ({ data: [] }))
          );
          const historyResults = await Promise.all(historyPromises);

          let totalPresent = 0;
          let totalStudents = 0;
          let uniqueStudents = 0;

          historyResults.forEach((res) => {
            const sessions = res.data || [];
            sessions.forEach((s: Session) => {
              if (s.total_students && s.total_students > 0) {
                totalPresent += s.present_count || 0;
                totalStudents += s.total_students;
                // Track max students per class for unique count
                if (s.total_students > uniqueStudents) {
                  uniqueStudents = s.total_students;
                }
              }
            });
          });

          if (totalStudents > 0) {
            setAvgAttendance(
              Math.round((totalPresent / totalStudents) * 100 * 10) / 10
            );
          }

          // Update total_students if it was 0
          if (calculatedStats.total_students === 0 && uniqueStudents > 0) {
            setStats((prev) =>
              prev ? { ...prev, total_students: uniqueStudents } : prev
            );
          }
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayName =
    profile?.lecturer_info?.name ||
    profile?.student_info?.name ||
    user?.email ||
    "User";
  const greeting = `Welcome back, ${displayName.split(" ")[0]}`;

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading dashboard...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard" subtitle="Error">
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
    <DashboardLayout title="Dashboard" subtitle={greeting}>
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatCard
          icon={
            <span
              className="material-symbols-outlined text-2xl text-[var(--rawuh-primary)]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              school
            </span>
          }
          iconBgColor="var(--rawuh-primary-muted)"
          title="Total Classes"
          value={stats?.total_classes ?? "-"}
          subtitle="This semester"
        />
        <StatCard
          icon={
            <span
              className="material-symbols-outlined text-2xl text-[var(--rawuh-success)]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              play_circle
            </span>
          }
          iconBgColor="var(--rawuh-success-muted)"
          title="Active Sessions"
          value={stats?.active_sessions ?? "-"}
          subtitle="Currently running"
        />
        <StatCard
          icon={
            <span
              className="material-symbols-outlined text-2xl text-[var(--rawuh-secondary-brand)]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              groups
            </span>
          }
          iconBgColor="#FFF3E8"
          title="Total Students"
          value={stats?.total_students ?? "-"}
          subtitle="Across all classes"
        />
        <StatCard
          icon={
            <span
              className="material-symbols-outlined text-2xl text-[var(--rawuh-main)]"
              style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
            >
              percent
            </span>
          }
          iconBgColor="#EEEEF5"
          title="Avg. Attendance"
          value={avgAttendance !== null ? `${avgAttendance}%` : "-"}
          subtitle="All sessions"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Classes Table - Takes 2 columns */}
        <div className="xl:col-span-2">
          <ClassesTable />
        </div>

        {/* Right Column - Active Sessions & Chart */}
        <div className="space-y-6">
          <ActiveSessionsWidget />
          <AttendanceChart />
        </div>
      </div>
    </DashboardLayout>
  );
}
