'use client'

import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardFooter } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { Input, SearchInput } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { GameCard } from '@/components/sports/GameCard'
import { PerformanceLineChart } from '@/components/sports/charts/PerformanceLineChart'
import { ComparisonBarChart } from '@/components/sports/charts/ComparisonBarChart'
import { OddsMovementChart } from '@/components/sports/charts/OddsMovementChart'
import { PlayerRadarChart } from '@/components/sports/charts/PlayerRadarChart'
import { StatsTable } from '@/components/sports/StatsTable'
import { Game } from '@/types/sports.types'

export default function DemoPage() {
  // Sample data
  const sampleGame: Game = {
    id: '1',
    sport: 'nfl',
    gameDate: new Date('2025-11-12'),
    gameTime: '20:20 ET',
    homeTeam: {
      id: 'kc',
      name: 'Chiefs',
      city: 'Kansas City',
      abbreviation: 'KC',
      sport: 'nfl',
      record: '8-3',
    },
    awayTeam: {
      id: 'sf',
      name: '49ers',
      city: 'San Francisco',
      abbreviation: 'SF',
      sport: 'nfl',
      record: '10-1',
    },
    homeScore: 24,
    awayScore: 28,
    status: 'live',
    stadium: 'Arrowhead Stadium',
    broadcast: 'NBC',
    odds: {
      spread: -3.5,
      total: 47.5,
      homeMoneyline: -165,
      awayMoneyline: 145,
    },
  }

  // Performance chart data
  const performanceData = [
    { date: 'Week 1', KC: 28, SF: 24 },
    { date: 'Week 2', KC: 31, SF: 27 },
    { date: 'Week 3', KC: 27, SF: 31 },
    { date: 'Week 4', KC: 34, SF: 28 },
    { date: 'Week 5', KC: 24, SF: 35 },
  ]

  // Comparison chart data
  const comparisonData = [
    { name: 'Total Yards', KC: 342, SF: 389 },
    { name: 'First Downs', KC: 23, SF: 27 },
    { name: 'Pass Yards', KC: 278, SF: 312 },
    { name: 'Rush Yards', KC: 64, SF: 77 },
    { name: 'Time of Poss', KC: 28, SF: 32 },
  ]

  // Odds movement data
  const oddsData = [
    { time: '9 AM', KC: -3, SF: 3 },
    { time: '12 PM', KC: -3.5, SF: 3.5 },
    { time: '3 PM', KC: -3.5, SF: 3.5 },
    { time: '6 PM', KC: -4, SF: 4 },
    { time: 'Now', KC: -3.5, SF: 3.5 },
  ]

  // Radar chart data
  const radarData = [
    { stat: 'Offense', Mahomes: 95, Purdy: 88 },
    { stat: 'Accuracy', Mahomes: 89, Purdy: 92 },
    { stat: 'Arm Strength', Mahomes: 98, Purdy: 82 },
    { stat: 'Mobility', Mahomes: 85, Purdy: 78 },
    { stat: 'Decision Making', Mahomes: 96, Purdy: 91 },
    { stat: 'Clutch', Mahomes: 99, Purdy: 87 },
  ]

  // Stats table data
  const statsData = [
    {
      player: 'Patrick Mahomes',
      team: 'KC',
      completions: 28,
      attempts: 38,
      yards: 312,
      tds: 3,
      ints: 0,
      rating: 128.4,
    },
    {
      player: 'Brock Purdy',
      team: 'SF',
      completions: 31,
      attempts: 41,
      yards: 289,
      tds: 2,
      ints: 1,
      rating: 102.7,
    },
  ]

  const statsColumns = [
    { key: 'player', label: 'Player', sortable: true },
    { key: 'team', label: 'Team', sortable: true, align: 'center' as const },
    {
      key: 'completions',
      label: 'CMP',
      sortable: true,
      align: 'right' as const,
    },
    { key: 'attempts', label: 'ATT', sortable: true, align: 'right' as const },
    { key: 'yards', label: 'YDS', sortable: true, align: 'right' as const },
    { key: 'tds', label: 'TD', sortable: true, align: 'right' as const },
    { key: 'ints', label: 'INT', sortable: true, align: 'right' as const },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-bold text-primary">{value.toFixed(1)}</span>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            BetAI UI Components Demo
          </h1>
          <p className="text-gray-600">
            Showcase of all interactive components and charts
          </p>
        </div>

        {/* Buttons */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="primary">Primary</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="nfl">NFL</Badge>
            <Badge variant="nba">NBA</Badge>
            <Badge variant="mlb">MLB</Badge>
            <Badge variant="wnba">WNBA</Badge>
            <Badge variant="soccer">Soccer</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="scheduled" />
            <StatusBadge status="live" />
            <StatusBadge status="completed" />
            <StatusBadge status="postponed" />
            <StatusBadge status="cancelled" />
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Inputs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Input label="Email" placeholder="Enter your email" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Input
              label="With Error"
              error="This field is required"
              placeholder="Enter value"
            />
            <SearchInput placeholder="Search games..." />
          </div>
        </section>

        {/* Select */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Selects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
            <Select
              label="Sport"
              options={[
                { value: 'nfl', label: 'NFL' },
                { value: 'nba', label: 'NBA' },
                { value: 'mlb', label: 'MLB' },
              ]}
            />
            <Select
              label="Time Range"
              options={[
                { value: '7d', label: 'Last 7 days' },
                { value: '30d', label: 'Last 30 days' },
                { value: 'season', label: 'This season' },
              ]}
            />
          </div>
        </section>

        {/* Tabs */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Tabs</h2>
          <Tabs
            tabs={[
              { id: 'overview', label: 'Overview', content: <div className="p-4 bg-white rounded-lg">Overview content</div> },
              { id: 'stats', label: 'Stats', content: <div className="p-4 bg-white rounded-lg">Stats content</div> },
              { id: 'odds', label: 'Odds', content: <div className="p-4 bg-white rounded-lg">Odds content</div> },
            ]}
            variant="underline"
          />
        </section>

        {/* Game Card */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Game Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GameCard game={sampleGame} onViewDetails={(id) => console.log('View:', id)} />
          </div>
        </section>

        {/* Charts */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Interactive Charts</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceLineChart
              title="Points Scored - Last 5 Games"
              subtitle="Track team scoring trends"
              data={performanceData}
              lines={[
                { dataKey: 'KC', name: 'Kansas City', color: '#013369' },
                { dataKey: 'SF', name: 'San Francisco', color: '#AA0000' },
              ]}
              yAxisLabel="Points"
            />

            <ComparisonBarChart
              title="Team Stats Comparison"
              subtitle="Head-to-head matchup"
              data={comparisonData}
              bars={[
                { dataKey: 'KC', name: 'Kansas City', color: '#013369' },
                { dataKey: 'SF', name: 'San Francisco', color: '#AA0000' },
              ]}
            />

            <OddsMovementChart
              title="Spread Movement (24h)"
              subtitle="Real-time odds tracking"
              data={oddsData}
              areas={[
                { dataKey: 'KC', name: 'Kansas City', color: '#013369' },
                { dataKey: 'SF', name: 'San Francisco', color: '#AA0000' },
              ]}
            />

            <PlayerRadarChart
              title="QB Comparison"
              subtitle="Normalized player attributes"
              data={radarData}
              players={[
                { dataKey: 'Mahomes', name: 'Patrick Mahomes', color: '#013369' },
                { dataKey: 'Purdy', name: 'Brock Purdy', color: '#AA0000' },
              ]}
            />
          </div>
        </section>

        {/* Stats Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Stats Table</h2>
          <StatsTable
            title="Passing Leaders"
            subtitle="Game statistics"
            data={statsData}
            columns={statsColumns}
          />
        </section>
      </div>
    </div>
  )
}
