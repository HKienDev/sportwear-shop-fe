interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function Input({ label, value, onChange, placeholder, disabled = false }: InputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200 text-sm text-slate-700 placeholder-slate-400 ${
          disabled ? 'bg-slate-100 cursor-not-allowed text-slate-500' : 'bg-white hover:border-slate-400'
        }`}
      />
    </div>
  );
} 