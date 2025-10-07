import { Product } from "@/lib/api/products";
import { Star } from "lucide-react";
import Link from "next/link";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-1.5 sm:space-y-2">
      <Link
        href={`/products/${product.slug}`}
        className="font-medium text-sm sm:text-base line-clamp-2 group-hover:underline min-h-[2.5rem] sm:min-h-[3rem]"
      >
        {product.name}
      </Link>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
        {product.category.name}
      </p>

      {/* Rating */}
      {product.reviewCount > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                  idx < Math.floor(product.averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({product.reviewCount})</span>
        </div>
      )}
    </div>
  );
}
