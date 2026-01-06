import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/contexts/AuthContext";
import StartSessionModal from "@/components/session/StartSessionModal";
import {
  apiClient,
  Class,
  ClassStudent,
  ClassStats,
  Session,
  SessionStudent,
  attendanceStatusLabels,
  attendanceStatusColors,
} from "@/lib/api";

export default function ClassDetailPage() {
  const router = useRouter();
  const { id, startSession } = router.query;
  const { user } = useAuth();

  const [classData, setClassData] = useState<Class | null>(null);
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [stats, setStats] = useState<ClassStats | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [sessionStudents, setSessionStudents] = useState<SessionStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"students" | "sessions">(
    "students"
  );
  const [showStartModal, setShowStartModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [selectedSessionStudents, setSelectedSessionStudents] = useState<
    SessionStudent[]
  >([]);
  const [loadingAttendees, setLoadingAttendees] = useState(false);

  const isLecturer = user?.role === "lecturer";

  useEffect(() => {
    if (startSession === "true" && !isLoading && classData && !activeSession) {
      setShowStartModal(true);
      router.replace(`/classes/${id}`, undefined, { shallow: true });
    }
  }, [startSession, isLoading, classData, activeSession, id, router]);

  useEffect(() => {
    if (!id || !isLecturer) return;

    async function fetchClassData() {
      try {
        setIsLoading(true);
        const classId = parseInt(id as string);

        const [classRes, studentsRes, statsRes, sessionsRes] =
          await Promise.all([
            apiClient.getClassDetails(classId),
            apiClient.getClassStudents(classId),
            apiClient.getClassStats(classId),
            apiClient.getSessionHistory(classId),
          ]);

        setClassData(classRes.data);
        setStudents(studentsRes.data);
        setStats(statsRes.data);
        setSessions(sessionsRes.data || []);

        const active = (sessionsRes.data || []).find(
          (s: Session) => s.is_active !== false
        );
        if (active) {
          setActiveSession(active);
          try {
            const sessionStudentsRes = await apiClient.getSessionStudents(
              active.session_id
            );
            setSessionStudents(sessionStudentsRes.data.students || []);
          } catch (e) {
            console.error("Failed to fetch session students:", e);
          }
        }
      } catch (err) {
        console.error("Failed to fetch class data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load class data"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchClassData();
  }, [id, isLecturer]);

  const handleUpdateStatus = async (
    studentId: number,
    status: "p" | "i" | "s" | "a"
  ) => {
    if (!activeSession) return;
    try {
      await apiClient.updateAttendanceStatus(
        activeSession.session_id,
        studentId,
        status
      );
      setSessionStudents((prev) =>
        prev.map((s) => (s.id === studentId ? { ...s, status } : s))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update attendance status");
    }
  };

  const handleCloseSession = async () => {
    if (!activeSession) return;
    if (!confirm("Are you sure you want to close this session?")) return;
    try {
      await apiClient.closeSessionV2(activeSession.session_id);
      setActiveSession(null);
      setSessionStudents([]);
      // Refresh sessions
      const classId = parseInt(id as string);
      const sessionsRes = await apiClient.getSessionHistory(classId);
      setSessions(sessionsRes.data || []);
    } catch (err) {
      console.error("Failed to close session:", err);
      alert("Failed to close session");
    }
  };

  if (!isLecturer) {
    return (
      <DashboardLayout title="Access Denied" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-5xl text-[var(--rawuh-error)] mb-3">
              lock
            </span>
            <h2 className="text-xl font-semibold text-[var(--rawuh-text)] mb-2">
              Access Denied
            </h2>
            <p className="text-[var(--rawuh-text-muted)] mb-4">
              Only lecturers can view class details.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout title="Loading..." subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined animate-spin">
              progress_activity
            </span>
            <span>Loading class data...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !classData) {
    return (
      <DashboardLayout title="Error" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <span className="material-symbols-outlined text-4xl text-[var(--rawuh-error)] mb-2">
              error
            </span>
            <p className="text-[var(--rawuh-error)]">
              {error || "Class not found"}
            </p>
            <Link
              href="/classes"
              className="inline-flex mt-4 px-4 py-2 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm"
            >
              Back to Classes
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={classData.name} subtitle={classData.class_code}>
      <div className="mb-6">
        <Link
          href="/classes"
          className="inline-flex items-center gap-1 text-sm text-[var(--rawuh-text-muted)] hover:text-[var(--rawuh-text)] mb-4"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to My Classes
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--rawuh-text)]">
              {classData.name}
              <span className="ml-3 text-lg font-normal text-[var(--rawuh-text-muted)]">
                {classData.class_code}
              </span>
            </h1>
            <p className="text-sm text-[var(--rawuh-text-muted)] mt-1">
              Section {classData.class_section} • {classData.day},{" "}
              {classData.start_time} - {classData.end_time}
            </p>
          </div>
          <button
            onClick={() => setShowStartModal(true)}
            disabled={!!activeSession}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--rawuh-primary)] text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            {activeSession ? "Session Active" : "Start Session"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center gap-3 mb-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined text-xl">groups</span>
            <span className="text-sm">Total Students</span>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {stats?.total_students ?? students.length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center gap-3 mb-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined text-xl">person</span>
            <span className="text-sm">Lecturer</span>
          </div>
          <p className="text-xl font-semibold text-[var(--rawuh-text)]">
            {classData.lecturer}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] p-5">
          <div className="flex items-center gap-3 mb-3 text-[var(--rawuh-text-muted)]">
            <span className="material-symbols-outlined text-xl">event</span>
            <span className="text-sm">Sessions</span>
          </div>
          <p className="text-3xl font-bold text-[var(--rawuh-text)]">
            {stats?.total_sessions ?? sessions.length}
          </p>
        </div>
      </div>

      {activeSession && (
        <div className="bg-gradient-to-r from-[var(--rawuh-primary)] to-blue-600 rounded-xl p-6 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
              <h3 className="text-lg font-semibold">
                Active Session - Week {activeSession.week}
              </h3>
            </div>
            <button
              onClick={handleCloseSession}
              className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                stop_circle
              </span>
              Close Session
            </button>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-80">Attendance Progress</span>
              <span className="font-semibold">
                {sessionStudents.filter((s) => s.status === "p").length}/
                {sessionStudents.length}
              </span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all"
                style={{
                  width: `${
                    sessionStudents.length > 0
                      ? (sessionStudents.filter((s) => s.status === "p")
                          .length /
                          sessionStudents.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "students"
              ? "bg-[var(--rawuh-primary)] text-white"
              : "bg-white text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)]"
          }`}
        >
          Enrolled Students
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "sessions"
              ? "bg-[var(--rawuh-primary)] text-white"
              : "bg-white text-[var(--rawuh-text-muted)] border border-[var(--rawuh-border)]"
          }`}
        >
          Session History
        </button>
      </div>

      {activeTab === "students" && (
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
          {students.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
                group_off
              </span>
              <p className="text-[var(--rawuh-text-muted)]">
                No students enrolled
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--rawuh-background)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    NIM
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Email
                  </th>
                  {activeSession && (
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                      Status
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rawuh-border)]">
                {students.map((student) => {
                  const sessionStudent = sessionStudents.find(
                    (s) => s.id === student.id
                  );
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-[var(--rawuh-background)]"
                    >
                      <td className="px-6 py-4 font-medium text-[var(--rawuh-text)]">
                        {student.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                        {student.nim}
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`mailto:${student.email}`}
                          className="text-sm text-[var(--rawuh-primary)] hover:underline"
                        >
                          {student.email}
                        </a>
                      </td>
                      {activeSession && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {(["p", "i", "s", "a"] as const).map((status) => {
                              const colors = attendanceStatusColors[status];
                              const isActive =
                                sessionStudent?.status === status;
                              return (
                                <button
                                  key={status}
                                  onClick={() =>
                                    handleUpdateStatus(student.id, status)
                                  }
                                  className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                                    isActive
                                      ? `bg-[${colors.bg}] text-[${colors.text}] ring-2 ring-offset-1`
                                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                                  }`}
                                  style={
                                    isActive
                                      ? {
                                          backgroundColor: colors.bg,
                                          color: colors.text,
                                        }
                                      : {}
                                  }
                                  title={attendanceStatusLabels[status]}
                                >
                                  {status.toUpperCase()}
                                </button>
                              );
                            })}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === "sessions" && (
        <div className="bg-white rounded-xl border border-[var(--rawuh-border)] overflow-hidden">
          {sessions.length === 0 ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
                event_busy
              </span>
              <p className="text-[var(--rawuh-text-muted)]">No sessions yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--rawuh-background)]">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--rawuh-border)]">
                {sessions.map((session) => (
                  <tr
                    key={session.session_id}
                    className="hover:bg-[var(--rawuh-background)]"
                  >
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--rawuh-primary-muted)] text-[var(--rawuh-primary)] font-semibold text-sm">
                        {session.week}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {session.is_active !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--rawuh-success-muted)] text-[var(--rawuh-success)] text-xs font-medium">
                          <span className="w-1.5 h-1.5 bg-[var(--rawuh-success)] rounded-full animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--rawuh-text-muted)]">
                      {session.created_at
                        ? new Date(session.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--rawuh-text)]">
                      {session.present_count ?? 0}/{session.total_students ?? 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={async () => {
                          setSelectedSession(session);
                          setLoadingAttendees(true);
                          try {
                            const res = await apiClient.getSessionStudents(
                              session.session_id
                            );
                            console.log("Session students response:", res);
                            const students =
                              res.data?.students || res.data || [];
                            setSelectedSessionStudents(
                              Array.isArray(students) ? students : []
                            );
                          } catch (e) {
                            console.error("Failed to fetch attendees:", e);
                            setSelectedSessionStudents([]);
                          } finally {
                            setLoadingAttendees(false);
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-[var(--rawuh-primary)] hover:bg-[var(--rawuh-primary-muted)] rounded-lg transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">
                          visibility
                        </span>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedSession(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[var(--rawuh-border)] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[var(--rawuh-text)]">
                  Session Attendees
                </h2>
                <p className="text-sm text-[var(--rawuh-text-muted)]">
                  Week {selectedSession.week} •{" "}
                  {selectedSession.created_at
                    ? new Date(selectedSession.created_at).toLocaleDateString()
                    : "-"}
                </p>
              </div>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 rounded-lg hover:bg-gray-100 text-[var(--rawuh-text-muted)]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
              {loadingAttendees ? (
                <div className="flex items-center justify-center py-12">
                  <span className="material-symbols-outlined animate-spin text-[var(--rawuh-text-muted)]">
                    progress_activity
                  </span>
                </div>
              ) : selectedSessionStudents.length === 0 ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-[var(--rawuh-text-muted)] mb-2">
                    group_off
                  </span>
                  <p className="text-[var(--rawuh-text-muted)]">
                    No attendance records
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-[var(--rawuh-background)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                        NIM
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                        Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--rawuh-text-muted)] uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--rawuh-border)]">
                    {selectedSessionStudents.map((student) => {
                      const statusLabel = student.status
                        ? attendanceStatusLabels[student.status]
                        : "Not Recorded";
                      const statusColors = student.status
                        ? attendanceStatusColors[student.status]
                        : { bg: "#f3f4f6", text: "#6b7280" };
                      return (
                        <tr
                          key={student.student_id || student.id || student.nim}
                          className="hover:bg-[var(--rawuh-background)]"
                        >
                          <td className="px-4 py-3 font-medium text-[var(--rawuh-text)]">
                            {student.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--rawuh-text-muted)]">
                            {student.nim}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: statusColors.bg,
                                color: statusColors.text,
                              }}
                            >
                              {statusLabel}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--rawuh-text-muted)]">
                            {student.recorded_at
                              ? new Date(
                                  student.recorded_at
                                ).toLocaleTimeString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {(["p", "i", "s", "a"] as const).map((status) => {
                                const isActive = student.status === status;
                                const colors = attendanceStatusColors[status];
                                const studentId =
                                  student.student_id || student.id;
                                return (
                                  <button
                                    key={status}
                                    onClick={async () => {
                                      if (!studentId) {
                                        alert("Student ID not available");
                                        return;
                                      }
                                      try {
                                        await apiClient.updateAttendanceStatus(
                                          selectedSession.session_id,
                                          studentId,
                                          status
                                        );
                                        setSelectedSessionStudents((prev) =>
                                          prev.map((s) =>
                                            (s.student_id || s.id) === studentId
                                              ? { ...s, status }
                                              : s
                                          )
                                        );
                                      } catch (e) {
                                        console.error(
                                          "Failed to update status:",
                                          e
                                        );
                                        alert(
                                          "Failed to update attendance status"
                                        );
                                      }
                                    }}
                                    className="w-7 h-7 rounded text-xs font-bold transition-all"
                                    style={{
                                      backgroundColor: isActive
                                        ? colors.bg
                                        : "transparent",
                                      color: isActive ? colors.text : "#9ca3af",
                                      border: isActive
                                        ? "none"
                                        : "1px solid #e5e7eb",
                                    }}
                                    title={attendanceStatusLabels[status]}
                                  >
                                    {status.toUpperCase()}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-6 py-4 border-t border-[var(--rawuh-border)] bg-[var(--rawuh-background)]">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-[var(--rawuh-text-muted)]">
                  Total:{" "}
                  <strong className="text-[var(--rawuh-text)]">
                    {selectedSessionStudents.length}
                  </strong>
                </span>
                <span className="text-[var(--rawuh-success)]">
                  Present:{" "}
                  <strong>
                    {
                      selectedSessionStudents.filter((s) => s.status === "p")
                        .length
                    }
                  </strong>
                </span>
                <span className="text-[var(--rawuh-warning)]">
                  Permission:{" "}
                  <strong>
                    {
                      selectedSessionStudents.filter((s) => s.status === "i")
                        .length
                    }
                  </strong>
                </span>
                <span className="text-blue-600">
                  Sick:{" "}
                  <strong>
                    {
                      selectedSessionStudents.filter((s) => s.status === "s")
                        .length
                    }
                  </strong>
                </span>
                <span className="text-[var(--rawuh-error)]">
                  Absent:{" "}
                  <strong>
                    {
                      selectedSessionStudents.filter((s) => s.status === "a")
                        .length
                    }
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      <StartSessionModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        classId={classData.id}
        className={classData.name}
        classCode={classData.class_code}
        onSessionStarted={async () => {
          const classId = parseInt(id as string);
          const sessionsRes = await apiClient.getSessionHistory(classId);
          setSessions(sessionsRes.data || []);
          const active = (sessionsRes.data || []).find(
            (s: Session) => s.is_active !== false
          );
          if (active) {
            setActiveSession(active);
            try {
              const sessionStudentsRes = await apiClient.getSessionStudents(
                active.session_id
              );
              setSessionStudents(sessionStudentsRes.data.students || []);
            } catch (e) {
              console.error("Failed to fetch session students:", e);
            }
          } else {
            setActiveSession(null);
            setSessionStudents([]);
          }
        }}
      />
    </DashboardLayout>
  );
}
