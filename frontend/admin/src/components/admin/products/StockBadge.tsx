// components/admin/products/StockBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StockBadgeProps {
  stock: number;
}

export default function StockBadge({ stock }: StockBadgeProps) {
  const getStockStatus = () => {
    if (stock === 0) {
      return {
        label: "Out of Stock",
        className:
          "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
      };
    }
    if (stock < 10) {
      return {
        label: `Low (${stock})`,
        className:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      };
    }
    return {
      label: `${stock} in stock`,
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
    };
  };

  const status = getStockStatus();

  return <Badge className={cn(status.className)}>{status.label}</Badge>;
}
