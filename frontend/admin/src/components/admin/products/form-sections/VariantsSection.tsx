"use client";

import { useState } from "react";
import {
  useFieldArray,
  Control,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductFormData } from "@/lib/validations/product.validation";
import VariantItem from "../VariantItem";
import AddVariantDialog from "../AddVariantDialog";

interface VariantsSectionProps {
  control: Control<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export default function VariantsSection({
  control,
  watch,
  setValue,
  errors,
}: VariantsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  const variants = watch("variants");

  const handleAddVariant = (variant: any) => {
    if (editingIndex !== null) {
      update(editingIndex, variant);
      setEditingIndex(null);
    } else {
      append(variant);
    }
    setDialogOpen(false);
  };

  const handleEditVariant = (index: number) => {
    setEditingIndex(index);
    setDialogOpen(true);
  };

  const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Product Variants</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Total Stock: {totalStock} units
              </p>
            </div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setEditingIndex(null);
                setDialogOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Variant
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {fields.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No variants added yet</p>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => setDialogOpen(true)}
              >
                Add Your First Variant
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {fields.map((field, index) => (
                <VariantItem
                  key={field.id}
                  variant={variants[index]}
                  onEdit={() => handleEditVariant(index)}
                  onDelete={() => remove(index)}
                />
              ))}
            </div>
          )}
          {errors.variants && (
            <p className="text-sm text-red-600 mt-2">
              {errors.variants.message}
            </p>
          )}
        </CardContent>
      </Card>

      <AddVariantDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={handleAddVariant}
        variant={editingIndex !== null ? variants[editingIndex] : undefined}
        existingSkus={variants.map((v) => v.sku)}
      />
    </>
  );
}
