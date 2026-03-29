# Documentation References

Quick links to official documentation and useful resources.

---

## Tech Stack Documentation

### Backend
- **Node.js**: https://nodejs.org/docs/
- **Express**: https://expressjs.com/
- **Prisma**: https://www.prisma.io/docs/
- **PostgreSQL**: https://www.postgresql.org/docs/

### Frontend
- **Next.js 15**: https://nextjs.org/docs
- **React 19**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

### DevOps
- **Docker**: https://docs.docker.com/
- **Docker Compose**: https://docs.docker.com/compose/

---

## Key Guides

### Prisma
- [Prisma Schema](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Client API](https://www.prisma.io/docs/concepts/components/prisma-client)
- [Seeding](https://www.prisma.io/docs/guides/database/seed-database)

### Next.js
- [App Router](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
- [API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)

### Authentication
- [JWT.io](https://jwt.io/) - JWT debugger and documentation
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

## Project Documentation

### Local Documentation
- [Project README](../README.md)
- [Optimization Summary](../OPTIMIZATION_SUMMARY.md)
- [Scalability Guide](../SCALABILITY_GUIDE.md)
- [Architecture Docs](../docs/)

### API Documentation
- API endpoints: See `backend/src/routes/` for implementation
- (TODO: Consider adding Swagger/OpenAPI documentation)

---

## Common Patterns

### Prisma Queries
```typescript
// Find one
const user = await prisma.user.findUnique({ where: { id } })

// Find many with filters
const students = await prisma.student.findMany({
  where: { departmentId },
  include: { courses: true }
})

// Create
const student = await prisma.student.create({
  data: { name, email, departmentId }
})

// Update
const updated = await prisma.student.update({
  where: { id },
  data: { name }
})

// Delete
await prisma.student.delete({ where: { id } })
```

### Next.js Server Actions
```typescript
'use server'

export async function createStudent(formData: FormData) {
  const name = formData.get('name') as string
  // ... validation and database operation
  revalidatePath('/students')
}
```

### Express Route Pattern
```typescript
import { Router } from 'express'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

router.get('/', authenticate, async (req, res) => {
  try {
    // ... logic
    res.json({ data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
```

---

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

## Performance Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Performance Optimization](https://nextjs.org/docs/app/building-your-application/optimizing)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Prisma Performance Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## Learning Resources

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### React
- [React Official Tutorial](https://react.dev/learn)
- [React Hooks](https://react.dev/reference/react)

### SQL & Databases
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
- [SQL Cheat Sheet](https://www.sqltutorial.org/sql-cheat-sheet/)

---

## Tools

### Development
- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - API testing
- [Prisma Studio](https://www.prisma.io/studio) - Database GUI
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL GUI

### Testing
- [Jest](https://jestjs.io/) - JavaScript testing
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/ladjs/supertest) - HTTP testing

### Monitoring
- [Node.js Built-in Profiler](https://nodejs.org/en/docs/guides/simple-profiling/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Last Updated**: 2026-03-27
