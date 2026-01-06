import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { apiClient, Class, Session, LecturerStats } from "@/lib/api";

interface ClassSessionStats {
  class: Class;
  totalSessions: number;
  totalPresent: number;
  totalAbsent: number;
  totalStudents: number;
  attendanceRate: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<LecturerStats | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classStats, setClassStats] = useState<ClassSessionStats[]>([]);
  const [weeklyData, setWeeklyData] = useState<
    { week: number; present: number; absent: number }[]
  >([]);
  const [overallStats, setOverallStats] = useState({
    present: 0,
    absent: 0,
    sick: 0,
    permission: 0,
    attendanceRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, classesRes] = await Promise.all([
          apiClient.getMyStats().catch(() => ({ data: null })),
          apiClient.getMyClasses(),
        ]);
        setStats(statsRes.data as LecturerStats);
        const myClasses = classesRes.data || [];
        setClasses(myClasses);

        if (myClasses.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch session history for each class
        const historyPromises = myClasses.map((cls: Class) =>
          apiClient.getSessionHistory(cls.id).catch(() => ({ data: [] }))
        );
        const historyResults = await Promise.all(historyPromises);

        // Calculate class-level stats
        const classSessionStats: ClassSessionStats[] = [];
        const weekMap = new Map<
          number,
          { present: number; absent: number; total: number }
        >();
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalSick = 0;
        let totalPermission = 0;
        let totalRecords = 0;

        historyResults.forEach((res, index) => {
          const cls = myClasses[index];
          const sessions = res.data || [];
          let classPresent = 0;
          let classAbsent = 0;
          let classTotal = 0;

          sessions.forEach((s: Session) => {
            if (s.total_students && s.total_students > 0) {
              const present = s.present_count || 0;
              const absent = s.total_students - present;
              classPresent += present;
              classAbsent += absent;
              classTotal += s.total_students;

              // Aggregate by week
              const weekData = weekMap.get(s.week) || {
                present: 0,
                absent: 0,
                total: 0,
              };
              weekData.present += present;
              weekData.absent += absent;
              weekData.total += s.total_students;
              weekMap.set(s.week, weekData);

              // Approximate status breakdown (we only have present_count from sessions)
              totalPresent += present;
              totalAbsent += absent;
              totalRecords += s.total_students;
            }
          });

          if (classTotal > 0) {
            classSessionStats.push({
              class: cls,
              totalSessions: sessions.length,
              totalPresent: classPresent,
              totalAbsent: classAbsent,
              totalStudents: sessions[0]?.total_students || 0,
              attendanceRate: Math.round((classPresent / classTotal) * 100),
            });
          }
        });

        setClassStats(classSessionStats);

        // Convert week data to array
        const weekArray = Array.from(weekMap.entries())
          .sort((a, b) => a[0] - b[0])
          .slice(-8)
          .map(([week, data]) => ({
            week,
            present: data.present,
            absent: data.absent,
          }));
        setWeeklyData(weekArray);

        // Set overall stats
        const rate =
          totalRecords > 0
            ? Math.round((totalPresent / totalRecords) * 100)
            : 0;
        setOverallStats({
          present: totalPresent,
          absent: totalAbsent,
          sick: totalSick,
          permission: totalPermission,
          attendanceRate: rate,
        });
      } catch (err) {
        console.error("Failed to fetch statistics:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title="Statistics" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading statistics...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Statistics" subtitle="Error">
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

  const maxWeekValue = Math.max(
    ...weeklyData.map((d) => d.present + d.absent),
    1
  );
  const chartHeight = 160;

  return (
    <DashboardLayout
      title="Statistics"
      subtitle="Attendance statistics and analytics"
    >
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-primary-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-primary)]">
                school
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {stats?.total_classes || classes.length}
          </p>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Total Classes
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-success-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-success)]">
                groups
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {stats?.total_students ?? 0}
          </p>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Total Students
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--rawuh-warning-muted)] flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[var(--rawuh-warning)]">
                play_circle
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {stats?.active_sessions ?? 0}
          </p>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Active Sessions
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-green-600">
                percent
              </span>
            </div>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {overallStats.attendanceRate}%
          </p>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Avg. Attendance
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Trend */}
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <h3 className="font-semibold text-[var(--rawuh-text)] mb-4">
            Weekly Attendance Trend
          </h3>
          {weeklyData.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[var(--rawuh-text-muted)]">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2">
                  bar_chart
                </span>
                <p>No attendance data yet</p>
              </div>
            </div>
          ) : (
            <div className="relative h-[200px]">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-[160px] flex flex-col justify-between text-xs text-[var(--rawuh-text-muted)] pr-2">
                <span>{maxWeekValue}</span>
                <span>{Math.round(maxWeekValue * 0.5)}</span>
                <span>0</span>
              </div>

              {/* Bars */}
              <div className="absolute left-8 right-0 bottom-5 top-0 flex items-end justify-around gap-2">
                {weeklyData.map((data) => {
                  const presentHeight =
                    (data.present / maxWeekValue) * chartHeight;
                  const absentHeight =
                    (data.absent / maxWeekValue) * chartHeight;

                  return (
                    <div
                      key={data.week}
                      className="flex flex-col items-center gap-1 flex-1"
                    >
                      <div className="flex flex-col items-center w-full max-w-[40px]">
                        <div
                          className="w-full bg-[var(--rawuh-error)] rounded-t-sm"
                          style={{ height: `${absentHeight}px` }}
                        />
                        <div
                          className="w-full bg-[var(--rawuh-success)]"
                          style={{ height: `${presentHeight}px` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* X-axis labels */}
              <div className="absolute left-8 right-0 bottom-0 flex justify-around">
                {weeklyData.map((data) => (
                  <span
                    key={data.week}
                    className="text-xs text-[var(--rawuh-text-muted)] flex-1 text-center"
                  >
                    W{data.week}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[var(--rawuh-border)]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[var(--rawuh-success)]" />
              <span className="text-xs text-[var(--rawuh-text-muted)]">
                Present
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[var(--rawuh-error)]" />
              <span className="text-xs text-[var(--rawuh-text-muted)]">
                Absent
              </span>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <h3 className="font-semibold text-[var(--rawuh-text)] mb-4">
            Overall Attendance Summary
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-[var(--rawuh-success-muted)] rounded-lg">
              <p className="text-3xl font-bold text-[var(--rawuh-success)]">
                {overallStats.present}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">Present</p>
            </div>
            <div className="text-center p-4 bg-[var(--rawuh-error-muted)] rounded-lg">
              <p className="text-3xl font-bold text-[var(--rawuh-error)]">
                {overallStats.absent}
              </p>
              <p className="text-sm text-[var(--rawuh-text-muted)]">
                Absent/Other
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--rawuh-border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--rawuh-text-muted)]">
                Attendance Rate
              </span>
              <span className="text-sm font-semibold text-[var(--rawuh-text)]">
                {overallStats.attendanceRate}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--rawuh-success)] rounded-full"
                style={{ width: `${overallStats.attendanceRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Class Statistics Table */}
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[var(--rawuh-border)]">
          <h3 className="font-semibold text-[var(--rawuh-text)]">
            Class Statistics
          </h3>
        </div>
        {classStats.length === 0 ? (
          <div className="p-8 text-center text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined text-4xl mb-2">
              school
            </span>
            <p>No class data available</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-[var(--rawuh-background)]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Present
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Absent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rawuh-border)]">
              {classStats.map((item) => (
                <tr
                  key={item.class.id}
                  className="hover:bg-[var(--rawuh-background)]"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium text-[var(--rawuh-text)]">
                      {item.class.name}
                    </p>
                    <p className="text-sm text-[var(--rawuh-text-muted)]">
                      {item.class.class_code}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-semibold">
                      {item.totalSessions}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--rawuh-success)] font-medium">
                    {item.totalPresent}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--rawuh-error)] font-medium">
                    {item.totalAbsent}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--rawuh-success)] rounded-full"
                          style={{ width: `${item.attendanceRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[var(--rawuh-text)]">
                        {item.attendanceRate}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/classes/${item.class.id}`}
                      className="text-sm font-medium text-[var(--rawuh-primary)] hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
