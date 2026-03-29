# Prompt Template: Debug Issue

Use this template when investigating and fixing bugs.

---

## Issue Description
**Summary**: [Brief description of the bug]
**Severity**: [Critical / High / Medium / Low]
**Module**: [Backend / Frontend / Database / Other]

---

## Reproduction Steps
1. Step 1
2. Step 2
3. Step 3

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happens]

---

## Environment
- **OS**: [Windows / Linux / Mac]
- **Browser**: [Chrome / Firefox / Safari / Edge] (if frontend)
- **Node Version**: [Version number]
- **Database**: [PostgreSQL version]

---

## Error Messages
```
[Paste error messages here]
```

---

## Investigation Checklist

### Initial Checks
- [ ] Can you reproduce the issue?
- [ ] Check server logs (backend)
- [ ] Check browser console (frontend)
- [ ] Check network tab (API calls)
- [ ] Check database logs

### Backend Investigation
- [ ] Review relevant API endpoint
- [ ] Check middleware/validation
- [ ] Verify database queries
- [ ] Check authentication/authorization
- [ ] Review error handling

### Frontend Investigation
- [ ] Check component rendering
- [ ] Verify API calls
- [ ] Check state management
- [ ] Review error boundaries
- [ ] Check prop types/TypeScript types

### Database Investigation
- [ ] Check schema matches code
- [ ] Verify migrations applied
- [ ] Check data integrity
- [ ] Review query performance
- [ ] Check constraints/relationships

---

## Root Cause Analysis

**What caused the issue?**
[Detailed explanation]

**Why did it happen?**
[Analysis of underlying cause]

**How can we prevent it in the future?**
[Preventive measures]

---

## Fix Implementation

### Changes Made
- [ ] File: [path/to/file.ts] - [description]
- [ ] File: [path/to/file.tsx] - [description]

### Testing
- [ ] Manual testing completed
- [ ] Edge cases tested
- [ ] Regression testing done
- [ ] Different user roles tested

---

## Example Usage

**Issue**: "Students can't see their payment receipts"

**Reproduction**:
1. Login as student
2. Navigate to Payments page
3. Click "View Receipt"
4. Error appears: "Receipt not found"

**Investigation**:
- Check backend: `/api/payments/:id/receipt` endpoint
- Found issue: Query filtering by wrong user ID field
- Root cause: Used `userId` instead of `studentId` in Prisma query

**Fix**:
```typescript
// Before
const payment = await prisma.payment.findFirst({
  where: { id: paymentId, userId: req.user.id }
})

// After
const payment = await prisma.payment.findFirst({
  where: { id: paymentId, studentId: req.user.id }
})
```

**Testing**:
- Tested with multiple student accounts
- Verified receipts display correctly
- Checked other payment operations still work
