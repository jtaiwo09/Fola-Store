"use client";

import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useProductPrice } from "@/lib/hooks/useProductPrice";
import { Product } from "@/lib/api/products";

interface ProductInfoHeaderProps {
  name: string;
  badge?: string;
  averageRating: number;
  reviewCount: number;
  discountPercentage?: number;
  unitOfMeasure: string;
  product: Product;
}

export default function ProductInfoHeader({
  name,
  badge,
  averageRating,
  reviewCount,
  discountPercentage,
  unitOfMeasure,
  product,
}: ProductInfoHeaderProps) {
  const { hasDiscount, formattedBasePrice, priceToDisplay } =
    useProductPrice(product);

  return (
    <div className="space-y-4">
      {badge && (
        <Badge className="bg-gray-900 dark:bg-white text-white dark:text-gray-900">
          {badge}
        </Badge>
      )}

      <h1 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
        {name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-4 h-4 ${
                idx < Math.floor(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {averageRating.toFixed(1)} ({reviewCount}{" "}
          {reviewCount === 1 ? "review" : "reviews"})
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3 flex-wrap">
        {priceToDisplay && (
          <span className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
            {priceToDisplay}
          </span>
        )}

        {/* Show base price if there's a discount */}
        {hasDiscount && formattedBasePrice && (
          <>
            <span className="text-xl md:text-2xl text-gray-500 line-through">
              {formattedBasePrice}
            </span>
            {discountPercentage && (
              <Badge variant="destructive" className="text-sm">
                {discountPercentage}% OFF
              </Badge>
            )}
          </>
        )}

        {unitOfMeasure && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            per {unitOfMeasure}
          </span>
        )}
      </div>
    </div>
  );
}
