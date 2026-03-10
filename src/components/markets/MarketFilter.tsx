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
            'rounded-full px-4 py-1.5 text-sm font-medium transition',
            value === opt
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
