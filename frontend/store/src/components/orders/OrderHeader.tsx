// components/orders/OrderHeader.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Order } from "@/lib/api/orders";
import { ArrowLeft, Download, Share2 } from "lucide-react";
import Link from "next/link";

const getStatusConfig = (status: Order["status"]) => {
  const configs = {
    pending: {
      label: "Pending",
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    processing: {
      label: "Processing",
      class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    },
    shipped: {
      label: "Shipped",
      class:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    },
    delivered: {
      label: "Delivered",
      class:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    cancelled: {
      label: "Cancelled",
      class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    refunded: {
      label: "Refunded",
      class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    },
  };
  return configs[status];
};

export function OrderHeader({ order }: { order: Order }) {
  const statusConfig = getStatusConfig(order.status);

  return (
    <div className="space-y-4">
      <Link href="/profile/orders">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light mb-2">
            Order Details
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-gray-600 dark:text-gray-400">
              #{order.orderNumber}
            </p>
            <Badge className={statusConfig.class}>{statusConfig.label}</Badge>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Invoice</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
