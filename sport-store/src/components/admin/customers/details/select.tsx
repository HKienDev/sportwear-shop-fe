interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  disabled,
  placeholder
}: SelectProps) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-medium text-slate-700 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none bg-white text-sm text-slate-700 transition-all duration-200 hover:border-slate-400 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
} 