// components/admin/products/VariantItem.tsx
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { ProductVariant } from "@/lib/api/products";
import Image from "next/image";

interface VariantItemProps {
  variant: ProductVariant;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VariantItem({
  variant,
  onEdit,
  onDelete,
}: VariantItemProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        {/* Color Preview */}
        <div className="flex-shrink-0">
          <div
            className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700"
            style={{ backgroundColor: variant.colorHex }}
          />
        </div>

        {/* Variant Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {variant.color}
            </h4>
            {!variant.isAvailable && (
              <Badge variant="secondary">Unavailable</Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            SKU: {variant.sku}
          </p>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Stock: <strong>{variant.stock}</strong>
            </span>
            {variant.price && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Price: <strong>₦{variant.price}</strong>
              </span>
            )}
            <span className="text-sm text-gray-600 dark:text-gray-400">
              <ImageIcon className="w-3 h-3 inline mr-1" />
              {variant.images.length} image(s)
            </span>
          </div>
        </div>

        {/* Images Preview */}
        <div className="flex gap-2">
          {variant.images.slice(0, 3).map((img, idx) => (
            <div
              key={idx}
              className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden relative"
            >
              <Image
                src={img}
                alt={variant.color}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {variant.images.length > 3 && (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs">
              +{variant.images.length - 3}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button type="button" variant="ghost" size="icon" onClick={onEdit}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
