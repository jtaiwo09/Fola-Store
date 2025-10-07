import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface MultiSelectProps extends FormFieldProps {
  id: string;
  options: { value: string; label: string }[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function FormMultiSelect({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Select options",
  error,
  required,
  description,
  className,
}: MultiSelectProps) {
  const toggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {description}
        </p>
      )}
      <div className="mt-1.5 space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-3">
            <Checkbox
              id={`${id}-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={() => toggleOption(option.value)}
            />
            <Label
              htmlFor={`${id}-${option.value}`}
              className="cursor-pointer font-normal"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
