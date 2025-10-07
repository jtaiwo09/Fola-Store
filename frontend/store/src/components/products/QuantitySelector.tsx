"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  minOrder: number;
  maxOrder?: number;
  availableStock: number;
  unitOfMeasure: string;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  minOrder,
  maxOrder,
  availableStock,
  unitOfMeasure,
}: QuantitySelectorProps) {
  const effectiveMax = maxOrder
    ? Math.min(maxOrder, availableStock)
    : availableStock;

  const canDecrease = quantity > minOrder;
  const canIncrease = quantity < effectiveMax;

  const handleInputChange = (value: string) => {
    const numValue = parseInt(value) || minOrder;
    const clampedValue = Math.max(minOrder, Math.min(effectiveMax, numValue));
    onQuantityChange(clampedValue);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-900 dark:text-white">
        Quantity ({unitOfMeasure}s)
      </label>

      <div className="flex items-center gap-4">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(quantity - 1)}
            disabled={!canDecrease}
            className="rounded-none h-11 w-11"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <input
            type="number"
            value={quantity}
            onChange={(e) => handleInputChange(e.target.value)}
            min={minOrder}
            max={effectiveMax}
            className="w-16 h-11 text-center border-0 border-x border-gray-300 dark:border-gray-600 bg-transparent text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
            aria-label="Quantity"
          />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onQuantityChange(quantity + 1)}
            disabled={!canIncrease}
            className="rounded-none h-11 w-11"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {availableStock} available
        </span>
      </div>

      {minOrder > 1 && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Minimum order: {minOrder} {unitOfMeasure}s
        </p>
      )}
    </div>
  );
}
