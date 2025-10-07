"use client";

import { FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  description?: string;
  className?: string;
}

interface TextInputProps extends FormFieldProps {
  id: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  register: any;
  icon?: React.ReactNode;
}

export function FormInput({
  id,
  label,
  type = "text",
  placeholder,
  register,
  error,
  required,
  description,
  icon,
  className,
}: TextInputProps) {
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
      <div className="relative mt-1.5">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className={cn(icon && "pl-10", error && "border-red-500")}
          {...register}
        />
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error.message}</p>}
    </div>
  );
}
