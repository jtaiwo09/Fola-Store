import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  onProceedToCheckout: () => void;
}

export default function OrderSummary({
  subtotal,
  shipping,
  total,
  onProceedToCheckout,
}: OrderSummaryProps) {
  return (
    <div className="lg:sticky lg:top-24 h-fit">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
            Order Summary
          </h2>
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full" onClick={onProceedToCheckout}>
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
