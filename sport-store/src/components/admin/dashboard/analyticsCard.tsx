import { ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  percentage: number;
  compareText: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  gradient?: string;
  trend?: 'up' | 'down' | 'stable';
  loading?: boolean;
}

export function AnalyticsCard({ 
  title, 
  value, 
  percentage, 
  compareText, 
  icon, 
  highlighted = false, 
  gradient = "from-white to-gray-50",
  trend = 'up',
  loading = false
}: AnalyticsCardProps) {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  const getTrendBg = () => {
    if (trend === 'up') return 'bg-emerald-50 dark:bg-emerald-900/20';
    if (trend === 'down') return 'bg-red-50 dark:bg-red-900/20';
    return 'bg-gray-50 dark:bg-gray-800';
  };

  const getIconBg = () => {
    if (highlighted) return 'bg-gradient-to-br from-emerald-500 to-emerald-600';
    return 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700';
  };

  return (
    <div className={`
      relative group overflow-hidden
      bg-gradient-to-br ${gradient} dark:from-gray-900 dark:to-gray-800
      rounded-2xl shadow-lg hover:shadow-xl 
      border border-gray-200/50 dark:border-gray-700/50
      transition-all duration-300 ease-out
      hover:scale-[1.02] hover:-translate-y-1
      ${highlighted ? 'ring-2 ring-emerald-500/20 hover:ring-emerald-500/30' : ''}
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      </div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
              {title}
            </p>
            <div className="flex items-baseline space-x-2">
              <h3 className={`
                text-3xl font-bold tracking-tight
                ${highlighted 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent' 
                  : 'text-gray-900 dark:text-white'
                }
              `}>
                {loading ? (
                  <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ) : (
                  value
                )}
              </h3>
              {highlighted && (
                <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full">
                  Featured
                </span>
              )}
            </div>
          </div>
          
          {/* Icon */}
          <div className={`
            relative p-3 rounded-xl shadow-sm
            ${getIconBg()}
            transition-all duration-300 group-hover:scale-110
            ${highlighted ? 'text-white' : 'text-gray-700 dark:text-gray-300'}
          `}>
            <div className="w-6 h-6">
              {loading ? (
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
              ) : (
                icon
              )}
            </div>
            {/* Icon glow effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        {/* Trend Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`
              flex items-center px-3 py-1.5 rounded-full text-sm font-medium
              ${getTrendBg()} ${getTrendColor()}
              transition-all duration-300 group-hover:scale-105
            `}>
              {loading ? (
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse mr-2"></div>
              ) : (
                <>
                  {trend === 'up' ? (
                    <ArrowUp size={14} className="mr-1.5" />
                  ) : trend === 'down' ? (
                    <ArrowDown size={14} className="mr-1.5" />
                  ) : (
                    <div className="w-3 h-0.5 bg-current mr-1.5"></div>
                  )}
                  <span className="font-semibold">{Math.abs(percentage)}%</span>
                </>
              )}
            </div>
            
            {!loading && (
              <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {compareText}
              </span>
            )}
          </div>

          {/* Trend Chart Mini */}
          {!loading && (
            <div className="flex items-end space-x-1 h-8">
              {[2, 4, 3, 6, 4, 8, 6, 9].map((height, index) => (
                <div
                  key={index}
                  className={`
                    w-1 rounded-full transition-all duration-300
                    ${trend === 'up' 
                      ? 'bg-emerald-500 dark:bg-emerald-400' 
                      : trend === 'down' 
                      ? 'bg-red-500 dark:bg-red-400' 
                      : 'bg-gray-400 dark:bg-gray-500'
                    }
                  `}
                  style={{ height: `${height * 0.5}px` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-4 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse"></div>
          </div>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-500/20 transition-all duration-300 pointer-events-none"></div>
    </div>
  );
} 