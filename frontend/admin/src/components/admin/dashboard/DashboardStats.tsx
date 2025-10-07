"use client";

import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Stats {
  revenue: { current: number; change?: number };
  orders: { current: number; change?: number };
  products: { total: number };
  customers: { current: number; change?: number };
}

interface DashboardStatsProps {
  stats?: Stats;
}

const STAT_CARDS = [
  {
    key: "revenue",
    title: "Total Revenue",
    icon: DollarSign,
    color: "bg-green-100 dark:bg-green-900/20 text-green-600",
    format: (value: number) => `₦${value.toLocaleString()}`,
  },
  {
    key: "orders",
    title: "Total Orders",
    icon: ShoppingCart,
    color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
    format: (value: number) => value.toString(),
  },
  {
    key: "products",
    title: "Total Products",
    icon: Package,
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
    format: (value: number) => value.toString(),
  },
  {
    key: "customers",
    title: "New Customers",
    icon: Users,
    color: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
    format: (value: number) => value.toString(),
  },
] as const;

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {STAT_CARDS.map((card) => {
        const Icon = card.icon;
        const statData = stats?.[card.key as keyof Stats];
        const value =
          card.key === "products"
            ? (statData as any)?.total || 0
            : (statData as any)?.current || 0;
        const change = (statData as any)?.change;

        return (
          <Card key={card.key} className="p-0">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl md:text-3xl font-light">
                    {card.format(value)}
                  </p>
                  {change !== undefined && (
                    <div className="flex items-center mt-2">
                      {change >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                      )}
                      <span
                        className={cn(
                          "text-sm",
                          change >= 0 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {change >= 0 ? "+" : ""}
                        {change}% from last month
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center flex-shrink-0",
                    card.color
                  )}
                >
                  <Icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
