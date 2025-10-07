"use client";

import { cn } from "@/lib/utils";

interface ColorVariant {
  sku: string;
  color: string;
  colorHex: string;
  stock: number;
  isAvailable: boolean;
}

interface ColorVariantSelectorProps {
  variants: ColorVariant[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorVariantSelector({
  variants,
  selectedColor,
  onColorChange,
}: ColorVariantSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Color:{" "}
        <span className="font-normal text-gray-600 dark:text-gray-400">
          {selectedColor || "Select a color"}
        </span>
      </label>

      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isOutOfStock = !variant.isAvailable || variant.stock === 0;
          const isSelected = selectedColor === variant.color;

          return (
            <button
              key={variant.sku}
              onClick={() => onColorChange(variant.color)}
              disabled={isOutOfStock}
              className={cn(
                "w-12 h-12 rounded-full border-2 transition-all relative",
                "hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
                isSelected
                  ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white ring-offset-2"
                  : "border-gray-300 dark:border-gray-600 hover:border-gray-500 dark:hover:border-gray-400"
              )}
              style={{ backgroundColor: variant.colorHex }}
              title={`${variant.color}${isOutOfStock ? " (Out of stock)" : ""}`}
              aria-label={`Select ${variant.color} color`}
            >
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-0.5 bg-red-500 rotate-45" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
