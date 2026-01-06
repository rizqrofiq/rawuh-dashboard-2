import DashboardLayout from "@/components/layout/DashboardLayout";

interface ScheduleItem {
  id: number;
  class_name: string;
  class_code: string;
  section: string;
  start_time: string;
  end_time: string;
  room: string;
}

const schedule: Record<string, ScheduleItem[]> = {
  Senin: [
    {
      id: 1,
      class_name: "Introduction to Programming",
      class_code: "CS101",
      section: "A",
      start_time: "08.00",
      end_time: "10.30",
      room: "Lab 1",
    },
    {
      id: 2,
      class_name: "Database Systems",
      class_code: "CS301",
      section: "A",
      start_time: "13.00",
      end_time: "15.30",
      room: "Room 201",
    },
  ],
  Selasa: [
    {
      id: 3,
      class_name: "Data Structures",
      class_code: "CS102",
      section: "A",
      start_time: "09.00",
      end_time: "11.30",
      room: "Lab 2",
    },
  ],
  Rabu: [
    {
      id: 4,
      class_name: "Algorithm Design",
      class_code: "CS201",
      section: "B",
      start_time: "08.00",
      end_time: "10.30",
      room: "Room 301",
    },
    {
      id: 5,
      class_name: "Introduction to Programming",
      class_code: "CS101",
      section: "B",
      start_time: "13.00",
      end_time: "15.30",
      room: "Lab 1",
    },
  ],
  Kamis: [
    {
      id: 6,
      class_name: "Mobile Computing",
      class_code: "CS401",
      section: "A",
      start_time: "10.00",
      end_time: "12.30",
      room: "Lab 3",
    },
  ],
  Jumat: [
    {
      id: 7,
      class_name: "Database Systems",
      class_code: "CS301",
      section: "B",
      start_time: "08.00",
      end_time: "10.30",
      room: "Room 201",
    },
  ],
};

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
const timeSlots = [
  "08.00",
  "09.00",
  "10.00",
  "11.00",
  "12.00",
  "13.00",
  "14.00",
  "15.00",
  "16.00",
];

export default function SchedulePage() {
  return (
    <DashboardLayout title="Schedule" subtitle="Weekly class schedule">
      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button className="p-2 flex items-center justify-center rounded-lg border border-[var(--rawuh-border)] hover:bg-gray-50">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <h3 className="text-lg font-semibold text-[var(--rawuh-text)]">
            Week 6, December 2025
          </h3>
          <button className="p-2 flex items-center justify-center rounded-lg border border-[var(--rawuh-border)] hover:bg-gray-50">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600">
          <span className="material-symbols-outlined text-xl">today</span>
          Today
        </button>
      </div>

      {/* Schedule Grid */}
      <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 border-b border-[var(--rawuh-border)]">
          <div className="p-4 bg-[var(--rawuh-background)]" />
          {days.map((day) => (
            <div
              key={day}
              className="p-4 text-center border-l border-[var(--rawuh-border)] bg-[var(--rawuh-background)]"
            >
              <p className="font-semibold text-[var(--rawuh-text)]">{day}</p>
            </div>
          ))}
        </div>

        {/* Time Slots */}
        <div className="divide-y divide-[var(--rawuh-border)]">
          {timeSlots.map((time) => (
            <div key={time} className="grid grid-cols-6 min-h-[80px]">
              <div className="p-3 text-sm text-[var(--rawuh-text-muted)] text-right pr-4 bg-[var(--rawuh-background)]">
                {time}
              </div>
              {days.map((day) => {
                const classItem = schedule[day]?.find(
                  (c) => c.start_time === time
                );
                return (
                  <div
                    key={`${day}-${time}`}
                    className="border-l border-[var(--rawuh-border)] p-1"
                  >
                    {classItem && (
                      <div className="h-full bg-[var(--rawuh-primary-muted)] rounded-lg p-2 cursor-pointer hover:bg-blue-100 transition-colors">
                        <p className="text-sm font-medium text-[var(--rawuh-primary)] line-clamp-1">
                          {classItem.class_name}
                        </p>
                        <p className="text-xs text-[var(--rawuh-text-muted)]">
                          {classItem.class_code} - {classItem.section}
                        </p>
                        <p className="text-xs text-[var(--rawuh-text-muted)] mt-1">
                          {classItem.start_time} - {classItem.end_time}
                        </p>
                        <p className="text-xs text-[var(--rawuh-text-muted)]">
                          {classItem.room}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Today's Classes */}
      <div className="mt-6 bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
        <h3 className="font-semibold text-[var(--rawuh-text)] mb-4">
          Today&apos;s Classes
        </h3>
        <div className="space-y-3">
          {schedule["Senin"]?.map((cls) => (
            <div
              key={cls.id}
              className="flex items-center gap-4 p-4 rounded-lg border border-[var(--rawuh-border)] hover:bg-[var(--rawuh-background)]"
            >
              <div className="w-12 h-12 rounded-lg bg-[var(--rawuh-primary-muted)] flex items-center justify-center">
                <span className="material-symbols-outlined text-[var(--rawuh-primary)]">
                  school
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-[var(--rawuh-text)]">
                  {cls.class_name}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  {cls.class_code} - Section {cls.section}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--rawuh-text)]">
                  {cls.start_time} - {cls.end_time}
                </p>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  {cls.room}
                </p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium hover:bg-blue-600">
                <span className="material-symbols-outlined text-lg">
                  play_circle
                </span>
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
