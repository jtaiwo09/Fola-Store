import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductAnalytics } from "@/lib/hooks/useProductAnalytics";

interface SalesAnalyticsCardProps {
  productId: string;
}

export default function SalesAnalyticsCard({
  productId,
}: SalesAnalyticsCardProps) {
  const { data: analytics, isLoading } = useProductAnalytics(productId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No sales data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `₦${analytics.totalRevenue.toLocaleString()}`,
      color: "text-green-600 dark:text-green-500",
      bg: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: ShoppingCart,
      label: "Total Orders",
      value: analytics.totalOrders.toString(),
      color: "text-blue-600 dark:text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Package,
      label: "Units Sold",
      value: analytics.totalQuantitySold.toString(),
      color: "text-purple-600 dark:text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      icon: TrendingUp,
      label: "Avg Order Value",
      value: `₦${Math.round(analytics.averageOrderValue).toLocaleString()}`,
      color: "text-orange-600 dark:text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-900/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Sales Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} rounded-lg p-4 border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </p>
              </div>
              <p className="text-xl font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Top Variants */}
        {analytics.topVariants && analytics.topVariants.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Top Selling Variants
            </h4>
            <div className="space-y-2">
              {analytics.topVariants.slice(0, 3).map((variant, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    {variant.color}
                  </span>
                  <div className="text-right">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {variant.quantitySold} units
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      ₦{variant.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
