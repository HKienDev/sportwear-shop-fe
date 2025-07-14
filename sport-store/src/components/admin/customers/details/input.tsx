import { AlertCircle } from "lucide-react";

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function Input({ label, value, onChange, placeholder, disabled = false, error }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 text-sm text-slate-700 placeholder-slate-400 ${
            error 
              ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-500 bg-rose-50' 
              : disabled 
                ? 'border-slate-300 bg-slate-100 cursor-not-allowed text-slate-500' 
                : 'border-slate-300 bg-white hover:border-slate-400 focus:ring-indigo-500/20 focus:border-indigo-500'
          }`}
        />
        {error && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle size={16} className="text-rose-500" />
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <AlertCircle size={12} className="text-rose-500 flex-shrink-0" />
          <span className="text-xs text-rose-600">{error}</span>
        </div>
      )}
    </div>
  );
} 