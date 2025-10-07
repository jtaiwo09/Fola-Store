"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardAlertsProps {
  stats?: {
    orders?: { pending?: number };
    products?: { lowStock?: number };
  };
}

export default function DashboardAlerts({ stats }: DashboardAlertsProps) {
  const pendingOrders = stats?.orders?.pending || 0;
  const lowStock = stats?.products?.lowStock || 0;

  if (pendingOrders === 0 && lowStock === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      {pendingOrders > 0 && (
        <AlertCard
          title="Pending Orders"
          description={`You have ${pendingOrders} orders waiting to be processed`}
          link="/admin/orders?status=pending"
          linkText="View pending orders"
          color="yellow"
        />
      )}

      {lowStock > 0 && (
        <AlertCard
          title="Low Stock Alert"
          description={`${lowStock} products are running low on stock`}
          link="/admin/products?stock=low"
          linkText="View low stock items"
          color="red"
        />
      )}
    </div>
  );
}

function AlertCard({
  title,
  description,
  link,
  linkText,
  color,
}: {
  title: string;
  description: string;
  link: string;
  linkText: string;
  color: "yellow" | "red";
}) {
  const colorClasses = {
    yellow: {
      border: "border-yellow-200 dark:border-yellow-900",
      icon: "text-yellow-600",
    },
    red: {
      border: "border-red-200 dark:border-red-900",
      icon: "text-red-600",
    },
  };

  return (
    <Card className={colorClasses[color].border}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle
            className={`w-6 h-6 flex-shrink-0 mt-1 ${colorClasses[color].icon}`}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium mb-1">{title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {description}
            </p>
            <Link href={link}>
              <span className="text-sm text-blue-600 hover:underline">
                {linkText} →
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
