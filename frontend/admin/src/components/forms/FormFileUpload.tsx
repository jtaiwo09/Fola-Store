import { Upload, X } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";

interface FileUploadProps extends FormFieldProps {
  id: string;
  accept?: string;
  multiple?: boolean;
  onChange: (files: FileList | null) => void;
  value?: File[];
  maxSize?: number; // in MB
}

export function FormFileUpload({
  id,
  label,
  accept,
  multiple,
  onChange,
  value,
  error,
  required,
  description,
  maxSize = 5,
  className,
}: FileUploadProps) {
  const handleRemove = (index: number) => {
    if (value) {
      const dt = new DataTransfer();
      value.forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      onChange(dt.files);
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
      <div className="mt-1.5">
        <label
          htmlFor={id}
          className={cn(
            "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors",
            "hover:bg-gray-50 dark:hover:bg-gray-800",
            error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accept || "Any file"} (Max {maxSize}MB)
            </p>
          </div>
          <input
            id={id}
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={(e) => onChange(e.target.files)}
          />
        </label>
      </div>

      {value && value.length > 0 && (
        <div className="mt-3 space-y-2">
          {Array.from(value).map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
