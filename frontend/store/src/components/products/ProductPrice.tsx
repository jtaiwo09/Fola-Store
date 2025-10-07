import { Product } from "@/lib/api/products";
import { useProductPrice } from "@/lib/hooks/useProductPrice";

interface ProductPriceProps {
  product: Product;
}

export function ProductPrice({ product }: ProductPriceProps) {
  const { hasDiscount, formattedBasePrice, priceToDisplay } =
    useProductPrice(product);

  return (
    <div className="flex items-baseline gap-2 flex-wrap">
      <p className="font-semibold text-base sm:text-lg">{priceToDisplay}</p>

      {hasDiscount && (
        <p className="text-xs sm:text-sm text-gray-500 line-through">
          {formattedBasePrice}
        </p>
      )}

      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        /{product.unitOfMeasure}
      </span>
    </div>
  );
}
