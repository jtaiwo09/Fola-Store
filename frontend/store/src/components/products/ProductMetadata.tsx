// components/products/ProductMetadata.tsx
import { Truck, RotateCcw, Shield } from "lucide-react";

interface ProductMetadataProps {
  metadata: {
    shippingTime?: string;
    returnPolicy?: string;
    warranty?: string;
  };
}

export default function ProductMetadata({ metadata }: ProductMetadataProps) {
  return (
    <div className="space-y-4">
      {/* Shipping Info */}
      {metadata?.shippingTime && (
        <div className="flex items-start gap-3">
          <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Shipping
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metadata.shippingTime}
            </p>
          </div>
        </div>
      )}

      {/* Return Policy */}
      {metadata?.returnPolicy && (
        <div className="flex items-start gap-3">
          <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Returns
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metadata.returnPolicy}
            </p>
          </div>
        </div>
      )}

      {/* Warranty */}
      {metadata?.warranty && (
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Warranty
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {metadata.warranty}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
