"use client";

import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "../providers/store-settings";

interface ProductDetailActionsProps {
  totalPrice: number;
  onAddToCart: () => void;
  isOutOfStock: boolean;
  isInStock?: boolean;
}

export default function ProductDetailActions({
  totalPrice,
  onAddToCart,
  isOutOfStock,
  isInStock,
}: ProductDetailActionsProps) {
  const { settings } = useStoreSettings();

  const minDate = settings?.shipping.estimatedDeliveryDays.min;
  const maxDate = settings?.shipping.estimatedDeliveryDays.max;
  return (
    <div className="space-y-6">
      {/* Total Price */}
      <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 dark:text-gray-300 text-lg">
            Total Price
          </span>
          <span className="text-3xl font-light text-gray-900 dark:text-white">
            ₦{totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 min-h-12"
          onClick={onAddToCart}
          disabled={isOutOfStock}
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="sm:w-12 h-12"
          aria-label="Add to wishlist"
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Stock Status */}
      {isInStock && (
        <div className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-gray-600 dark:text-gray-400">
            In Stock • Ships within {minDate}-{maxDate} business days
          </span>
        </div>
      )}
    </div>
  );
}
