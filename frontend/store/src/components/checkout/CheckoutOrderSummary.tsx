"use client";

import { Lock, MapPin, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/lib/store/cartStore";
import { formatCurrency } from "@/lib/utils";
import { useStoreSettings } from "../providers/store-settings";

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

interface CheckoutOrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingInfo?: ShippingInfo;
  showShippingAddress?: boolean;
}

export default function CheckoutOrderSummary({
  items,
  subtotal,
  shipping,
  total,
  shippingInfo,
  showShippingAddress,
}: CheckoutOrderSummaryProps) {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { settings } = useStoreSettings();

  const minDate = settings?.shipping.estimatedDeliveryDays.min;
  const maxDate = settings?.shipping.estimatedDeliveryDays.max;

  return (
    <div className="lg:sticky lg:top-24 h-fit space-y-6">
      <Card className="dark:bg-gray-800 dark:border-gray-700 p-0">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Order Summary
          </h2>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <Package className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            {showShippingAddress && shippingInfo?.firstName && (
              <div className="flex items-start gap-3 text-sm pt-3 border-t border-gray-200 dark:border-gray-700">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-gray-600 dark:text-gray-400">
                  <p className="font-medium text-gray-900 dark:text-white mb-1">
                    Shipping to:
                  </p>
                  <p>
                    {shippingInfo.firstName} {shippingInfo.lastName}
                  </p>
                  <p>{shippingInfo.address}</p>
                  <p>
                    {shippingInfo.city}, {shippingInfo.state}{" "}
                    {shippingInfo.postalCode}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="mb-4 dark:bg-gray-700" />

          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-700 dark:text-gray-300">
              <span>Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <Separator className="dark:bg-gray-700" />
            <div className="flex justify-between text-lg font-medium text-gray-900 dark:text-white">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="space-y-4">
        <TrustBadge
          icon={Lock}
          text="256-bit SSL encryption"
          bgColor="bg-green-100 dark:bg-green-900/20"
          iconColor="text-green-600 dark:text-green-400"
        />
        <TrustBadge
          icon={Package}
          text={`Ships within ${minDate}-${maxDate} business days`}
          bgColor="bg-blue-100 dark:bg-blue-900/20"
          iconColor="text-blue-600 dark:text-blue-400"
        />
      </div>
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  text,
  bgColor,
  iconColor,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  bgColor: string;
  iconColor: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
      <div
        className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
      >
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <span>{text}</span>
    </div>
  );
}
