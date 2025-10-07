import { ProductVariant } from "@/lib/api/products";

interface ColorSwatchesProps {
  variants: ProductVariant[];
  maxDisplay?: number;
}

export function ColorSwatches({
  variants,
  maxDisplay = 5,
}: ColorSwatchesProps) {
  if (!variants.length) return null;

  console.log(variants);

  const displayVariants = variants.slice(0, maxDisplay);
  const remainingCount = variants.length - maxDisplay;

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
      {displayVariants.map((variant, idx) => (
        <div
          key={idx}
          className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform cursor-pointer"
          style={{ backgroundColor: variant.colorHex }}
          title={variant.color}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}
