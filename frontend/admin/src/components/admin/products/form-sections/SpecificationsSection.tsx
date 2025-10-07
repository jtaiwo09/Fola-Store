// components/admin/products/form-sections/SpecificationsSection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { ProductFormData } from "@/lib/validations/product.validation";
import { UseFormWatch, UseFormSetValue } from "react-hook-form";

interface SpecificationsSectionProps {
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export default function SpecificationsSection({
  watch,
  setValue,
}: SpecificationsSectionProps) {
  const [key, setKey] = useState("");
  const [value, setValueInput] = useState("");

  const specifications = watch("specifications") || {};

  const handleAdd = () => {
    if (key && value) {
      setValue("specifications", {
        ...specifications,
        [key]: value,
      });
      setKey("");
      setValueInput("");
    }
  };

  const handleRemove = (keyToRemove: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[keyToRemove];
    setValue("specifications", newSpecs);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(specifications).length > 0 && (
          <div className="space-y-2">
            {Object.entries(specifications).map(([k, v]) => (
              <div
                key={k}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium text-sm">{k}:</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {String(v)}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(k)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Key (e.g., Width)"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
          <Input
            placeholder="Value (e.g., 60 inches)"
            value={value}
            onChange={(e) => setValueInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAdd();
              }
            }}
          />
          <Button type="button" onClick={handleAdd} disabled={!key || !value}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Add custom specifications like width, weight, material, etc.
        </p>
      </CardContent>
    </Card>
  );
}
