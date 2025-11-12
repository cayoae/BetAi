# Claude Instructions - BetAI Sports Platform

In all interactions and commit messages, be extremely concise and sacrifice grammar for the sake of concision.

## Project Overview

BetAI is a React-based sports analysis platform that helps users make better betting decisions using daily-updated sports data (no real-time APIs). Data is stored in Supabase and updated daily via automated processes. Frontend deployed on Netlify.

**Core Sports:** Soccer, MLB, NFL, NBA, WNBA

## Tech Stack

- **Frontend:** React + TypeScript, deployed on Netlify
- **Backend/Data:** Supabase (PostgreSQL database, Edge Functions)
- **AI Model:** Kimi K2 Thinking (chat interface)
- **Data Strategy:** Daily batch updates (NO real-time APIs)
- **Styling:** Tailwind CSS

## PR Comments

When adding a comment to a PR with a TODO, use checkbox markdown format:
```
- [ ] Description of the todo
```

## Changesets

Add changesets to `.changeset` directory as `0000-your-change.md`:

```markdown
---
"betai": patch
---

Description of the change (user-facing).
```

Types: patch (bug fix), minor (new feature), major (breaking change)

## GitHub & Git

- Primary GitHub interaction: CLI (`gh` command)
- Branch naming: `claude/{description}-{sessionId}`
- Always push to branch with session ID suffix

## Plans

At the end of each plan, list unresolved questions (extremely concise).

---

## Journal System (Backend & Frontend)

### Structure
```
.github/journals/
  backend/
    2025/week-{n}/
      daily/
        YYYY-MM-DD-{slug}.md    # One issue per file (~100 lines)
      _week-summary.md          # Weekly overview
    current-status.md           # Live dashboard
    index.md                    # Tag-based search
  frontend/
    2025/week-{n}/
      daily/
        YYYY-MM-DD-{slug}.md
      _week-summary.md
    current-status.md
    index.md
  _project-status.md            # Overall project dashboard
```

### When to Search
1. **Specific issue:** Check current-status.md, then search by date/tag
2. **Debugging:** Read single daily file only
3. **Weekly context:** Read _week-summary.md (not daily files)
4. **Cross-reference:** Use "Related:" links in daily entries

### Daily Entry Template
```markdown
# Brief Title
**Date:** YYYY-MM-DD | **Area:** Backend/Frontend | **Status:** ✅/⚠️/❌ | **Tags:** #tag1 #tag2

## Problem
[1-2 sentences]

## Root Cause
[why it broke]

## Solution
[how fixed]

## Files Changed
- path/to/file.ext

## Impact
[result/metrics]

## Related
- [YYYY-MM-DD-other-issue.md](../YYYY-MM-DD-other-issue.md)
```

### Backend Tags
`#database` `#supabase` `#edge-function` `#data-pipeline` `#authentication` `#api` `#schema` `#migration` `#security` `#performance`

### Frontend Tags
`#component` `#ui` `#routing` `#state-management` `#styling` `#responsive` `#chat-interface` `#data-visualization` `#hooks` `#performance`

### Journal Update Workflow

**When User Says "Update the journal":**

1. **Create daily entry:**
   - File: `.github/journals/{backend|frontend}/2025/week-{n}/daily/YYYY-MM-DD-{slug}.md`
   - Use template above (~100 lines max)
   - Add 2-3 relevant tags
   - Include "Related:" section

2. **Update current-status.md:**
   - Latest Activity: Add row with date + link to daily entry
   - Component/Service Status: Update status (✅/⚠️/❌)
   - Last Updated: Today's date

3. **Update index.md:**
   - Add to relevant tag sections (limit 3-4 recent)
   - Add to "By Date" section for current week

4. **Update _project-status.md:**
   - Update overall progress
   - Add to Recent Updates section

5. **Commit format:**
   ```
   docs: Update {backend|frontend} journal with {issue title}

   - Created daily entry: YYYY-MM-DD-{slug}.md
     * Problem summary (1 line)
     * Solution applied

   - Updated status dashboards
     * Tags: #tag1 #tag2
   ```

### Automatic Journal Updates

**Create journal entry automatically after:**
- Fixing a bug
- Implementing a feature
- Resolving an error
- Completing a significant task

Don't wait for "update journal" command.

---

## Task Management Format

### Backend Tasks

Track in `.github/journals/backend/current-status.md`:

```markdown
## Backend Components Status

| Component | Status | Last Activity | Notes |
|-----------|--------|---------------|-------|
| Database Schema | 🔄 | 2025-11-12 | In design phase |
| Supabase Setup | ⏸️ | - | Not started |
| Data Pipeline | ⏸️ | - | Not started |
| Edge Functions | ⏸️ | - | Not started |
| Authentication | ⏸️ | - | Not started |

**Legend:** ✅ Complete | 🔄 In Progress | ⚠️ Issues | ❌ Blocked | ⏸️ Not Started

## Active Tasks

- [ ] Design complete database schema
- [ ] Set up Supabase project
- [ ] Create data ingestion pipeline
- [ ] Implement authentication flow
```

### Frontend Tasks

Track in `.github/journals/frontend/current-status.md`:

```markdown
## Frontend Components Status

| Component | Status | Last Activity | Notes |
|-----------|--------|---------------|-------|
| Project Setup | 🔄 | 2025-11-12 | React + TS + Tailwind |
| Chat Interface | ⏸️ | - | Not started |
| Sports Components | ⏸️ | - | Not started |
| Dashboard | ⏸️ | - | Not started |
| Auth Pages | ⏸️ | - | Not started |

## Active Tasks

- [ ] Initialize React project with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Create component structure
- [ ] Build chat interface
```

---

## Development Workflow

### Starting a New Feature

1. Read relevant current-status.md (backend or frontend)
2. Check index.md for related past issues
3. Update task status to 🔄
4. Implement feature
5. Create journal entry
6. Update status to ✅
7. Commit with descriptive message

### Fixing a Bug

1. Create daily journal entry with problem
2. Document root cause
3. Implement solution
4. Update journal with solution and impact
5. Update current-status.md
6. Commit

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] No console.log statements (use proper logging)
- [ ] Error handling implemented
- [ ] Responsive design (mobile + desktop)
- [ ] No hardcoded values (use env variables)
- [ ] Comments for complex logic only
- [ ] Journal updated if significant change

---

## Project Conventions

### File Naming
- Components: PascalCase (e.g., `ChatInterface.tsx`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Hooks: camelCase with `use` prefix (e.g., `useAuth.ts`)
- Types: PascalCase with `.types.ts` suffix (e.g., `Game.types.ts`)

### Component Structure
```typescript
// Imports (external → internal → types)
// Types/Interfaces
// Component function
// Styled components (if using styled-components)
// Export
```

### Database Naming
- Tables: snake_case, plural (e.g., `nfl_games`)
- Columns: snake_case (e.g., `home_team_score`)
- Indexes: `idx_{table}_{column}` (e.g., `idx_nfl_games_game_date`)

### Commit Messages
```
type(scope): brief description

Detailed explanation (if needed)
```

**Types:** feat, fix, docs, style, refactor, test, chore

**Scopes:** backend, frontend, database, auth, chat, dashboard, etc.

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_KIMI_API_KEY=
```

**Backend (Supabase):**
```
DATABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
DATA_UPDATE_CRON_SECRET=
```

---

## Sports Data Structure

### Daily Data Requirements

Each sport needs:
- Today's games (date, teams, odds if available)
- This week's schedule
- Recent team/player stats (last 5-10 games)
- News/updates affecting games
- Historical matchup data

### Data Update Frequency

- **Games/Odds:** Daily at 6 AM ET
- **Stats:** Daily at 8 AM ET (after overnight games complete)
- **News:** Every 6 hours
- **Historical Data:** Weekly on Sundays

---

## Debugging Guidelines

### Frontend Issues
1. Check browser console for errors
2. Verify Supabase connection
3. Check React DevTools for state issues
4. Review network tab for failed requests
5. Test in incognito (cache issues)

### Backend Issues
1. Check Supabase logs
2. Verify database connections
3. Review Edge Function logs
4. Check data pipeline execution times
5. Verify Row Level Security policies

### Common Pitfalls
- CORS issues: Configure Supabase allowed origins
- Authentication: Check token expiration
- Data not showing: Verify RLS policies
- Slow queries: Add database indexes
- Build errors: Clear .next cache

---

## Quick Reference

### Supabase Client (Frontend)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

### Data Fetching Pattern
```typescript
const { data, error } = await supabase
  .from('table_name')
  .select('*')
  .eq('column', 'value')
  .order('created_at', { ascending: false })
  .limit(10)
```

### Edge Function Pattern
```typescript
// supabase/functions/function-name/index.ts
import { serve } from 'std/server'

serve(async (req) => {
  try {
    // Function logic
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

---

**Version:** 1.0
**Last Updated:** 2025-11-12
**Next Review:** After Sprint 1 completion
