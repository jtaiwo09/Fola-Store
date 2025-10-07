"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput, FormSwitch } from "@/components/forms";
import { productVariantSchema } from "@/lib/validations/product.validation";
import { ProductVariant } from "@/lib/api/products";
import { z } from "zod";
import ImageUploadField from "./ImageUploadField";

interface AddVariantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (variant: ProductVariant) => void;
  variant?: ProductVariant;
  existingSkus: string[];
}

// Create a separate schema without images for form validation
const variantFormSchema = productVariantSchema.omit({ images: true });
type VariantFormData = z.infer<typeof variantFormSchema>;

export default function AddVariantDialog({
  open,
  onOpenChange,
  onAdd,
  variant,
  existingSkus,
}: AddVariantDialogProps) {
  const [images, setImages] = useState<string[]>(variant?.images || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VariantFormData>({
    resolver: zodResolver(variantFormSchema),
    defaultValues: variant
      ? {
          sku: variant.sku,
          color: variant.color,
          colorHex: variant.colorHex,
          stock: variant.stock,
          price: variant.price,
          isAvailable: variant.isAvailable,
        }
      : {
          sku: "",
          color: "",
          colorHex: "#000000",
          stock: 0,
          isAvailable: true,
        },
  });

  useEffect(() => {
    if (open && variant) {
      reset({
        sku: variant.sku,
        color: variant.color,
        colorHex: variant.colorHex,
        stock: variant.stock,
        price: variant.price,
        isAvailable: variant.isAvailable,
      });
      setImages(variant.images);
    } else if (open) {
      reset({
        sku: "",
        color: "",
        colorHex: "#000000",
        stock: 0,
        isAvailable: true,
      });
      setImages([]);
    }
  }, [open, variant, reset]);

  const onSubmit = (data: VariantFormData) => {
    // Check for duplicate SKU (excluding current variant when editing)
    if (existingSkus.includes(data.sku) && data.sku !== variant?.sku) {
      return;
    }

    // Validate images separately
    if (images.length === 0) {
      // You can show an error toast here
      return;
    }

    // Clean up the data
    const cleanedData = {
      ...data,
      images,
      price: data.price && data.price > 0 ? data.price : undefined,
    };

    onAdd(cleanedData as ProductVariant);
  };

  const color = watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {variant ? "Edit Variant" : "Add New Variant"}
          </DialogTitle>
          <DialogDescription>
            {variant
              ? "Update variant information"
              : "Add a new color variant for this product"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="sku"
              label="SKU"
              placeholder="PRD-001-BLK"
              register={register("sku")}
              error={errors.sku}
              required
            />

            <FormInput
              id="color"
              label="Color Name"
              placeholder="e.g., Navy Blue"
              register={register("color")}
              error={errors.color}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FormInput
                id="colorHex"
                label="Color Hex"
                type="text"
                placeholder="#000000"
                register={register("colorHex")}
                error={errors.colorHex}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Color Preview
              </label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: watch("colorHex") }}
                />
                <input
                  type="color"
                  value={watch("colorHex")}
                  onChange={(e) => setValue("colorHex", e.target.value)}
                  className="w-12 h-12 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="stock"
              label="Stock Quantity"
              type="number"
              placeholder="0"
              register={register("stock", { valueAsNumber: true })}
              error={errors.stock}
              required
            />

            <FormInput
              id="price"
              label="Variant Price (Optional)"
              type="number"
              placeholder="Override base price"
              register={register("price", {
                setValueAs: (v) =>
                  v === "" || v === null ? undefined : parseFloat(v),
              })}
              error={errors.price}
              description="Leave empty to use base price"
            />
          </div>

          <FormSwitch
            id="isAvailable"
            label="Available for Purchase"
            checked={watch("isAvailable")}
            onCheckedChange={(checked) => setValue("isAvailable", checked)}
            description="Disable to hide this variant from customers"
          />

          <ImageUploadField
            label={`${color || "Variant"} Images`}
            images={images}
            onChange={setImages}
            error={
              images.length === 0
                ? { message: "At least one image required" }
                : undefined
            }
            required
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={images.length === 0}>
              {variant ? "Update Variant" : "Add Variant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
