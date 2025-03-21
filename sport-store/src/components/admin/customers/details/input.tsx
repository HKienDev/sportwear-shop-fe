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
      <label className="text-sm font-medium text-neutral-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`border border-neutral-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
          disabled ? 'bg-neutral-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  );
} 