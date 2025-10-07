import { FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

interface RadioInputProps {
  id: string;
  label: string;
  options: { value: string; label: string; description?: string }[];
  value: string;
  onValueChange: (value: string) => void;
  error?: FieldError;
  className?: string;
}

export function FormRadioGroup({
  id,
  label,
  options,
  value,
  onValueChange,
  error,
  className,
}: RadioInputProps) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <RadioGroup
        value={value}
        onValueChange={onValueChange}
        className="mt-3 space-y-3"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start space-x-3">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <div className="space-y-1 leading-none">
              <Label
                htmlFor={`${id}-${option.value}`}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
              {option.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {option.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </RadioGroup>
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
