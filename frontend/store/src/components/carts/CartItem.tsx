import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { type CartItem, useCartStore } from "@/lib/store/cartStore";
import CartItemQuantity from "./CartItemQuantity";

interface CartItemProps {
  item: CartItem;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  const handleRemove = () => removeItem(item.product._id, item.variant.sku);
  const handleQuantityChange = (change: number) =>
    updateQuantity(item.product._id, item.variant.sku, item.quantity + change);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-6">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={item.product.featuredImage}
              alt={item.product.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {item.product.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.product.category.name}
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Color:
              </span>
              <div
                className="w-6 h-6 rounded-full border-2"
                style={{ backgroundColor: item.variant.colorHex }}
              />
              <span className="text-sm text-gray-900 dark:text-white">
                {item.variant.color}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <CartItemQuantity
                quantity={item.quantity}
                unitOfMeasure={item.product.unitOfMeasure}
                minimumOrder={item.product.minimumOrder}
                maximumOrder={item.product.maximumOrder}
                onQuantityChange={handleQuantityChange}
              />

              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {formatCurrency(
                    item.variant.price ||
                      item.product.salePrice ||
                      item.product.basePrice
                  )}{" "}
                  × {item.quantity}
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {formatCurrency(
                    (item.variant.price ||
                      item.product.salePrice ||
                      item.product.basePrice) * item.quantity
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
