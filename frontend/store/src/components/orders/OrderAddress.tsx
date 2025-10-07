import { Card, CardContent } from "@/components/ui/card";
import { MapPin, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/lib/api/orders";

export function OrderAddress({ order }: { order: Order }) {
  const getPaymentStatusClass = (status: Order["payment"]["status"]) => {
    const classes = {
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      processing:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      refunded: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    };
    return classes[status];
  };

  return (
    <div className="space-y-4">
      {/* Shipping Address */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">Shipping Address</h2>
          </div>
          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="pt-2">{order.shippingAddress.phone}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="text-lg font-semibold">Payment</h2>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Method</span>
              <span className="font-medium capitalize">
                {order.payment.method.replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Status</span>
              <Badge className={getPaymentStatusClass(order.payment.status)}>
                {order.payment.status.replace("_", " ")}
              </Badge>
            </div>
            {order.payment.reference && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400">Reference</p>
                <p className="font-mono text-xs mt-1">
                  {order.payment.reference}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
