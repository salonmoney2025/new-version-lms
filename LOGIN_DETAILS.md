# 🔐 UNIVERSITY LMS - LOGIN DETAILS

**Ernest Bai Koroma University of Science and Technology**
**Complete Login Credentials & Access Information**

---

## 🌐 Access URLs

### Main Application URLs
- **Frontend Portal:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Django Admin Panel:** http://localhost:8000/admin
- **API Documentation:** http://localhost:8000/api/docs
- **API Swagger:** http://localhost:8000/api/schema/swagger-ui/

---

## 🗄️ Database Credentials

### PostgreSQL Database
```
Database Name: university_lms
Username: postgres
Password: postgres123
Host: postgres (Docker) / localhost (Local)
Port: 5432
Connection URL: postgresql://postgres:postgres123@postgres:5432/university_lms
```

### Database Access Commands
```powershell
# Connect via psql
psql -U postgres -d university_lms

# Using full path (Windows)
"C:/PostgreSQL/18/bin/psql.exe" -U postgres -d university_lms
```

---

## 👤 Super Admin Accounts

### Super Admin 1
```
Email: superadmin1@university.edu
Password: 12345
Name: Super Admin 1
Phone: +23276123456
Gender: Male
Role: SUPER_ADMIN
```

### Super Admin 2
```
Email: superadmin2@university.edu
Password: 12345
Name: Super Admin 2
Phone: +23276123457
Gender: Female
Role: SUPER_ADMIN
```

**Privileges:**
- Full system access
- Can manage all campuses
- Can create/modify all users
- Access to all modules
- System settings control
- Database management

---

## 👨‍🏫 Staff Member Accounts

### Staff Login Details
- **Total Staff:** 50 members
- **Email Format:** `firstname.lastname@ebkustsl.edu.sl`
- **Default Password:** `12345` (all staff)
- **Role:** LECTURER
- **Staff IDs:** STF12000 - STF12049

### Staff Designations
- Professor
- Associate Professor
- Senior Lecturer
- Lecturer
- Assistant Lecturer
- Head of Department
- Lab Technician

### Example Staff Accounts
```
Staff 1:
  Email: [firstname.lastname]@ebkustsl.edu.sl
  Password: 12345
  Staff ID: STF12000

Staff 2:
  Email: [firstname.lastname]@ebkustsl.edu.sl
  Password: 12345
  Staff ID: STF12001

... (50 total staff members)
```

**Staff Privileges:**
- Access to staff portal
- Course management
- Student grading
- Attendance marking
- Department resources

---

## 🎓 Student Accounts

### Student Login Details
- **Total Students:** 100 students
- **Email Format:** `firstname.lastname###@student.ebkustsl.edu.sl`
- **Default Password:** `12345` (all students)
- **Role:** STUDENT
- **Matriculation Numbers:** 12000 - 12099

### Student Login Options
Students can login using either:
1. **Email Address:** firstname.lastname###@student.ebkustsl.edu.sl
2. **Matriculation Number:** 12000 - 12099

### Example Student Accounts
```
Student 1:
  Email: [firstname.lastname]@student.ebkustsl.edu.sl
  Password: 12345
  Matric No: 12000

Student 2:
  Email: [firstname.lastname]@student.ebkustsl.edu.sl
  Password: 12345
  Matric No: 12001

Student 100:
  Email: [firstname.lastname]@student.ebkustsl.edu.sl
  Password: 12345
  Matric No: 12099
```

**Student Privileges:**
- Student portal access
- Course registration
- View grades & transcripts
- Payment records
- Academic calendar
- Library access

---

## 🏫 Campus & Academic Structure

### Campus Details
```
Campus Code: EBKUST
Campus Name: Ernest Bai Koroma University of Science and Technology
Location: Main Campus, Magburaka
City: Magburaka
State: Tonkolili District
Country: Sierra Leone
Phone: +23276555000
Email: info@ebkustsl.edu.sl
```

### Faculties (4 Total)
1. **Faculty of Engineering (FOE)**
2. **Faculty of Science (FOS)**
3. **Faculty of Business Administration (FOBA)**
4. **Faculty of Education (FOED)**

### Departments (10 Total)
1. Computer Science (CS)
2. Electrical Engineering (EE)
3. Civil Engineering (CE)
4. Mathematics (MATH)
5. Physics (PHY)
6. Chemistry (CHEM)
7. Accounting (ACC)
8. Management (MGT)
9. Educational Psychology (EDPSY)
10. Curriculum Studies (CURR)

### Programs (7 Total)
1. Bachelor of Computer Science (BCS) - 4 years
2. Bachelor of Electrical Engineering (BEE) - 4 years
3. Bachelor of Civil Engineering (BCE) - 4 years
4. Bachelor of Mathematics (BMATH) - 4 years
5. Bachelor of Accounting (BAC) - 4 years
6. Master of Computer Science (MCS) - 2 years
7. Diploma in Information Technology (DIT) - 2 years

### Courses (13+ Sample Courses)
- CS101 - Introduction to Programming
- CS201 - Data Structures and Algorithms
- CS301 - Database Systems
- CS401 - Software Engineering
- MATH101 - Calculus I
- MATH201 - Linear Algebra
- EE101 - Circuit Analysis
- ACC101 - Financial Accounting
- GEN101 - English Composition
- ... and more

---

## 🔧 System Configuration

### Environment Variables (.env)
```bash
# Database
POSTGRES_DB=university_lms
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
DATABASE_URL=postgresql://postgres:postgres123@postgres:5432/university_lms

# Django
SECRET_KEY=django-insecure-test-key-for-docker-development-only-change-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0,backend

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_APP_NAME=University LMS
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Redis
REDIS_URL=redis://redis:6379/0

# RabbitMQ
RABBITMQ_USER=guest
RABBITMQ_PASS=guest
```

---

## 🚀 Quick Start Commands

### Starting Servers

**Option 1: PowerShell Script (Recommended)**
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY
.\START_SERVERS.ps1
```

**Option 2: Manual Start**
```powershell
# Terminal 1 - Backend
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py runserver

# Terminal 2 - Frontend
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend
npm run dev
```

### Stopping Servers

**Option 1: PowerShell Script**
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY
.\STOP_SERVERS.ps1
```

**Option 2: Force Kill**
```powershell
# Kill backend
taskkill /F /IM python.exe

# Kill frontend
taskkill /F /IM node.exe
```

---

## 🗃️ Database Management

### Create Superuser
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py createsuperuser
```

### Seed Database with Test Data
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend

# Seed data (keeps existing data)
python manage.py seed_database

# Flush existing data and reseed
python manage.py seed_database --flush
```

### Run Migrations
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py makemigrations
python manage.py migrate
```

### Seed System Settings
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py seed_system_settings
```

---

## 🔑 API Authentication

### JWT Token Authentication

**Login Endpoint:**
```
POST http://localhost:8000/api/v1/auth/login/
Content-Type: application/json

{
  "email": "superadmin1@university.edu",
  "password": "12345"
}
```

**Response:**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "superadmin1@university.edu",
    "role": "SUPER_ADMIN",
    "first_name": "Super",
    "last_name": "Admin 1"
  }
}
```

**Using Access Token:**
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

---

## 📱 Test User Roles & Permissions

### Role Hierarchy
1. **SUPER_ADMIN** - Full system access
2. **ADMIN** - Campus-wide administration
3. **CAMPUS_ADMIN** - Campus-specific management
4. **REGISTRAR** - Student records & enrollment
5. **FINANCE_OFFICER** - Financial operations
6. **DEAN** - Faculty-level management
7. **HOD** - Department management
8. **LECTURER** - Course teaching & grading
9. **PART_TIME_LECTURER** - Limited teaching access
10. **STUDENT** - Student portal access
11. **PARENT** - View student progress
12. **LIBRARIAN** - Library management

---

## 🧪 Testing Credentials Summary

### Quick Reference Table

| User Type | Email | Password | ID/Matric |
|-----------|-------|----------|-----------|
| Super Admin 1 | superadmin1@university.edu | 12345 | - |
| Super Admin 2 | superadmin2@university.edu | 12345 | - |
| Staff (50) | firstname.lastname@ebkustsl.edu.sl | 12345 | STF12000-STF12049 |
| Students (100) | firstname.lastname###@student.ebkustsl.edu.sl | 12345 | 12000-12099 |

---

## 🛡️ Security Notes

### Development Environment
- All passwords are set to `12345` for easy testing
- DEBUG mode is enabled
- CORS is configured for localhost
- JWT tokens expire after 60 minutes

### Production Deployment
**IMPORTANT: Before deploying to production:**
1. Change all default passwords
2. Generate new SECRET_KEY and JWT_SECRET_KEY
3. Set DEBUG=False
4. Update ALLOWED_HOSTS
5. Configure HTTPS
6. Set SESSION_COOKIE_SECURE=True
7. Set CSRF_COOKIE_SECURE=True
8. Use strong database passwords
9. Enable proper CORS restrictions
10. Configure production-grade database

---

## 📞 Support Information

### System Administration
- **Email:** admin@ebkustsl.edu.sl
- **Phone:** +23276555000
- **Location:** Main Campus, Magburaka

### Technical Support
- **Backend API Docs:** http://localhost:8000/api/docs
- **Django Admin:** http://localhost:8000/admin
- **Documentation Folder:** `/documentation` (21+ docs)

---

## 📝 Recent Updates

**Last Updated:** March 28, 2026

**What's Included:**
- ✅ 2 Super Admin accounts
- ✅ 50 Staff member accounts
- ✅ 100 Student accounts (Matric: 12000-12099)
- ✅ 4 Campuses with faculties and departments
- ✅ 7 Academic programs
- ✅ 13+ Courses with offerings
- ✅ Complete authentication system
- ✅ Role-based access control (RBAC)

---

## 🔄 Password Reset

If you forget a password or need to reset:

```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py shell

# In Python shell:
from apps.authentication.models import User
user = User.objects.get(email='superadmin1@university.edu')
user.set_password('12345')
user.save()
exit()
```

---

**© 2026 EBKUST (Ernest Bai Koroma University of Science and Technology)**
**All rights reserved.**

---

**Built with ❤️ for modern universities**
