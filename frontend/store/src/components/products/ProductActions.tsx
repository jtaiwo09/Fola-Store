"use client";

import { Product } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "sonner";

interface ProductActionsProps {
  product: Product;
}

export function ProductActions({ product }: ProductActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addItem } = useCartStore();

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const firstVariant = product.variants[0];
    if (!firstVariant) {
      toast.error("No variants available");
      return;
    }

    addItem(product, firstVariant, 5);
    toast.success("Added to cart!");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <>
      {/* Favorite Button */}
      <button
        onClick={handleToggleFavorite}
        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
            isFavorite
              ? "fill-red-500 text-red-500"
              : "text-gray-700 dark:text-gray-300"
          }`}
        />
      </button>

      {/* Quick Add Button */}
      {product.variants.length > 0 && (
        <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 shadow-lg"
            onClick={handleQuickAdd}
          >
            Quick Add
          </Button>
        </div>
      )}
    </>
  );
}
