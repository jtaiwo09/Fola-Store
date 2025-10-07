"use client";
import { useCartStore } from "@/lib/store/cartStore";
import { useRouter } from "next/navigation";
import CartItem from "@/components/carts/CartItem";
import OrderSummary from "@/components/carts/OrderSummary";
import EmptyCart from "@/components/carts/EmptyCart";
import { Button } from "@/components/ui/button";
import { useStoreSettings } from "../providers/store-settings";

export default function CartPage() {
  const { items, clearCart, getTotal } = useCartStore();
  const router = useRouter();

  const { settings } = useStoreSettings();

  const subtotal = getTotal();
  const shipping = settings?.shipping.flatRate || 1500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-light text-gray-900 dark:text-white mb-4 sm:mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem
              key={`${item.product._id}-${item.variant.sku}`}
              item={item}
            />
          ))}

          <div className="flex gap-4">
            <Button
              variant="default"
              className="flex-1"
              onClick={() => router.push("/products")}
            >
              Continue Shopping
            </Button>
            <Button variant="outline" className="flex-1" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onProceedToCheckout={() => router.push("/checkout")}
        />
      </div>
    </div>
  );
}
