// @ts-nocheck
'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  ReferenceLine,
} from 'recharts'
import { ChartContainer } from './ChartContainer'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface OddsDataPoint {
  time: string
  [key: string]: string | number
}

interface OddsMovementChartProps {
  title: string
  subtitle?: string
  data: OddsDataPoint[]
  areas: Array<{
    dataKey: string
    name: string
    color: string
  }>
  onExport?: () => void
  className?: string
}

export function OddsMovementChart({
  title,
  subtitle,
  data,
  areas,
  onExport,
  className,
}: OddsMovementChartProps) {
  // Calculate trend
  const calculateTrend = (dataKey: string) => {
    if (data.length < 2) return 0
    const first = data[0][dataKey] as number
    const last = data[data.length - 1][dataKey] as number
    return last - first
  }

  // Custom tooltip with trend indicator
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => {
          const trend = calculateTrend(entry.dataKey as string)
          return (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-600">{entry.name}:</span>
              <span className="font-semibold">{entry.value}</span>
              {trend !== 0 && (
                <span
                  className={`flex items-center ${
                    trend > 0 ? 'text-success' : 'text-danger'
                  }`}
                >
                  {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                  <span className="ml-1 text-xs">
                    {trend > 0 ? '+' : ''}
                    {trend.toFixed(1)}
                  </span>
                </span>
              )}
            </div>
          )
        })}
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
      <div className="mb-4 flex items-center gap-4">
        {areas.map((area) => {
          const trend = calculateTrend(area.dataKey)
          return (
            <div
              key={area.dataKey}
              className="flex items-center gap-2 text-sm"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: area.color }}
              />
              <span className="text-gray-600">{area.name}:</span>
              <span
                className={`font-semibold flex items-center ${
                  trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : ''
                }`}
              >
                {trend > 0 ? <TrendingUp size={16} /> : trend < 0 ? <TrendingDown size={16} /> : null}
                {trend > 0 ? '+' : ''}
                {trend.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            {areas.map((area) => (
              <linearGradient
                key={area.dataKey}
                id={`gradient-${area.dataKey}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={area.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={area.color}
                  stopOpacity={0.1}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="time"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          {areas.map((area) => (
            <Area
              key={area.dataKey}
              type="monotone"
              dataKey={area.dataKey}
              name={area.name}
              stroke={area.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${area.dataKey})`}
              animationDuration={1000}
            />
          ))}
          <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
