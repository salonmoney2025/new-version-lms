# Claude Context Management — README

This folder implements an optimized context management system for working with Claude on long-running projects.

---

## The Problem This Solves

**Before**: One giant `claude.md` file with everything
- Gets huge over time
- Parses the whole thing every session, burning tokens
- Never updates itself, goes stale
- Inefficient and expensive

**After**: Focused, lazy-loaded files
- Claude starts each session lean and fast
- Only loads context when needed
- Files stay current because you update them
- Saves tokens and improves performance

---

## File Structure

```
.claude/
├── README.md              # This file
├── claude.md              # Core context (2-3k tokens max)
├── session-log.md         # What happened last session
├── project-state.md       # Current build status, what works
├── tools.md               # Commands and tool reference
├── context.md             # EBKUST domain knowledge
├── prompts/               # Reusable task templates
│   ├── add-feature.md
│   ├── debug-issue.md
│   └── refactor-code.md
├── scripts/               # Helper scripts (future)
└── docs/                  # Documentation links
    └── references.md
```

---

## How to Use Each File

### `claude.md` — Core Context
**Purpose**: Your identity, tech stack, core principles
**Size**: 2-3k tokens max
**Update**: Rarely (only when fundamentals change)
**Claude loads**: Every session automatically

This is the only file Claude reads by default. Keep it lean!

---

### `session-log.md` — Session History
**Purpose**: What happened last session, what's next
**Size**: Keep recent sessions only
**Update**: After every session (5-10 min)
**Claude loads**: When you start a new session

**Update template**:
```markdown
## Session — 2026-03-27

### What Was Done
- Built X feature
- Fixed Y bug

### What Broke
- Z component now has issue (investigate)

### What's Next
- Complete Z fix
- Add tests for X

### Blockers
- Need clarification on payment flow
```

---

### `project-state.md` — Current Status
**Purpose**: What's built, what works, what's broken
**Size**: Comprehensive but organized
**Update**: After major changes
**Claude loads**: Before starting work

**When to update**:
- Completed a major feature
- Found a critical bug
- Changed architecture
- Updated dependencies

---

### `tools.md` — Command Reference
**Purpose**: All commands, shortcuts, workflows
**Size**: As detailed as needed
**Update**: When tools/commands change
**Claude loads**: When running commands or troubleshooting

---

### `context.md` — Domain Knowledge
**Purpose**: EBKUST-specific business rules, terminology
**Size**: Comprehensive
**Update**: When requirements change
**Claude loads**: When working on domain-specific features

---

### `prompts/` — Task Templates
**Purpose**: Reusable prompts for common tasks
**Files**:
- `add-feature.md` - Adding new features
- `debug-issue.md` - Debugging bugs
- `refactor-code.md` - Code refactoring

**How to use**:
1. Copy template content
2. Fill in the blanks
3. Send to Claude

---

### `docs/` — Documentation Links
**Purpose**: Quick reference to external docs
**Update**: When adding new tools/libraries

---

## Workflow Examples

### Starting a New Session
```
You: "Read session-log.md and project-state.md. What should we work on?"
Claude: [Reads files, suggests next steps based on what's documented]
```

### Adding a Feature
```
You: "Use the add-feature.md template to plan adding student ID card generation"
Claude: [Uses template, loads context.md for domain knowledge, creates plan]
```

### Debugging an Issue
```
You: "Use debug-issue.md template to investigate why payments aren't working"
Claude: [Uses template, loads tools.md for debugging commands, investigates]
```

### Ending a Session
```
You: "Update session-log.md with what we did today"
Claude: [Updates file with session summary]
```

---

## Maintenance Schedule

| File | Update Frequency |
|------|------------------|
| `claude.md` | Rarely (fundamentals only) |
| `session-log.md` | Every session |
| `project-state.md` | After major changes |
| `tools.md` | When tools change |
| `context.md` | When requirements change |
| `prompts/` | As needed |
| `docs/` | As needed |

---

## Best Practices

### DO
- Keep `claude.md` under 3k tokens
- Update `session-log.md` after every session
- Be specific in session logs (what broke, what's next)
- Use prompt templates for consistency
- Load only relevant context per task

### DON'T
- Don't dump everything in `claude.md`
- Don't let `session-log.md` grow forever (archive old sessions)
- Don't forget to update `project-state.md` after big changes
- Don't load all files every session (only what's needed)

---

## Token Savings Example

**Before (One giant file)**:
- 15,000 tokens loaded every session
- Claude reads everything even if irrelevant

**After (Lazy loading)**:
- 2,500 tokens for `claude.md` (always loaded)
- +1,000 tokens for `session-log.md` (when continuing work)
- +2,000 tokens for `context.md` (only for domain-specific tasks)
- **Result**: ~3,500 tokens for typical session vs 15,000

**Savings**: ~75% reduction in context tokens!

---

## Quick Reference

| Task | Command |
|------|---------|
| Start session | "Read session-log.md and project-state.md" |
| Add feature | "Use add-feature.md template for [feature]" |
| Debug | "Use debug-issue.md template for [issue]" |
| Refactor | "Use refactor-code.md template for [target]" |
| End session | "Update session-log.md with today's work" |
| Check commands | "Check tools.md for [command type]" |
| Domain question | "Check context.md about [EBKUST process]" |

---

## Evolution of This System

This folder structure can evolve over time:
- Add new prompt templates as patterns emerge
- Create custom scripts in `scripts/`
- Expand documentation in `docs/`
- Archive old session logs to keep files lean
- Add new context files for different domains

The key principle: **Lazy load context only when needed**

---

**Created**: 2026-03-27
**Project**: EBKUST UMS
**Owner**: Wisdom
