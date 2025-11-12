// @ts-nocheck
'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps,
  Cell,
} from 'recharts'
import { ChartContainer } from './ChartContainer'

interface DataPoint {
  name: string
  [key: string]: string | number
}

interface ComparisonBarChartProps {
  title: string
  subtitle?: string
  data: DataPoint[]
  bars: Array<{
    dataKey: string
    name: string
    color: string
  }>
  horizontal?: boolean
  stacked?: boolean
  onExport?: () => void
  className?: string
}

export function ComparisonBarChart({
  title,
  subtitle,
  data,
  bars,
  horizontal = false,
  stacked = false,
  onExport,
  className,
}: ComparisonBarChartProps) {
  const [hoveredBar, setHoveredBar] = useState<string | null>(null)

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null

    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  const ChartComponent = BarChart

  return (
    <ChartContainer
      title={title}
      subtitle={subtitle}
      className={className}
      onExport={onExport}
    >
      <ResponsiveContainer width="100%" height={350}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          layout={horizontal ? 'vertical' : 'horizontal'}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {horizontal ? (
            <>
              <XAxis type="number" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                width={100}
              />
            </>
          ) : (
            <>
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            </>
          )}
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              stackId={stacked ? 'stack' : undefined}
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
              onMouseEnter={() => setHoveredBar(bar.dataKey)}
              onMouseLeave={() => setHoveredBar(null)}
              opacity={hoveredBar === null || hoveredBar === bar.dataKey ? 1 : 0.6}
            />
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
