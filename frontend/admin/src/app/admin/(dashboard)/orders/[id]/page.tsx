"use client";

import { use, useState } from "react";
import { useOrder } from "@/lib/hooks/useOrders";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, CreditCard, Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import Image from "next/image";
import UpdateOrderStatusDialog from "@/components/admin/orders/UpdateOrderStatusDialog";

const STATUS_COLORS = {
  pending:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  processing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  shipped:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  delivered:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  refunded: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading } = useOrder(id);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }

  if (!data?.data.order) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Order not found</p>
        <Button onClick={() => router.back()} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  const order = data.data.order;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-light text-gray-900 dark:text-white">
              Order {order.orderNumber}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {formatDate(order.updatedAt, "MMM DD, YYYY [at] h:mm A")}
            </p>
          </div>
        </div>
        <Button onClick={() => setStatusDialogOpen(true)}>
          <Edit className="w-4 h-4 mr-2" />
          Update Status
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                  >
                    <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={item.productImage}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {item.productName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.variant.color} • SKU: {item.variant.sku}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.quantity} {item.unitOfMeasure}
                        {item.quantity > 1 ? "s" : ""} ×
                        {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Subtotal
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Shipping
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {formatCurrency(order.shippingCost)}
                  </span>
                </div>
                {order.tax > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                )}
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>- {formatCurrency(order.discount)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-medium text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.address}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.country}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {order.shippingAddress.phone}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {order.shippingAddress.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Order Status
                </p>
                <Badge
                  className={cn(
                    "capitalize text-sm",
                    STATUS_COLORS[order.status as keyof typeof STATUS_COLORS]
                  )}
                >
                  {order.status}
                </Badge>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Fulfillment
                </p>
                <Badge variant="outline" className="capitalize">
                  {order.fulfillmentStatus.replace("_", " ")}
                </Badge>
              </div>

              {order.trackingNumber && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Tracking Number
                    </p>
                    <p className="text-sm font-mono">{order.trackingNumber}</p>
                  </div>
                </>
              )}

              {order.carrier && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Carrier
                  </p>
                  <p className="text-sm">{order.carrier}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Status
                </p>
                <Badge
                  className={cn(
                    "capitalize",
                    order.payment.status === "completed"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                  )}
                >
                  {order.payment.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Method
                </p>
                <p className="text-sm capitalize">
                  {order.payment.method.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Reference
                </p>
                <p className="text-sm font-mono">{order.payment.reference}</p>
              </div>
              {order.payment.transactionId && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Transaction ID
                  </p>
                  <p className="text-sm font-mono">
                    {order.payment.transactionId}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.customer.firstName} {order.customer.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.customer.email}
                </p>
                <Link href={`/admin/customers/${order.customer._id}`}>
                  <Button variant="link" className="p-0 h-auto text-blue-600">
                    View customer →
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Update Status Dialog */}
      <UpdateOrderStatusDialog
        order={order}
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
      />
    </div>
  );
}

function OrderDetailsSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Skeleton className="h-10 w-96" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20 mb-4" />
              ))}
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
