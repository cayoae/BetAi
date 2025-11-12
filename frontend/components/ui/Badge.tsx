import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'nfl'
    | 'nba'
    | 'mlb'
    | 'wnba'
    | 'soccer'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          {
            // Variants
            'bg-gray-100 text-gray-800': variant === 'default',
            'bg-primary text-white': variant === 'primary',
            'bg-gray-200 text-gray-900': variant === 'secondary',
            'bg-success text-white': variant === 'success',
            'bg-danger text-white': variant === 'danger',
            'bg-secondary text-gray-900': variant === 'warning',
            // Sport variants
            'bg-nfl text-white': variant === 'nfl',
            'bg-nba text-white': variant === 'nba',
            'bg-mlb text-white': variant === 'mlb',
            'bg-wnba text-white': variant === 'wnba',
            'bg-soccer text-white': variant === 'soccer',
            // Sizes
            'px-2 py-0.5 text-xs': size === 'sm',
            'px-2.5 py-1 text-sm': size === 'md',
            'px-3 py-1.5 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Status Badge Variants
export const StatusBadge = ({
  status,
  ...props
}: Omit<BadgeProps, 'variant'> & {
  status: 'scheduled' | 'live' | 'halftime' | 'completed' | 'postponed' | 'cancelled'
}) => {
  const variantMap = {
    scheduled: 'default',
    live: 'danger',
    halftime: 'warning',
    completed: 'success',
    postponed: 'warning',
    cancelled: 'secondary',
  } as const

  const labelMap = {
    scheduled: 'Scheduled',
    live: '🔴 LIVE',
    halftime: 'Halftime',
    completed: 'Final',
    postponed: 'Postponed',
    cancelled: 'Cancelled',
  }

  return (
    <Badge variant={variantMap[status]} {...props}>
      {labelMap[status]}
    </Badge>
  )
}
