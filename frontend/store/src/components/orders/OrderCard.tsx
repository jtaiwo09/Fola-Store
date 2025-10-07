// components/orders/OrderCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  Calendar,
  CreditCard,
  MapPin,
} from "lucide-react";
import { Order } from "@/lib/api/orders";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { usePriceFormatter } from "@/lib/hooks/usePriceFormatter";

interface OrderCardProps {
  order: Order;
}

const getStatusConfig = (status: Order["status"]) => {
  const configs = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
    },
    processing: {
      label: "Processing",
      variant: "default" as const,
      icon: Package,
      color: "text-blue-600 dark:text-blue-400",
    },
    shipped: {
      label: "Shipped",
      variant: "default" as const,
      icon: Truck,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    delivered: {
      label: "Delivered",
      variant: "default" as const,
      icon: CheckCircle2,
      color: "text-green-600 dark:text-green-400",
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive" as const,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
    },
    refunded: {
      label: "Refunded",
      variant: "outline" as const,
      icon: XCircle,
      color: "text-gray-600 dark:text-gray-400",
    },
  };
  return configs[status] || configs.pending;
};

const getPaymentStatusColor = (status: Order["payment"]["status"]) => {
  const colors = {
    completed: "text-green-600 dark:text-green-400",
    processing: "text-blue-600 dark:text-blue-400",
    pending: "text-yellow-600 dark:text-yellow-400",
    failed: "text-red-600 dark:text-red-400",
    refunded: "text-gray-600 dark:text-gray-400",
  };
  return colors[status] || colors.pending;
};

export function OrderCard({ order }: OrderCardProps) {
  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();

  const formatPrice = usePriceFormatter();

  const handleClick = () => {
    router.push(`/orders/${order._id}`);
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-md transition-shadow py-0 cursor-pointer"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
    >
      <CardContent className="p-0">
        {/* Header Section */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Order Info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg">
                  Order #{order.orderNumber}
                </h3>
                <Badge
                  variant={statusConfig.variant}
                  className="flex items-center gap-1"
                >
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.label}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(order.createdAt)}
                </span>
                <span>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-xl font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>
        </div>

        {/* Items Preview */}
        <div className="p-4">
          <div className="space-y-3">
            {order.items.slice(0, 2).map((item, index) => (
              <div key={index} className="flex gap-3">
                {/* Product Image */}
                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  <Image
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.productName}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    {item.variant.color && (
                      <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300 dark:border-gray-600"
                          style={{ backgroundColor: item.variant.colorHex }}
                        />
                        <span>{item.variant.color}</span>
                      </div>
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-semibold text-sm">
                    {order.currency} {item.totalPrice.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {order.currency} {item.unitPrice.toLocaleString()} each
                  </p>
                </div>
              </div>
            ))}

            {/* Show more items indicator */}
            {order.items.length > 2 && (
              <Link href={`/profile/orders/${order._id}`}>
                <div className="text-sm text-primary hover:underline flex items-center gap-1 pt-2">
                  +{order.items.length - 2} more{" "}
                  {order.items.length - 2 === 1 ? "item" : "items"}
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            )}
          </div>

          <Separator className="my-4" />

          {/* Footer Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            {/* Payment Status */}
            <div className="flex items-start gap-2">
              <CreditCard className="w-4 h-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment</p>
                <p
                  className={`font-medium capitalize ${getPaymentStatusColor(
                    order.payment.status
                  )}`}
                >
                  {order.payment.status.replace("_", " ")}
                </p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400">Ship to</p>
                <p className="font-medium truncate">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
              </div>
            </div>

            {/* Tracking Info */}
            {order.trackingNumber && (
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 mt-0.5 text-gray-500" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tracking</p>
                  <p className="font-medium font-mono text-xs">
                    {order.trackingNumber}
                  </p>
                </div>
              </div>
            )}

            {/* Delivery Status */}
            {order.status === "delivered" && order.deliveredAt && (
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-600" />
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Delivered</p>
                  <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                </div>
              </div>
            )}

            {/* Shipped Status */}
            {order.status === "shipped" &&
              order.shippedAt &&
              !order.deliveredAt && (
                <div className="flex items-start gap-2">
                  <Truck className="w-4 h-4 mt-0.5 text-indigo-600" />
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Shipped</p>
                    <p className="font-medium">
                      {/* {format(new Date(order.shippedAt), "MMM DD, YYYY")} */}
                      {formatDate(order.shippedAt)}
                    </p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
