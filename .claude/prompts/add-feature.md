# Prompt Template: Add New Feature

Use this template when adding a new feature to the system.

---

## Feature Request
**Feature Name**: [Name of the feature]
**Module**: [Backend / Frontend / Both]
**Priority**: [High / Medium / Low]

---

## Requirements
[Describe what the feature should do]

### User Story
As a [role], I want to [action] so that [benefit].

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

---

## Technical Approach

### Database Changes
- [ ] Schema changes needed? (Yes/No)
- [ ] New tables/models?
- [ ] Migration required?

### Backend Changes
- [ ] New API endpoints?
- [ ] List endpoints:
  - `GET /api/endpoint`
  - `POST /api/endpoint`
  - `PUT /api/endpoint/:id`
  - `DELETE /api/endpoint/:id`

### Frontend Changes
- [ ] New pages?
- [ ] New components?
- [ ] State management changes?

---

## Implementation Checklist

### Backend
- [ ] Create Prisma model (if needed)
- [ ] Generate migration
- [ ] Create API routes
- [ ] Add validation/middleware
- [ ] Test with Postman/curl

### Frontend
- [ ] Create page/component
- [ ] Add API client functions
- [ ] Implement UI
- [ ] Add error handling
- [ ] Test in browser

### Integration
- [ ] Test end-to-end flow
- [ ] Check error handling
- [ ] Verify permissions
- [ ] Update documentation

---

## Example Usage

**Feature**: Add Student ID Card Generation

**Requirements**:
As a Registrar, I want to generate student ID cards so that students can access campus facilities.

**Technical Approach**:
- Backend: Create endpoint to generate ID card PDF
- Frontend: Add button to student profile to generate card
- Database: Add `id_card_generated` field to Student model

**Implementation**:
1. Update Prisma schema
2. Create migration
3. Add `POST /api/students/:id/id-card` endpoint
4. Add PDF generation logic (using jsPDF or similar)
5. Create frontend UI component
6. Add download button
7. Test full flow
