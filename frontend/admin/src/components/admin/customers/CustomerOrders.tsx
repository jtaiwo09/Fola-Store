// components/admin/customers/CustomerOrders.tsx
"use client";

import { useOrders } from "@/lib/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

interface CustomerOrdersProps {
  customerId: string;
}

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

export default function CustomerOrders({ customerId }: CustomerOrdersProps) {
  // Filter orders by customer - would need backend support
  const { data, isLoading } = useOrders({ page: 1, limit: 10 });

  const orders = data?.data || [];
  const customerOrders = orders.filter(
    (order) => order.customer._id === customerId
  );

  const totalSpent = customerOrders.reduce(
    (sum, order) => sum + order.total,
    0
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Orders ({customerOrders.length})
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-xl font-medium">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center py-8 text-gray-500">Loading orders...</p>
        ) : customerOrders.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {customerOrders.map((order) => (
              <div
                key={order._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-medium">{order.orderNumber}</p>
                    <Badge
                      className={cn(
                        "capitalize",
                        STATUS_COLORS[
                          order.status as keyof typeof STATUS_COLORS
                        ]
                      )}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{order.items.length} items</span>
                    <span>•</span>
                    <span>{formatDate(order.createdAt, "MMM DD, YYYY")}</span>
                    <span>•</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>
                <Link href={`/admin/orders/${order._id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
