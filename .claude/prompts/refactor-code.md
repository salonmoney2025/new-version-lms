# Prompt Template: Refactor Code

Use this template when refactoring existing code.

---

## Refactoring Goal
**Target**: [File, component, or module to refactor]
**Reason**: [Why refactoring is needed]
**Type**: [Performance / Readability / Maintainability / Architecture]

---

## Current Issues
- Issue 1: [Description]
- Issue 2: [Description]
- Issue 3: [Description]

---

## Refactoring Plan

### Objectives
- [ ] Objective 1
- [ ] Objective 2
- [ ] Objective 3

### Constraints
- Must maintain backward compatibility
- Must not break existing tests
- Must not change public API
- [Add other constraints]

---

## Approach

### Before State
[Describe current implementation]

### After State
[Describe target implementation]

### Migration Strategy
1. Step 1
2. Step 2
3. Step 3

---

## Implementation Checklist

### Code Changes
- [ ] Identify all affected files
- [ ] Create backup/branch
- [ ] Implement refactoring
- [ ] Update imports/references
- [ ] Remove dead code

### Testing
- [ ] Existing tests still pass
- [ ] Add new tests if needed
- [ ] Manual testing completed
- [ ] Performance testing (if applicable)

### Documentation
- [ ] Update code comments
- [ ] Update documentation files
- [ ] Update README if needed

---

## Risk Assessment

**High Risk**:
- [Areas where things could break]

**Medium Risk**:
- [Areas that might need adjustment]

**Low Risk**:
- [Areas unlikely to be affected]

---

## Example Usage

**Target**: Refactor authentication middleware

**Current Issues**:
- Code is duplicated across multiple routes
- Error handling is inconsistent
- Hard to add new authentication methods

**Plan**:
1. Extract authentication logic into middleware function
2. Create unified error response format
3. Add support for multiple token types (JWT, API keys)
4. Centralize token verification

**Before**:
```typescript
// In each route file
app.get('/api/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    // ... route logic
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
})
```

**After**:
```typescript
// middleware/auth.ts
export const authenticate = async (req, res, next) => {
  try {
    const token = extractToken(req)
    const user = await verifyToken(token)
    req.user = user
    next()
  } catch (err) {
    handleAuthError(res, err)
  }
}

// In route file
app.get('/api/users', authenticate, async (req, res) => {
  // ... route logic (req.user already available)
})
```

**Benefits**:
- Single source of truth for authentication
- Consistent error handling
- Easier to test
- Easier to extend with new auth methods
