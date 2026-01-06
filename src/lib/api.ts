// API Configuration
// For local development, set NEXT_PUBLIC_API_URL=http://localhost:8080
// For production, it defaults to https://service.rawuh.rofiq.dev
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://service.rawuh.rofiq.dev";

// API Version prefixes
const V1 = "/api/v1";
const V2 = "/api/v2";

// ==================== API Client ====================

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: "include", // Include HttpOnly cookies automatically
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async login(identifier: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Platform": "web",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }

    return response.json();
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" });
  }

  // Profile
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request(`${V1}/profile`);
  }

  // Classes
  async getMyClasses(): Promise<ApiResponse<Class[]>> {
    return this.request(`${V1}/classes/my`);
  }

  async getClassDetails(id: number): Promise<ApiResponse<Class>> {
    return this.request(`${V1}/classes/${id}`);
  }

  async getClassStudents(id: number): Promise<ApiResponse<ClassStudent[]>> {
    return this.request(`${V1}/classes/${id}/students`);
  }

  // Sessions V1 API (Original with token/QR)
  async startSessionV1(
    classId: number,
    week: number
  ): Promise<
    ApiResponse<{
      session_id: string;
      token: string;
      expires_at: string;
      week: number;
    }>
  > {
    return this.request(`${V1}/session/start`, {
      method: "POST",
      body: JSON.stringify({ class_id: classId, week }),
    });
  }

  async getSessionToken(
    sessionId: string
  ): Promise<ApiResponse<{ token: string; expires_at: string }>> {
    return this.request(`${V1}/session/${sessionId}/token`);
  }

  async closeSessionV1(sessionId: string): Promise<ApiResponse<void>> {
    return this.request(`${V1}/session/${sessionId}/close`, { method: "POST" });
  }

  // Sessions V2 API (Demo without token)
  async startSessionV2(
    classId: number,
    week: number
  ): Promise<ApiResponse<Session>> {
    return this.request(`${V2}/session/start`, {
      method: "POST",
      body: JSON.stringify({ class_id: classId, week }),
    });
  }

  async closeSessionV2(sessionId: string): Promise<ApiResponse<void>> {
    return this.request(`${V2}/session/${sessionId}/close`, { method: "POST" });
  }

  async getActiveSessions(): Promise<ApiResponse<Session[]>> {
    return this.request(`${V2}/sessions`);
  }

  async getSessionHistory(classId: number): Promise<ApiResponse<Session[]>> {
    return this.request(`${V2}/sessions/history/${classId}`);
  }

  async getSessionStudents(
    sessionId: string
  ): Promise<ApiResponse<{ students: SessionStudent[] }>> {
    return this.request(`${V1}/session/${sessionId}/students`);
  }

  async updateAttendanceStatus(
    sessionId: string,
    studentId: number,
    status: "p" | "i" | "s" | "a"
  ): Promise<ApiResponse<void>> {
    return this.request(`${V1}/session/${sessionId}/presence/${studentId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Stats
  async getMyStats(): Promise<ApiResponse<LecturerStats | StudentStats>> {
    return this.request(`${V1}/stats/my`);
  }

  async getClassStats(classId: number): Promise<ApiResponse<ClassStats>> {
    return this.request(`${V1}/stats/class/${classId}`);
  }

  // Academic
  async getStudents(): Promise<
    ApiResponse<{ id: number; name: string; nim: string; major: string }[]>
  > {
    return this.request(`${V1}/students`);
  }

  async getTeachers(): Promise<
    ApiResponse<{ id: number; name: string; nip: string; department: string }[]>
  > {
    return this.request(`${V1}/teachers`);
  }

  async getLectures(): Promise<
    ApiResponse<{ id: number; code: string; name: string; credits: number }[]>
  > {
    return this.request(`${V1}/lectures`);
  }

  // Face Recognition
  async checkEnrollmentStatus(
    userId: number
  ): Promise<ApiResponse<{ user_id: string; enrolled: boolean }>> {
    return this.request(`${V1}/face/enrolled/${userId}`);
  }
}

export const apiClient = new ApiClient();

// ==================== Types ====================

// Auth types
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    role: "student" | "lecturer" | "admin";
  };
  permissions: string[];
}

// User Profile types
export interface StudentInfo {
  name: string;
  nim: string;
  cohort: string;
  major: string;
  faculty: string;
  degree_level: string;
  status: string;
  email: string;
  nik: string;
  pob: string;
  dob: string;
  phone_number: string;
  photo: string;
}

export interface LecturerInfo {
  name: string;
  nip: string;
  major: string;
  email: string;
}

export interface UserProfile {
  id: number;
  email: string;
  role: "student" | "lecturer";
  student_info?: StudentInfo;
  lecturer_info?: LecturerInfo;
}

// Class types
export interface Class {
  id: number;
  name: string;
  class_code: string;
  class_section: string;
  lecturer: string;
  day: string;
  start_time: string;
  end_time: string;
}

export interface ClassStudent {
  id: number;
  name: string;
  nim: string;
  email: string;
}

// Session types
export interface Session {
  session_id: string;
  token?: string;
  expires_at?: string;
  week: number;
  class_id?: number;
  class_name?: string;
  class_code?: string;
  class_section?: string;
  created_at?: string;
  closed_at?: string;
  is_active?: boolean;
  total_students?: number;
  present_count?: number;
  absent_count?: number;
}

export interface SessionStudent {
  id?: number;
  student_id?: number;
  name: string;
  nim: string;
  status: "p" | "i" | "s" | "a" | null;
  recorded_at: string | null;
}

export interface LecturerStats {
  total_classes: number;
  active_sessions: number;
  total_students: number;
}

export interface StudentStats {
  total_classes: number;
  total_classmates: number;
  total_sessions: number;
  attended_sessions: number;
  attendance_rate: number;
}

export interface ClassStats {
  total_students: number;
  total_sessions: number;
  active_sessions: number;
}

export interface AttendanceHistory {
  week: number;
  status: "p" | "i" | "s" | "a" | null;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  sick: number;
  permission: number;
  total_attended: number;
  total_sessions: number;
  attendance_rate: number;
}

export interface ClassAttendanceSummary {
  id: number;
  name: string;
  class_code: string;
  class_section: string;
  day: string;
  credits: number;
  category: string;
  total_sessions: number;
  attended_sessions: number;
  attendance_percentage: number;
}

export interface TodaySchedule {
  day: string;
  classes: Class[] | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface ApiError {
  error: string;
}

export const attendanceStatusLabels: Record<string, string> = {
  p: "Present",
  i: "Permission",
  s: "Sick",
  a: "Absent",
};

export const attendanceStatusColors: Record<
  string,
  { bg: string; text: string }
> = {
  p: { bg: "var(--rawuh-success-muted)", text: "var(--rawuh-success)" },
  i: { bg: "var(--rawuh-primary-muted)", text: "var(--rawuh-primary)" },
  s: { bg: "var(--rawuh-warning-muted)", text: "var(--rawuh-warning)" },
  a: { bg: "var(--rawuh-error-muted)", text: "var(--rawuh-error)" },
};
