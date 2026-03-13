export type GenericInputProps<T> = {
  label: string;
  name: keyof T;
  type?: string;
  value: string;
  placeholder?: string;
  className?: string;
  onChange: (name: keyof T, value: string) => void;
};

function GenericInput<T>({
  label,
  name,
  type = "text",
  value,
  placeholder,
  className,
  onChange,
}: GenericInputProps<T>) {
  return (
    <div className="mb-4 relative">
      <label className="block text-gray-700 font-semibold mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(name, e.target.value)}
        className={`w-full px-4 py-2 border border-[#DFEAF2] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
    </div>
  );
}

export default GenericInput;