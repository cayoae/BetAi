// @ts-nocheck
'use client'

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { ChartContainer } from './ChartContainer'

interface RadarDataPoint {
  stat: string
  [key: string]: string | number
}

interface PlayerRadarChartProps {
  title: string
  subtitle?: string
  data: RadarDataPoint[]
  players: Array<{
    dataKey: string
    name: string
    color: string
  }>
  onExport?: () => void
  className?: string
}

export function PlayerRadarChart({
  title,
  subtitle,
  data,
  players,
  onExport,
  className,
}: PlayerRadarChartProps) {
  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">
          {payload[0].payload.stat}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">{entry.value}/100</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      className={className}
      onExport={onExport}
    >
      {/* Legend with player info */}
      <div className="mb-4 flex items-center gap-4 flex-wrap">
        {players.map((player) => (
          <div key={player.dataKey} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: player.color }}
            />
            <span className="font-medium text-sm">{player.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="stat"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            stroke="#6b7280"
            style={{ fontSize: '10px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          {players.map((player) => (
            <Radar
              key={player.dataKey}
              name={player.name}
              dataKey={player.dataKey}
              stroke={player.color}
              fill={player.color}
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={1000}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>

      {/* Stats explanation */}
      <div className="mt-4 text-xs text-gray-500">
        <p>* Values are normalized to 0-100 scale for comparison</p>
      </div>
    </ChartContainer>
  )
}
