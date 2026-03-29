# 🎓 EBKUST University Management System

Ernest Bai Koroma University of Science and Technology - Complete University Portal System

A comprehensive, scalable Learning Management System built for modern universities with multi-campus support.

---

## 🚀 Quick Start - Starting & Stopping Servers

### Starting All Servers (PowerShell)

**Option 1: Using PowerShell Script**
```powershell
# Navigate to project root
cd C:\Users\Wisdom\source\repos\UNIVERSITY

# Start both backend and frontend servers
.\START_SERVERS.ps1
```

**Option 2: Manual Start - Backend Server**
```powershell
# Open PowerShell terminal 1
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py runserver
```

**Option 3: Manual Start - Frontend Server**
```powershell
# Open PowerShell terminal 2
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend
npm run dev
```

---

### Stopping All Servers (PowerShell)

**Option 1: Using PowerShell Script**
```powershell
# Navigate to project root
cd C:\Users\Wisdom\source\repos\UNIVERSITY

# Stop all running servers
.\STOP_SERVERS.ps1
```

**Option 2: Manual Stop - Press Ctrl+C in Each Terminal**
- In the backend terminal: Press `Ctrl + C`
- In the frontend terminal: Press `Ctrl + C`

**Option 3: Force Kill All Servers**
```powershell
# Kill all Python processes (Backend Django server)
taskkill /F /IM python.exe

# Kill all Node.js processes (Frontend Next.js server)
taskkill /F /IM node.exe
```

**Option 4: Kill Specific Port Processes**
```powershell
# Kill backend server on port 8000
netstat -ano | findstr :8000
taskkill /F /PID <PID>

# Kill frontend server on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

---

## 🌐 Access URLs

Once servers are running, access the application at:

- **Frontend (Main Portal):** http://localhost:3000
- **Backend API:** http://localhost:8000
- **Django Admin Panel:** http://localhost:8000/admin
- **API Documentation:** http://localhost:8000/api/docs

---

## 📋 System Requirements

- **Python:** 3.11 or higher
- **Node.js:** 18.0 or higher
- **PostgreSQL:** 14+ (for production) or SQLite (for development)
- **Redis:** 7+ (optional, for caching)
- **PowerShell:** 5.1+ (Windows)

---

## 🔧 First Time Setup

### 1. Backend Setup (Django)

```powershell
# Navigate to backend directory
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend

# Install Python dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create superuser account
python manage.py createsuperuser

# Seed initial system data (campuses, faculties, departments, courses)
python manage.py seed_system_settings
```

### 2. Frontend Setup (Next.js)

```powershell
# Navigate to frontend directory
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend

# Install Node.js dependencies
npm install

# Optional: Build for production
npm run build
```

---

## 🛠️ Useful PowerShell Commands

### Backend Commands (Django)

```powershell
# Navigate to backend
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend

# Run development server
python manage.py runserver

# Create new migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Seed system settings data
python manage.py seed_system_settings

# Collect static files
python manage.py collectstatic

# Open Django shell
python manage.py shell

# Run tests
python manage.py test
```

### Frontend Commands (Next.js)

```powershell
# Navigate to frontend
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Clear Next.js cache
rm -r .next
```

---

## 🏗️ Project Structure

```
UNIVERSITY/
├── backend/                    # Django REST Framework Backend
│   ├── apps/                  # Django Applications
│   │   ├── authentication/    # User authentication & RBAC
│   │   ├── campuses/          # Multi-campus management
│   │   ├── students/          # Student records
│   │   ├── staff/             # Staff management
│   │   ├── courses/           # Course management
│   │   ├── exams/             # Examination system
│   │   ├── finance/           # Finance & payments
│   │   ├── communications/    # SMS & email system
│   │   ├── analytics/         # Dashboard analytics
│   │   └── ...
│   ├── config/                # Django settings
│   │   └── settings/          # Environment-specific settings
│   ├── manage.py              # Django management script
│   └── requirements.txt       # Python dependencies
│
├── frontend/                   # Next.js 14 Frontend
│   ├── app/                   # Next.js App Directory
│   │   ├── (auth)/            # Authentication pages (login, register)
│   │   ├── (dashboard)/       # Dashboard pages
│   │   ├── (system)/          # System settings pages
│   │   │   └── system-settings/
│   │   │       ├── add-campus/
│   │   │       ├── manage-campuses/
│   │   │       ├── manage-faculties/
│   │   │       ├── manage-departments/
│   │   │       ├── add-course/
│   │   │       ├── course-rollover/
│   │   │       ├── manage-signatures/
│   │   │       └── sms-templates/
│   │   └── api/               # Next.js API routes
│   ├── components/            # React components
│   ├── lib/                   # Utilities & API client
│   ├── package.json           # Node dependencies
│   └── next.config.js         # Next.js configuration
│
├── START_SERVERS.ps1          # PowerShell script to start servers
├── STOP_SERVERS.ps1           # PowerShell script to stop servers
└── README.md                  # This file
```

---

## 📚 Technology Stack

### Backend
- **Framework:** Django 5.0 + Django REST Framework
- **Language:** Python 3.11+
- **Database:** PostgreSQL 15+ / SQLite (development)
- **Cache:** Redis 7+ (optional)
- **Task Queue:** Celery (optional)
- **Authentication:** JWT (Simple JWT)

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **Forms:** React Hook Form
- **HTTP Client:** Axios

---

## 📋 Core Features

### ✅ Implemented Features

#### System Settings
- Add Campus
- Manage Campuses
- Manage Faculties
- Manage Departments
- Add Course
- Course Rollover (semester-to-semester)
- Manage Digital Signatures
- SMS Templates Management

#### Student Management
- Student Registration
- Enrollment Management
- Academic Records
- Transcript Generation

#### Finance Management
- Payment Processing
- Receipt Generation
- Financial Reports
- Payment Verification

#### Communications
- SMS Notifications (template-based)
- Email Alerts
- Official Letter Generation
- Digital Signature Management

#### Analytics & Reports
- Dashboard Statistics
- Campus Analytics
- Student Reports
- Financial Reports

---

## 🔐 Default Login Credentials

After initial setup, login with:

**Method 1: Create via PowerShell**
```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
python manage.py createsuperuser
# Follow the prompts to create your admin account
```

**Method 2: Use pre-seeded accounts** (if available)
```
Email: admin@ebkust.edu.sl
Password: (set during createsuperuser)
```

---

## 📊 Seeded Data

After running `python manage.py seed_system_settings`, you'll have:

- **4 Campuses:** Main Campus (Magburaka), Freetown Campus, Bo Campus
- **8 Faculties:** Engineering, Science, Business, Social Sciences, etc.
- **17 Departments:** Computer Science, Electrical Engineering, Civil Engineering, etc.
- **27 Courses:** CSC101, EE101, ACC101, etc.
- **7 SMS Templates:** Admission, Payment, Exam, Registration, Results, etc.
- **4 Official Signatures:** Vice Chancellor, Registrar, Dean, Campus Admin

---

## 🐛 Troubleshooting

### Port Already in Use

**Check what's using the port:**
```powershell
# Backend port 8000
netstat -ano | findstr :8000

# Frontend port 3000
netstat -ano | findstr :3000
```

**Kill the process:**
```powershell
# Replace <PID> with actual Process ID from above command
taskkill /F /PID <PID>
```

### Module Not Found / Dependencies Missing

```powershell
# Backend - Reinstall Python packages
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend
pip install -r requirements.txt

# Frontend - Reinstall Node packages
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend
npm install
```

### Database Connection Error

**Check PostgreSQL is running:**
```powershell
# Check PostgreSQL service status
Get-Service -Name postgresql*

# Start PostgreSQL if stopped
Start-Service postgresql-x64-14
```

**For SQLite (development):**
- Database file should be at `backend/db.sqlite3`
- If missing, run: `python manage.py migrate`

### CORS Error (Frontend can't reach Backend)

Check `backend/config/settings/base.py`:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
CORS_ALLOW_CREDENTIALS = True
```

### Authentication Issues

**Logout and login again** to refresh tokens:
1. Logout from frontend
2. Login again
3. This will fetch fresh Django JWT tokens

---

## 🔄 Database Management

### Reset Backend Database (Development Only)

```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\backend

# Option 1: Delete and recreate (SQLite)
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_system_settings

# Option 2: PostgreSQL reset
python manage.py flush
python manage.py migrate
python manage.py createsuperuser
python manage.py seed_system_settings
```

### Reset Frontend Database (Development Only)

```powershell
cd C:\Users\Wisdom\source\repos\UNIVERSITY\frontend

# Delete Prisma database
rm prisma/dev.db

# Reset migrations
npx prisma migrate reset
npx prisma db push
```

---

## 📝 Recent Updates

### March 24, 2026 - Authentication & Seed Data Fix
- ✅ Fixed dual authentication system (Next.js + Django JWT)
- ✅ Django tokens now properly stored in localStorage
- ✅ All System Settings API calls authenticated correctly
- ✅ Added comprehensive seed data command
- ✅ Created 4 campuses, 8 faculties, 17 departments, 27 courses
- ✅ Added 7 SMS templates and 4 official signatures

### March 23, 2026 - System Settings Implementation
- ✅ Complete campus management system
- ✅ Faculty and department management
- ✅ Course management with rollover feature
- ✅ SMS template system with dynamic placeholders
- ✅ Digital signature management with image upload

---

## 📞 Support & Documentation

- **Backend API Docs:** http://localhost:8000/api/docs (when server is running)
- **Django Admin:** http://localhost:8000/admin
- **Project Documentation:** `documentation/` folder (21+ docs)

---

## 📄 License

© 2026 EBKUST (Ernest Bai Koroma University of Science and Technology). All rights reserved.

---

**Built with ❤️ for modern universities**

**Last Updated:** March 24, 2026
