'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
  icon?: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
  variant?: 'default' | 'pills' | 'underline'
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'default',
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div
        className={cn('flex gap-2', {
          'border-b border-gray-200': variant === 'underline',
        })}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              'px-4 py-2 font-medium transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              {
                // Default variant
                'rounded-lg': variant === 'default',
                // Pills variant
                'rounded-full': variant === 'pills',
                // Underline variant
                'border-b-2 -mb-[1px]': variant === 'underline',
                // Active state
                'bg-primary text-white':
                  (variant === 'default' || variant === 'pills') && activeTab === tab.id,
                'border-primary text-primary':
                  variant === 'underline' && activeTab === tab.id,
                // Inactive state
                'text-gray-600 hover:bg-gray-100':
                  (variant === 'default' || variant === 'pills') && activeTab !== tab.id,
                'border-transparent text-gray-600 hover:text-gray-900':
                  variant === 'underline' && activeTab !== tab.id,
              }
            )}
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-4">{activeContent}</div>
    </div>
  )
}
