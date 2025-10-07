"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  _id: string;
  orderNumber: string;
  customer: { firstName: string; lastName: string };
  total: number;
  status: string;
}

interface RecentOrdersProps {
  orders?: Order[];
}

const STATUS_VARIANTS = {
  delivered: "default",
  pending: "secondary",
  processing: "outline",
  shipped: "outline",
  cancelled: "destructive",
} as const;

export default function RecentOrders({ orders }: RecentOrdersProps) {
  const displayOrders = orders?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link
            href="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {displayOrders.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
            No recent orders
          </p>
        ) : (
          <div className="space-y-2">
            {displayOrders.map((order) => (
              <Link
                key={order._id}
                href={`/admin/orders/${order._id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">#{order.orderNumber}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium mb-1">
                      ₦{order.total.toLocaleString()}
                    </p>
                    <Badge
                      variant={
                        STATUS_VARIANTS[
                          order.status as keyof typeof STATUS_VARIANTS
                        ] || "outline"
                      }
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
