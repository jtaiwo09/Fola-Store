import { FieldError } from "react-hook-form";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

interface SwitchInputProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  description?: string;
  error?: FieldError;
  className?: string;
}

export function FormSwitch({
  id,
  label,
  checked,
  onCheckedChange,
  description,
  error,
  className,
}: SwitchInputProps) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor={id}>{label}</Label>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
