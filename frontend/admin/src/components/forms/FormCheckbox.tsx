import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

interface CheckboxInputProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function FormCheckbox({
  id,
  label,
  checked,
  onCheckedChange,
  description,
  className,
}: CheckboxInputProps) {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Checkbox id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <div className="space-y-1 leading-none">
        <Label htmlFor={id} className="cursor-pointer">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
