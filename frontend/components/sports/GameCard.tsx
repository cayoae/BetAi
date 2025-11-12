import { Card } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Game } from '@/types/sports.types'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GameCardProps {
  game: Game
  onViewDetails?: (gameId: string) => void
}

export function GameCard({ game, onViewDetails }: GameCardProps) {
  const sportColorMap = {
    nfl: 'nfl',
    nba: 'nba',
    mlb: 'mlb',
    wnba: 'wnba',
    soccer: 'soccer',
  } as const

  const formatTime = (date: Date, time?: string) => {
    if (!time) return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
    return time
  }

  const formatOdds = (odds?: number) => {
    if (!odds) return '-'
    return odds > 0 ? `+${odds}` : odds.toString()
  }

  return (
    <Card hover padding="md" className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Badge variant={sportColorMap[game.sport]} size="sm">
          {game.sport.toUpperCase()}
        </Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {formatTime(game.gameDate, game.gameTime)}
          </span>
          <StatusBadge status={game.status} size="sm" />
        </div>
      </div>

      {/* Teams */}
      <div className="space-y-3 mb-4">
        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {game.awayTeam.logo && (
              <img
                src={game.awayTeam.logo}
                alt={game.awayTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {game.awayTeam.city} {game.awayTeam.name}
              </div>
              {game.awayTeam.record && (
                <div className="text-xs text-gray-500">{game.awayTeam.record}</div>
              )}
            </div>
          </div>
          {game.awayScore !== undefined && (
            <div className="text-3xl font-bold text-gray-900 ml-4">
              {game.awayScore}
            </div>
          )}
        </div>

        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {game.homeTeam.logo && (
              <img
                src={game.homeTeam.logo}
                alt={game.homeTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold text-gray-900">
                {game.homeTeam.city} {game.homeTeam.name}
              </div>
              {game.homeTeam.record && (
                <div className="text-xs text-gray-500">{game.homeTeam.record}</div>
              )}
            </div>
          </div>
          {game.homeScore !== undefined && (
            <div className="text-3xl font-bold text-gray-900 ml-4">
              {game.homeScore}
            </div>
          )}
        </div>
      </div>

      {/* Odds (if available) */}
      {game.odds && (
        <div className="border-t pt-4 space-y-2">
          <div className="text-xs font-semibold text-gray-500 uppercase">
            Betting Lines
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {/* Spread */}
            {game.odds.spread && (
              <div>
                <div className="text-xs text-gray-500">Spread</div>
                <div className="font-medium">
                  {game.odds.spread > 0 ? '+' : ''}
                  {game.odds.spread}
                </div>
              </div>
            )}

            {/* Total */}
            {game.odds.total && (
              <div>
                <div className="text-xs text-gray-500">Total</div>
                <div className="font-medium">O/U {game.odds.total}</div>
              </div>
            )}

            {/* Moneyline */}
            {game.odds.homeMoneyline && (
              <div>
                <div className="text-xs text-gray-500">Moneyline</div>
                <div className="font-medium">
                  {formatOdds(game.odds.homeMoneyline)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 pt-4 border-t">
        <Button
          variant="outline"
          size="sm"
          fullWidth
          onClick={() => onViewDetails?.(game.id)}
        >
          View Details & Analysis →
        </Button>
      </div>

      {/* Additional Info */}
      {(game.stadium || game.broadcast) && (
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          {game.stadium && <span>📍 {game.stadium}</span>}
          {game.broadcast && <span>📺 {game.broadcast}</span>}
        </div>
      )}
    </Card>
  )
}

// Compact version for lists
export function GameCardCompact({ game, onViewDetails }: GameCardProps) {
  return (
    <Card
      hover
      padding="sm"
      className="cursor-pointer"
      onClick={() => onViewDetails?.(game.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={game.sport} size="sm">
              {game.sport.toUpperCase()}
            </Badge>
            <StatusBadge status={game.status} size="sm" />
          </div>
          <div className="text-sm">
            <div className="font-medium">
              {game.awayTeam.abbreviation} @ {game.homeTeam.abbreviation}
            </div>
            <div className="text-xs text-gray-500">
              {formatTime(game.gameDate, game.gameTime)}
            </div>
          </div>
        </div>
        {(game.homeScore !== undefined || game.awayScore !== undefined) && (
          <div className="text-right">
            <div className="font-bold">
              {game.awayScore} - {game.homeScore}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}

function formatTime(date: Date, time?: string): string {
  if (!time)
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  return time
}
