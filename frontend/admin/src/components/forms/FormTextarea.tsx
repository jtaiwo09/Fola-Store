import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface TextareaInputProps extends FormFieldProps {
  id: string;
  placeholder?: string;
  register: any;
  rows?: number;
}

export function FormTextarea({
  id,
  label,
  placeholder,
  register,
  error,
  required,
  description,
  rows = 4,
  className,
}: TextareaInputProps) {
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
      <Textarea
        id={id}
        placeholder={placeholder}
        rows={rows}
        className={cn("mt-1.5", error && "border-red-500")}
        {...register}
      />
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
