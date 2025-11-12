export type Sport = 'nfl' | 'nba' | 'mlb' | 'wnba' | 'soccer'

export type GameStatus =
  | 'scheduled'
  | 'live'
  | 'halftime'
  | 'completed'
  | 'postponed'
  | 'cancelled'

export interface Team {
  id: string
  name: string
  abbreviation: string
  city: string
  logo?: string
  sport: Sport
  record?: string
}

export interface GameOdds {
  homeMoneyline?: number
  awayMoneyline?: number
  spread?: number
  spreadOdds?: number
  total?: number
  overOdds?: number
  underOdds?: number
  lastUpdated?: Date
}

export interface Game {
  id: string
  sport: Sport
  gameDate: Date
  gameTime?: string
  homeTeam: Team
  awayTeam: Team
  homeScore?: number
  awayScore?: number
  status: GameStatus
  quarter?: string
  stadium?: string
  broadcast?: string
  odds?: GameOdds
}

export interface Player {
  id: string
  name: string
  teamId: string
  position: string
  jerseyNumber?: number
  sport: Sport
  photoUrl?: string
}

export interface PlayerStats {
  playerId: string
  gameId: string
  stats: Record<string, number | string>
}

export interface TeamStats {
  teamId: string
  wins: number
  losses: number
  ties?: number
  stats: Record<string, number | string>
}
