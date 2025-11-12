# BetAI - Complete Development Planning

**Project Type:** Sports Analysis Platform with Daily Data Updates
**Architecture:** React Frontend (Netlify) + Supabase Backend (PostgreSQL + Edge Functions)
**Timeline:** 16-18 weeks (4-4.5 months)
**Last Updated:** 2025-11-12

---

## Table of Contents

1. [Project Architecture Overview](#project-architecture-overview)
2. [Phase 1: Foundation & Setup](#phase-1-foundation--setup)
3. [Phase 2: Database & Data Pipeline](#phase-2-database--data-pipeline)
4. [Phase 3: Frontend Core](#phase-3-frontend-core)
5. [Phase 4: Sports Features](#phase-4-sports-features)
6. [Phase 5: AI Integration](#phase-5-ai-integration)
7. [Phase 6: Advanced Features](#phase-6-advanced-features)
8. [Phase 7: Testing & Launch](#phase-7-testing--launch)
9. [Development Priorities](#development-priorities)
10. [Risk Mitigation](#risk-mitigation)

---

## Project Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │         React Frontend (Netlify)                   │    │
│  │  - Chat Interface                                  │    │
│  │  - Sports Dashboard                                │    │
│  │  - Data Visualizations                             │    │
│  │  - User Auth UI                                    │    │
│  └─────────────────┬──────────────────────────────────┘    │
│                    │                                         │
└────────────────────┼─────────────────────────────────────────┘
                     │
                     │ HTTPS (REST/WebSocket)
                     │
┌────────────────────▼─────────────────────────────────────────┐
│                   SUPABASE BACKEND                            │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  PostgreSQL Database                                 │  │
│  │  - Sports data (5 sports)                           │  │
│  │  - User data & preferences                          │  │
│  │  - Chat history                                     │  │
│  │  - Betting tracker                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Edge Functions (Deno)                               │  │
│  │  - Daily data ingestion                             │  │
│  │  - Data processing & transformation                 │  │
│  │  - AI integration (Kimi K2)                         │  │
│  │  - Scheduled jobs (cron)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication                                      │  │
│  │  - Email/Password                                    │  │
│  │  - OAuth (Google, etc)                              │  │
│  │  - Row Level Security                               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└───────────────────────────────────────────────────────────────┘
                     │
                     │ Daily Updates (Cron)
                     │
┌────────────────────▼─────────────────────────────────────────┐
│              EXTERNAL DATA SOURCES                            │
│  - Sports data files (manual upload initially)               │
│  - News APIs (future)                                         │
│  - Historical data archives                                   │
└───────────────────────────────────────────────────────────────┘
```

### Data Flow

```
Daily Data Update Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. Cron triggers Edge Function (6 AM ET daily)              │
│    ↓                                                         │
│ 2. Fetch data from source (CSV/JSON/API)                    │
│    ↓                                                         │
│ 3. Validate & transform data                                │
│    ↓                                                         │
│ 4. Update PostgreSQL tables                                 │
│    ↓                                                         │
│ 5. Generate daily summary stats                             │
│    ↓                                                         │
│ 6. Log update status                                        │
└─────────────────────────────────────────────────────────────┘

User Query Flow:
┌─────────────────────────────────────────────────────────────┐
│ 1. User submits chat query                                  │
│    ↓                                                         │
│ 2. Frontend sends to Edge Function                          │
│    ↓                                                         │
│ 3. Edge Function queries relevant sports data               │
│    ↓                                                         │
│ 4. Build context + prompt for Kimi K2                       │
│    ↓                                                         │
│ 5. Stream AI response back to frontend                      │
│    ↓                                                         │
│ 6. Frontend displays with data visualizations               │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation & Setup

**Duration:** 2 weeks
**Goal:** Complete project infrastructure and development environment

### Week 1: Repository & Environment Setup

#### Task 1.1: Initialize Project Structure
**Priority:** Critical
**Estimated Time:** 2 hours

**Steps:**
1. Verify GitHub repository structure
2. Create directory structure:
   ```
   BetAi/
   ├── .github/
   │   ├── workflows/           # CI/CD
   │   ├── journals/            # Development journals
   │   │   ├── backend/
   │   │   │   ├── current-status.md
   │   │   │   └── index.md
   │   │   ├── frontend/
   │   │   │   ├── current-status.md
   │   │   │   └── index.md
   │   │   └── _project-status.md
   │   └── ISSUE_TEMPLATE/
   ├── docs/                    # Documentation
   ├── frontend/                # React app
   ├── supabase/               # Backend
   │   ├── functions/          # Edge Functions
   │   ├── migrations/         # DB migrations
   │   └── seed/               # Seed data
   ├── scripts/                # Utility scripts
   ├── .gitignore
   ├── README.md
   ├── claude.md               # ✅ Already created
   ├── PLANNING.md             # This file
   └── DATABASE_SCHEMA.md      # To be created
   ```

3. Create initial journal files:
   - `.github/journals/backend/current-status.md`
   - `.github/journals/frontend/current-status.md`
   - `.github/journals/_project-status.md`

**Deliverable:** Complete directory structure with journal system

#### Task 1.2: Initialize React Frontend
**Priority:** Critical
**Estimated Time:** 3 hours

**Steps:**
1. Create React app with TypeScript:
   ```bash
   cd /home/user/BetAi
   npx create-next-app@latest frontend --typescript --tailwind --app --no-src-dir
   ```

2. Install core dependencies:
   ```bash
   cd frontend
   npm install @supabase/supabase-js
   npm install @supabase/auth-helpers-nextjs
   npm install zustand # State management
   npm install date-fns # Date utilities
   npm install recharts # Charts
   npm install lucide-react # Icons
   ```

3. Install dev dependencies:
   ```bash
   npm install -D @types/node
   npm install -D eslint-config-prettier
   npm install -D prettier
   ```

4. Configure TypeScript (`tsconfig.json`):
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "lib": ["dom", "dom.iterable", "esnext"],
       "allowJs": true,
       "skipLibCheck": true,
       "strict": true,
       "forceConsistentCasingInFileNames": true,
       "noEmit": true,
       "esModuleInterop": true,
       "module": "esnext",
       "moduleResolution": "bundler",
       "resolveJsonModule": true,
       "isolatedModules": true,
       "jsx": "preserve",
       "incremental": true,
       "paths": {
         "@/*": ["./*"]
       }
     }
   }
   ```

5. Configure Tailwind (`tailwind.config.ts`):
   ```typescript
   import type { Config } from 'tailwindcss'

   const config: Config = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {
         colors: {
           primary: '#1a73e8',
           secondary: '#fbbc04',
           success: '#34a853',
           danger: '#ea4335',
         },
       },
     },
     plugins: [],
   }
   export default config
   ```

6. Create `.env.local.example`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_KIMI_API_KEY=your_kimi_key
   ```

7. Configure ESLint (`.eslintrc.json`):
   ```json
   {
     "extends": ["next/core-web-vitals", "prettier"],
     "rules": {
       "no-console": "warn",
       "@typescript-eslint/no-unused-vars": "error"
     }
   }
   ```

8. Configure Prettier (`.prettierrc`):
   ```json
   {
     "semi": false,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```

**Deliverable:** Working React + TypeScript + Tailwind setup

#### Task 1.3: Create Supabase Project
**Priority:** Critical
**Estimated Time:** 2 hours

**Steps:**
1. Go to https://supabase.com and create new project
   - Project name: `betai-sports`
   - Database password: Generate strong password (save securely)
   - Region: Choose closest to target users
   - Plan: Free tier for development

2. Save credentials:
   - Project URL
   - Anon/Public key
   - Service role key (keep secret)

3. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

4. Initialize Supabase in project:
   ```bash
   cd /home/user/BetAi
   supabase init
   ```

5. Link to remote project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

6. Create `supabase/config.toml` configuration

**Deliverable:** Supabase project ready for development

#### Task 1.4: Set Up Netlify
**Priority:** High
**Estimated Time:** 1 hour

**Steps:**
1. Go to https://netlify.com and create account
2. Connect GitHub repository
3. Configure build settings:
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/out`
   - Node version: 18.x

4. Add environment variables in Netlify dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_KIMI_API_KEY`

5. Set up branch deploys:
   - Production: `main` branch
   - Preview: All pull requests

**Deliverable:** Netlify connected and ready for deployments

### Week 2: Core Infrastructure

#### Task 1.5: Set Up GitHub Actions
**Priority:** Medium
**Estimated Time:** 2 hours

**Steps:**
1. Create `.github/workflows/frontend-ci.yml`:
   ```yaml
   name: Frontend CI

   on:
     pull_request:
       branches: [main]
       paths:
         - 'frontend/**'
     push:
       branches: [main]
       paths:
         - 'frontend/**'

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
             cache-dependency-path: frontend/package-lock.json

         - name: Install dependencies
           working-directory: ./frontend
           run: npm ci

         - name: Lint
           working-directory: ./frontend
           run: npm run lint

         - name: Type check
           working-directory: ./frontend
           run: npx tsc --noEmit

         - name: Build
           working-directory: ./frontend
           run: npm run build
   ```

2. Create `.github/workflows/backend-ci.yml`:
   ```yaml
   name: Backend CI

   on:
     pull_request:
       branches: [main]
       paths:
         - 'supabase/**'
     push:
       branches: [main]
       paths:
         - 'supabase/**'

   jobs:
     validate:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Supabase CLI
           uses: supabase/setup-cli@v1

         - name: Verify migrations
           run: supabase db diff --schema public
   ```

**Deliverable:** Automated CI pipeline for both frontend and backend

#### Task 1.6: Basic Authentication Setup
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Create Supabase auth helpers in `frontend/lib/supabase/`:

   **`client.ts`:**
   ```typescript
   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

   export const supabase = createClientComponentClient()
   ```

   **`server.ts`:**
   ```typescript
   import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
   import { cookies } from 'next/headers'

   export const createServerClient = () => {
     return createServerComponentClient({ cookies })
   }
   ```

   **`middleware.ts`:**
   ```typescript
   import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
   import { NextResponse } from 'next/server'
   import type { NextRequest } from 'next/server'

   export async function middleware(req: NextRequest) {
     const res = NextResponse.next()
     const supabase = createMiddlewareClient({ req, res })
     await supabase.auth.getSession()
     return res
   }
   ```

2. Create auth context (`frontend/contexts/AuthContext.tsx`):
   ```typescript
   'use client'

   import { createContext, useContext, useEffect, useState } from 'react'
   import { User } from '@supabase/supabase-js'
   import { supabase } from '@/lib/supabase/client'

   interface AuthContextType {
     user: User | null
     loading: boolean
     signOut: () => Promise<void>
   }

   const AuthContext = createContext<AuthContextType | undefined>(undefined)

   export function AuthProvider({ children }: { children: React.ReactNode }) {
     const [user, setUser] = useState<User | null>(null)
     const [loading, setLoading] = useState(true)

     useEffect(() => {
       supabase.auth.getSession().then(({ data: { session } }) => {
         setUser(session?.user ?? null)
         setLoading(false)
       })

       const {
         data: { subscription },
       } = supabase.auth.onAuthStateChange((_event, session) => {
         setUser(session?.user ?? null)
       })

       return () => subscription.unsubscribe()
     }, [])

     const signOut = async () => {
       await supabase.auth.signOut()
       setUser(null)
     }

     return (
       <AuthContext.Provider value={{ user, loading, signOut }}>
         {children}
       </AuthContext.Provider>
     )
   }

   export const useAuth = () => {
     const context = useContext(AuthContext)
     if (!context) {
       throw new Error('useAuth must be used within AuthProvider')
     }
     return context
   }
   ```

3. Create login page (`frontend/app/login/page.tsx`):
   ```typescript
   'use client'

   import { useState } from 'react'
   import { supabase } from '@/lib/supabase/client'
   import { useRouter } from 'next/navigation'

   export default function LoginPage() {
     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState<string | null>(null)
     const router = useRouter()

     const handleLogin = async (e: React.FormEvent) => {
       e.preventDefault()
       setLoading(true)
       setError(null)

       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       })

       if (error) {
         setError(error.message)
       } else {
         router.push('/')
       }
       setLoading(false)
     }

     return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
           <h2 className="text-3xl font-bold text-center">BetAI Login</h2>

           {error && (
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
               {error}
             </div>
           )}

           <form onSubmit={handleLogin} className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700">
                 Email
               </label>
               <input
                 type="email"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                 required
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700">
                 Password
               </label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                 required
               />
             </div>

             <button
               type="submit"
               disabled={loading}
               className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-blue-600"
             >
               {loading ? 'Logging in...' : 'Login'}
             </button>
           </form>
         </div>
       </div>
     )
   }
   ```

4. Create register page (similar to login)
5. Add protected route middleware

**Deliverable:** Working authentication system

#### Task 1.7: Create Project Documentation
**Priority:** Medium
**Estimated Time:** 2 hours

**Steps:**
1. Update `README.md` with:
   - Project overview
   - Setup instructions
   - Development workflow
   - Deployment process

2. Create `docs/DEVELOPMENT.md`:
   - Local development setup
   - Environment variables
   - Common commands
   - Troubleshooting

3. Create `docs/ARCHITECTURE.md`:
   - System architecture diagram
   - Data flow
   - Component structure
   - Technology choices

**Deliverable:** Complete project documentation

#### Phase 1 Checklist

- [ ] GitHub repository structured with journals
- [ ] React + TypeScript + Tailwind configured
- [ ] Supabase project created and linked
- [ ] Netlify deployment configured
- [ ] GitHub Actions CI/CD working
- [ ] Authentication system functional
- [ ] Project documentation complete
- [ ] Environment variables configured
- [ ] Initial commit and push to main branch

**Phase 1 Journal Update:** Document all setup decisions and configurations

---

## Phase 2: Database & Data Pipeline

**Duration:** 3 weeks
**Goal:** Complete database schema and automated daily data updates

### Week 3: Database Design & Implementation

#### Task 2.1: Design Complete Database Schema
**Priority:** Critical
**Estimated Time:** 6 hours

**Steps:**
1. Review `DATABASE_SCHEMA.md` (to be created next)
2. Identify all entities for each sport:
   - Teams
   - Players
   - Games
   - Odds
   - Stats
   - News

3. Design relationships and constraints
4. Plan indexes for query optimization
5. Design Row Level Security policies

**Reference:** See `DATABASE_SCHEMA.md` for complete schema

**Deliverable:** Complete database schema design document

#### Task 2.2: Create Initial Migration
**Priority:** Critical
**Estimated Time:** 4 hours

**Steps:**
1. Create migration file:
   ```bash
   supabase migration new initial_schema
   ```

2. Implement core tables in migration:
   - Users and profiles
   - Teams (all sports)
   - Players (all sports)
   - Games (all sports)
   - Odds data
   - User preferences

3. Add indexes:
   ```sql
   CREATE INDEX idx_nfl_games_game_date ON nfl_games(game_date);
   CREATE INDEX idx_nba_games_game_date ON nba_games(game_date);
   -- etc for all sports
   ```

4. Apply migration:
   ```bash
   supabase db push
   ```

**Deliverable:** Initial database schema deployed

#### Task 2.3: Implement Row Level Security
**Priority:** High
**Estimated Time:** 3 hours

**Steps:**
1. Enable RLS on all tables:
   ```sql
   ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_bets ENABLE ROW LEVEL SECURITY;
   ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;
   ```

2. Create policies for public data (readable by all):
   ```sql
   CREATE POLICY "Sports data is viewable by everyone"
   ON nfl_games FOR SELECT
   USING (true);
   ```

3. Create policies for user data (own data only):
   ```sql
   CREATE POLICY "Users can view own profile"
   ON user_profiles FOR SELECT
   USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile"
   ON user_profiles FOR UPDATE
   USING (auth.uid() = id);
   ```

4. Test policies with different user roles

**Deliverable:** Secure database with proper RLS policies

### Week 4: Data Models & Types

#### Task 2.4: Create TypeScript Types
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Generate types from Supabase:
   ```bash
   supabase gen types typescript --local > frontend/types/supabase.ts
   ```

2. Create domain-specific types (`frontend/types/sports.types.ts`):
   ```typescript
   export type Sport = 'soccer' | 'mlb' | 'nfl' | 'nba' | 'wnba'

   export interface Game {
     id: string
     sport: Sport
     gameDate: Date
     homeTeam: Team
     awayTeam: Team
     homeScore?: number
     awayScore?: number
     status: 'scheduled' | 'live' | 'completed' | 'postponed'
     odds?: GameOdds
   }

   export interface Team {
     id: string
     name: string
     abbreviation: string
     city: string
     logo?: string
     sport: Sport
   }

   export interface GameOdds {
     homeMoneyline?: number
     awayMoneyline?: number
     spread?: number
     spreadOdds?: number
     total?: number
     overOdds?: number
     underOdds?: number
     lastUpdated: Date
   }

   export interface Player {
     id: string
     name: string
     teamId: string
     position: string
     jerseyNumber?: number
     sport: Sport
   }

   export interface PlayerStats {
     playerId: string
     gameId: string
     stats: Record<string, number>
   }
   ```

3. Create user-related types (`frontend/types/user.types.ts`):
   ```typescript
   export interface UserProfile {
     id: string
     email: string
     displayName?: string
     favoriteTeams: string[]
     favoriteSports: Sport[]
     createdAt: Date
   }

   export interface UserBet {
     id: string
     userId: string
     gameId: string
     betType: 'moneyline' | 'spread' | 'total' | 'prop'
     amount: number
     odds: number
     result?: 'win' | 'loss' | 'push'
     placedAt: Date
   }

   export interface ChatMessage {
     id: string
     userId: string
     content: string
     role: 'user' | 'assistant'
     timestamp: Date
   }
   ```

**Deliverable:** Complete TypeScript type definitions

#### Task 2.5: Create Database Access Layer
**Priority:** High
**Estimated Time:** 5 hours

**Steps:**
1. Create database utilities (`frontend/lib/database/`):

   **`teams.ts`:**
   ```typescript
   import { supabase } from '@/lib/supabase/client'
   import type { Team, Sport } from '@/types/sports.types'

   export async function getTeamsBySport(sport: Sport): Promise<Team[]> {
     const tableName = `${sport}_teams`
     const { data, error } = await supabase
       .from(tableName)
       .select('*')
       .order('name')

     if (error) throw error
     return data as Team[]
   }

   export async function getTeamById(sport: Sport, teamId: string): Promise<Team> {
     const tableName = `${sport}_teams`
     const { data, error } = await supabase
       .from(tableName)
       .select('*')
       .eq('id', teamId)
       .single()

     if (error) throw error
     return data as Team
   }
   ```

   **`games.ts`:**
   ```typescript
   import { supabase } from '@/lib/supabase/client'
   import type { Game, Sport } from '@/types/sports.types'

   export async function getTodaysGames(sport?: Sport): Promise<Game[]> {
     const today = new Date().toISOString().split('T')[0]

     if (sport) {
       const tableName = `${sport}_games`
       const { data, error } = await supabase
         .from(tableName)
         .select(`
           *,
           home_team:home_team_id(*),
           away_team:away_team_id(*),
           odds:game_odds(*)
         `)
         .eq('game_date', today)
         .order('game_time')

       if (error) throw error
       return data as Game[]
     }

     // Fetch from all sports
     const sports: Sport[] = ['nfl', 'nba', 'mlb', 'wnba', 'soccer']
     const promises = sports.map(s => getTodaysGames(s))
     const results = await Promise.all(promises)
     return results.flat()
   }

   export async function getWeekGames(sport: Sport): Promise<Game[]> {
     const today = new Date()
     const weekLater = new Date(today)
     weekLater.setDate(weekLater.getDate() + 7)

     const tableName = `${sport}_games`
     const { data, error } = await supabase
       .from(tableName)
       .select(`
         *,
         home_team:home_team_id(*),
         away_team:away_team_id(*),
         odds:game_odds(*)
       `)
       .gte('game_date', today.toISOString().split('T')[0])
       .lte('game_date', weekLater.toISOString().split('T')[0])
       .order('game_date')
       .order('game_time')

     if (error) throw error
     return data as Game[]
   }
   ```

   **`stats.ts`:**
   ```typescript
   import { supabase } from '@/lib/supabase/client'

   export async function getTeamStats(sport: Sport, teamId: string, limit = 10) {
     const tableName = `${sport}_team_stats`
     const { data, error } = await supabase
       .from(tableName)
       .select('*')
       .eq('team_id', teamId)
       .order('game_date', { ascending: false })
       .limit(limit)

     if (error) throw error
     return data
   }

   export async function getPlayerStats(sport: Sport, playerId: string, limit = 10) {
     const tableName = `${sport}_player_stats`
     const { data, error } = await supabase
       .from(tableName)
       .select('*')
       .eq('player_id', playerId)
       .order('game_date', { ascending: false })
       .limit(limit)

     if (error) throw error
     return data
   }
   ```

2. Create custom hooks for data fetching:

   **`frontend/hooks/useSportsData.ts`:**
   ```typescript
   import { useQuery } from '@tanstack/react-query'
   import { getTodaysGames, getWeekGames } from '@/lib/database/games'
   import type { Sport } from '@/types/sports.types'

   export function useTodaysGames(sport?: Sport) {
     return useQuery({
       queryKey: ['games', 'today', sport],
       queryFn: () => getTodaysGames(sport),
       refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
     })
   }

   export function useWeekGames(sport: Sport) {
     return useQuery({
       queryKey: ['games', 'week', sport],
       queryFn: () => getWeekGames(sport),
     })
   }
   ```

**Deliverable:** Complete data access layer with hooks

### Week 5: Data Pipeline Implementation

#### Task 2.6: Create Data Ingestion Edge Function
**Priority:** Critical
**Estimated Time:** 6 hours

**Steps:**
1. Create Edge Function:
   ```bash
   supabase functions new ingest-sports-data
   ```

2. Implement function (`supabase/functions/ingest-sports-data/index.ts`):
   ```typescript
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

   interface GameData {
     sport: string
     gameDate: string
     homeTeam: string
     awayTeam: string
     homeScore?: number
     awayScore?: number
     status: string
     odds?: {
       homeMoneyline?: number
       awayMoneyline?: number
       spread?: number
       total?: number
     }
   }

   serve(async (req) => {
     try {
       // Verify request authorization
       const authHeader = req.headers.get('Authorization')
       if (authHeader !== `Bearer ${Deno.env.get('CRON_SECRET')}`) {
         return new Response(JSON.stringify({ error: 'Unauthorized' }), {
           status: 401,
           headers: { 'Content-Type': 'application/json' },
         })
       }

       const supabase = createClient(
         Deno.env.get('SUPABASE_URL') ?? '',
         Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
       )

       // Get sport from query params or ingest all
       const url = new URL(req.url)
       const sport = url.searchParams.get('sport')

       const sports = sport ? [sport] : ['nfl', 'nba', 'mlb', 'wnba', 'soccer']

       const results = []

       for (const sportName of sports) {
         // Fetch data from source (CSV, JSON, or external endpoint)
         const data = await fetchSportData(sportName)

         // Transform and validate data
         const transformedData = transformData(sportName, data)

         // Upsert into database
         const { error } = await supabase
           .from(`${sportName}_games`)
           .upsert(transformedData, { onConflict: 'external_id' })

         if (error) {
           console.error(`Error upserting ${sportName} data:`, error)
           results.push({ sport: sportName, success: false, error: error.message })
         } else {
           results.push({ sport: sportName, success: true, count: transformedData.length })
         }
       }

       return new Response(JSON.stringify({ success: true, results }), {
         headers: { 'Content-Type': 'application/json' },
       })
     } catch (error) {
       console.error('Error in ingest-sports-data:', error)
       return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { 'Content-Type': 'application/json' },
       })
     }
   })

   async function fetchSportData(sport: string): Promise<any[]> {
     // Implementation depends on data source
     // For now, assume CSV files in Supabase Storage
     const supabase = createClient(
       Deno.env.get('SUPABASE_URL') ?? '',
       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
     )

     const { data, error } = await supabase.storage
       .from('sports-data')
       .download(`${sport}/latest.json`)

     if (error) throw error

     const text = await data.text()
     return JSON.parse(text)
   }

   function transformData(sport: string, rawData: any[]): any[] {
     // Transform raw data to match database schema
     return rawData.map(item => ({
       external_id: item.id,
       game_date: item.date,
       game_time: item.time,
       home_team_id: item.homeTeamId,
       away_team_id: item.awayTeamId,
       home_score: item.homeScore,
       away_score: item.awayScore,
       status: item.status,
       // ... more fields
     }))
   }
   ```

3. Deploy function:
   ```bash
   supabase functions deploy ingest-sports-data
   ```

4. Set up environment variables in Supabase:
   - `CRON_SECRET`
   - `SUPABASE_SERVICE_ROLE_KEY`

**Deliverable:** Working data ingestion Edge Function

#### Task 2.7: Set Up Scheduled Jobs
**Priority:** High
**Estimated Time:** 2 hours

**Steps:**
1. Configure cron job in Supabase dashboard or using pg_cron:
   ```sql
   -- Daily at 6 AM ET (11 AM UTC)
   SELECT cron.schedule(
     'daily-sports-data-ingest',
     '0 11 * * *',
     $$
     SELECT net.http_post(
       url := 'https://your-project.supabase.co/functions/v1/ingest-sports-data',
       headers := jsonb_build_object('Authorization', 'Bearer ' || current_setting('app.cron_secret'))
     );
     $$
   );
   ```

2. Alternative: Use external cron service (cron-job.org, GitHub Actions):

   **`.github/workflows/daily-data-update.yml`:**
   ```yaml
   name: Daily Sports Data Update

   on:
     schedule:
       - cron: '0 11 * * *'  # 11 AM UTC = 6 AM ET
     workflow_dispatch:  # Allow manual trigger

   jobs:
     update-data:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger data ingestion
           run: |
             curl -X POST \
               -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
               https://your-project.supabase.co/functions/v1/ingest-sports-data
   ```

3. Test cron job manually:
   ```bash
   curl -X POST \
     -H "Authorization: Bearer YOUR_CRON_SECRET" \
     https://your-project.supabase.co/functions/v1/ingest-sports-data
   ```

**Deliverable:** Automated daily data updates

#### Task 2.8: Create Data Validation & Monitoring
**Priority:** Medium
**Estimated Time:** 3 hours

**Steps:**
1. Create validation Edge Function:
   ```bash
   supabase functions new validate-sports-data
   ```

2. Implement validation checks:
   - Data freshness (last update timestamp)
   - Missing games (expected vs actual count)
   - Data quality (null checks, format validation)
   - Anomaly detection (unusual scores, odds)

3. Create monitoring table:
   ```sql
   CREATE TABLE data_ingestion_logs (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     sport TEXT NOT NULL,
     execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     records_processed INT,
     records_inserted INT,
     records_updated INT,
     errors JSONB,
     status TEXT CHECK (status IN ('success', 'partial', 'failed')),
     duration_ms INT
   );
   ```

4. Log all ingestion runs to this table

**Deliverable:** Data validation and monitoring system

#### Phase 2 Checklist

- [ ] Complete database schema designed and documented
- [ ] All migrations created and applied
- [ ] Row Level Security policies implemented
- [ ] TypeScript types generated and custom types created
- [ ] Database access layer with all CRUD operations
- [ ] Custom React hooks for data fetching
- [ ] Data ingestion Edge Function working
- [ ] Scheduled jobs configured and tested
- [ ] Data validation and monitoring in place
- [ ] Manual data upload process documented

**Phase 2 Journal Update:** Document database design decisions, data pipeline architecture, and any challenges encountered

---

## Phase 3: Frontend Core

**Duration:** 3 weeks
**Goal:** Build core UI components and navigation

### Week 6: Component Library & Layout

#### Task 3.1: Create Design System
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Define color palette in Tailwind config (already started)
2. Create typography scale
3. Define spacing system
4. Create component variants

5. Create design tokens file (`frontend/lib/design-tokens.ts`):
   ```typescript
   export const colors = {
     primary: {
       50: '#e3f2fd',
       100: '#bbdefb',
       500: '#1a73e8',
       700: '#1565c0',
       900: '#0d47a1',
     },
     // ... more colors for each sport
   }

   export const sportColors = {
     nfl: '#013369',
     nba: '#17408B',
     mlb: '#041E42',
     wnba: '#C8102E',
     soccer: '#00B140',
   }
   ```

**Deliverable:** Consistent design system

#### Task 3.2: Build UI Component Library
**Priority:** High
**Estimated Time:** 8 hours

**Steps:**
1. Create base components (`frontend/components/ui/`):

   **`Button.tsx`:**
   ```typescript
   import { ButtonHTMLAttributes, forwardRef } from 'react'
   import { cn } from '@/lib/utils'

   interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
     size?: 'sm' | 'md' | 'lg'
   }

   export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
       return (
         <button
           ref={ref}
           className={cn(
             'rounded-lg font-medium transition-colors',
             {
               'bg-primary text-white hover:bg-blue-600': variant === 'primary',
               'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
               'border border-gray-300 hover:bg-gray-50': variant === 'outline',
               'hover:bg-gray-100': variant === 'ghost',
             },
             {
               'px-3 py-1.5 text-sm': size === 'sm',
               'px-4 py-2 text-base': size === 'md',
               'px-6 py-3 text-lg': size === 'lg',
             },
             className
           )}
           {...props}
         />
       )
     }
   )
   ```

   **`Card.tsx`:**
   ```typescript
   import { HTMLAttributes, forwardRef } from 'react'
   import { cn } from '@/lib/utils'

   interface CardProps extends HTMLAttributes<HTMLDivElement> {
     hover?: boolean
   }

   export const Card = forwardRef<HTMLDivElement, CardProps>(
     ({ className, hover = false, ...props }, ref) => {
       return (
         <div
           ref={ref}
           className={cn(
             'bg-white rounded-lg shadow p-6',
             hover && 'transition-shadow hover:shadow-lg cursor-pointer',
             className
           )}
           {...props}
         />
       )
     }
   )
   ```

   **`Badge.tsx`, `Modal.tsx`, `Input.tsx`, `Select.tsx`, `Tabs.tsx`**

2. Create utility function (`frontend/lib/utils.ts`):
   ```typescript
   import { clsx, type ClassValue } from 'clsx'
   import { twMerge } from 'tailwind-merge'

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs))
   }
   ```

**Deliverable:** Reusable UI component library

#### Task 3.3: Build Main Layout
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Create layout component (`frontend/components/layout/MainLayout.tsx`):
   ```typescript
   'use client'

   import { ReactNode } from 'react'
   import { Sidebar } from './Sidebar'
   import { Header } from './Header'
   import { useAuth } from '@/contexts/AuthContext'

   interface MainLayoutProps {
     children: ReactNode
   }

   export function MainLayout({ children }: MainLayoutProps) {
     const { user } = useAuth()

     return (
       <div className="min-h-screen bg-gray-50">
         <Header />

         <div className="flex">
           {user && <Sidebar />}

           <main className="flex-1 p-6">
             {children}
           </main>
         </div>
       </div>
     )
   }
   ```

2. Create Header component:
   ```typescript
   import { useAuth } from '@/contexts/AuthContext'
   import { Button } from '@/components/ui/Button'

   export function Header() {
     const { user, signOut } = useAuth()

     return (
       <header className="bg-white border-b border-gray-200 px-6 py-4">
         <div className="flex items-center justify-between">
           <div className="flex items-center space-x-4">
             <h1 className="text-2xl font-bold text-primary">BetAI</h1>
             <nav className="hidden md:flex space-x-4">
               <a href="/" className="text-gray-600 hover:text-gray-900">
                 Dashboard
               </a>
               <a href="/chat" className="text-gray-600 hover:text-gray-900">
                 Chat
               </a>
               <a href="/games" className="text-gray-600 hover:text-gray-900">
                 Games
               </a>
             </nav>
           </div>

           <div className="flex items-center space-x-4">
             {user ? (
               <>
                 <span className="text-sm text-gray-600">{user.email}</span>
                 <Button onClick={signOut} variant="outline" size="sm">
                   Logout
                 </Button>
               </>
             ) : (
               <Button href="/login" size="sm">
                 Login
               </Button>
             )}
           </div>
         </div>
       </header>
     )
   }
   ```

3. Create Sidebar component with sport navigation

**Deliverable:** Complete app layout with navigation

### Week 7: Core Pages

#### Task 3.4: Build Dashboard Page
**Priority:** High
**Estimated Time:** 6 hours

**Steps:**
1. Create dashboard page (`frontend/app/dashboard/page.tsx`):
   ```typescript
   'use client'

   import { useTodaysGames } from '@/hooks/useSportsData'
   import { GameCard } from '@/components/sports/GameCard'
   import { Card } from '@/components/ui/Card'

   export default function DashboardPage() {
     const { data: games, isLoading } = useTodaysGames()

     return (
       <div className="space-y-6">
         <div>
           <h2 className="text-3xl font-bold">Today's Games</h2>
           <p className="text-gray-600">
             {new Date().toLocaleDateString('en-US', {
               weekday: 'long',
               year: 'numeric',
               month: 'long',
               day: 'numeric'
             })}
           </p>
         </div>

         {isLoading ? (
           <div>Loading...</div>
         ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {games?.map((game) => (
               <GameCard key={game.id} game={game} />
             ))}
           </div>
         )}

         <Card>
           <h3 className="text-xl font-bold mb-4">Quick Stats</h3>
           {/* Add summary statistics */}
         </Card>
       </div>
     )
   }
   ```

**Deliverable:** Functional dashboard showing today's games

#### Task 3.5: Create Sports-Specific Components
**Priority:** High
**Estimated Time:** 8 hours

**Steps:**
1. Create GameCard component (`frontend/components/sports/GameCard.tsx`):
   ```typescript
   import { Game } from '@/types/sports.types'
   import { Card } from '@/components/ui/Card'
   import { Badge } from '@/components/ui/Badge'
   import { sportColors } from '@/lib/design-tokens'

   interface GameCardProps {
     game: Game
   }

   export function GameCard({ game }: GameCardProps) {
     return (
       <Card hover className="space-y-4">
         <div className="flex items-center justify-between">
           <Badge
             style={{ backgroundColor: sportColors[game.sport] }}
             className="text-white"
           >
             {game.sport.toUpperCase()}
           </Badge>
           <span className="text-sm text-gray-500">
             {new Date(game.gameDate).toLocaleTimeString('en-US', {
               hour: 'numeric',
               minute: '2-digit',
             })}
           </span>
         </div>

         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               {game.awayTeam.logo && (
                 <img
                   src={game.awayTeam.logo}
                   alt={game.awayTeam.name}
                   className="w-8 h-8"
                 />
               )}
               <span className="font-medium">{game.awayTeam.name}</span>
             </div>
             {game.awayScore !== undefined && (
               <span className="text-2xl font-bold">{game.awayScore}</span>
             )}
           </div>

           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               {game.homeTeam.logo && (
                 <img
                   src={game.homeTeam.logo}
                   alt={game.homeTeam.name}
                   className="w-8 h-8"
                 />
               )}
               <span className="font-medium">{game.homeTeam.name}</span>
             </div>
             {game.homeScore !== undefined && (
               <span className="text-2xl font-bold">{game.homeScore}</span>
             )}
           </div>
         </div>

         {game.odds && (
           <div className="border-t pt-4 space-y-1 text-sm">
             <div className="flex justify-between">
               <span className="text-gray-600">Spread:</span>
               <span className="font-medium">{game.odds.spread}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-gray-600">Total:</span>
               <span className="font-medium">{game.odds.total}</span>
             </div>
           </div>
         )}

         <Badge variant={
           game.status === 'live' ? 'success' :
           game.status === 'completed' ? 'secondary' :
           'default'
         }>
           {game.status}
         </Badge>
       </Card>
     )
   }
   ```

2. Create TeamCard component
3. Create PlayerCard component
4. Create StatsTable component
5. Create OddsDisplay component

**Deliverable:** Complete set of sports display components

### Week 8: State Management & Data Flow

#### Task 3.6: Implement Global State
**Priority:** Medium
**Estimated Time:** 4 hours

**Steps:**
1. Create Zustand stores (`frontend/stores/`):

   **`sportsStore.ts`:**
   ```typescript
   import { create } from 'zustand'
   import { Sport } from '@/types/sports.types'

   interface SportsState {
     selectedSport: Sport | 'all'
     setSelectedSport: (sport: Sport | 'all') => void
     favoriteTeams: string[]
     addFavoriteTeam: (teamId: string) => void
     removeFavoriteTeam: (teamId: string) => void
   }

   export const useSportsStore = create<SportsState>((set) => ({
     selectedSport: 'all',
     setSelectedSport: (sport) => set({ selectedSport: sport }),
     favoriteTeams: [],
     addFavoriteTeam: (teamId) =>
       set((state) => ({
         favoriteTeams: [...state.favoriteTeams, teamId]
       })),
     removeFavoriteTeam: (teamId) =>
       set((state) => ({
         favoriteTeams: state.favoriteTeams.filter(id => id !== teamId)
       })),
   }))
   ```

   **`uiStore.ts`:**
   ```typescript
   import { create } from 'zustand'

   interface UIState {
     sidebarOpen: boolean
     setSidebarOpen: (open: boolean) => void
     theme: 'light' | 'dark'
     setTheme: (theme: 'light' | 'dark') => void
   }

   export const useUIStore = create<UIState>((set) => ({
     sidebarOpen: true,
     setSidebarOpen: (open) => set({ sidebarOpen: open }),
     theme: 'light',
     setTheme: (theme) => set({ theme }),
   }))
   ```

2. Integrate stores with components

**Deliverable:** Global state management system

#### Task 3.7: Add React Query for Data Caching
**Priority:** High
**Estimated Time:** 3 hours

**Steps:**
1. Install React Query:
   ```bash
   npm install @tanstack/react-query
   ```

2. Create QueryProvider (`frontend/providers/QueryProvider.tsx`):
   ```typescript
   'use client'

   import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
   import { ReactNode, useState } from 'react'

   export function QueryProvider({ children }: { children: ReactNode }) {
     const [queryClient] = useState(() => new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 5 * 60 * 1000, // 5 minutes
           cacheTime: 10 * 60 * 1000, // 10 minutes
           refetchOnWindowFocus: false,
         },
       },
     }))

     return (
       <QueryClientProvider client={queryClient}>
         {children}
       </QueryClientProvider>
     )
   }
   ```

3. Wrap app in provider (`frontend/app/layout.tsx`):
   ```typescript
   import { QueryProvider } from '@/providers/QueryProvider'
   import { AuthProvider } from '@/contexts/AuthContext'

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <html lang="en">
         <body>
           <QueryProvider>
             <AuthProvider>
               {children}
             </AuthProvider>
           </QueryProvider>
         </body>
       </html>
     )
   }
   ```

**Deliverable:** Efficient data caching and fetching

#### Phase 3 Checklist

- [ ] Design system with color palette and typography
- [ ] UI component library (Button, Card, Input, etc.)
- [ ] Main layout with header and sidebar
- [ ] Dashboard page showing today's games
- [ ] Sports-specific components (GameCard, TeamCard, etc.)
- [ ] Global state management with Zustand
- [ ] React Query for data caching
- [ ] Responsive design (mobile + desktop)
- [ ] Loading and error states

**Phase 3 Journal Update:** Document component architecture, design decisions, and UI patterns

---

## Phase 4: Sports Features

**Duration:** 3 weeks
**Goal:** Build sport-specific features and advanced data displays

### Week 9: Game Details & Analysis

#### Task 4.1: Create Game Detail Page
**Priority:** High
**Estimated Time:** 6 hours

**Steps:**
1. Create dynamic route (`frontend/app/games/[sport]/[gameId]/page.tsx`)
2. Fetch game data with related stats
3. Display:
   - Full game information
   - Team stats comparison
   - Recent matchup history
   - Player stats (key players)
   - Betting odds breakdown
   - News related to game

**Deliverable:** Comprehensive game detail page

#### Task 4.2: Build Stats Comparison Tool
**Priority:** Medium
**Estimated Time:** 4 hours

**Steps:**
1. Create comparison component
2. Allow selecting 2 teams or players
3. Display side-by-side stats
4. Add visualizations (bar charts, radar charts)

**Deliverable:** Interactive comparison tool

### Week 10: Data Visualizations

#### Task 4.3: Implement Chart Components
**Priority:** High
**Estimated Time:** 6 hours

**Steps:**
1. Create reusable chart components using Recharts:
   - Line chart (trends over time)
   - Bar chart (comparisons)
   - Radar chart (player attributes)
   - Pie chart (win/loss records)

2. Create sport-specific visualizations:
   - NFL: Field position chart
   - NBA: Shot chart
   - MLB: Strike zone heat map
   - Soccer: Pitch position map

**Deliverable:** Rich data visualization library

#### Task 4.4: Build Team & Player Pages
**Priority:** Medium
**Estimated Time:** 4 hours

**Steps:**
1. Create team profile pages
2. Create player profile pages
3. Display historical stats
4. Show upcoming games
5. Add recent news

**Deliverable:** Complete team and player pages

### Week 11: Odds & Betting Features

#### Task 4.5: Create Betting Tracker
**Priority:** Medium
**Estimated Time:** 6 hours

**Steps:**
1. Create interface to log bets
2. Track bet results (win/loss/push)
3. Calculate ROI and profit/loss
4. Display betting history
5. Add filters and sorting

**Deliverable:** Full betting tracker feature

#### Task 4.6: Implement Odds Comparison
**Priority:** Medium
**Estimated Time:** 3 hours

**Steps:**
1. Display current odds for all games
2. Show odds movement over time
3. Highlight best odds
4. Calculate implied probability

**Deliverable:** Odds comparison feature

#### Phase 4 Checklist

- [ ] Game detail pages with full stats
- [ ] Stats comparison tool
- [ ] Chart component library
- [ ] Sport-specific visualizations
- [ ] Team profile pages
- [ ] Player profile pages
- [ ] Betting tracker
- [ ] Odds comparison display

**Phase 4 Journal Update:** Document feature implementations and user interaction patterns

---

## Phase 5: AI Integration

**Duration:** 2 weeks
**Goal:** Integrate Kimi K2 for chat interface

### Week 12: Chat Backend

#### Task 5.1: Create AI Chat Edge Function
**Priority:** Critical
**Estimated Time:** 6 hours

**Steps:**
1. Create Edge Function:
   ```bash
   supabase functions new ai-chat
   ```

2. Implement chat logic:
   - Accept user message
   - Retrieve relevant sports data (RAG)
   - Build context for AI
   - Call Kimi K2 API
   - Stream response back

3. Add conversation history management

**Deliverable:** Working AI chat backend

#### Task 5.2: Implement Prompt Engineering
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Create system prompts for sports analysis
2. Design prompt templates for different query types
3. Implement context injection
4. Add few-shot examples

**Deliverable:** Optimized AI prompts

### Week 13: Chat Frontend

#### Task 5.3: Build Chat Interface
**Priority:** Critical
**Estimated Time:** 8 hours

**Steps:**
1. Create chat UI components:
   - Message list
   - Message input
   - Typing indicator
   - Code/data display

2. Implement streaming responses
3. Add conversation history
4. Create new conversation functionality
5. Add conversation search

**Deliverable:** Full chat interface

#### Task 5.4: Add Quick Actions
**Priority:** Medium
**Estimated Time:** 3 hours

**Steps:**
1. Create quick action buttons:
   - "Today's best bets"
   - "Upset alerts"
   - "Team comparison"
   - "Player stats"

2. Pre-populate queries based on context

**Deliverable:** Enhanced chat UX with quick actions

#### Phase 5 Checklist

- [ ] AI chat Edge Function working
- [ ] Prompt engineering optimized
- [ ] Chat interface built
- [ ] Message streaming implemented
- [ ] Conversation history saved
- [ ] Quick action buttons
- [ ] Context-aware responses

**Phase 5 Journal Update:** Document AI integration, prompt strategies, and response quality

---

## Phase 6: Advanced Features

**Duration:** 2 weeks
**Goal:** Polish features and add advanced functionality

### Week 14: User Preferences & Personalization

#### Task 6.1: Build Settings Page
**Priority:** Medium
**Estimated Time:** 4 hours

**Steps:**
1. Create settings UI
2. Allow customizing:
   - Favorite sports
   - Favorite teams
   - Notification preferences
   - Display preferences

3. Save to database

**Deliverable:** Complete settings system

#### Task 6.2: Implement Notifications
**Priority:** Low
**Estimated Time:** 4 hours

**Steps:**
1. Create notification system
2. Add in-app notifications
3. (Optional) Email notifications

**Deliverable:** Notification system

### Week 15: Performance & Polish

#### Task 6.3: Optimize Performance
**Priority:** High
**Estimated Time:** 6 hours

**Steps:**
1. Optimize database queries (add indexes)
2. Implement lazy loading
3. Add image optimization
4. Bundle size optimization
5. Lighthouse audit and fixes

**Deliverable:** Optimized application

#### Task 6.4: Mobile Responsiveness
**Priority:** High
**Estimated Time:** 4 hours

**Steps:**
1. Test all pages on mobile
2. Fix layout issues
3. Optimize touch interactions
4. Test on different screen sizes

**Deliverable:** Fully responsive app

#### Phase 6 Checklist

- [ ] Settings page complete
- [ ] User preferences saved
- [ ] Notification system
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Accessibility improvements

---

## Phase 7: Testing & Launch

**Duration:** 2-3 weeks
**Goal:** Test, fix bugs, and launch

### Week 16: Testing

#### Task 7.1: Write Tests
**Priority:** High
**Estimated Time:** 8 hours

**Steps:**
1. Unit tests for utilities
2. Component tests
3. Integration tests
4. E2E tests (Playwright)

**Deliverable:** Comprehensive test suite

#### Task 7.2: Bug Fixes
**Priority:** Critical
**Estimated Time:** Ongoing

**Steps:**
1. Test all features end-to-end
2. Fix identified bugs
3. Test edge cases
4. Performance testing

**Deliverable:** Stable application

### Week 17-18: Launch

#### Task 7.3: Prepare for Launch
**Priority:** Critical
**Estimated Time:** 4 hours

**Steps:**
1. Final security audit
2. Set up monitoring (Sentry, LogRocket)
3. Prepare documentation
4. Create user guide

**Deliverable:** Launch-ready application

#### Task 7.4: Deploy to Production
**Priority:** Critical
**Estimated Time:** 2 hours

**Steps:**
1. Deploy to Netlify
2. Verify all environment variables
3. Test production build
4. Monitor for errors

**Deliverable:** Live application

#### Phase 7 Checklist

- [ ] Test suite written and passing
- [ ] All major bugs fixed
- [ ] Security audit complete
- [ ] Monitoring set up
- [ ] Documentation complete
- [ ] Production deployment successful
- [ ] Post-launch monitoring

---

## Development Priorities

### Must Have (P0)
1. User authentication
2. Database schema and data pipeline
3. Today's games display
4. Basic chat interface
5. Game details
6. Mobile responsive

### Should Have (P1)
1. Betting tracker
2. Stats comparison
3. Team/player pages
4. Data visualizations
5. Settings page

### Nice to Have (P2)
1. Notifications
2. Advanced charts
3. Historical data analysis
4. Social features
5. Dark mode

---

## Risk Mitigation

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Data source unavailable | High | Medium | Multiple data sources, fallback to cached data |
| AI API downtime | High | Low | Graceful degradation, cached responses |
| Database performance | Medium | Medium | Proper indexing, query optimization |
| Frontend bundle size | Medium | Medium | Code splitting, lazy loading |
| Authentication issues | High | Low | Use proven Supabase Auth |

### Timeline Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Feature creep | High | Strict prioritization, MVP focus |
| Underestimated complexity | Medium | Buffer time built in, iterative development |
| Data integration delays | High | Start data pipeline early, manual uploads if needed |

---

## Success Metrics

### Technical Metrics
- Page load time < 2s
- Time to interactive < 3s
- Database query time < 100ms
- 95%+ test coverage

### User Metrics
- Daily active users
- Chat messages per user
- Return rate (7-day)
- Feature adoption rate

---

## Next Steps

1. **Review this plan** with team/stakeholders
2. **Create DATABASE_SCHEMA.md** (next task)
3. **Set up journal system** in `.github/journals/`
4. **Begin Phase 1** development

---

**Document Version:** 1.0
**Created:** 2025-11-12
**Estimated Completion:** April 2026 (16-18 weeks)
**Next Review:** After Phase 1 completion

## Unresolved Questions

1. Exact data source for daily updates? (CSV upload, specific API, web scraping?)
2. Kimi K2 API access details and rate limits?
3. Budget for Supabase (free tier sufficient for MVP?)
4. Target number of users for launch?
5. Specific sports leagues? (NFL only or include CFL? NBA + G League?)
