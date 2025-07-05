type TimeRange = 'day' | 'month' | 'year';

interface TimeFilterProps {
  timeFilter: TimeRange;
  setTimeFilter: (filter: TimeRange) => void;
}

export function TimeFilter({ timeFilter, setTimeFilter }: TimeFilterProps) {
  return (
    <div className="flex p-1 bg-gray-50 rounded-lg border border-gray-100">
      <button 
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          timeFilter === 'day' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'bg-transparent text-gray-700 hover:bg-gray-100'
        }`} 
        onClick={() => setTimeFilter('day')}
      >
        Ngày
      </button>
      <button 
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          timeFilter === 'month' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'bg-transparent text-gray-700 hover:bg-gray-100'
        }`} 
        onClick={() => setTimeFilter('month')}
      >
        Tháng
      </button>
      <button 
        className={`px-4 py-2 rounded-lg transition-all duration-300 ${
          timeFilter === 'year' 
            ? 'bg-indigo-600 text-white shadow-sm' 
            : 'bg-transparent text-gray-700 hover:bg-gray-100'
        }`} 
        onClick={() => setTimeFilter('year')}
      >
        Năm
      </button>
    </div>
  );
} 