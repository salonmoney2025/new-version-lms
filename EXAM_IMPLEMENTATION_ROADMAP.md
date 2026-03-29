# Examination System Implementation Roadmap — EBKUST UMS

**Date**: 2026-03-27
**Based On**: Real EBKUST Portal Analysis
**Priority**: High
**Timeline**: 8-10 weeks

---

## Overview

This roadmap implements a complete examination management system matching the existing EBKUST portal functionality, including:

✅ **10 Major Features** from the current portal
✅ **Comprehensive workflows** for exam lifecycle
✅ **Role-based access** for all user types
✅ **Full integration** with existing backend

---

## Features to Implement (From Current Portal)

### 1. Exam Setup & Management ⭐ Priority 1
**URLs**: `/Exam/examSetExams.aspx`, `/Exam/examEditSetExams.aspx`

**Backend Status**: ✅ Models exist, ❌ Need enhancements
**Frontend Status**: ❌ Need to build

**Requirements**:
- Create exam for a course offering
- Set exam type (Midterm, Final, Quiz, Assignment)
- Schedule date, time, venue
- Define marks (total, passing)
- Add instructions
- Edit existing exams
- Delete exams (with validation)

**Backend Updates Needed**:
```python
# Add to Exam model
venue = models.CharField(max_length=200, blank=True, null=True)
capacity = models.PositiveIntegerField(blank=True, null=True)
status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SCHEDULED')
invigilators = models.ManyToManyField('staff.Staff', blank=True)
```

**Frontend Pages**:
- `/examinations/exams` - List all exams
- `/examinations/exams/create` - Create new exam
- `/examinations/exams/[id]` - View exam details
- `/examinations/exams/[id]/edit` - Edit exam

---

### 2. Script Collection Tracking ⭐ Priority 2
**URLs**: `/Exam/ScriptCollection.aspx`, `/Exam/ScriptCollectionList.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Purpose**: Track physical exam answer scripts from students

**Requirements**:
- Record scripts collected per exam
- Track absent students
- Verify script count vs attendance
- Assign scripts to markers

**Backend - New Model**:
```python
class ScriptCollection(BaseModel):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    script_collected = models.BooleanField(default=False)
    collection_date = models.DateTimeField(null=True, blank=True)
    collected_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True)
    script_number = models.CharField(max_length=50, blank=True, null=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = [['exam', 'student']]
```

**Frontend Pages**:
- `/examinations/scripts` - List all script collections
- `/examinations/scripts/collect/[examId]` - Record script collection
- `/examinations/scripts/report/[examId]` - Collection report

---

### 3. Grade Entry & Management ⭐ Priority 1
**URLs**: `/Grades/EnterExamsGrades.aspx`, `/Grades/ViewExamGrades.aspx`, `/Grades/StudentAllGrades.aspx`

**Backend Status**: ✅ Models exist, ❌ Need enhancements
**Frontend Status**: ❌ Need to build

**Requirements**:
- Individual grade entry
- Bulk grade entry (Excel upload/paste)
- Validation (marks ≤ total marks)
- Auto-calculate percentage
- Show pass/fail indicator
- Add remarks
- Save as draft

**Backend Updates Needed**:
```python
# Add to Grade model
grade_letter = models.CharField(max_length=2, blank=True, null=True)
approval_status = models.CharField(max_length=20, default='DRAFT')
# DRAFT, PENDING_APPROVAL, APPROVED, PUBLISHED
approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_grades')
approved_date = models.DateTimeField(null=True, blank=True)
is_published = models.BooleanField(default=False)
published_date = models.DateTimeField(null=True, blank=True)
```

**New Model - Grade Scale**:
```python
class GradeScale(BaseModel):
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE)
    letter_grade = models.CharField(max_length=2)  # A, B+, B, C+, C, D, F
    min_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    max_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    grade_points = models.DecimalField(max_digits=3, decimal_places=2)
    description = models.CharField(max_length=50)

    class Meta:
        unique_together = [['program', 'letter_grade']]
```

**Frontend Pages**:
- `/examinations/grades/enter/[examId]` - Enter grades for exam
- `/examinations/grades/upload/[examId]` - Bulk upload grades
- `/examinations/grades/view/[examId]` - View all grades for exam
- `/students/grades` - Student view (their own grades)
- `/students/grades/all` - All grades for a student

---

### 4. Grade Publishing Workflow ⭐ Priority 1
**URLs**: `/Grades/PublishGrades.aspx`, `/Grades/ResetPublishGrades.aspx`

**Backend Status**: ❌ Need enhancements
**Frontend Status**: ❌ Need to build

**Workflow States**:
1. **Draft** - Grades entered, not visible to students
2. **Pending Approval** - Submitted for HOD/Dean review
3. **Approved** - Verified by HOD/Dean
4. **Published** - Visible to students, notifications sent
5. **Reset** - Unpublish for corrections

**Requirements**:
- Submit grades for approval
- Approve/reject grades (HOD/Dean)
- Publish approved grades
- Reset published grades
- Send notifications to students
- Track publishing history

**Frontend Pages**:
- `/examinations/grades/publish/[examId]` - Publish grades interface
- `/examinations/grades/approve/[examId]` - Approve grades (HOD/Dean)
- `/examinations/grades/reset/[examId]` - Reset published grades

---

### 5. Result Generation & Export ⭐ Priority 2
**URLs**: `/Exam/GenerateResults.aspx`, `/Exam/ResultSpreadsheet.aspx`, `/Exam/ExamsCertificates.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Capabilities**:
- Generate individual result slips (PDF)
- Generate class result spreadsheet (Excel)
- Generate semester transcripts (PDF)
- Generate CGPA reports
- Export data (CSV, Excel, PDF)

**Backend - New Utilities**:
```python
# backend/apps/exams/utils/pdf_generator.py
class ResultSlipGenerator:
    def generate_student_result(student_id, semester, academic_year)
    def generate_transcript(student_id)

# backend/apps/exams/utils/excel_generator.py
class ExcelExporter:
    def export_exam_grades(exam_id)
    def export_semester_results(semester, academic_year)
    def export_promotional_list(level, semester)
```

**Frontend Pages**:
- `/examinations/results/generate` - Result generation interface
- `/examinations/results/student/[studentId]` - Individual result
- `/examinations/results/class/[courseOfferingId]` - Class results
- `/examinations/results/semester/[semester]` - Semester results

**Libraries Needed**:
- **Backend**: `reportlab` or `weasyprint` (PDF), `openpyxl` (Excel)
- **Frontend**: `jspdf` or `react-pdf` (PDF), `xlsx` (Excel)

---

### 6. Promotional Lists ⭐ Priority 2
**URLs**: `/Exam/PromotionalList.aspx`, `/Exam/PromotionalListView.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Purpose**: Determine students eligible for level promotion

**Criteria**:
- CGPA ≥ 2.0
- All required courses passed
- Completed required credits
- No outstanding fees
- No disciplinary issues

**Promotion Status Categories**:
- **Promoted** - Move to next level
- **On Probation** - CGPA 1.50-1.99, can progress with restrictions
- **Repeat** - Failed required courses or CGPA < 1.50
- **Withdrawn** - Academic dismissal

**Backend - New Model**:
```python
class PromotionalList(BaseModel):
    semester = models.CharField(max_length=20)
    academic_year = models.CharField(max_length=9)
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE)
    level = models.IntegerField()  # Current level
    generated_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True)
    approved_date = models.DateTimeField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)
    students_data = models.JSONField(default=list)  # List of student promotions

class StudentPromotion(BaseModel):
    promotional_list = models.ForeignKey(PromotionalList, on_delete=models.CASCADE)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    current_level = models.IntegerField()
    cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    credits_earned = models.IntegerField()
    status = models.CharField(max_length=20)  # PROMOTED, PROBATION, REPEAT, WITHDRAWN
    remarks = models.TextField(blank=True, null=True)
    effective_date = models.DateField()
```

**Frontend Pages**:
- `/examinations/promotional/generate` - Generate promotional list
- `/examinations/promotional/[id]` - View promotional list
- `/examinations/promotional/[id]/approve` - Approve list

---

### 7. Graduation Lists ⭐ Priority 2
**URLs**: `/MgtGraduation/AddGraduationList.aspx`, `/MgtGraduation/ViewGraduationList.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Purpose**: Identify students eligible for graduation

**Degree Classifications** (Sierra Leone):
- First Class Honours: CGPA ≥ 3.70
- Second Class Honours (Upper): CGPA 3.00-3.69
- Second Class Honours (Lower): CGPA 2.50-2.99
- Third Class Honours: CGPA 2.00-2.49
- Pass: CGPA 1.50-1.99

**Backend - New Model**:
```python
class GraduationList(BaseModel):
    academic_year = models.CharField(max_length=9)
    program = models.ForeignKey('courses.Program', on_delete=models.CASCADE)
    ceremony_date = models.DateField()
    generated_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey('authentication.User', on_delete=models.SET_NULL, null=True)
    approved_date = models.DateTimeField(null=True, blank=True)
    is_approved = models.BooleanField(default=False)

class GraduatingStudent(BaseModel):
    graduation_list = models.ForeignKey(GraduationList, on_delete=models.CASCADE)
    student = models.ForeignKey('students.Student', on_delete=models.CASCADE)
    final_cgpa = models.DecimalField(max_digits=3, decimal_places=2)
    classification = models.CharField(max_length=50)
    total_credits = models.IntegerField()
    is_cleared = models.BooleanField(default=False)  # No outstanding fees/issues
    remarks = models.TextField(blank=True, null=True)
```

**Frontend Pages**:
- `/graduation/lists` - All graduation lists
- `/graduation/create` - Create graduation list
- `/graduation/[id]` - View graduation list
- `/graduation/[id]/approve` - Approve list

---

### 8. Semester Registration ⭐ Priority 3
**URLs**: `/StudentMgt/SemesterRegistration.aspx`

**Backend Status**: ⚠️ May exist partially
**Frontend Status**: ❌ Need to build

**Requirements**:
- Student selects courses for semester
- Validate prerequisites
- Respect credit limits (12-24 credits)
- HOD approval
- Payment confirmation
- Generate course schedule

**Frontend Pages**:
- `/students/registration` - Student course registration
- `/staff/registrations/approve` - HOD approval interface

---

### 9. Batch Transfer ⭐ Priority 3
**URLs**: `/StudentMgt/BatchTransfer.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Use Cases**:
- Promote students to next level (bulk)
- Transfer between programs
- Batch reclassification

**Frontend Pages**:
- `/students/batch-transfer` - Batch transfer interface

---

### 10. Exam Certificates ⭐ Priority 2
**URLs**: `/Exam/ExamsCertificates.aspx`

**Backend Status**: ❌ New feature
**Frontend Status**: ❌ Need to build

**Certificate Types**:
- Course completion certificates
- Semester transcripts
- Provisional degree certificates
- Official transcripts with seal

**Frontend Pages**:
- `/certificates/generate` - Generate certificates
- `/certificates/[id]` - View/download certificate

---

## Implementation Timeline (8-10 Weeks)

### Phase 1: Foundation (Week 1-2)
**Backend**:
- [ ] Update Exam model (venue, status, invigilators)
- [ ] Update Grade model (grade_letter, approval_status, published)
- [ ] Create GradeScale model
- [ ] Create ScriptCollection model
- [ ] Run migrations
- [ ] Create API endpoints for new fields

**Frontend**:
- [ ] Set up exam module structure
- [ ] Create shared components (tables, forms, modals)
- [ ] Set up API client functions
- [ ] Create reusable form validation schemas

### Phase 2: Core Exam Features (Week 3-4)
**Implement**:
- [ ] Exam Setup & Edit UI
- [ ] Exam List & Details pages
- [ ] Exam Schedule Calendar view
- [ ] Script Collection interface
- [ ] Script Collection reports

**Test**:
- [ ] Create exams with all fields
- [ ] Edit and delete exams
- [ ] Record script collections
- [ ] View collection reports

### Phase 3: Grading System (Week 5-6)
**Implement**:
- [ ] Grade Entry interface (table-based)
- [ ] Bulk grade upload (Excel)
- [ ] Grade validation logic
- [ ] Grade letter calculation
- [ ] Grade Publishing workflow
- [ ] Grade Approval interface (HOD/Dean)
- [ ] Reset published grades
- [ ] Student grade viewing

**Test**:
- [ ] Enter grades individually
- [ ] Upload bulk grades
- [ ] Submit for approval
- [ ] Approve/reject grades
- [ ] Publish grades
- [ ] Students see only published grades
- [ ] Reset and re-publish

### Phase 4: Results & Transcripts (Week 7)
**Implement**:
- [ ] Result slip PDF generation
- [ ] Transcript PDF generation
- [ ] Excel export for grades
- [ ] Result spreadsheet generation
- [ ] Batch PDF generation

**Libraries to Install**:
```bash
# Backend
pip install reportlab  # or weasyprint
pip install openpyxl

# Frontend
npm install jspdf jspdf-autotable
npm install xlsx
npm install react-pdf
```

**Test**:
- [ ] Generate individual result PDF
- [ ] Generate transcript PDF
- [ ] Export grades to Excel
- [ ] Generate class result sheet
- [ ] Batch generate results

### Phase 5: Promotional & Graduation (Week 8)
**Backend**:
- [ ] Create PromotionalList model
- [ ] Create StudentPromotion model
- [ ] Create GraduationList model
- [ ] Create GraduatingStudent model
- [ ] Create calculation logic for promotions
- [ ] Create degree classification logic

**Frontend**:
- [ ] Promotional list generation interface
- [ ] Promotional list approval
- [ ] Graduation list generation
- [ ] Graduation list approval
- [ ] Batch promotion execution

**Test**:
- [ ] Generate promotional lists
- [ ] Approve promotions
- [ ] Execute batch transfers
- [ ] Generate graduation lists
- [ ] Calculate degree classifications

### Phase 6: Additional Features (Week 9)
**Implement**:
- [ ] Semester Registration UI
- [ ] Batch Transfer UI
- [ ] Exam Certificates generation
- [ ] Statistics dashboards
- [ ] Analytics and reports

### Phase 7: Testing & Polish (Week 10)
**Test**:
- [ ] End-to-end exam lifecycle
- [ ] All user roles and permissions
- [ ] Edge cases and error handling
- [ ] Performance under load
- [ ] Mobile responsiveness

**Polish**:
- [ ] UI/UX improvements
- [ ] Loading states and error messages
- [ ] Accessibility improvements
- [ ] Documentation and help text

---

## Database Migrations Needed

```bash
cd backend

# 1. Update Exam model
python manage.py makemigrations -n add_exam_venue_status

# 2. Update Grade model
python manage.py makemigrations -n add_grade_publishing_workflow

# 3. Create GradeScale model
python manage.py makemigrations -n create_grade_scale

# 4. Create ScriptCollection model
python manage.py makemigrations -n create_script_collection

# 5. Create PromotionalList models
python manage.py makemigrations -n create_promotional_lists

# 6. Create GraduationList models
python manage.py makemigrations -n create_graduation_lists

# Apply all migrations
python manage.py migrate
```

---

## API Endpoints to Create

### Exam Management
```
GET    /api/exams/                    - List exams
POST   /api/exams/                    - Create exam
GET    /api/exams/{id}/               - Get exam details
PUT    /api/exams/{id}/               - Update exam
DELETE /api/exams/{id}/               - Delete exam
GET    /api/exams/{id}/schedule/      - Get exam schedule
```

### Script Collection
```
GET    /api/scripts/                  - List script collections
POST   /api/scripts/collect/          - Record script collection
GET    /api/scripts/exam/{exam_id}/   - Get collection for exam
GET    /api/scripts/report/{exam_id}/ - Get collection report
```

### Grade Management
```
GET    /api/grades/                   - List grades
POST   /api/grades/                   - Create grade
PUT    /api/grades/{id}/              - Update grade
POST   /api/grades/bulk/              - Bulk create/update
GET    /api/grades/exam/{exam_id}/    - Get grades for exam
POST   /api/grades/upload/            - Upload Excel grades
GET    /api/grades/export/{exam_id}/  - Export grades to Excel
```

### Grade Publishing
```
POST   /api/grades/submit-approval/   - Submit for approval
POST   /api/grades/approve/           - Approve grades (HOD/Dean)
POST   /api/grades/reject/            - Reject grades
POST   /api/grades/publish/           - Publish grades
POST   /api/grades/reset/             - Reset published grades
```

### Results & Transcripts
```
GET    /api/results/student/{id}/     - Get student results
GET    /api/results/semester/{id}/    - Get semester results
GET    /api/transcripts/student/{id}/ - Get student transcript
GET    /api/results/pdf/{student_id}/ - Generate result PDF
GET    /api/transcripts/pdf/{student_id}/ - Generate transcript PDF
```

### Promotional Lists
```
GET    /api/promotional-lists/        - List promotional lists
POST   /api/promotional-lists/generate/ - Generate promotional list
GET    /api/promotional-lists/{id}/   - Get promotional list
POST   /api/promotional-lists/{id}/approve/ - Approve list
POST   /api/promotional-lists/{id}/execute/ - Execute promotions
```

### Graduation Lists
```
GET    /api/graduation-lists/         - List graduation lists
POST   /api/graduation-lists/generate/ - Generate graduation list
GET    /api/graduation-lists/{id}/    - Get graduation list
POST   /api/graduation-lists/{id}/approve/ - Approve list
```

---

## Frontend Page Structure

```
/examinations
├── /dashboard                  - Overview & statistics
├── /exams
│   ├── /create                - Create new exam
│   ├── /[id]                  - Exam details
│   ├── /[id]/edit             - Edit exam
│   └── /[id]/scripts          - Script collection
├── /grades
│   ├── /enter/[examId]        - Enter grades
│   ├── /upload/[examId]       - Bulk upload
│   ├── /view/[examId]         - View grades
│   ├── /publish/[examId]      - Publish grades
│   └── /approve/[examId]      - Approve grades (HOD)
├── /results
│   ├── /generate              - Result generation
│   ├── /student/[id]          - Student result
│   └── /class/[offeringId]    - Class results
├── /promotional
│   ├── /generate              - Generate promotional list
│   ├── /[id]                  - View list
│   └── /[id]/approve          - Approve list
├── /graduation
│   ├── /generate              - Generate graduation list
│   ├── /[id]                  - View list
│   └── /[id]/approve          - Approve list
├── /certificates
│   └── /generate              - Generate certificates
└── /schedule                   - Exam calendar

/students
├── /grades                     - View own grades
├── /results                    - View results
├── /transcript                 - View transcript
└── /registration               - Course registration
```

---

## Component Library to Build

### Shared Components
```
components/exams/
├── ExamCard.tsx               - Display exam summary
├── ExamForm.tsx               - Create/edit exam form
├── ExamTable.tsx              - List of exams
├── ExamCalendar.tsx           - Calendar view
├── GradeEntryTable.tsx        - Editable grade table
├── GradeUploadModal.tsx       - Excel upload modal
├── ResultCard.tsx             - Display result summary
├── TranscriptView.tsx         - Display transcript
├── PromotionalListTable.tsx   - Promotional list display
└── GraduationListTable.tsx    - Graduation list display
```

---

## Testing Checklist

### Exam Setup
- [ ] Create exam with all required fields
- [ ] Create exam with optional venue and invigilators
- [ ] Edit existing exam
- [ ] Delete exam (verify cascading behavior)
- [ ] Duplicate exam
- [ ] Validate date/time constraints
- [ ] Validate marks constraints

### Script Collection
- [ ] Record script collection for students present
- [ ] Mark students absent
- [ ] Generate collection report
- [ ] Verify script count matches attendance

### Grade Entry
- [ ] Enter grades individually
- [ ] Upload grades via Excel
- [ ] Validate marks ≤ total marks
- [ ] Calculate percentage automatically
- [ ] Determine pass/fail correctly
- [ ] Save as draft
- [ ] Calculate grade letters

### Grade Publishing
- [ ] Submit grades for approval
- [ ] Approve grades (HOD/Dean)
- [ ] Reject grades with reason
- [ ] Publish approved grades
- [ ] Verify students can see published grades
- [ ] Verify students cannot see unpublished grades
- [ ] Reset published grades
- [ ] Send notifications on publish

### Results & Transcripts
- [ ] Generate individual result PDF
- [ ] Generate transcript PDF
- [ ] Export grades to Excel
- [ ] Generate class result sheet
- [ ] Verify PDF formatting and layout
- [ ] Verify data accuracy

### Promotional Lists
- [ ] Generate promotional list with correct criteria
- [ ] Correctly classify students (Promoted, Probation, Repeat)
- [ ] Calculate CGPA correctly
- [ ] Approve promotional list
- [ ] Execute batch promotions
- [ ] Verify student records updated

### Graduation Lists
- [ ] Generate graduation list
- [ ] Calculate degree classifications correctly
- [ ] Verify eligibility criteria
- [ ] Approve graduation list
- [ ] Generate graduation certificates

### Permissions
- [ ] Students can only view their own grades
- [ ] Lecturers can enter grades for their courses
- [ ] HODs can approve grades for their department
- [ ] Registrars can publish grades
- [ ] Admins have full access

---

## Success Criteria

### Functionality
- ✅ Complete exam lifecycle (setup → grading → publishing)
- ✅ Script collection tracking operational
- ✅ Grade publishing workflow with approvals
- ✅ Result and transcript generation
- ✅ Promotional and graduation lists
- ✅ All 10 features from current portal implemented

### Performance
- ✅ Grade entry for 100+ students completes in < 5s
- ✅ PDF generation completes in < 3s
- ✅ Excel export completes in < 5s
- ✅ Bulk operations handle 1000+ records

### Quality
- ✅ Zero unauthorized access to grade data
- ✅ Accurate GPA/CGPA calculations
- ✅ Correct degree classifications
- ✅ No data loss during bulk operations
- ✅ Audit trail for all grade changes

### User Experience
- ✅ Intuitive interfaces for all user roles
- ✅ Clear error messages and validation
- ✅ Mobile-responsive design
- ✅ Fast load times
- ✅ Helpful guidance and tooltips

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Grade calculation errors | High | Extensive unit tests, manual verification |
| Permission leaks | Critical | Strict permission checks, security audit |
| Data loss in bulk ops | High | Transactions, rollback on error, backups |
| Performance degradation | Medium | Database indexing, query optimization |
| PDF generation failures | Medium | Error handling, fallback to Excel |

---

## Next Steps

1. **Get Approval** - Review roadmap with stakeholders
2. **Start Phase 1** - Backend model updates
3. **Parallel Development** - Frontend foundation while backend completes
4. **Weekly Demos** - Show progress to stakeholders
5. **Iterative Testing** - Test each feature as completed
6. **Phased Rollout** - Deploy features incrementally

---

## Questions for Stakeholder

1. Which features are highest priority?
2. Are there any additional features not in the current portal?
3. What is the preferred timeline?
4. Who will be the primary testers?
5. When is the ideal launch date?

---

**Created**: 2026-03-27
**Author**: Claude (based on EBKUST portal analysis)
**Project**: EBKUST UMS
**Status**: Ready for Implementation

**Let's build this! 🚀**
