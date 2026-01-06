import { useEffect, useState } from "react";
import { apiClient, Class, Session } from "@/lib/api";

interface WeekData {
  week: string;
  present: number;
  absent: number;
}

export default function AttendanceChart() {
  const [weeklyData, setWeeklyData] = useState<WeekData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({ present: 0, absent: 0, rate: 0 });

  useEffect(() => {
    async function fetchData() {
      try {
        const classesRes = await apiClient.getMyClasses();
        const classes = classesRes.data || [];

        if (classes.length === 0) {
          setIsLoading(false);
          return;
        }

        const historyPromises = classes.map((cls: Class) =>
          apiClient.getSessionHistory(cls.id).catch(() => ({ data: [] }))
        );
        const historyResults = await Promise.all(historyPromises);

        const weekMap = new Map<number, { present: number; total: number }>();

        historyResults.forEach((res) => {
          const sessions = res.data || [];
          sessions.forEach((s: Session) => {
            if (s.week && s.total_students) {
              const existing = weekMap.get(s.week) || { present: 0, total: 0 };
              existing.present += s.present_count || 0;
              existing.total += s.total_students;
              weekMap.set(s.week, existing);
            }
          });
        });

        const data: WeekData[] = Array.from(weekMap.entries())
          .sort((a, b) => a[0] - b[0])
          .slice(-6)
          .map(([week, stats]) => ({
            week: `W${week}`,
            present: stats.present,
            absent: stats.total - stats.present,
          }));

        setWeeklyData(data);

        const totalPresent = data.reduce((sum, d) => sum + d.present, 0);
        const totalAbsent = data.reduce((sum, d) => sum + d.absent, 0);
        const total = totalPresent + totalAbsent;
        const rate = total > 0 ? Math.round((totalPresent / total) * 100) : 0;
        setTotals({ present: totalPresent, absent: totalAbsent, rate });
      } catch (err) {
        console.error("Failed to fetch attendance data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
        <div className="flex items-center justify-center gap-3 text-[var(--rawuh-text-muted)] py-12">
          <span className="material-symbols-outlined animate-spin">
            progress_activity
          </span>
          <span>Loading chart...</span>
        </div>
      </div>
    );
  }

  if (weeklyData.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[var(--rawuh-text)]">
              Attendance Trend
            </h3>
            <p className="text-sm text-[var(--rawuh-text-muted)]">
              Weekly attendance overview
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
            bar_chart
          </span>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            No attendance data yet
          </p>
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...weeklyData.map((d) => d.present + d.absent));
  const chartHeight = 160;

  return (
    <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--rawuh-text)]">
            Attendance Trend
          </h3>
          <p className="text-sm text-[var(--rawuh-text-muted)]">
            Weekly attendance overview
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--rawuh-success)]" />
            <span className="text-xs text-[var(--rawuh-text-muted)]">
              Present
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--rawuh-error)]" />
            <span className="text-xs text-[var(--rawuh-text-muted)]">
              Absent
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[180px]">
        <div className="absolute left-0 top-0 h-[160px] flex flex-col justify-between text-xs text-[var(--rawuh-text-muted)] pr-2">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>0</span>
        </div>

        <div className="absolute left-6 right-0 top-0 h-[160px] flex flex-col justify-between">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-full border-t border-dashed border-[var(--rawuh-border)]"
            />
          ))}
        </div>

        <div className="absolute left-8 right-0 bottom-5 top-0 flex items-end justify-around gap-2">
          {weeklyData.map((data) => {
            const presentHeight =
              maxValue > 0 ? (data.present / maxValue) * chartHeight : 0;
            const absentHeight =
              maxValue > 0 ? (data.absent / maxValue) * chartHeight : 0;

            return (
              <div
                key={data.week}
                className="flex flex-col items-center gap-1 flex-1"
              >
                <div className="flex flex-col items-center w-full max-w-[40px]">
                  <div
                    className="w-full bg-[var(--rawuh-error)] rounded-t-sm transition-all duration-300"
                    style={{ height: `${absentHeight}px` }}
                  />
                  <div
                    className="w-full bg-[var(--rawuh-success)] transition-all duration-300"
                    style={{ height: `${presentHeight}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="absolute left-8 right-0 bottom-0 flex justify-around">
          {weeklyData.map((data) => (
            <span
              key={data.week}
              className="text-xs text-[var(--rawuh-text-muted)] flex-1 text-center"
            >
              {data.week}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[var(--rawuh-border)] grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-[var(--rawuh-success)]">
            {totals.rate}%
          </p>
          <p className="text-xs text-[var(--rawuh-text-muted)]">
            Avg. Attendance
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--rawuh-text)]">
            {totals.present}
          </p>
          <p className="text-xs text-[var(--rawuh-text-muted)]">
            Total Present
          </p>
        </div>
        <div>
          <p className="text-2xl font-bold text-[var(--rawuh-error)]">
            {totals.absent}
          </p>
          <p className="text-xs text-[var(--rawuh-text-muted)]">Total Absent</p>
        </div>
      </div>
    </div>
  );
}
