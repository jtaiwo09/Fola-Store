"use client";

import { use } from "react";
import { useOrder } from "@/lib/hooks/useOrders";
import { Loader2 } from "lucide-react";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { OrderTimeline } from "@/components/orders/OrderTimeline";
import { OrderItems } from "@/components/orders/OrderItems";
import { OrderSummary } from "@/components/orders/OrderSummary";
import { OrderAddress } from "@/components/orders/OrderAddress";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-light mb-2">Order not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The order you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
      <OrderHeader order={order} />

      <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <OrderTimeline order={order} />
          <OrderItems order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderSummary order={order} />
          <OrderAddress order={order} />
        </div>
      </div>
    </div>
  );
}
