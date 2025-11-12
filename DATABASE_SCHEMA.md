# BetAI - Complete Database Schema

**Database:** PostgreSQL (Supabase)
**Version:** 1.0
**Last Updated:** 2025-11-12

---

## Table of Contents

1. [Overview](#overview)
2. [Schema Diagram](#schema-diagram)
3. [Core Tables](#core-tables)
4. [Sport-Specific Tables](#sport-specific-tables)
5. [User Tables](#user-tables)
6. [AI & Chat Tables](#ai--chat-tables)
7. [System Tables](#system-tables)
8. [Indexes](#indexes)
9. [Row Level Security](#row-level-security)
10. [Triggers & Functions](#triggers--functions)

---

## Overview

### Design Principles

1. **Sport Separation:** Each sport has its own set of tables (teams, games, players, stats)
2. **Normalization:** Data is normalized to 3NF to reduce redundancy
3. **Flexibility:** JSON columns for sport-specific stats that vary
4. **Performance:** Strategic indexing for common queries
5. **Security:** Row Level Security (RLS) for user data

### Naming Conventions

- **Tables:** `snake_case`, plural (e.g., `nfl_games`)
- **Columns:** `snake_case` (e.g., `home_team_id`)
- **Primary Keys:** `id` (UUID)
- **Foreign Keys:** `{referenced_table}_id` (e.g., `team_id`)
- **Timestamps:** `created_at`, `updated_at`
- **Indexes:** `idx_{table}_{column(s)}`

---

## Schema Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CORE TABLES                               │
├─────────────────────────────────────────────────────────────────┤
│ • users (Supabase Auth)                                         │
│ • user_profiles                                                  │
│ • user_preferences                                               │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ References
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SPORT TABLES                                │
│                  (Per Sport: NFL, NBA, MLB, WNBA, Soccer)       │
├─────────────────────────────────────────────────────────────────┤
│ • {sport}_teams                                                 │
│ • {sport}_players                                               │
│ • {sport}_games                                                 │
│ • {sport}_game_odds                                             │
│ • {sport}_team_stats                                            │
│ • {sport}_player_stats                                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ References
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      USER INTERACTION                            │
├─────────────────────────────────────────────────────────────────┤
│ • user_bets                                                      │
│ • user_favorite_teams                                            │
│ • chat_conversations                                             │
│ • chat_messages                                                  │
│ • user_notifications                                             │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      SYSTEM TABLES                               │
├─────────────────────────────────────────────────────────────────┤
│ • data_ingestion_logs                                            │
│ • sports_news                                                    │
│ • system_config                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Tables

### 1. user_profiles

Extends Supabase Auth users with additional profile information.

```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_email ON user_profiles(email);
```

### 2. user_preferences

User customization and preferences.

```sql
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  favorite_sports TEXT[] DEFAULT '{}', -- Array of sport codes
  default_odds_format TEXT DEFAULT 'american', -- american, decimal, fractional
  notifications_enabled BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  theme TEXT DEFAULT 'light', -- light, dark
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
```

### 3. user_favorite_teams

Many-to-many relationship for user favorite teams across all sports.

```sql
CREATE TABLE user_favorite_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  sport TEXT NOT NULL CHECK (sport IN ('nfl', 'nba', 'mlb', 'wnba', 'soccer')),
  team_id UUID NOT NULL, -- References sport-specific team table
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, sport, team_id)
);

CREATE INDEX idx_user_favorite_teams_user_id ON user_favorite_teams(user_id);
CREATE INDEX idx_user_favorite_teams_sport_team ON user_favorite_teams(sport, team_id);
```

---

## Sport-Specific Tables

All sport-specific tables follow the same pattern with variations for sport-specific fields.

### Pattern: {sport}_teams

**Sports:** `nfl`, `nba`, `mlb`, `wnba`, `soccer`

#### NFL Teams

```sql
CREATE TABLE nfl_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE, -- ID from data source
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE, -- e.g., 'KC', 'SF'
  conference TEXT CHECK (conference IN ('AFC', 'NFC')),
  division TEXT, -- e.g., 'West', 'East'
  logo_url TEXT,
  stadium_name TEXT,
  stadium_capacity INTEGER,
  founded_year INTEGER,
  colors JSONB, -- {primary: '#color', secondary: '#color'}
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nfl_teams_abbreviation ON nfl_teams(abbreviation);
CREATE INDEX idx_nfl_teams_conference ON nfl_teams(conference);
```

#### NBA Teams

```sql
CREATE TABLE nba_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  conference TEXT CHECK (conference IN ('Eastern', 'Western')),
  division TEXT, -- e.g., 'Atlantic', 'Central', 'Southeast'
  logo_url TEXT,
  arena_name TEXT,
  arena_capacity INTEGER,
  founded_year INTEGER,
  colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nba_teams_abbreviation ON nba_teams(abbreviation);
CREATE INDEX idx_nba_teams_conference ON nba_teams(conference);
```

#### MLB Teams

```sql
CREATE TABLE mlb_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  league TEXT CHECK (league IN ('AL', 'NL')), -- American League, National League
  division TEXT, -- e.g., 'East', 'Central', 'West'
  logo_url TEXT,
  stadium_name TEXT,
  stadium_capacity INTEGER,
  founded_year INTEGER,
  colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mlb_teams_abbreviation ON mlb_teams(abbreviation);
CREATE INDEX idx_mlb_teams_league ON mlb_teams(league);
```

#### WNBA Teams

```sql
CREATE TABLE wnba_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  abbreviation TEXT NOT NULL UNIQUE,
  conference TEXT CHECK (conference IN ('Eastern', 'Western')),
  logo_url TEXT,
  arena_name TEXT,
  arena_capacity INTEGER,
  founded_year INTEGER,
  colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wnba_teams_abbreviation ON wnba_teams(abbreviation);
```

#### Soccer Teams

```sql
CREATE TABLE soccer_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  name TEXT NOT NULL,
  city TEXT,
  abbreviation TEXT NOT NULL,
  league TEXT, -- e.g., 'Premier League', 'La Liga', 'MLS'
  country TEXT,
  logo_url TEXT,
  stadium_name TEXT,
  stadium_capacity INTEGER,
  founded_year INTEGER,
  colors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(name, league)
);

CREATE INDEX idx_soccer_teams_league ON soccer_teams(league);
CREATE INDEX idx_soccer_teams_country ON soccer_teams(country);
```

### Pattern: {sport}_players

#### NFL Players

```sql
CREATE TABLE nfl_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  team_id UUID REFERENCES nfl_teams(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER,
  position TEXT NOT NULL, -- QB, RB, WR, TE, etc.
  position_category TEXT, -- offense, defense, special_teams
  height INTEGER, -- inches
  weight INTEGER, -- pounds
  age INTEGER,
  college TEXT,
  years_pro INTEGER,
  status TEXT DEFAULT 'active', -- active, injured, suspended, retired
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nfl_players_team_id ON nfl_players(team_id);
CREATE INDEX idx_nfl_players_position ON nfl_players(position);
CREATE INDEX idx_nfl_players_last_name ON nfl_players(last_name);
CREATE INDEX idx_nfl_players_full_name ON nfl_players(full_name);
```

#### NBA Players

```sql
CREATE TABLE nba_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  team_id UUID REFERENCES nba_teams(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER,
  position TEXT NOT NULL, -- PG, SG, SF, PF, C
  height INTEGER, -- inches
  weight INTEGER, -- pounds
  age INTEGER,
  college TEXT,
  years_pro INTEGER,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nba_players_team_id ON nba_players(team_id);
CREATE INDEX idx_nba_players_position ON nba_players(position);
CREATE INDEX idx_nba_players_full_name ON nba_players(full_name);
```

#### MLB Players

```sql
CREATE TABLE mlb_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  team_id UUID REFERENCES mlb_teams(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER,
  position TEXT NOT NULL, -- P, C, 1B, 2B, 3B, SS, OF
  bats TEXT, -- L, R, S (switch)
  throws TEXT, -- L, R
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  years_pro INTEGER,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mlb_players_team_id ON mlb_players(team_id);
CREATE INDEX idx_mlb_players_position ON mlb_players(position);
CREATE INDEX idx_mlb_players_full_name ON mlb_players(full_name);
```

#### WNBA Players

```sql
CREATE TABLE wnba_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  team_id UUID REFERENCES wnba_teams(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER,
  position TEXT NOT NULL, -- G, F, C
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  college TEXT,
  years_pro INTEGER,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wnba_players_team_id ON wnba_players(team_id);
CREATE INDEX idx_wnba_players_full_name ON wnba_players(full_name);
```

#### Soccer Players

```sql
CREATE TABLE soccer_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  team_id UUID REFERENCES soccer_teams(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  jersey_number INTEGER,
  position TEXT NOT NULL, -- GK, DF, MF, FW
  nationality TEXT,
  height INTEGER,
  weight INTEGER,
  age INTEGER,
  status TEXT DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_soccer_players_team_id ON soccer_players(team_id);
CREATE INDEX idx_soccer_players_position ON soccer_players(position);
CREATE INDEX idx_soccer_players_full_name ON soccer_players(full_name);
```

### Pattern: {sport}_games

#### NFL Games

```sql
CREATE TABLE nfl_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  season INTEGER NOT NULL,
  week INTEGER NOT NULL,
  game_date DATE NOT NULL,
  game_time TIME,
  game_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    (game_date::TEXT || ' ' || COALESCE(game_time::TEXT, '00:00:00'))::TIMESTAMP WITH TIME ZONE
  ) STORED,
  home_team_id UUID NOT NULL REFERENCES nfl_teams(id),
  away_team_id UUID NOT NULL REFERENCES nfl_teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled', -- scheduled, live, halftime, completed, postponed, cancelled
  quarter TEXT, -- 1Q, 2Q, 3Q, 4Q, OT, Final
  time_remaining TEXT, -- e.g., '5:23'
  stadium TEXT,
  weather JSONB, -- {temp: 72, condition: 'clear', wind: '5 mph'}
  broadcast_network TEXT,
  attendance INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_nfl_games_game_date ON nfl_games(game_date);
CREATE INDEX idx_nfl_games_season_week ON nfl_games(season, week);
CREATE INDEX idx_nfl_games_home_team ON nfl_games(home_team_id);
CREATE INDEX idx_nfl_games_away_team ON nfl_games(away_team_id);
CREATE INDEX idx_nfl_games_status ON nfl_games(status);
```

#### NBA Games

```sql
CREATE TABLE nba_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  season TEXT NOT NULL, -- e.g., '2024-25'
  game_date DATE NOT NULL,
  game_time TIME,
  game_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    (game_date::TEXT || ' ' || COALESCE(game_time::TEXT, '00:00:00'))::TIMESTAMP WITH TIME ZONE
  ) STORED,
  home_team_id UUID NOT NULL REFERENCES nba_teams(id),
  away_team_id UUID NOT NULL REFERENCES nba_teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  quarter TEXT, -- 1Q, 2Q, 3Q, 4Q, OT, Final
  time_remaining TEXT,
  arena TEXT,
  broadcast_network TEXT,
  attendance INTEGER,
  is_playoff BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_nba_games_game_date ON nba_games(game_date);
CREATE INDEX idx_nba_games_season ON nba_games(season);
CREATE INDEX idx_nba_games_home_team ON nba_games(home_team_id);
CREATE INDEX idx_nba_games_away_team ON nba_games(away_team_id);
CREATE INDEX idx_nba_games_status ON nba_games(status);
```

#### MLB Games

```sql
CREATE TABLE mlb_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  season INTEGER NOT NULL,
  game_date DATE NOT NULL,
  game_time TIME,
  game_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    (game_date::TEXT || ' ' || COALESCE(game_time::TEXT, '00:00:00'))::TIMESTAMP WITH TIME ZONE
  ) STORED,
  home_team_id UUID NOT NULL REFERENCES mlb_teams(id),
  away_team_id UUID NOT NULL REFERENCES mlb_teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  inning TEXT, -- '1st', '2nd', ..., 'Final'
  inning_half TEXT, -- 'top', 'bottom'
  stadium TEXT,
  weather JSONB,
  broadcast_network TEXT,
  attendance INTEGER,
  is_playoff BOOLEAN DEFAULT false,
  doubleheader_number INTEGER, -- 1 or 2 for doubleheaders
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_mlb_games_game_date ON mlb_games(game_date);
CREATE INDEX idx_mlb_games_season ON mlb_games(season);
CREATE INDEX idx_mlb_games_home_team ON mlb_games(home_team_id);
CREATE INDEX idx_mlb_games_away_team ON mlb_games(away_team_id);
CREATE INDEX idx_mlb_games_status ON mlb_games(status);
```

#### WNBA Games

```sql
CREATE TABLE wnba_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  season INTEGER NOT NULL,
  game_date DATE NOT NULL,
  game_time TIME,
  game_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    (game_date::TEXT || ' ' || COALESCE(game_time::TEXT, '00:00:00'))::TIMESTAMP WITH TIME ZONE
  ) STORED,
  home_team_id UUID NOT NULL REFERENCES wnba_teams(id),
  away_team_id UUID NOT NULL REFERENCES wnba_teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  quarter TEXT,
  time_remaining TEXT,
  arena TEXT,
  broadcast_network TEXT,
  attendance INTEGER,
  is_playoff BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_wnba_games_game_date ON wnba_games(game_date);
CREATE INDEX idx_wnba_games_season ON wnba_games(season);
CREATE INDEX idx_wnba_games_home_team ON wnba_games(home_team_id);
CREATE INDEX idx_wnba_games_away_team ON wnba_games(away_team_id);
CREATE INDEX idx_wnba_games_status ON wnba_games(status);
```

#### Soccer Games

```sql
CREATE TABLE soccer_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT UNIQUE,
  league TEXT NOT NULL,
  season TEXT NOT NULL,
  matchday INTEGER, -- Round/gameweek number
  game_date DATE NOT NULL,
  game_time TIME,
  game_datetime TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
    (game_date::TEXT || ' ' || COALESCE(game_time::TEXT, '00:00:00'))::TIMESTAMP WITH TIME ZONE
  ) STORED,
  home_team_id UUID NOT NULL REFERENCES soccer_teams(id),
  away_team_id UUID NOT NULL REFERENCES soccer_teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status TEXT DEFAULT 'scheduled',
  minute TEXT, -- e.g., '45+2', '90'
  stadium TEXT,
  referee TEXT,
  attendance INTEGER,
  competition_stage TEXT, -- e.g., 'Group Stage', 'Knockout', 'Final'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (home_team_id != away_team_id)
);

CREATE INDEX idx_soccer_games_game_date ON soccer_games(game_date);
CREATE INDEX idx_soccer_games_league ON soccer_games(league);
CREATE INDEX idx_soccer_games_season ON soccer_games(season);
CREATE INDEX idx_soccer_games_home_team ON soccer_games(home_team_id);
CREATE INDEX idx_soccer_games_away_team ON soccer_games(away_team_id);
CREATE INDEX idx_soccer_games_status ON soccer_games(status);
```

### Pattern: {sport}_game_odds

Betting odds for each game.

#### NFL Game Odds

```sql
CREATE TABLE nfl_game_odds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES nfl_games(id) ON DELETE CASCADE,
  bookmaker TEXT, -- e.g., 'DraftKings', 'FanDuel'

  -- Moneyline
  home_moneyline INTEGER, -- e.g., -150, +120
  away_moneyline INTEGER,

  -- Spread
  spread DECIMAL(4,1), -- e.g., -3.5, +7.0
  home_spread_odds INTEGER, -- e.g., -110
  away_spread_odds INTEGER,

  -- Total (Over/Under)
  total DECIMAL(4,1), -- e.g., 47.5
  over_odds INTEGER, -- e.g., -105
  under_odds INTEGER,

  -- Timestamps
  odds_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nfl_game_odds_game_id ON nfl_game_odds(game_id);
CREATE INDEX idx_nfl_game_odds_bookmaker ON nfl_game_odds(bookmaker);
CREATE INDEX idx_nfl_game_odds_timestamp ON nfl_game_odds(odds_timestamp DESC);
```

**Note:** Similar tables for NBA, MLB, WNBA, Soccer with same structure.

```sql
-- Copy pattern for other sports
CREATE TABLE nba_game_odds (/* same structure */);
CREATE TABLE mlb_game_odds (/* same structure */);
CREATE TABLE wnba_game_odds (/* same structure */);
CREATE TABLE soccer_game_odds (/* same structure with appropriate FKs */);
```

### Pattern: {sport}_team_stats

Season and game-level team statistics.

#### NFL Team Stats

```sql
CREATE TABLE nfl_team_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES nfl_teams(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  week INTEGER, -- NULL for season totals

  -- Win/Loss Record
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  ties INTEGER DEFAULT 0,

  -- Offensive Stats
  points_scored INTEGER DEFAULT 0,
  total_yards INTEGER DEFAULT 0,
  passing_yards INTEGER DEFAULT 0,
  rushing_yards INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,

  -- Defensive Stats
  points_allowed INTEGER DEFAULT 0,
  yards_allowed INTEGER DEFAULT 0,
  sacks INTEGER DEFAULT 0,
  interceptions INTEGER DEFAULT 0,
  fumbles_recovered INTEGER DEFAULT 0,

  -- Additional stats as JSON for flexibility
  additional_stats JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(team_id, season, week)
);

CREATE INDEX idx_nfl_team_stats_team_season ON nfl_team_stats(team_id, season);
CREATE INDEX idx_nfl_team_stats_season_week ON nfl_team_stats(season, week);
```

#### NBA Team Stats

```sql
CREATE TABLE nba_team_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES nba_teams(id) ON DELETE CASCADE,
  season TEXT NOT NULL,
  game_date DATE, -- NULL for season totals

  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,

  -- Scoring
  points INTEGER DEFAULT 0,
  field_goals_made INTEGER DEFAULT 0,
  field_goals_attempted INTEGER DEFAULT 0,
  three_pointers_made INTEGER DEFAULT 0,
  three_pointers_attempted INTEGER DEFAULT 0,
  free_throws_made INTEGER DEFAULT 0,
  free_throws_attempted INTEGER DEFAULT 0,

  -- Other Stats
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  steals INTEGER DEFAULT 0,
  blocks INTEGER DEFAULT 0,
  turnovers INTEGER DEFAULT 0,

  additional_stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(team_id, season, game_date)
);

CREATE INDEX idx_nba_team_stats_team_season ON nba_team_stats(team_id, season);
```

#### MLB Team Stats

```sql
CREATE TABLE mlb_team_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES mlb_teams(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  game_date DATE, -- NULL for season totals

  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,

  -- Batting Stats
  runs INTEGER DEFAULT 0,
  hits INTEGER DEFAULT 0,
  home_runs INTEGER DEFAULT 0,
  rbi INTEGER DEFAULT 0,
  batting_average DECIMAL(4,3),
  on_base_percentage DECIMAL(4,3),
  slugging_percentage DECIMAL(4,3),

  -- Pitching Stats
  earned_runs_allowed INTEGER DEFAULT 0,
  innings_pitched DECIMAL(5,1),
  strikeouts INTEGER DEFAULT 0,
  walks INTEGER DEFAULT 0,
  era DECIMAL(4,2),

  additional_stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(team_id, season, game_date)
);

CREATE INDEX idx_mlb_team_stats_team_season ON mlb_team_stats(team_id, season);
```

**Note:** Similar pattern for WNBA and Soccer with sport-specific stats.

### Pattern: {sport}_player_stats

Individual player performance statistics.

#### NFL Player Stats

```sql
CREATE TABLE nfl_player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL REFERENCES nfl_players(id) ON DELETE CASCADE,
  game_id UUID REFERENCES nfl_games(id) ON DELETE CASCADE,
  season INTEGER NOT NULL,
  week INTEGER,

  -- Passing (QB)
  passing_yards INTEGER,
  passing_touchdowns INTEGER,
  interceptions INTEGER,
  completions INTEGER,
  attempts INTEGER,

  -- Rushing
  rushing_yards INTEGER,
  rushing_touchdowns INTEGER,
  carries INTEGER,

  -- Receiving
  receiving_yards INTEGER,
  receiving_touchdowns INTEGER,
  receptions INTEGER,
  targets INTEGER,

  -- Defense
  tackles INTEGER,
  sacks DECIMAL(3,1),
  forced_fumbles INTEGER,

  additional_stats JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_nfl_player_stats_player ON nfl_player_stats(player_id);
CREATE INDEX idx_nfl_player_stats_game ON nfl_player_stats(game_id);
CREATE INDEX idx_nfl_player_stats_season_week ON nfl_player_stats(season, week);
```

**Note:** Similar pattern for NBA, MLB, WNBA, Soccer with sport-specific stats.

---

## User Tables

### user_bets

Track user betting activity.

```sql
CREATE TABLE user_bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  -- Game Reference
  sport TEXT NOT NULL CHECK (sport IN ('nfl', 'nba', 'mlb', 'wnba', 'soccer')),
  game_id UUID NOT NULL, -- References sport-specific game table

  -- Bet Details
  bet_type TEXT NOT NULL, -- moneyline, spread, total, prop
  selection TEXT NOT NULL, -- e.g., 'home', 'away', 'over', 'under'
  odds INTEGER NOT NULL, -- American odds (e.g., -110, +150)
  stake DECIMAL(10,2) NOT NULL, -- Amount wagered
  potential_payout DECIMAL(10,2) NOT NULL,

  -- Bet Status
  status TEXT DEFAULT 'pending', -- pending, won, lost, push, cancelled
  result_date DATE,
  actual_payout DECIMAL(10,2),

  -- Metadata
  bookmaker TEXT,
  notes TEXT,
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_bets_user_id ON user_bets(user_id);
CREATE INDEX idx_user_bets_sport_game ON user_bets(sport, game_id);
CREATE INDEX idx_user_bets_status ON user_bets(status);
CREATE INDEX idx_user_bets_placed_at ON user_bets(placed_at DESC);
```

---

## AI & Chat Tables

### chat_conversations

Store chat conversation threads.

```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT, -- Auto-generated or user-defined
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_conversations_user_id ON chat_conversations(user_id);
CREATE INDEX idx_chat_conversations_last_message ON chat_conversations(last_message_at DESC);
```

### chat_messages

Individual messages in conversations.

```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,

  -- Context/Metadata
  context_data JSONB, -- Sports data used for this response
  model_used TEXT, -- e.g., 'kimi-k2'
  tokens_used INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_conversation ON chat_messages(conversation_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at DESC);
```

---

## System Tables

### data_ingestion_logs

Track data pipeline execution.

```sql
CREATE TABLE data_ingestion_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT NOT NULL CHECK (sport IN ('nfl', 'nba', 'mlb', 'wnba', 'soccer')),
  data_type TEXT NOT NULL, -- games, players, teams, odds, stats

  -- Execution Details
  execution_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('success', 'partial', 'failed')),

  -- Statistics
  records_processed INTEGER,
  records_inserted INTEGER,
  records_updated INTEGER,
  records_failed INTEGER,

  -- Error Tracking
  errors JSONB,
  error_message TEXT,

  -- Performance
  duration_ms INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_data_ingestion_logs_sport ON data_ingestion_logs(sport);
CREATE INDEX idx_data_ingestion_logs_status ON data_ingestion_logs(status);
CREATE INDEX idx_data_ingestion_logs_execution_time ON data_ingestion_logs(execution_time DESC);
```

### sports_news

Store sports news articles.

```sql
CREATE TABLE sports_news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport TEXT CHECK (sport IN ('nfl', 'nba', 'mlb', 'wnba', 'soccer', 'general')),

  -- Article Details
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  url TEXT UNIQUE,
  image_url TEXT,
  source TEXT, -- e.g., 'ESPN', 'Bleacher Report'
  author TEXT,

  -- Relevance
  teams UUID[], -- Array of team IDs
  players UUID[], -- Array of player IDs
  keywords TEXT[],

  -- Metadata
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sports_news_sport ON sports_news(sport);
CREATE INDEX idx_sports_news_published_at ON sports_news(published_at DESC);
CREATE INDEX idx_sports_news_teams ON sports_news USING GIN(teams);
CREATE INDEX idx_sports_news_players ON sports_news USING GIN(players);
```

### user_notifications

User notification queue.

```sql
CREATE TABLE user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL, -- game_start, score_update, bet_result, news
  title TEXT NOT NULL,
  message TEXT NOT NULL,

  -- References
  sport TEXT,
  game_id UUID,

  -- Status
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_read ON user_notifications(user_id, read);
CREATE INDEX idx_user_notifications_created_at ON user_notifications(created_at DESC);
```

### system_config

Application configuration.

```sql
CREATE TABLE system_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed with initial config
INSERT INTO system_config (key, value, description) VALUES
  ('data_update_schedule', '{"nfl": "0 11 * * *", "nba": "0 11 * * *"}', 'Cron schedules for data updates'),
  ('feature_flags', '{"betting_tracker": true, "ai_chat": true}', 'Feature toggle flags'),
  ('sports_enabled', '["nfl", "nba", "mlb", "wnba", "soccer"]', 'Active sports'),
  ('maintenance_mode', 'false', 'Maintenance mode flag');
```

---

## Indexes

### Composite Indexes

```sql
-- Game queries by date range and team
CREATE INDEX idx_nfl_games_team_date ON nfl_games(home_team_id, game_date);
CREATE INDEX idx_nfl_games_away_team_date ON nfl_games(away_team_id, game_date);

CREATE INDEX idx_nba_games_team_date ON nba_games(home_team_id, game_date);
CREATE INDEX idx_nba_games_away_team_date ON nba_games(away_team_id, game_date);

-- Similar for other sports...

-- Stats queries
CREATE INDEX idx_nfl_player_stats_player_season ON nfl_player_stats(player_id, season);
CREATE INDEX idx_nba_player_stats_player_season ON nba_player_stats(player_id, season);

-- Betting queries
CREATE INDEX idx_user_bets_user_status_date ON user_bets(user_id, status, placed_at DESC);

-- Chat queries
CREATE INDEX idx_chat_messages_conversation_created ON chat_messages(conversation_id, created_at);
```

---

## Row Level Security

### Enable RLS on User Tables

```sql
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;
```

### RLS Policies

#### User Profiles

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### User Bets

```sql
-- Users can view their own bets
CREATE POLICY "Users can view own bets"
  ON user_bets FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own bets
CREATE POLICY "Users can insert own bets"
  ON user_bets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bets
CREATE POLICY "Users can update own bets"
  ON user_bets FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own bets
CREATE POLICY "Users can delete own bets"
  ON user_bets FOR DELETE
  USING (auth.uid() = user_id);
```

#### Chat Tables

```sql
-- Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON chat_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- Users can view messages in their conversations
CREATE POLICY "Users can view own messages"
  ON chat_messages FOR SELECT
  USING (
    auth.uid() = (
      SELECT user_id FROM chat_conversations
      WHERE id = chat_messages.conversation_id
    )
  );
```

### Public Data Policies

```sql
-- Sports data is viewable by everyone (authenticated users)
CREATE POLICY "Authenticated users can view NFL teams"
  ON nfl_teams FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view NFL games"
  ON nfl_games FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view NFL players"
  ON nfl_players FOR SELECT
  TO authenticated
  USING (true);

-- Repeat for all sports data tables...
```

---

## Triggers & Functions

### Auto-Update Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_nfl_teams_updated_at
  BEFORE UPDATE ON nfl_teams
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Repeat for all tables with updated_at...
```

### Auto-Generate Conversation Title

```sql
CREATE OR REPLACE FUNCTION generate_conversation_title()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.title IS NULL THEN
    NEW.title = 'Conversation ' || TO_CHAR(NEW.created_at, 'YYYY-MM-DD HH24:MI');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_chat_conversation_title
  BEFORE INSERT ON chat_conversations
  FOR EACH ROW
  EXECUTE FUNCTION generate_conversation_title();
```

### Update Last Message Timestamp

```sql
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chat_conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chat_conversation_last_message
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_last_message();
```

### Calculate Bet Payout

```sql
CREATE OR REPLACE FUNCTION calculate_potential_payout(
  stake DECIMAL(10,2),
  odds INTEGER
)
RETURNS DECIMAL(10,2) AS $$
BEGIN
  -- American odds calculation
  IF odds > 0 THEN
    RETURN ROUND(stake + (stake * odds / 100), 2);
  ELSE
    RETURN ROUND(stake + (stake * 100 / ABS(odds)), 2);
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-calculate potential payout
CREATE OR REPLACE FUNCTION set_potential_payout()
RETURNS TRIGGER AS $$
BEGIN
  NEW.potential_payout = calculate_potential_payout(NEW.stake, NEW.odds);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_user_bet_payout
  BEFORE INSERT OR UPDATE OF stake, odds ON user_bets
  FOR EACH ROW
  EXECUTE FUNCTION set_potential_payout();
```

---

## Database Views

### Today's Games (All Sports)

```sql
CREATE VIEW todays_games AS
SELECT
  'nfl' as sport,
  id,
  game_date,
  game_time,
  home_team_id,
  away_team_id,
  home_score,
  away_score,
  status
FROM nfl_games
WHERE game_date = CURRENT_DATE

UNION ALL

SELECT
  'nba' as sport,
  id,
  game_date,
  game_time,
  home_team_id,
  away_team_id,
  home_score,
  away_score,
  status
FROM nba_games
WHERE game_date = CURRENT_DATE

-- Union for other sports...
```

### User Betting Summary

```sql
CREATE VIEW user_betting_summary AS
SELECT
  user_id,
  COUNT(*) as total_bets,
  SUM(stake) as total_staked,
  SUM(CASE WHEN status = 'won' THEN actual_payout ELSE 0 END) as total_winnings,
  SUM(CASE WHEN status = 'lost' THEN stake ELSE 0 END) as total_losses,
  SUM(CASE WHEN status = 'won' THEN actual_payout ELSE 0 END) -
    SUM(CASE WHEN status = 'lost' THEN stake ELSE 0 END) as net_profit,
  COUNT(CASE WHEN status = 'won' THEN 1 END) as wins,
  COUNT(CASE WHEN status = 'lost' THEN 1 END) as losses
FROM user_bets
WHERE status IN ('won', 'lost')
GROUP BY user_id;
```

---

## Sample Data Structure

### Example NFL Game Record

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "external_id": "nfl_2024_wk1_kc_sf",
  "season": 2024,
  "week": 1,
  "game_date": "2024-09-05",
  "game_time": "20:20:00",
  "home_team_id": "...",
  "away_team_id": "...",
  "home_score": 28,
  "away_score": 24,
  "status": "completed",
  "quarter": "Final",
  "stadium": "Arrowhead Stadium",
  "weather": {
    "temp": 75,
    "condition": "clear",
    "wind": "5 mph NW"
  },
  "broadcast_network": "NBC",
  "attendance": 76416
}
```

### Example Bet Record

```json
{
  "id": "...",
  "user_id": "...",
  "sport": "nfl",
  "game_id": "...",
  "bet_type": "spread",
  "selection": "home",
  "odds": -110,
  "stake": 100.00,
  "potential_payout": 190.91,
  "status": "won",
  "actual_payout": 190.91,
  "bookmaker": "DraftKings",
  "placed_at": "2024-09-05T18:00:00Z",
  "settled_at": "2024-09-05T23:30:00Z"
}
```

---

## Migration Strategy

### Phase 1: Core Tables
1. User tables (profiles, preferences)
2. NFL tables (most popular to start)
3. Chat tables

### Phase 2: Additional Sports
4. NBA tables
5. MLB tables
6. WNBA tables
7. Soccer tables

### Phase 3: Advanced Features
8. Betting tracker tables
9. Notification tables
10. News tables

### Phase 4: Optimization
11. Add indexes based on query patterns
12. Create materialized views for expensive queries
13. Set up partitioning for large tables (if needed)

---

## Estimated Table Sizes

| Table | Records (Year 1) | Growth Rate |
|-------|------------------|-------------|
| nfl_games | ~270 | +270/year |
| nba_games | ~1,230 | +1,230/year |
| mlb_games | ~2,430 | +2,430/year |
| nfl_players | ~2,500 | +500/year |
| nba_players | ~500 | +100/year |
| mlb_players | ~1,500 | +300/year |
| game_odds | ~10,000 | +10,000/year |
| chat_messages | ~100,000 | +100,000/year |
| user_bets | ~50,000 | +50,000/year |

---

## Backup & Maintenance

### Recommended Backup Schedule
- **Full backup:** Daily at 2 AM ET
- **Point-in-time recovery:** Enabled (Supabase automatic)
- **Retention:** 30 days

### Maintenance Tasks
- **Weekly:** Vacuum analyze on large tables
- **Monthly:** Review and optimize slow queries
- **Quarterly:** Review unused indexes

---

**Document Version:** 1.0
**Created:** 2025-11-12
**Next Review:** After initial migration

## Notes

- All timestamps stored in UTC
- User-facing dates converted to user's timezone
- Foreign key constraints ensure referential integrity
- Cascading deletes configured where appropriate
- JSON columns used for flexible, sport-specific data
- All tables include created_at, most include updated_at
