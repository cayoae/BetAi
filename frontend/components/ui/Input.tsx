import { InputHTMLAttributes, forwardRef } from 'react'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              'w-full px-4 py-2 border border-gray-300 rounded-lg',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'placeholder:text-gray-400',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              {
                'border-danger focus:ring-danger': error,
                'pl-10': icon,
              },
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-danger">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Search Input Component
interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        icon={<Search size={18} />}
        placeholder="Search..."
        className={className}
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    )
  }
)

SearchInput.displayName = 'SearchInput'
