'use client'

import { MarketStatus } from '@/lib/types/api'
import { cn } from '@/lib/utils/cn'

type FilterOption = MarketStatus | 'All'

interface MarketFilterProps {
  value: FilterOption
  onChange: (value: FilterOption) => void
}

const options: FilterOption[] = ['All', 'Open', 'Closed', 'Resolved']

export default function MarketFilter({ value, onChange }: MarketFilterProps) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition',
            value === opt
              ? 'bg-blue-600 dark:bg-blue-700 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
