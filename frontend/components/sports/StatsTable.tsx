'use client'

import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: any, row: T) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
}

interface StatsTableProps<T> {
  title?: string
  subtitle?: string
  data: T[]
  columns: Column<T>[]
  striped?: boolean
  hoverable?: boolean
  compact?: boolean
  onRowClick?: (row: T) => void
}

type SortDirection = 'asc' | 'desc' | null

export function StatsTable<T extends Record<string, any>>({
  title,
  subtitle,
  data,
  columns,
  striped = true,
  hoverable = true,
  compact = false,
  onRowClick,
}: StatsTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortKey(null)
        setSortDirection(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey || !sortDirection) return 0

    const aValue = a[sortKey]
    const bValue = b[sortKey]

    if (aValue === bValue) return 0

    const comparison =
      typeof aValue === 'string'
        ? aValue.localeCompare(bValue)
        : aValue > bValue
        ? 1
        : -1

    return sortDirection === 'asc' ? comparison : -comparison
  })

  const TableWrapper = title ? Card : 'div'

  return (
    <TableWrapper className={title ? 'w-full overflow-hidden' : ''}>
      {title && <CardHeader title={title} subtitle={subtitle} />}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-y border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    'font-semibold text-gray-700 text-sm uppercase tracking-wider',
                    {
                      'px-6 py-4': !compact,
                      'px-4 py-2': compact,
                      'text-left': column.align === 'left' || !column.align,
                      'text-center': column.align === 'center',
                      'text-right': column.align === 'right',
                      'cursor-pointer hover:bg-gray-100': column.sortable,
                    }
                  )}
                  style={{ width: column.width }}
                  onClick={() =>
                    column.sortable && handleSort(column.key)
                  }
                >
                  <div className="flex items-center gap-2">
                    <span>{column.label}</span>
                    {column.sortable && (
                      <span className="text-gray-400">
                        {sortKey === column.key ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp size={16} />
                          ) : (
                            <ArrowDown size={16} />
                          )
                        ) : (
                          <ArrowUpDown size={16} />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-gray-200',
                  {
                    'bg-gray-50': striped && rowIndex % 2 === 1,
                    'hover:bg-blue-50 cursor-pointer': hoverable,
                  }
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => {
                  const value = row[column.key]
                  return (
                    <td
                      key={String(column.key)}
                      className={cn('text-gray-900', {
                        'px-6 py-4': !compact,
                        'px-4 py-2': compact,
                        'text-left': column.align === 'left' || !column.align,
                        'text-center': column.align === 'center',
                        'text-right': column.align === 'right',
                      })}
                    >
                      {column.render ? column.render(value, row) : value}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No data available
        </div>
      )}
    </TableWrapper>
  )
}
