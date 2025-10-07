"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CartItem } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils";

interface CheckoutReviewStepProps {
  items: CartItem[];
  onContinue: () => void;
}

export default function CheckoutReviewStep({
  items,
  onContinue,
}: CheckoutReviewStepProps) {
  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700 p-0">
      <CardContent className="p-4 md:p-6">
        <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
          Review Your Order
        </h2>

        <div className="space-y-4 mb-6">
          {items.map((item) => {
            const price =
              item.variant.price ||
              item.product.salePrice ||
              item.product.basePrice;
            return (
              <div
                key={`${item.product._id}-${item.variant.sku}`}
                className="flex gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0"
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                  <Image
                    src={item.product.featuredImage}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.variant.color} • {item.quantity}{" "}
                    {item.product.unitOfMeasure}
                    {item.quantity > 1 ? "s" : ""}
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(price * item.quantity)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <Button size="lg" className="w-full" onClick={onContinue}>
          Continue to Shipping
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
