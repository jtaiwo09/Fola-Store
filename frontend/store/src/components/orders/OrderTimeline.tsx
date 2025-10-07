import { Card, CardContent } from "@/components/ui/card";
import { Order } from "@/lib/api/orders";
import { formatDate } from "@/lib/utils";
import { Package, Truck, CheckCircle2, XCircle } from "lucide-react";

interface TimelineStep {
  icon: React.ElementType;
  label: string;
  date?: string;
  description?: string;
  status: "completed" | "current" | "pending";
}

export function OrderTimeline({ order }: { order: Order }) {
  const steps: TimelineStep[] = [
    {
      icon: CheckCircle2,
      label: "Order Placed",
      date: order.createdAt,
      status: "completed",
    },
    {
      icon: Package,
      label: "Processing",
      date:
        order.status === "processing" || order.shippedAt
          ? order.createdAt
          : undefined,
      status: order.shippedAt
        ? "completed"
        : order.status === "processing"
          ? "current"
          : "pending",
    },
    {
      icon: Truck,
      label: "Shipped",
      date: order.shippedAt,
      description: order.trackingNumber
        ? `Tracking: ${order.trackingNumber}`
        : undefined,
      status: order.deliveredAt
        ? "completed"
        : order.shippedAt
          ? "current"
          : "pending",
    },
    {
      icon: CheckCircle2,
      label: "Delivered",
      date: order.deliveredAt,
      status: order.deliveredAt ? "completed" : "pending",
    },
  ];

  if (order.status === "cancelled") {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <XCircle className="w-6 h-6" />
            <div>
              <p className="font-semibold">Order Cancelled</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(order.updatedAt, "MMM DD, YYYY [at] h:mm A")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-6">Order Status</h2>
        <div className="space-y-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.status === "completed"
                        ? "bg-green-100 dark:bg-green-900"
                        : step.status === "current"
                          ? "bg-blue-100 dark:bg-blue-900"
                          : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        step.status === "completed"
                          ? "text-green-600 dark:text-green-400"
                          : step.status === "current"
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400"
                      }`}
                    />
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-12 ${
                        step.status === "completed"
                          ? "bg-green-200 dark:bg-green-800"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <p className="font-medium">{step.label}</p>
                  {step.date && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(step.date, "MMM DD, YYYY [at] h:mm A")}
                    </p>
                  )}
                  {step.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
