"use client";

import { useAdminStats, useLowStockProducts } from "@/lib/hooks/useAdmin";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardStats from "@/components/admin/dashboard/DashboardStats";
import DashboardAlerts from "@/components/admin/dashboard/DashboardAlerts";
import RecentOrders from "@/components/admin/dashboard/RecentOrders";
import LowStockProducts from "@/components/admin/dashboard/LowStockProducts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useAdminStats();
  const { data: lowStockProducts } = useLowStockProducts();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-light mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      <DashboardStats stats={stats} />

      <DashboardAlerts stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentOrders orders={stats?.recentOrders} />
        <LowStockProducts products={lowStockProducts} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    </div>
  );
}
