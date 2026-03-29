# 🎓 STUDENT MANAGEMENT SYSTEM - COMPLETE GUIDE

**Ernest Bai Koroma University of Science and Technology**
**Student Management Module Documentation**

---

## 📋 Table of Contents
1. [Overview](#overview)
2. [Student Management Features](#student-management-features)
3. [Backend API Endpoints](#backend-api-endpoints)
4. [Database Models](#database-models)
5. [Frontend Pages](#frontend-pages)
6. [Common Operations](#common-operations)

---

## 🌟 Overview

The Student Management System is a comprehensive module for managing all aspects of student records, enrollment, attendance, and academic progression.

### Access URL
**Frontend:** http://localhost:3000/students
**Backend API:** http://localhost:8000/api/v1/students/

---

## 📚 Student Management Features

### 1. **Add Student**
**URL:** `/students/add`
**Icon:** UserPlus
**Description:** Register new students into the system

**Features:**
- Auto-generate student ID based on campus and year
- Format: `{CampusCode}{Year}{SequenceNumber}`
- Example: `EBKUST202600001`
- Full student profile creation
- Guardian information
- Medical information
- Emergency contacts

---

### 2. **Edit Students Info**
**URL:** `/students`
**Icon:** Edit
**Description:** View and modify existing student records

**Features:**
- Search students by ID, email, name
- Filter by campus, department, program
- Update personal information
- Modify enrollment status
- Track academic progress

---

### 3. **Manage Halls (Student Accommodation)**
**URL:** `/students/halls`
**Icon:** Home
**Description:** Manage student accommodation and hostel assignments

**Features:**
- View all accommodation halls
- Track occupancy rates
- Capacity: Total, Occupied, Available
- Gender-specific halls
- Real-time statistics

**Current Halls:**
| Hall Name | Capacity | Occupied | Gender | Availability |
|-----------|----------|----------|--------|--------------|
| King George Hall | 200 | 180 | Male | 20 beds |
| Queen Elizabeth Hall | 150 | 145 | Female | 5 beds |
| Peace Hall | 180 | 160 | Male | 20 beds |
| Unity Hall | 120 | 100 | Female | 20 beds |

**Total Statistics:**
- Total Halls: 4
- Total Capacity: 650
- Occupied: 585
- Available: 65

---

### 4. **Student Promotions**
**URL:** `/students/promotions`
**Icon:** TrendingUp
**Description:** Promote students to the next academic level

**Features:**
- Select academic year
- Choose current level (100-400)
- Auto-promote eligible students
- Department filtering
- Bulk promotion

**Promotion Flow:**
- 100 Level → 200 Level
- 200 Level → 300 Level
- 300 Level → 400 Level
- 400 Level → Graduate

**Requirements:**
- Only students meeting academic requirements are promoted
- Students on probation are excluded
- Irreversible action - review carefully

---

### 5. **Generate Class List**
**URL:** `/students/class-list`
**Icon:** List
**Description:** Create class lists for courses and departments

**Features:**
- Filter by Academic Year
- Filter by Semester (First/Second)
- Filter by Level (100-400)
- Filter by Department
- Optional course filtering
- Export to Excel
- Print functionality

**Export Formats:**
- Excel spreadsheet
- PDF document
- Print-ready format

---

### 6. **Reset Student Password**
**URL:** `/students/reset-password`
**Icon:** Key
**Description:** Reset student account passwords

**Features:**
- Search by Student ID or Email
- View student information before reset
- Set new password
- Email notification to student
- Security confirmation

**Security:**
- Admin-only access
- Email notification sent
- Password strength requirements

---

### 7. **Delete Students Info**
**URL:** `/students/delete`
**Icon:** Trash2
**Description:** Permanently remove student records

**⚠️ Warning:** This is an irreversible action!

**Features:**
- Search student by ID or Email
- View complete student information
- Confirmation required: Type "DELETE"
- Removes all associated data:
  - Academic records
  - Grades and transcripts
  - Enrollment history
  - Attendance records
  - Payment records

**Safety Measures:**
- Red color theme (danger indicator)
- Double confirmation
- Type confirmation text: "DELETE"
- Warning banners
- Shows all student info before deletion

---

### 8. **Add Other Students**
**URL:** `/students/add-others`
**Icon:** UserCog
**Description:** Register non-traditional students

**Student Types:**
1. **Part-Time Students**
   - Evening or weekend programs
   - Flexible schedules

2. **Distance Learning Students**
   - Remote/online programs
   - Virtual attendance

3. **Special Program Students**
   - Certificate programs
   - Diploma programs
   - Professional development

**Features:**
- Student type selection
- Custom program assignment
- Dedicated registration forms
- Different requirements per type

---

### 9. **Reset Other Students**
**URL:** `/students/reset-others`
**Icon:** UserX
**Description:** Reset accounts for non-traditional students

**Features:**
- Search part-time, distance, special students
- Password reset
- Account recovery
- Bulk reset options

---

## 🔌 Backend API Endpoints

### Base URL
```
http://localhost:8000/api/v1/students/
```

### Student Endpoints

#### 1. **List/Create Students**
```http
GET    /api/v1/students/students/
POST   /api/v1/students/students/
```

**Query Parameters:**
- `campus` - Filter by campus ID
- `department` - Filter by department ID
- `program` - Filter by program ID
- `enrollment_status` - ACTIVE, SUSPENDED, GRADUATED, WITHDRAWN, DEFERRED
- `current_semester` - Filter by semester number
- `search` - Search by student_id, email, name, guardian_name
- `ordering` - student_id, admission_date, gpa, created_at

**Example:**
```bash
GET /api/v1/students/students/?campus=1&enrollment_status=ACTIVE&search=John
```

---

#### 2. **Retrieve/Update/Delete Student**
```http
GET    /api/v1/students/students/{id}/
PUT    /api/v1/students/students/{id}/
PATCH  /api/v1/students/students/{id}/
DELETE /api/v1/students/students/{id}/
```

---

#### 3. **Enroll Student in Course**
```http
POST /api/v1/students/students/{id}/enroll_course/
```

**Request Body:**
```json
{
  "course_offering_id": 1
}
```

**Response:**
```json
{
  "id": 1,
  "student": 1,
  "course_offering": 1,
  "semester": "First Semester",
  "academic_year": "2025/2026",
  "status": "ENROLLED"
}
```

---

#### 4. **Get Student Transcript**
```http
GET /api/v1/students/students/{id}/get_transcript/
```

**Response:**
```json
[
  {
    "id": 1,
    "student": 1,
    "academic_year": "2025/2026",
    "semester": "First Semester",
    "courses": [...],
    "gpa": 3.45
  }
]
```

---

#### 5. **Get Student Enrollments**
```http
GET /api/v1/students/students/{id}/enrollments/
```

**Response:**
```json
[
  {
    "id": 1,
    "course_offering": {
      "course": {
        "code": "CS101",
        "title": "Introduction to Programming"
      }
    },
    "semester": "First Semester",
    "status": "ENROLLED",
    "grade": "A"
  }
]
```

---

#### 6. **Get Attendance Summary**
```http
GET /api/v1/students/students/{id}/attendance_summary/
```

**Response:**
```json
{
  "total": 40,
  "present": 35,
  "absent": 3,
  "late": 2,
  "excused": 0,
  "attendance_percentage": 92.5
}
```

---

### Enrollment Endpoints

#### 1. **List/Create Enrollments**
```http
GET  /api/v1/students/enrollments/
POST /api/v1/students/enrollments/
```

**Query Parameters:**
- `student` - Filter by student ID
- `course_offering` - Filter by course offering ID
- `semester` - Filter by semester
- `academic_year` - Filter by academic year
- `status` - ENROLLED, COMPLETED, DROPPED, FAILED

---

#### 2. **Bulk Enroll Students**
```http
POST /api/v1/students/enrollments/bulk_enroll/
```

**Request Body:**
```json
{
  "student_ids": [1, 2, 3, 4, 5],
  "course_offering_id": 1
}
```

**Response:**
```json
{
  "enrolled": [...],
  "errors": [],
  "total_enrolled": 5,
  "total_errors": 0
}
```

---

### Attendance Endpoints

#### 1. **List/Create Attendance**
```http
GET  /api/v1/students/attendance/
POST /api/v1/students/attendance/
```

**Query Parameters:**
- `student` - Filter by student ID
- `course_offering` - Filter by course offering
- `date` - Filter by specific date
- `status` - PRESENT, ABSENT, LATE, EXCUSED

---

#### 2. **Bulk Mark Attendance**
```http
POST /api/v1/students/attendance/bulk_mark/
```

**Request Body:**
```json
{
  "attendances": [
    {
      "student_id": 1,
      "course_offering_id": 1,
      "date": "2026-03-28",
      "status": "PRESENT"
    },
    {
      "student_id": 2,
      "course_offering_id": 1,
      "date": "2026-03-28",
      "status": "ABSENT"
    }
  ]
}
```

---

## 💾 Database Models

### 1. **Student Model**

**Table:** `students_student`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| user | ForeignKey | Link to User account |
| student_id | CharField(20) | Unique student identifier |
| campus | ForeignKey | Campus assignment |
| department | ForeignKey | Department enrollment |
| program | ForeignKey | Academic program |
| admission_date | DateField | Date of admission |
| enrollment_status | CharField | ACTIVE, SUSPENDED, GRADUATED, WITHDRAWN, DEFERRED |
| current_semester | Integer | Current semester number |
| gpa | Decimal(3,2) | Grade Point Average (0.00-4.00) |
| guardian_name | CharField | Guardian full name |
| guardian_phone | CharField | Guardian contact |
| guardian_email | EmailField | Guardian email |
| medical_info | TextField | Medical conditions/allergies |
| blood_group | CharField | A+, A-, B+, B-, AB+, AB-, O+, O- |
| address | TextField | Residential address |
| emergency_contact | CharField | Emergency phone number |

**Enrollment Status Options:**
- **ACTIVE** - Currently enrolled and attending
- **SUSPENDED** - Temporarily suspended
- **GRADUATED** - Completed program
- **WITHDRAWN** - Left the university
- **DEFERRED** - Deferred admission/enrollment

---

### 2. **Enrollment Model**

**Table:** `students_enrollment`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| student | ForeignKey | Student reference |
| course_offering | ForeignKey | Course offering reference |
| semester | CharField | Semester name |
| academic_year | CharField | Academic year (e.g., 2025/2026) |
| enrollment_date | DateField | Date enrolled |
| status | CharField | ENROLLED, COMPLETED, DROPPED, FAILED |
| grade | CharField | A, B, C, D, F, I, W |
| grade_point | Decimal(3,2) | Grade point (0.00-4.00) |

**Grade Options:**
- **A** - 4.0
- **B** - 3.0
- **C** - 2.0
- **D** - 1.0
- **F** - 0.0 (Fail)
- **I** - Incomplete
- **W** - Withdrawn

---

### 3. **Attendance Model**

**Table:** `students_attendance`

**Fields:**
| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary Key |
| student | ForeignKey | Student reference |
| course_offering | ForeignKey | Course offering reference |
| date | DateField | Attendance date |
| status | CharField | PRESENT, ABSENT, LATE, EXCUSED |
| marked_by | ForeignKey | User who marked attendance |
| remarks | TextField | Additional notes |

**Status Options:**
- **PRESENT** - Student attended
- **ABSENT** - Student did not attend
- **LATE** - Student came late
- **EXCUSED** - Absence was excused

---

## 🖥️ Frontend Pages

### Page Structure

```
frontend/app/(academic)/students/
├── add-others/page.tsx          # Add part-time/distance/special students
├── class-list/page.tsx          # Generate class lists
├── delete/page.tsx              # Delete student records
├── halls/page.tsx               # Manage accommodation halls
├── promotions/page.tsx          # Student level promotions
├── reset-others/page.tsx        # Reset other student accounts
└── reset-password/page.tsx      # Reset student passwords
```

### Related Pages

```
frontend/app/
├── (dashboard)/student-portal/
│   ├── dashboard/page.tsx       # Student dashboard
│   ├── profile/page.tsx         # Student profile
│   └── payments/page.tsx        # Student payments
├── (administrative)/
│   └── student-id-cards/page.tsx # Generate student ID cards
└── (system)/reports/
    ├── students/page.tsx         # Student reports
    ├── students-list/page.tsx    # Student list reports
    └── student-fees/page.tsx     # Student fees reports
```

---

## ⚙️ Common Operations

### 1. **Create a New Student**

**API Request:**
```bash
POST /api/v1/students/students/
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "user": {
    "email": "john.doe@student.ebkustsl.edu.sl",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+23276123456",
    "gender": "MALE",
    "date_of_birth": "2005-01-15",
    "role": "STUDENT"
  },
  "campus": 1,
  "department": 1,
  "program": 1,
  "admission_date": "2026-09-01",
  "current_semester": 1,
  "guardian_name": "Jane Doe",
  "guardian_phone": "+23276987654",
  "guardian_email": "jane.doe@example.com",
  "blood_group": "O+",
  "address": "123 Main Street, Magburaka",
  "emergency_contact": "+23276555000"
}
```

**Note:** `student_id` is auto-generated in format: `{CampusCode}{Year}{Sequence}`

---

### 2. **Search Students**

**By Student ID:**
```bash
GET /api/v1/students/students/?search=12000
```

**By Name:**
```bash
GET /api/v1/students/students/?search=John
```

**By Department:**
```bash
GET /api/v1/students/students/?department=1
```

**Active Students Only:**
```bash
GET /api/v1/students/students/?enrollment_status=ACTIVE
```

**Combined Filters:**
```bash
GET /api/v1/students/students/?campus=1&department=1&enrollment_status=ACTIVE&current_semester=1
```

---

### 3. **Update Student Information**

**Full Update (PUT):**
```bash
PUT /api/v1/students/students/1/
Content-Type: application/json

{
  "campus": 1,
  "department": 1,
  "program": 1,
  "current_semester": 2,
  "enrollment_status": "ACTIVE",
  "gpa": 3.45,
  ...
}
```

**Partial Update (PATCH):**
```bash
PATCH /api/v1/students/students/1/
Content-Type: application/json

{
  "current_semester": 2,
  "gpa": 3.45
}
```

---

### 4. **Enroll Student in Course**

```bash
POST /api/v1/students/students/1/enroll_course/
Content-Type: application/json

{
  "course_offering_id": 1
}
```

**Validations:**
- Course offering must exist
- Student cannot be enrolled twice
- Course must not be full

---

### 5. **Bulk Enroll Multiple Students**

```bash
POST /api/v1/students/enrollments/bulk_enroll/
Content-Type: application/json

{
  "student_ids": [1, 2, 3, 4, 5],
  "course_offering_id": 1
}
```

---

### 6. **Mark Attendance**

**Single Student:**
```bash
POST /api/v1/students/attendance/
Content-Type: application/json

{
  "student": 1,
  "course_offering": 1,
  "date": "2026-03-28",
  "status": "PRESENT",
  "remarks": "On time"
}
```

**Bulk Mark Attendance:**
```bash
POST /api/v1/students/attendance/bulk_mark/
Content-Type: application/json

{
  "attendances": [
    {"student_id": 1, "course_offering_id": 1, "date": "2026-03-28", "status": "PRESENT"},
    {"student_id": 2, "course_offering_id": 1, "date": "2026-03-28", "status": "ABSENT"},
    {"student_id": 3, "course_offering_id": 1, "date": "2026-03-28", "status": "LATE"}
  ]
}
```

---

### 7. **Get Student Academic Records**

**Transcript:**
```bash
GET /api/v1/students/students/1/get_transcript/
```

**Enrollments:**
```bash
GET /api/v1/students/students/1/enrollments/
```

**Attendance Summary:**
```bash
GET /api/v1/students/students/1/attendance_summary/
```

---

### 8. **Update Enrollment Grade**

```bash
PATCH /api/v1/students/enrollments/1/
Content-Type: application/json

{
  "grade": "A",
  "grade_point": 4.00,
  "status": "COMPLETED"
}
```

---

## 🔒 Permissions & Access Control

### Role-Based Access

| Feature | SUPER_ADMIN | ADMIN | REGISTRAR | LECTURER | STUDENT |
|---------|-------------|-------|-----------|----------|---------|
| Add Student | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Student | ✅ | ✅ | ✅ | ❌ | Own Only |
| Delete Student | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Students | ✅ | ✅ | ✅ | ✅ | Own Only |
| Enroll Course | ✅ | ✅ | ✅ | ❌ | Own Only |
| Mark Attendance | ✅ | ✅ | ❌ | ✅ | ❌ |
| Update Grades | ✅ | ✅ | ❌ | ✅ | ❌ |
| Promote Students | ✅ | ✅ | ✅ | ❌ | ❌ |
| Reset Password | ✅ | ✅ | ✅ | ❌ | ❌ |

---

## 📊 Reports & Analytics

### Available Student Reports

1. **Student List Report** - `/reports/students-list`
   - Complete list of all students
   - Filter by campus, department, program
   - Export to Excel/PDF

2. **Student Fees Report** - `/reports/student-fees`
   - Outstanding fees
   - Payment history
   - Fee structure

3. **Registered Students** - `/reports/registered-students`
   - Current semester registrations
   - Course enrollments
   - Registration status

4. **Verify Student** - `/reports/verify-student`
   - Student verification
   - Enrollment confirmation
   - Academic status

---

## 🎯 Best Practices

### 1. **Student Registration**
- Always verify student information before submission
- Ensure guardian contact details are accurate
- Collect emergency contact information
- Document medical conditions

### 2. **Enrollment Management**
- Check course prerequisites before enrollment
- Verify course capacity
- Ensure no schedule conflicts
- Monitor credit hour limits

### 3. **Attendance Tracking**
- Mark attendance consistently
- Use EXCUSED status for valid absences
- Add remarks for unusual circumstances
- Generate attendance reports regularly

### 4. **Data Security**
- Limit access to sensitive student data
- Use proper authentication
- Log all administrative actions
- Regular backups

### 5. **Academic Progression**
- Review GPA before promotions
- Check course completion
- Handle probation cases separately
- Document all academic actions

---

## 🐛 Troubleshooting

### Common Issues

**1. Student ID Not Generated**
```
Error: Student ID is required
Solution: Ensure campus is selected - ID auto-generates based on campus code
```

**2. Enrollment Failed - Course Full**
```
Error: Course offering is full
Solution: Check course max_students and enrolled_count
```

**3. Cannot Update Student**
```
Error: Permission denied
Solution: Ensure you have ADMIN or REGISTRAR role
```

**4. Attendance Already Marked**
```
Error: Attendance record already exists
Solution: Use PATCH to update existing attendance
```

---

## 📞 Support & Additional Resources

### Documentation
- **API Documentation:** http://localhost:8000/api/docs
- **Schema:** http://localhost:8000/api/schema/swagger-ui/
- **Admin Panel:** http://localhost:8000/admin

### Database Access
```bash
# Connect to database
psql -U postgres -d university_lms

# View students
SELECT * FROM students_student LIMIT 10;

# View enrollments
SELECT * FROM students_enrollment LIMIT 10;
```

### Useful Commands
```bash
# Django shell
cd backend
python manage.py shell

# Get student count
from apps.students.models import Student
Student.objects.count()

# Get active students
Student.objects.filter(enrollment_status='ACTIVE').count()
```

---

## 📝 Change Log

**Version 1.0 - March 2026**
- Initial student management system
- Student CRUD operations
- Enrollment management
- Attendance tracking
- Student promotions
- Accommodation management
- Password reset functionality
- Bulk operations support

---

**© 2026 EBKUST (Ernest Bai Koroma University of Science and Technology)**
**All rights reserved.**

**Last Updated:** March 28, 2026
