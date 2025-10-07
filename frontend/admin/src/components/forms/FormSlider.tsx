import { Label } from "../ui/label";

interface SliderInputProps extends FormFieldProps {
  id: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  showValue?: boolean;
  unit?: string;
}

export function FormSlider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  showValue = true,
  unit,
  error,
  required,
  description,
  className,
}: SliderInputProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <Label htmlFor={id}>
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {showValue && (
          <span className="text-sm font-medium">
            {value}
            {unit}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-2">
          {description}
        </p>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
