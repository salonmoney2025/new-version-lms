# Domain Context — EBKUST University

> **Purpose**: EBKUST-specific knowledge, terminology, processes, and business rules
> **Update**: When domain requirements change

---

## About EBKUST

**Ernest Bai Koroma University of Science and Technology**
- Location: Sierra Leone
- Type: Public university focused on science and technology
- Website: https://portal.ebkustsl.edu.sl

---

## Organizational Structure

### Academic Hierarchy
```
University
├── Campuses (multiple locations)
│   ├── Faculties (e.g., Engineering, Sciences, Business)
│   │   ├── Departments (e.g., Computer Science, Electrical Engineering)
│   │   │   ├── Programs (Degree programs)
│   │   │   │   ├── Courses
```

### User Roles & Permissions

| Role | Responsibilities | Access Level |
|------|-----------------|--------------|
| **System Admin** | Full system control, user management | Full access |
| **Registrar** | Academic records, enrollment, student management | Academic modules |
| **Bursar** | Financial operations, payments, receipts | Financial modules |
| **Dean** | Faculty oversight, academic policies | Faculty-level access |
| **HOD** | Department management, course approval | Department-level access |
| **Lecturer** | Teaching, grading, course content | Course-level access |
| **Student** | Course registration, payment, view grades | Self-service only |

---

## Academic Processes

### Student Enrollment Flow
1. Student submits online application
2. Registrar reviews and approves/rejects
3. Approved student receives admission letter
4. Student pays application fees
5. Student registers for courses
6. Bursar confirms payment
7. Student receives confirmation

### Payment Process
1. Student selects payment type (tuition, fees, etc.)
2. Student chooses bank and payment method
3. System generates payment invoice
4. Student makes payment (online or bank teller)
5. Bursar verifies payment
6. System generates official receipt
7. Student downloads receipt

### Course Registration
1. Student views available courses for their program
2. Student selects courses (within credit limits)
3. HOD/Dean approves course selection
4. Registration confirmed after payment
5. Student receives class schedule

---

## Examination Workflows (From Current Portal)

### 1. Exam Setup & Management
**URL Pattern**: `/Exam/examSetExams.aspx`, `/Exam/examEditSetExams.aspx`

**Workflow**:
1. Lecturer/HOD creates exam for a course
2. Sets exam details (type, date, time, venue, duration)
3. Defines total marks and passing marks
4. Adds exam instructions
5. System schedules the exam
6. Students can view exam timetable

**Key Fields**:
- Course offering
- Exam type (Midterm, Final, Quiz, Assignment)
- Date and time (start, end)
- Venue/location
- Duration (minutes)
- Total marks
- Passing marks
- Instructions/notes

### 2. Script Collection Tracking
**URL Pattern**: `/Exam/ScriptCollection.aspx`, `/Exam/ScriptCollectionList.aspx`

**Purpose**: Track physical exam answer scripts collected from students

**Workflow**:
1. After exam, collect physical answer scripts
2. Record number of scripts collected per exam
3. Track missing/absent students
4. Verify script count matches attendance
5. Assign scripts to markers/lecturers

**Key Data**:
- Exam ID
- Student ID
- Script collected (Yes/No)
- Collection date/time
- Collector name
- Notes (if script missing)

### 3. Grade Entry & Management
**URL Pattern**: `/Grades/EnterExamsGrades.aspx`, `/Grades/ViewExamGrades.aspx`

**Workflow**:
1. Lecturer receives marked scripts
2. Enters grades for each student
3. System validates marks (≤ total marks)
4. Calculates percentage automatically
5. Determines pass/fail status
6. Saves grades (draft state)
7. Reviews all grades before publishing

**Key Features**:
- Individual grade entry
- Bulk grade entry (copy-paste from Excel)
- Validation (marks ≤ total marks)
- Auto-calculation of percentage
- Pass/fail indicator
- Remarks/comments field

### 4. Grade Publishing
**URL Pattern**: `/Grades/PublishGrades.aspx`, `/Grades/ResetPublishGrades.aspx`

**Workflow**:
1. Lecturer completes all grade entries
2. Reviews grades for accuracy
3. Submits for approval (if required)
4. HOD/Dean approves grades
5. Registrar publishes grades
6. Students can now view results
7. System sends notifications to students

**States**:
- **Draft**: Grades entered, not visible to students
- **Pending Approval**: Submitted for review
- **Approved**: Verified by HOD/Dean
- **Published**: Visible to students
- **Reset**: Unpublish grades for corrections

### 5. Result Generation & Export
**URL Pattern**: `/Exam/GenerateResults.aspx`, `/Exam/ResultSpreadsheet.aspx`

**Capabilities**:
- Generate result slips (individual students)
- Generate result spreadsheets (entire class)
- Export to Excel/PDF
- Print result transcripts
- Generate semester GPA reports
- Generate cumulative CGPA reports

**Export Formats**:
- PDF (official result slips)
- Excel (grade sheets, analysis)
- CSV (data export)

### 6. Promotional Lists
**URL Pattern**: `/Exam/PromotionalList.aspx`, `/Exam/PromotionalListView.aspx`

**Purpose**: Determine which students qualify to move to next level

**Criteria**:
- Passed all required courses
- Achieved minimum CGPA (typically 2.0)
- Completed required credits
- No outstanding fees
- No disciplinary issues

**Workflow**:
1. System calculates semester results
2. Determines students meeting promotion criteria
3. Generates promotional list
4. Dean/Registrar reviews and approves
5. Students promoted to next level
6. System updates student records

**List Includes**:
- Student ID and name
- Current level/year
- Semester GPA
- Cumulative CGPA
- Total credits earned
- Promotion status (Promoted, On Probation, Repeat, Withdrawn)

### 7. Graduation Lists
**URL Pattern**: `/MgtGraduation/AddGraduationList.aspx`, `/MgtGraduation/ViewGraduationList.aspx`

**Purpose**: Identify students eligible for graduation

**Criteria**:
- Completed all required courses
- Achieved minimum CGPA for degree classification
- Completed total credit requirement
- No outstanding fees
- No pending disciplinary cases
- Satisfied all program requirements

**Degree Classifications** (Sierra Leone System):
- **First Class Honours**: CGPA ≥ 3.70
- **Second Class Honours (Upper)**: CGPA 3.00 - 3.69
- **Second Class Honours (Lower)**: CGPA 2.50 - 2.99
- **Third Class Honours**: CGPA 2.00 - 2.49
- **Pass**: CGPA 1.50 - 1.99

**Workflow**:
1. System identifies students completing final semester
2. Calculates final CGPA
3. Determines degree classification
4. Generates graduation list
5. Registrar reviews and verifies
6. Senate approves graduation list
7. Students cleared for graduation ceremony

### 8. Semester Registration
**URL Pattern**: `/StudentMgt/SemesterRegistration.aspx`

**Purpose**: Register students for new semester

**Workflow**:
1. Student logs in during registration period
2. Views courses for current level/semester
3. Selects courses (respecting credit limits)
4. System validates prerequisites
5. Student submits registration
6. HOD approves registration
7. Student pays fees
8. Registration confirmed

### 9. Batch Transfer
**URL Pattern**: `/StudentMgt/BatchTransfer.aspx`

**Purpose**: Move multiple students between programs/levels

**Use Cases**:
- Transfer students to next level after promotion
- Move students between program tracks
- Batch reclassification
- Cohort management

**Workflow**:
1. Admin selects students to transfer
2. Specifies destination (program/level)
3. System validates transfer eligibility
4. Preview transfer list
5. Confirm batch transfer
6. System updates all student records
7. Generates transfer report

### 10. Exam Certificates
**URL Pattern**: `/Exam/ExamsCertificates.aspx`

**Purpose**: Generate official examination certificates

**Types**:
- Course completion certificates
- Semester transcripts
- Provisional degree certificates
- Official transcripts with seal

---

## Financial Operations

### Bank Integration
- Multiple bank accounts per institution
- Bank-specific payment codes
- Real-time payment verification (planned)
- Manual verification (current)

### Payment Types
- Tuition fees
- Application fees
- Late registration fees
- Library fees
- Laboratory fees
- Examination fees
- Hostel fees
- ID card fees

### Receipt Management
- Unique receipt numbers
- Bursar digital signatures
- PDF generation for downloads
- Payment audit trail

---

## Academic Calendar

### Typical Semester Structure
- **Semester 1**: September - December
- **Break**: December - January
- **Semester 2**: January - May
- **Break**: May - June
- **Summer Session**: June - August (optional)

### Key Dates
- Course registration deadlines
- Add/Drop period
- Mid-term examinations
- Final examinations
- Grade submission deadlines
- Graduation ceremonies

---

## Data Terminology

### Student Information
- **Matriculation Number**: Unique student identifier (e.g., EBK/2024/CS/001)
- **Program Code**: Degree program identifier
- **Academic Year**: Current year of study (Year 1, 2, 3, 4)
- **Level**: Same as academic year
- **Semester**: Current semester enrollment (Semester 1 or 2)
- **CGPA**: Cumulative Grade Point Average (0.00 - 4.00)
- **GPA**: Grade Point Average for single semester

### Course Information
- **Course Code**: Unique course identifier (e.g., CSC101)
- **Credit Hours**: Number of credits (typically 1-4)
- **Prerequisites**: Required prior courses
- **Corequisites**: Concurrent required courses
- **Course Offering**: Specific instance of course in a semester

### Examination Information
- **Script**: Physical exam answer booklet
- **Continuous Assessment (CA)**: Ongoing evaluation (quizzes, assignments)
- **Final Exam**: End of semester examination
- **Total Score**: CA + Final Exam
- **Grade Letter**: A, B+, B, C+, C, D, F
- **Grade Point**: Numerical value for GPA calculation

### Grading Scale
| Letter | Grade Points | Percentage | Description |
|--------|-------------|------------|-------------|
| A | 4.00 | 80-100% | Excellent |
| B+ | 3.50 | 75-79% | Very Good |
| B | 3.00 | 70-74% | Good |
| C+ | 2.50 | 65-69% | Fairly Good |
| C | 2.00 | 60-64% | Fair |
| D | 1.50 | 50-59% | Pass |
| F | 0.00 | 0-49% | Fail |

---

## Business Rules

### Payment Rules
- All fees must be paid before course registration is finalized
- Late payments incur penalty fees (typically 10%)
- Refunds require Dean approval
- Payment receipts are non-transferable

### Academic Rules
- **Minimum CGPA**: 2.0 to remain in good standing
- **Probation**: CGPA 1.50 - 1.99
- **Dismissal**: CGPA < 1.50 for two consecutive semesters
- **Maximum course load**: 24 credit hours per semester
- **Minimum course load**: 12 credit hours (full-time)
- **Prerequisites**: Must be satisfied before course registration
- **Attendance**: Minimum 75% required to sit for exams
- **Resit**: Failed courses can be retaken once

### Examination Rules
- **Grade Submission Deadline**: 2 weeks after exam
- **Result Publishing**: Within 3 days of submission
- **Grade Appeal**: Within 1 week of result publication
- **Resit Fee**: 50% of course fee
- **Script Collection**: Must be tracked for auditing
- **Malpractice**: Automatic failure + disciplinary action

### Promotion Rules
- **Pass**: All courses with grade ≥ D
- **Promoted**: CGPA ≥ 2.0 + all required courses passed
- **On Probation**: CGPA 1.50-1.99
- **Repeat Level**: CGPA < 1.50 or failed core courses
- **Carryover**: Can progress with ≤ 2 failed elective courses

---

## Integration Points

### Current Integrations
- PostgreSQL/SQLite database
- Email system (planned)
- SMS gateway (planned)
- Payment gateways (planned)

### Future Integrations
- Student portal mobile app
- Biometric attendance system
- Online examination platform
- Library management system
- HR payroll system

---

## Common Workflows

### Complete Examination Cycle
```
1. Exam Setup → 2. Student Registration → 3. Exam Timetable
   ↓
4. Conduct Exam → 5. Script Collection → 6. Grade Entry
   ↓
7. Grade Approval → 8. Grade Publishing → 9. Result Notification
   ↓
10. Promotional List → 11. Level Transfer → 12. Graduation List
```

### Grade Management Flow
```
Draft → Pending Approval → Approved → Published
                                        ↓
                                   Can Reset
                                        ↓
                                   Back to Draft
```

---

## Performance Considerations

### Peak Usage Times
- **Course registration periods** (very high load)
- **Result checking** (high load)
- **Payment deadlines** (high load)
- **Exam periods** (moderate load)

### Scalability Requirements
- Support 10,000+ active students
- Handle 500+ concurrent result checks
- Process 1,000+ grade entries per day
- Generate 100+ transcripts simultaneously

---

**Last Updated**: 2026-03-27
**Domain Expert**: Wisdom (Project Owner)
**Based On**: EBKUST Portal Analysis
