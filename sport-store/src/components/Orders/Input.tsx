export default function Input({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    width,
    min,
    max,
  }: {
    label?: string;
    type?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (val: string) => void;
    width?: string;
    min?: number;
    max?: number;
  }) {
    return (
      <div style={{ width }} className="flex flex-col">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          className="w-full p-2 border rounded mt-1"
          min={min}
          max={max}
        />
      </div>
    );
  }