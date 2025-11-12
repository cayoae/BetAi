// @ts-nocheck
'use client'

import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts'
import { ChartContainer, ChartFilters } from './ChartContainer'

interface DataPoint {
  date: string
  [key: string]: string | number
}

interface PerformanceLineChartProps {
  title: string
  subtitle?: string
  data: DataPoint[]
  lines: Array<{
    dataKey: string
    name: string
    color: string
  }>
  yAxisLabel?: string
  onExport?: () => void
  className?: string
}

export function PerformanceLineChart({
  title,
  subtitle,
  data,
  lines,
  yAxisLabel,
  onExport,
  className,
}: PerformanceLineChartProps) {
  const [timeRange, setTimeRange] = useState('30d')

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
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
      filters={
        <ChartFilters
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
      }
    >
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            label={{
              value: yAxisLabel,
              angle: -90,
              position: 'insideLeft',
              style: { textAnchor: 'middle' },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
