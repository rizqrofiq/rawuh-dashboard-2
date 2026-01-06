# Rawuh Backend API Documentation

## Base URL
```
https://service.rawuh.rofiq.dev/api/v1
```

All API endpoints are prefixed with `/api/v1` for versioning.

## Demo Credentials

[Click Here](https://docs.google.com/spreadsheets/d/1Z1jo7TKwDJbH1pvd3kQUZMoh6-y4MPmE1CjZXjkTt48/edit?usp=sharing)

## Required Headers

### Authentication
All protected endpoints require a Bearer token:
```
Authorization: Bearer <your_access_token>
```

### Platform Identification
**IMPORTANT:** Mobile clients must include the platform header:
```
X-Platform: mobile
```

This header is required for:
- Login and authentication flows
- Session tracking
- Platform-specific features

## Response Format

All API responses follow this structure:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

Error responses:
```json
{
  "error": "Error message description"
}
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Profile](#profile)
3. [Face Recognition](#face-recognition)
4. [Classes](#classes)
5. [Sessions](#sessions)
6. [Attendance](#attendance)
7. [Statistics](#statistics)
8. [Student](#student)
9. [Academic](#academic)
10. [V2 API - Face Recognition Sessions](#v2-api---face-recognition-sessions)

---

## Mobile Usage

Use `X-Platform=mobile` in Mobile

## Authentication

### Login

Authenticate using NIM (for students) or NIP (for lecturers).

| Method | Endpoint | Auth Required | Permissions |
|--------|----------|---------------|-------------|
| `POST` | `/api/v1/auth/login` | No | None |

**Required Headers:**
```
Content-Type: application/json
X-Platform: mobile
```

**Request Body:**
```json
{
  "identifier": "2023010001",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "permissions": [
        "attendance:read",
        "attendance:submit",
        "class:read",
        "subject:read"
    ],
    "refresh_token": "2744ef22a0fa9cf877710c2f4af5d407138b2c556032b9e5396797214945369c",
    "user": {
        "email": "john@example.com",
        "id": 1,
        "role": "student"
    }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Invalid credentials"
}
```

---

### Refresh Token

Refresh the access token using a refresh token.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `POST` | `/auth/refresh` | No |

**Request Body:**
```json
{
  "refresh_token": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Logout

Invalidate the current session.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `POST` | `/auth/logout` | Yes |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Profile

### Get My Profile

Get the authenticated user's profile information.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v1/profile` | Yes |

**Response (200 OK) - Student:**
```json
{
  "data": {
    "id": 1,
    "email": "john@example.com",
    "role": "student",
    "student_info": {
      "name": "John Doe",
      "nim": "2023010001",
      "cohort": "2023",
      "major": "Computer Science",
      "faculty": "Faculty of Computer Science",
      "degree_level": "Sarjana",
      "status": "Mahasiswa Aktif",
      "email": "john@example.com",
      "nik": "3201234567890001",
      "pob": "Jakarta",
      "dob": "2000-01-01",
      "phone_number": "081234567890",
      "photo": "photo1.jpg"
    }
  },
  "message": "User profile retrieved successfully",
  "success": true
}
```

**Response (200 OK) - Lecturer:**
```json
{
  "data": {
    "id": 3,
    "email": "turing@example.com",
    "role": "lecturer",
    "lecturer_info": {
      "name": "Dr. Alan Turing",
      "nip": "19120623",
      "major": "Computer Science",
      "email": "turing@example.com"
    }
  },
  "message": "User profile retrieved successfully",
  "success": true
}
```

---

## Face Recognition

### Enroll Face

Enroll a user's face for facial recognition attendance. Students must enroll their face before using facial recognition for attendance.

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v1/face/enroll` | Yes | `attendance:submit` |

**Request:**

Use `multipart/form-data` for file upload.

**Form Data:**
- `image`: Face image file (JPEG/PNG)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Face enrolled successfully",
  "data": {
    "user_id": 1,
    "enrolled_at": "2025-12-10T08:00:00Z"
  }
}
```

**Error Responses:**

No face detected:
```json
{
  "error": "No face detected in the image"
}
```

Multiple faces detected:
```json
{
  "error": "Multiple faces detected. Please submit an image with a single face"
}
```

Invalid file format:
```json
{
  "error": "Invalid file format. Please upload a JPEG or PNG image"
}
```

Face already enrolled:
```json
{
  "error": "Face already enrolled for this user"
}
```

---

### Check Enrollment Status

Check if a user has enrolled their face for facial recognition.

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/face/enrolled/:user_id` | Yes | `attendance:submit` |

**URL Parameters:**
- `user_id`: The ID of the user to check enrollment status

**Response (200 OK) - Enrolled:**
```json
{
  "success": true,
  "data": {
    "user_id": "1",
    "enrolled": true
  }
}
```

**Response (200 OK) - Not Enrolled:**
```json
{
  "success": true,
  "data": {
    "user_id": "1",
    "enrolled": false
  }
}
```

**Error Responses:**

User not found:
```json
{
  "error": "User not found"
}
```

Unauthorized access:
```json
{
  "error": "You don't have permission to check this user's enrollment status"
}
```

---

## Classes

### Get My Classes

Get all classes for the authenticated user (lecturer or student).

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v1/classes/my` | Yes |

**Response (200 OK) - Student:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Introduction to Programming",
      "class_code": "CS101",
      "class_section": "A",
      "lecturer": "Dr. Alan Turing",
      "day": "Senin",
      "start_time": "08.00",
      "end_time": "10.30"
    },
    {
      "id": 2,
      "name": "Data Structures",
      "class_code": "CS102",
      "class_section": "A",
      "lecturer": "Dr. Grace Hopper",
      "day": "Selasa",
      "start_time": "13.00",
      "end_time": "15.30"
    }
  ],
  "message": "Classes retrieved successfully",
  "success": true
}
```

**Response (200 OK) - Lecturer:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Introduction to Programming",
      "class_code": "CS101",
      "class_section": "A",
      "lecturer": "Dr. Alan Turing",
      "day": "Senin",
      "start_time": "08.00",
      "end_time": "10.30"
    }
  ],
  "message": "Classes retrieved successfully",
  "success": true
}
```

---

### Get Class Details

Get detailed information about a specific class.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v1/classes/:id` | Yes |

**Response (200 OK):**
```json
{
  "data": {
    "id": 1,
    "name": "Introduction to Programming",
    "class_code": "CS101",
    "class_section": "A",
    "lecturer": "Dr. Alan Turing",
    "day": "Senin",
    "start_time": "08.00",
    "end_time": "10.30"
  },
  "message": "Class details retrieved successfully",
  "success": true
}
```

---

### Get Class Students

Get list of students enrolled in a class (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/classes/:id/api/v1/students` | Yes | `attendance:view` |

**Response (200 OK):**
```json
{
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "nim": "2023010001",
      "email": "john@example.com"
    }
  ],
  "message": "Class students retrieved successfully",
  "success": true
}
```

---

## Sessions

### Start Session

Create a new attendance session for a class (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v1/session/start` | Yes | `attendance:manage` |

**Request Body:**
```json
{
  "class_id": 1,
  "week": 5
}
```

**Response (200 OK):**
```json
{
  "data": {
    "session_id": "2629d795-54f4-486f-9ec7-9c968c7bc079",
    "token": "9c627bc0ffa1180fce048f20f53a6f96",
    "expires_at": "2025-12-05T13:10:30.464564+07:00",
    "week": 6
  },
  "message": "Session started successfully",
  "success": true
}
```

---

### Get Session Token

Get the current token for an active session (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/session/:id/token` | Yes | `attendance:manage` |

**Response (200 OK):**
```json
{
  "data": {
    "token": "70dc0c95f9ea05b97748b736bbd4a04c",
    "expires_at": "2025-12-05T13:13:02.46827+07:00"
  },
  "message": "Token generated successfully",
  "success": true
}
```

---

### Close Session

Close an active attendance session (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v1/session/:id/close` | Yes | `attendance:manage` |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Session closed successfully"
}
```

---

### Get Session Students

Get list of students and their attendance status for a session (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/session/:id/api/v1/students` | Yes | `attendance:manage` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "students": [
      {
        "id": 1,
        "name": "John Doe",
        "nim": "2023010001",
        "status": "p",
        "recorded_at": "2024-12-04T09:15:00Z"
      },
      {
        "id": 2,
        "name": "Jane Smith",
        "nim": "2023010002",
        "status": null,
        "recorded_at": null
      }
    ]
  }
}
```

**Status values:**
- `p` = Present
- `i` = Permission
- `s` = Sick
- `a` = Absent
- `null` = Not recorded yet

---

### Update Attendance Status

Manually update a student's attendance status (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `PATCH` | `/api/v1/session/:id/api/v1/presence/:studentId` | Yes | `attendance:manage` |

**Request Body:**
```json
{
  "status": "i"
}
```

**Response (200 OK):**
```json
{
  "message": "Attendance status updated successfully",
  "success": true
}
```

---

## Attendance

### Record Presence

Submit attendance using a session token (students only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v1/presence` | Yes | `attendance:submit` |

Use `multipart/form-data` for file upload.

**Request Body:**
```json
{
  "file": "<file>",
  "token": "abc123def456",
  "session_id": "12345678-1234-1234-1234-123456789012"
}
```

**Response (200 OK):**
```json
{
  "data": {
    "face_verify_distance": 18.931916978181317,
    "nim": "2023010001",
    "user": "john@example.com"
  },
  "message": "Presence recorded successfully",
  "success": true
}
```

**Error Responses:**

Invalid token:
```json
{
  "error": "Invalid or expired token"
}
```

Already recorded:
```json
{
  "error": "Attendance already recorded for this session"
}
```

Wrong location:
```json
{
  "error": "You are not within the allowed location range"
}
```

---

## Statistics

### Get My Stats

Get statistics for the authenticated user.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v1/stats/my` | Yes |

**Response (200 OK) - Lecturer:**
```json
{
  "success": true,
  "data": {
    "total_classes": 3,
    "active_sessions": 1,
    "total_students": 85
  }
}
```

**Response (200 OK) - Student:**
```json
{
  "data": {
    "attendance_rate": 0,
    "attended_sessions": 0,
    "total_classes": 2,
    "total_classmates": 1,
    "total_sessions": 1
  },
  "success": true
}
```

---

### Get Class Stats

Get statistics for a specific class.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v1/stats/class/:id` | Yes |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total_students": 30,
    "total_sessions": 8,
    "active_sessions": 1
  }
}
```

---

## Student

### Get Class Attendance Summary

Get detailed attendance summary for a specific class (mobile).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/student/api/v1/classes/:classId/attendance-summary` | Yes | `attendance:submit` |

**Response (200 OK):**
```json
{
  "data": {
    "attendance_history": [
      {
        "status": null,
        "week": 1
      },
      {
        "status": "a",
        "week": 1
      },
      {
        "status": null,
        "week": 2
      },
      {
        "status": null,
        "week": 5
      }
    ],
    "class": {
      "class_code": "CS101",
      "class_section": "A",
      "credits": 3,
      "day": "Senin",
      "min_attendance_percentage": 75,
      "name": "Introduction to Programming",
      "schedule": "Senin, 08.00 - 10.30 WIB",
      "total_meetings": 14
    },
    "summary": {
      "absent": 1,
      "attendance_rate": 0,
      "permission": 0,
      "present": 0,
      "sick": 0,
      "total_attended": 0,
      "total_sessions": 1
    }
  },
  "success": true
}
```

---

### Get Attendance Summary

Get attendance summary for all enrolled classes (mobile).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/student/attendance-summary` | Yes | `attendance:submit` |

**Response (200 OK):**
```json
{
  "data": {
    "classes": [
      {
        "attendance_percentage": 0,
        "attended_sessions": 0,
        "category": "MK Teori",
        "class_code": "CS102",
        "class_section": "A",
        "credits": 4,
        "day": "Selasa",
        "id": 2,
        "name": "Data Structures",
        "total_sessions": 0
      },
      {
        "attendance_percentage": 0,
        "attended_sessions": 0,
        "category": "MK Teori",
        "class_code": "CS101",
        "class_section": "A",
        "credits": 3,
        "day": "Senin",
        "id": 1,
        "name": "Introduction to Programming",
        "total_sessions": 1
      }
    ]
  },
  "success": true
}
```

---

### Get Today's Schedule

Get classes scheduled for today (mobile).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/student/schedule/today` | Yes | `attendance:submit` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "day": "Senin",
    "classes": [
      {
        "id": 1,
        "name": "Komputasi Mobile",
        "class_code": "A",
        "category": "MK Teori",
        "credits": 3,
        "start_time": "09.40",
        "end_time": "12.10",
        "day": "Senin"
      },
      {
        "id": 2,
        "name": "Pengembangan Aplikasi Piranti Bergerak",
        "class_code": "A",
        "category": "MK Praktikum",
        "credits": 2,
        "start_time": "15.30",
        "end_time": "18.00",
        "day": "Senin"
      }
    ]
  }
}
```

or 

```json
{
  "data": {
    "classes": null,
    "day": "Jumat"
  },
  "success": true
}
```

---

## Academic

### Get Students

Get list of all students (mock data).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/students` | Yes | `attendance:view` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "nim": "2023010001",
      "major": "Informatika"
    }
  ]
}
```

---

### Get Teachers

Get list of all lecturers (mock data).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/teachers` | Yes | `attendance:view` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Alan Turing",
      "nip": "197001011990031001",
      "department": "Informatika"
    }
  ]
}
```

---

### Get Lectures

Get list of all subjects (mock data).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `GET` | `/api/v1/lectures` | Yes | `attendance:view` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "CS101",
      "name": "Introduction to Programming",
      "credits": 3
    }
  ]
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Authentication Headers

For authenticated endpoints, include the JWT token in the request header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Alternatively, the token can be sent via cookies (automatically handled by browsers).


---

## V2 API - Face Recognition Sessions

The V2 API provides a simplified attendance system using **face recognition only**, without rotating tokens. This version is designed for scenarios where face verification is sufficient for attendance validation.

### Key Differences from V1

| Feature | V1 API | V2 API |
|---------|--------|--------|
| **Authentication** | Rotating tokens (20s TTL) | Face recognition only |
| **Session Start** | Returns token | No token generation |
| **Presence Recording** | Requires token + face | Requires face only |
| **ML Endpoint** | `/verify` (requires user_id) | `/pretrained/verify` (matches any enrolled face) |

---

### Start Session V2

Create a new attendance session without token generation (lecturers only).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v2/session/start` | Yes | `attendance:create` |

**Request Body:**
```json
{
  "class_id": 1,
  "week": 5
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "V2 session started successfully",
  "data": {
    "session_id": "a8f5c3e1-2b4d-4c7a-9e1f-3d8b6a2c4e5f",
    "week": 5
  }
}
```

**Notes:**
- No token is generated in V2 sessions
- Session remains active until manually closed
- Students use face recognition only to record attendance

---

### Close Session V2

Manually close a V2 attendance session. Auto-marks absent students who didn't record presence.

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v2/session/:id/close` | Yes | `attendance:create` |

**Response (200 OK):**
```json
{
  "success": true,
  "message": "V2 session closed successfully"
}
```

**Behavior:**
- Students who didn't record presence are automatically marked as absent (`a`)
- Session cannot be reopened once closed

---

### Record Presence V2

Submit student attendance using **face recognition only** (no token required).

| Method | Endpoint | Auth Required | Permission |
|--------|----------|---------------|------------|
| `POST` | `/api/v2/presence` | Yes | `attendance:submit` |

**Content-Type:** `multipart/form-data`

**Form Data:**
- `session_id` (string, required): UUID of the active session
- `image` (file, required): Face image for verification (JPEG/PNG)

**Request Example:**
```bash
curl -X POST http://localhost:8080/api/v2/presence \
  -H "Authorization: Bearer <token>" \
  -F "session_id=a8f5c3e1-2b4d-4c7a-9e1f-3d8b6a2c4e5f" \
  -F "image=@student_face.jpg"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Presence recorded successfully",
  "data": {
    "user": "student@example.com",
    "nim": "2023010001",
    "face_verify_distance": 12.45
  }
}
```

**Error Responses:**

Session not found or closed:
```json
{
  "error": "session not found"
}
```

Face verification failed:
```json
{
  "error": "face verification failed: No match found"
}
```

Face mismatch (different student):
```json
{
  "error": "face verification mismatch: expected NIM 2023010001 but got 2023010002"
}
```

Already recorded:
```json
{
  "error": "presence already recorded for this session"
}
```

**Notes:**
- Uses `/pretrained/verify` ML endpoint which matches against all enrolled faces
- Verifies that the matched face belongs to the authenticated user
- No token validation required
- Lower distance values indicate better face match quality

---

### Get Active Sessions

Get all active V2 sessions for the authenticated user.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v2/sessions` | Yes |

**Response (200 OK) - Lecturer:**
```json
{
  "success": true,
  "message": "Active sessions retrieved successfully",
  "data": [
    {
      "session_id": "a8f5c3e1-2b4d-4c7a-9e1f-3d8b6a2c4e5f",
      "class_id": 1,
      "class_name": "Introduction to Programming",
      "class_code": "CS101",
      "class_section": "A",
      "week": 5,
      "created_at": "2025-12-15T08:00:00Z"
    }
  ]
}
```

**Response (200 OK) - Student:**
```json
{
  "success": true,
  "message": "Active sessions retrieved successfully",
  "data": [
    {
      "session_id": "a8f5c3e1-2b4d-4c7a-9e1f-3d8b6a2c4e5f",
      "class_id": 1,
      "class_name": "Introduction to Programming",
      "class_code": "CS101",
      "class_section": "A",
      "week": 5,
      "created_at": "2025-12-15T08:00:00Z"
    }
  ]
}
```

**Notes:**
- Lecturers see all their active V2 sessions
- Students see active V2 sessions for classes they're enrolled in
- Only returns sessions with `version=2`

---

### Get Session History

Get all past V2 sessions with attendance statistics for a specific class.

| Method | Endpoint | Auth Required |
|--------|----------|---------------|
| `GET` | `/api/v2/sessions/history/:class_id` | Yes |

**URL Parameters:**
- `class_id` (integer): The ID of the class

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Session history retrieved successfully",
  "data": [
    {
      "session_id": "a8f5c3e1-2b4d-4c7a-9e1f-3d8b6a2c4e5f",
      "week": 5,
      "created_at": "2025-12-15T08:00:00Z",
      "closed_at": "2025-12-15T09:30:00Z",
      "is_active": false,
      "total_students": 30,
      "present_count": 28,
      "absent_count": 2
    },
    {
      "session_id": "b7e4d2c1-3a5b-4d6c-8f2e-4c9a7b3d5e6f",
      "week": 4,
      "created_at": "2025-12-08T08:00:00Z",
      "closed_at": "2025-12-08T09:30:00Z",
      "is_active": false,
      "total_students": 30,
      "present_count": 25,
      "absent_count": 5
    }
  ]
}
```

**Notes:**
- Returns sessions ordered by creation date (newest first)
- Includes attendance statistics for each session
- Only returns V2 sessions (`version=2`)

---

## Demo Credentials

**Lecturer:**
- **NIP:** `197001011990031001`
- **Password:** `lecturer123`

**Student:**
- **NIM:** `2023010001`
- **Password:** `password123`

---

## Notes

1. All timestamps are in ISO 8601 format (UTC)
2. Attendance status codes:
   - `p` = Present (Hadir)
   - `i` = Permission (Izin)
   - `s` = Sick (Sakit)
   - `a` = Absent (Alpa)
3. Location validation uses a 100-meter radius from the session's coordinates
4. Session tokens expire after 2 hours of inactivity
5. The day names in the database are in Indonesian: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu
