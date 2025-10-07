// apps/store/src/app/(store)/profile/orders/page.tsx
"use client";

import { useState } from "react";
import { useMyOrders } from "@/lib/hooks/useOrders";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/reusables/Pagination";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { OrderCard } from "@/components/orders/OrderCard";

function OrdersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyOrders(page, 10);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light mb-2">My Orders</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and track all your orders
        </p>
      </div>

      {orders.length === 0 ? (
        <Card className="p-0">
          <CardContent className="p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You haven't placed any orders yet
            </p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col gap-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPage />
    </ProtectedRoute>
  );
}
