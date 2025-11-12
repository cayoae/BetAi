// @ts-nocheck
'use client'

import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Download, Settings, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChartContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
  onExport?: () => void
  onFullscreen?: () => void
  onSettings?: () => void
  filters?: React.ReactNode
  actions?: React.ReactNode
}

export function ChartContainer({
  title,
  subtitle,
  children,
  className,
  onExport,
  onFullscreen,
  onSettings,
  filters,
  actions,
}: ChartContainerProps) {
  return (
    <Card className={cn('w-full', className)}>
      {/* Header with actions */}
      <div className="flex items-start justify-between mb-4">
        <CardHeader title={title} subtitle={subtitle} className="mb-0" />
        <div className="flex items-center gap-2">
          {actions}
          {filters}
          {onSettings && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettings}
              aria-label="Chart settings"
            >
              <Settings size={16} />
            </Button>
          )}
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              aria-label="Export chart"
            >
              <Download size={16} />
            </Button>
          )}
          {onFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onFullscreen}
              aria-label="Fullscreen"
            >
              <Maximize2 size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Chart Content */}
      <div className="w-full">{children}</div>
    </Card>
  )
}

// Chart Filters Component
interface ChartFiltersProps {
  timeRange?: string
  onTimeRangeChange?: (value: string) => void
  metric?: string
  onMetricChange?: (value: string) => void
  timeRangeOptions?: Array<{ value: string; label: string }>
  metricOptions?: Array<{ value: string; label: string }>
}

export function ChartFilters({
  timeRange,
  onTimeRangeChange,
  metric,
  onMetricChange,
  timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: 'season', label: 'This season' },
  ],
  metricOptions,
}: ChartFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      {timeRange && onTimeRangeChange && (
        <Select
          options={timeRangeOptions}
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
          className="w-40"
        />
      )}
      {metric && onMetricChange && metricOptions && (
        <Select
          options={metricOptions}
          value={metric}
          onChange={(e) => onMetricChange(e.target.value)}
          className="w-40"
        />
      )}
    </div>
  )
}
