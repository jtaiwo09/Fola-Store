import { Package, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Variant {
  sku: string;
  color: string;
  colorHex: string;
  images: string[];
  stock: number;
  price?: number;
  isAvailable: boolean;
}

interface VariantDetailsCardProps {
  variants: Variant[];
  basePrice: number;
}

export default function VariantDetailsCard({
  variants,
  basePrice,
}: VariantDetailsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Product Variants ({variants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {variants.map((variant, idx) => {
            const isLowStock = variant.stock < 10;
            const isOutOfStock = variant.stock === 0;

            return (
              <div
                key={idx}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Color Swatch */}
                  <div className="flex-shrink-0">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-gray-300 dark:border-gray-600"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {variant.color}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          SKU: {variant.sku}
                        </p>
                      </div>

                      {/* Status Badge */}
                      {isOutOfStock ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      ) : isLowStock ? (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Low Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          In Stock
                        </Badge>
                      )}
                    </div>

                    {/* Stock and Price Info */}
                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Stock
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {variant.stock} units
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Price
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          ₦{(variant.price || basePrice).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Status
                        </p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {variant.isAvailable ? "Available" : "Unavailable"}
                        </p>
                      </div>
                    </div>

                    {/* Images Preview */}
                    {variant.images && variant.images.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          Images ({variant.images.length})
                        </p>
                        <div className="flex gap-2 overflow-x-auto">
                          {variant.images.slice(0, 4).map((image, imgIdx) => (
                            <img
                              key={imgIdx}
                              src={image}
                              alt={`${variant.color} ${imgIdx + 1}`}
                              className="w-12 h-12 rounded border border-gray-200 dark:border-gray-700 object-cover"
                            />
                          ))}
                          {variant.images.length > 4 && (
                            <div className="w-12 h-12 rounded border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-400">
                              +{variant.images.length - 4}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
