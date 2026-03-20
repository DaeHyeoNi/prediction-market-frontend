export default function MarketCardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 animate-pulse">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full shrink-0"></div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="flex-1 h-14 bg-gray-100 dark:bg-gray-800 rounded"></div>
        <div className="flex-1 h-14 bg-gray-100 dark:bg-gray-800 rounded"></div>
      </div>
      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-1/2"></div>
    </div>
  )
}
