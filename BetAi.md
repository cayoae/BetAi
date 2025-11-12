# BetAI - Sports AI Agent Platform

## Project Overview
A specialized AI agent platform focused exclusively on sports analysis, providing daily-updated insights, statistics, and betting odds analysis for Soccer, MLB, NFL, NBA, and WNBA. The platform features a ChatGPT-like interface grounded entirely in daily-refreshed sports data.

**Key Difference:** This platform uses **daily batch data updates** instead of real-time API calls, making it cost-effective while still providing current information for betting decisions.

**Tech Stack:**
- **Frontend:** React/Next.js with TypeScript
- **Backend:** Supabase (PostgreSQL Database, Auth, Edge Functions)
- **AI Model:** Kimi K2 Thinking
- **Deployment:** Netlify (Frontend), Supabase (Backend)
- **Data Strategy:** Daily batch updates (6 AM ET) via Edge Functions
- **Data Sources:** Daily data files (CSV/JSON), manual uploads initially, automated ingestion later

---

## Roadmap Overview

**Total Timeline:** 16-18 weeks (4-4.5 months)
**Development Approach:** Phased implementation with daily batch data updates

For complete detailed planning, see `PLANNING.md`
For complete database schema, see `DATABASE_SCHEMA.md`
For development guidelines, see `claude.md`

---

## Roadmap & Sprint Breakdown

### 🎯 Phase 1: Foundation & Setup (Week 1-2)

#### Goals:
- [ ] Initialize GitHub repository
- [ ] Set up project structure and development environment
- [ ] Configure Netlify and Supabase accounts
- [ ] Set up basic CI/CD pipeline

#### Tasks:
1. **Repository Setup**
   - Create GitHub repository `BetAI`
   - Set up branch protection rules
   - Configure GitHub Actions for deployment

2. **Development Environment**
   - Initialize Next.js project with TypeScript
   - Set up ESLint and Prettier
   - Configure Tailwind CSS for styling
   - Set up environment variables structure

3. **Infrastructure Setup**
   - Create Supabase project
   - Set up database schemas for users, sports data
   - Configure Netlify site
   - Set up environment variables for local and production

4. **Basic Authentication**
   - Implement Supabase Auth
   - Create login/register pages
   - Set up protected routes

**Deliverable:** Working development environment with authentication

---

### 🎯 Phase 2: Database & Data Pipeline (Week 3-5)

#### Goals:
- [ ] Design and implement complete database schema
- [ ] Set up daily data ingestion pipeline
- [ ] Create data models and TypeScript types
- [ ] Implement automated daily updates

#### Tasks:
1. **Database Design**
   - Implement complete schema (see DATABASE_SCHEMA.md)
   - Create tables for all 5 sports (teams, players, games, odds, stats)
   - Set up relationships, indexes, and constraints
   - Implement Row Level Security policies

2. **Data Pipeline Development**
   - Create Supabase Edge Function for data ingestion
   - Implement CSV/JSON file parsing and validation
   - Set up daily cron jobs (6 AM ET)
   - Create data transformation and normalization logic
   - Implement error handling and retry mechanisms

3. **TypeScript Integration**
   - Generate Supabase types
   - Create domain-specific types (Game, Team, Player, etc.)
   - Build database access layer with CRUD operations
   - Create custom React hooks (useTodaysGames, useWeekGames)

4. **Data Quality & Monitoring**
   - Create data validation checks
   - Implement ingestion logging system
   - Set up data freshness monitoring
   - Create manual data upload process documentation

**Deliverable:** Complete database with automated daily data updates

---

### 🎯 Phase 3: Frontend Core (Week 6-8)

#### Goals:
- [ ] Build React component library
- [ ] Create main layout and navigation
- [ ] Implement dashboard with today's games
- [ ] Build sports-specific display components

#### Key Components:
- Design system with Tailwind CSS
- Reusable UI components (Button, Card, Badge, Modal)
- Main layout with Header and Sidebar
- Dashboard page showing today's games across all sports
- GameCard, TeamCard, PlayerCard components
- Global state management with Zustand
- React Query for data caching and fetching

**Deliverable:** Fully functional frontend displaying sports data

---

### 🎯 Phase 4: Sports Features (Week 9-11)

#### Goals:
- [ ] Build game detail pages
- [ ] Create data visualization components
- [ ] Implement team and player profile pages
- [ ] Add betting tracker and odds comparison

#### Key Features:
- Comprehensive game detail pages with stats
- Stats comparison tool (team vs team, player vs player)
- Interactive charts (Recharts: line, bar, radar, pie)
- Sport-specific visualizations (field position, shot charts, etc.)
- Betting tracker with ROI calculations
- Odds display and comparison

**Deliverable:** Complete sports analysis features

---

### 🎯 Phase 5: AI Integration (Week 12-13)

#### Goals:
- [ ] Integrate Kimi K2 Thinking API
- [ ] Build ChatGPT-like chat interface
- [ ] Implement RAG system for context retrieval
- [ ] Create conversation management

#### Key Tasks:
1. **AI Chat Backend**
   - Create AI chat Edge Function
   - Implement context retrieval from sports data (RAG)
   - Build prompts for sports analysis
   - Set up streaming responses

2. **Chat Interface**
   - Build message list and input components
   - Implement streaming message display
   - Add conversation history
   - Create quick action buttons ("Today's best bets", etc.)
   - Add markdown rendering for AI responses

**Deliverable:** Fully functional AI chat with sports context

---

### 🎯 Phase 6: Advanced Features & Polish (Week 14-15)

#### Goals:
- [ ] Build user preferences system
- [ ] Add notifications
- [ ] Optimize performance
- [ ] Ensure mobile responsiveness

#### Key Tasks:
- Settings page for user customization
- Favorite sports and teams
- In-app notification system
- Performance optimization (bundle size, lazy loading, query optimization)
- Mobile responsiveness testing and fixes
- Accessibility improvements

**Deliverable:** Polished, performant, mobile-ready application

---

### 🎯 Phase 7: Testing & Launch (Week 16-18)

#### Goals:
- [ ] Write comprehensive tests
- [ ] Fix all bugs
- [ ] Perform security audit
- [ ] Deploy to production

#### Key Tasks:
1. **Testing**
   - Unit tests for utilities and components
   - Integration tests for data flow
   - E2E tests with Playwright
   - Performance testing

2. **Bug Fixes & Polish**
   - Test all features end-to-end
   - Fix identified bugs
   - Handle edge cases
   - Polish UI/UX

3. **Launch Preparation**
   - Security audit
   - Set up monitoring (error tracking, analytics)
   - Prepare documentation
   - Create user guide

4. **Production Deployment**
   - Deploy frontend to Netlify
   - Verify all environment variables
   - Test production build
   - Monitor for errors post-launch

**Deliverable:** Live, production-ready BetAI platform

**Note:** Previous sprints 8-10 have been consolidated into Phase 7 above. See `PLANNING.md` for complete details.

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER BROWSER                              │
│  React Frontend (Netlify) - TypeScript + Tailwind          │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE BACKEND                             │
│  ┌─────────────┬──────────────┬──────────────┐            │
│  │ PostgreSQL  │ Edge Functions│ Auth         │            │
│  │ Database    │ (Deno)        │              │            │
│  └─────────────┴──────────────┴──────────────┘            │
└─────────────────┬───────────────────────────────────────────┘
                  │ Daily Updates (Cron)
                  ▼
┌─────────────────────────────────────────────────────────────┐
│           DAILY DATA FILES (CSV/JSON)                        │
│  Uploaded to Supabase Storage or fetched by Edge Function   │
└─────────────────────────────────────────────────────────────┘
```

### Frontend Architecture (Next.js App Router)
```
frontend/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   ├── games/
│   │   └── [sport]/
│   │       └── [gameId]/
│   ├── chat/
│   └── settings/
├── components/
│   ├── ui/                   # Base UI components
│   ├── sports/               # Sports-specific components
│   ├── chat/                 # Chat interface
│   └── layout/               # Layout components
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Client-side Supabase
│   │   └── server.ts         # Server-side Supabase
│   ├── database/             # DB access layer
│   └── utils.ts
├── hooks/                    # Custom React hooks
├── stores/                   # Zustand state stores
├── types/                    # TypeScript types
└── providers/                # Context providers
```

### Backend Architecture (Supabase)
```
supabase/
├── functions/                # Edge Functions (Deno)
│   ├── ingest-sports-data/   # Daily data ingestion
│   ├── ai-chat/              # AI chat integration
│   └── validate-data/        # Data validation
├── migrations/               # Database migrations
│   └── 20250112_initial_schema.sql
└── seed/                     # Seed data

Database Tables (per sport: nfl, nba, mlb, wnba, soccer):
- {sport}_teams               # Team information
- {sport}_players             # Player information
- {sport}_games               # Games and scores
- {sport}_game_odds           # Betting odds
- {sport}_team_stats          # Team statistics
- {sport}_player_stats        # Player statistics

User Tables:
- user_profiles
- user_preferences
- user_favorite_teams
- user_bets
- chat_conversations
- chat_messages
- user_notifications

System Tables:
- data_ingestion_logs
- sports_news
- system_config
```

### Data Flow

**Daily Update Flow:**
```
Cron (6 AM ET) → Edge Function → Fetch CSV/JSON →
Validate & Transform → Update PostgreSQL → Log Results
```

**User Query Flow:**
```
User Input → Frontend → Edge Function → Query DB for Context →
Build Prompt → Kimi K2 API → Stream Response → Frontend Display
```

For complete database schema, see `DATABASE_SCHEMA.md`

---

## Data Sources & Strategy

### Data Approach
**Daily Batch Updates** instead of real-time API calls

### Data Sources

1. **Initial Phase (Manual Upload)**
   - CSV/JSON files uploaded to Supabase Storage
   - Daily manual updates until automation is established
   - Format: Standardized schemas for each sport

2. **Automated Phase (Future)**
   - Scheduled web scraping from public sources
   - Integration with free sports data APIs (if available)
   - News aggregation APIs (NewsAPI.org, Bing News)

3. **Data Types Needed**
   - **Games:** Schedule, scores, status (today + this week)
   - **Teams:** Names, logos, stats, records
   - **Players:** Names, positions, key stats
   - **Odds:** Moneyline, spread, total (from various bookmakers)
   - **News:** Recent articles affecting games/teams

### Update Schedule
- **6 AM ET Daily:** Games, odds, overnight results
- **8 AM ET Daily:** Updated stats after games complete
- **Every 6 hours:** News updates (optional)
- **Weekly (Sundays):** Historical data compilation

### AI Integration
- **Kimi K2 Thinking** - Primary language model for chat
- **RAG System** - Retrieves relevant sports data for context
- **Prompt Engineering** - Sport-specific templates

---

## Deployment Strategy

### Netlify Configuration
- **Build Command:** `npm run build`
- **Publish Directory:** `out/` or `.next/`
- **Environment Variables:** API keys, Supabase URL
- **Functions:** Serverless functions for specific tasks

### Supabase Configuration
- **Database:** PostgreSQL with Row Level Security
- **Auth:** Email/password, OAuth providers
- **Storage:** For user uploads, images
- **Edge Functions:** For data processing and AI integration

### CI/CD Pipeline
1. **GitHub Actions** for testing and building
2. **Automatic deployment** to Netlify on merge to main
3. **Database migrations** managed through Supabase CLI
4. **Environment promotion** from dev → staging → production

---

## Success Metrics

### Technical Metrics
- Response time < 2 seconds
- 99.9% uptime
- Support for 1000+ concurrent users
- Data freshness < 5 minutes

### Business Metrics
- User acquisition rate
- Daily active users
- User retention rate
- Query success rate
- User satisfaction score

---

## Future Enhancements (Post v1.0)

- [ ] Additional sports (NHL, MLS, etc.)
- [ ] Multi-language support
- [ ] Voice interface
- [ ] Mobile app (React Native)
- [ ] Advanced machine learning models
- [ ] Community features (forums, tips)
- [ ] Premium subscription tiers
- [ ] Integration with betting platforms
- [ ] Real-time video analysis
- [ ] Fantasy sports integration

---

## Risk Mitigation

### Technical Risks
- **API Rate Limits:** Implement caching and request optimization
- **Data Accuracy:** Multiple data source validation
- **AI Model Downtime:** Fallback responses and status monitoring
- **Scalability:** Progressive loading and database optimization

### Business Risks
- **Legal/Compliance:** Consult with legal team on betting regulations
- **Data Costs:** Optimize API usage and implement usage monitoring
- **User Adoption:** Focus on UX and provide clear value proposition

---

## Team Requirements

### Core Team
- **Full-stack Developer** (React/Next.js, TypeScript)
- **Backend Developer** (Supabase, PostgreSQL)
- **AI/ML Engineer** (Prompt engineering, RAG systems)
- **DevOps Engineer** (Deployment, monitoring)
- **UI/UX Designer** (Interface design, user experience)

### Estimated Timeline
- **Total Development Time:** 20 weeks (5 months)
- **Beta Launch:** Week 18
- **Public Launch:** Week 20

---

## Budget Estimates

### Development Costs (Solo Developer or Small Team)
- **Development Time:** 16-18 weeks
- **Freelance Rate:** ~$5,000 - $15,000 (if outsourcing)

### Monthly Operating Costs
- **Supabase:** $0 (Free tier) → $25/month (Pro) as you scale
- **Netlify:** $0 (Free tier) → $19/month (Pro) if needed
- **Kimi K2 API:** ~$50 - $200/month (based on usage)
- **Data Sources:** $0 (manual/free sources) → $50 - $200/month (premium APIs)
- **Domain:** ~$15/year
- **Monitoring/Analytics:** $0 (free tier services)

### Initial Launch Budget
- **Minimum:** $0 - $100/month (all free tiers + manual data)
- **Recommended:** $100 - $300/month (paid tiers for better limits)
- **Scaling:** $500+/month (as user base grows)

### Total Estimated Cost for MVP: $500 - $2,000 (first 3-6 months)

---

**Document Version:** 2.0
**Last Updated:** 2025-11-12
**Architecture:** Daily batch updates (no real-time APIs)
**Next Review:** After Phase 1 completion

---

## Quick Links

- 📋 **[PLANNING.md](PLANNING.md)** - Complete step-by-step development plan with detailed tasks
- 🗄️ **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Complete database design for all 5 sports
- 📝 **[claude.md](claude.md)** - Development guidelines and journal system
- 🔗 **GitHub Issues** - Track individual tasks and bugs
- 📊 **Project Journals** - `.github/journals/` for development documentation