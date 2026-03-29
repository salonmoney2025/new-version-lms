# Tools & Commands Reference — EBKUST UMS

> **Purpose**: Detailed command reference for the project
> **Update**: When tools or commands change

---

## Project Management

### Start/Stop Services
```powershell
# Start all services (PostgreSQL + Backend + Frontend)
./START_SERVERS.ps1

# Stop all services
./STOP_SERVERS.ps1
```

### Check What's Running
```bash
# Check if services are running
netstat -ano | findstr "3000 5000 5432"

# Docker status
docker ps
```

---

## Backend Commands

### Installation & Setup
```bash
cd backend
npm install
```

### Database Operations
```bash
# Generate Prisma client (after schema changes)
npx prisma generate

# Create a new migration
npx prisma migrate dev --name descriptive_migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database
npx prisma db seed

# Open Prisma Studio (GUI for database)
npx prisma studio
```

### Development
```bash
# Start dev server (hot reload)
npm run dev

# Start production server
npm start

# Run linting
npm run lint
```

### Common Prisma Tasks
```bash
# After changing schema.prisma, always run:
npx prisma generate && npx prisma migrate dev

# To introspect existing database:
npx prisma db pull

# To push schema without creating migration:
npx prisma db push
```

---

## Frontend Commands

### Installation & Setup
```bash
cd frontend
npm install
```

### Development
```bash
# Start dev server (hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Run type checking
npm run type-check
```

### Common Next.js Tasks
```bash
# Clear Next.js cache
rm -rf .next

# Check bundle size
npm run build && npm run analyze

# Generate static site
npm run build && npm run export
```

---

## Database Commands

### PostgreSQL (Direct Access)
```bash
# Connect to database
psql -U postgres -d university_db

# Common SQL queries
\dt                    # List tables
\d table_name          # Describe table
\q                     # Quit

# Backup database
pg_dump -U postgres university_db > backup.sql

# Restore database
psql -U postgres university_db < backup.sql
```

---

## Docker Commands

### Basic Operations
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild services
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v
```

### Database in Docker
```bash
# Access PostgreSQL container
docker exec -it university-postgres psql -U postgres -d university_db

# Backup from container
docker exec university-postgres pg_dump -U postgres university_db > backup.sql

# Restore to container
docker exec -i university-postgres psql -U postgres university_db < backup.sql
```

---

## Git Commands

### Daily Workflow
```bash
# Check status
git status

# Stage changes
git add .

# Commit with message
git commit -m "feat: descriptive message"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main
```

### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature/branch-name

# Switch branches
git checkout branch-name

# Merge branch
git checkout main
git merge feature/branch-name

# Delete branch
git branch -d feature/branch-name
```

---

## Testing Commands

### Backend Testing
```bash
cd backend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Testing
```bash
cd frontend
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:e2e         # End-to-end tests
```

---

## Debugging Commands

### Check Logs
```bash
# Backend logs
cd backend && npm run dev

# Frontend logs
cd frontend && npm run dev

# Docker logs
docker-compose logs backend
docker-compose logs frontend
```

### Debug Modes
```bash
# Node.js debugging
node --inspect backend/src/index.js

# Next.js debugging (launch in VS Code)
# Use F5 with proper launch.json
```

---

## Performance & Optimization

### Frontend
```bash
# Analyze bundle size
cd frontend
npm run build
npm run analyze

# Check for unused dependencies
npx depcheck
```

### Database
```bash
# Check query performance in Prisma
npx prisma studio
# Then check "Query History"

# PostgreSQL query analysis
EXPLAIN ANALYZE SELECT * FROM users;
```

---

## Common Task Sequences

### Adding a New Feature
```bash
# 1. Create branch
git checkout -b feature/new-feature

# 2. Make changes to code

# 3. If database changes:
cd backend
npx prisma generate
npx prisma migrate dev --name add_new_feature

# 4. Test locally
npm run dev

# 5. Commit
git add .
git commit -m "feat: add new feature"

# 6. Push
git push origin feature/new-feature
```

### Fixing a Bug
```bash
# 1. Reproduce the bug locally

# 2. Fix the code

# 3. Test the fix

# 4. Commit
git add .
git commit -m "fix: description of bug fix"

# 5. Push
git push
```

### Updating Dependencies
```bash
# Check outdated packages
npm outdated

# Update specific package
npm update package-name

# Update all packages (careful!)
npm update

# Verify everything still works
npm run dev
npm run build
```

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key"
PORT=5000
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Start everything | `./START_SERVERS.ps1` |
| Stop everything | `./STOP_SERVERS.ps1` |
| Migrate database | `cd backend && npx prisma migrate dev` |
| Reset database | `cd backend && npx prisma migrate reset` |
| Backend dev | `cd backend && npm run dev` |
| Frontend dev | `cd frontend && npm run dev` |
| View database | `cd backend && npx prisma studio` |

---

**Last Updated**: 2026-03-27
