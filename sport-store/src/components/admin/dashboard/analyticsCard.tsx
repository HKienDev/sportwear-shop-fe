import { ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  percentage: number;
  isPositive: boolean;
  compareText: string;
  icon: React.ReactNode;
  highlighted?: boolean;
  gradient?: string;
}

export function AnalyticsCard({ 
  title, 
  value, 
  percentage, 
  isPositive, 
  compareText, 
  icon, 
  highlighted = false, 
  gradient = "from-gray-50 to-white" 
}: AnalyticsCardProps) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className={`text-2xl font-bold mt-2 ${highlighted ? 'bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-lg ${highlighted ? 'bg-emerald-50' : 'bg-gray-50'}`}>
          {icon}
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
          isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
        }`}>
          {isPositive ? (
            <ArrowUp size={14} className="mr-1" />
          ) : (
            <ArrowDown size={14} className="mr-1" />
          )}
          <span className="font-medium">{Math.abs(percentage)}%</span>
        </div>
        <span className="text-gray-500 text-sm ml-2">{compareText}</span>
      </div>
    </div>
  );
} 