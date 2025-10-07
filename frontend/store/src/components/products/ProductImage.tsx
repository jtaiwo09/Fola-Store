"use client";

import { Product } from "@/lib/api/products";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ProductActions } from "./ProductActions";

interface ProductImageProps {
  product: Product;
  isHovered: boolean;
}

export function ProductImage({ product, isHovered }: ProductImageProps) {
  const displayImage =
    isHovered && product.images[1] ? product.images[1] : product.featuredImage;

  return (
    <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 overflow-hidden">
      <Image
        src={displayImage}
        alt={product.name}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Badge */}
      {product.badge && (
        <Badge className="absolute top-2 left-2 text-xs sm:top-3 sm:left-3 bg-black dark:bg-white text-white dark:text-black">
          {product.badge}
        </Badge>
      )}

      {/* Actions */}
      <ProductActions product={product} />
    </div>
  );
}
