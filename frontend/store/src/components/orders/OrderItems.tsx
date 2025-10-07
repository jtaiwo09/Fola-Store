import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/lib/api/orders";
import Image from "next/image";

export function OrderItems({ order }: { order: Order }) {
  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {order.items.map((item, idx) => (
            <div key={idx} className="py-4 first:pt-0 last:pb-0">
              <div className="flex gap-4">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm sm:text-base truncate">
                    {item.productName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {item.variant.color && (
                      <span className="flex items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: item.variant.colorHex }}
                        />
                        {item.variant.color}
                      </span>
                    )}
                    <span>•</span>
                    <span>Qty: {item.quantity}</span>
                    {item.variant.sku && (
                      <>
                        <span>•</span>
                        <span className="font-mono text-xs">
                          {item.variant.sku}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-baseline gap-2 mt-2">
                    <p className="font-semibold text-sm sm:text-base">
                      {order.currency} {item.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {order.currency} {item.unitPrice.toLocaleString()} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
