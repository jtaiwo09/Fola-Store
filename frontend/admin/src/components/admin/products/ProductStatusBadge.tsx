// components/admin/products/ProductStatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductStatusBadgeProps {
  status: "draft" | "active" | "archived" | "out_of_stock";
  isPublished: boolean;
}

const STATUS_CONFIG = {
  draft: {
    label: "Draft",
    className:
      "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  },
  active: {
    label: "Active",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  },
  archived: {
    label: "Archived",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  },
};

export default function ProductStatusBadge({
  status,
  isPublished,
}: ProductStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <div className="flex flex-col gap-1">
      <Badge className={cn("capitalize", config.className)}>
        {config.label}
      </Badge>
      {!isPublished && (
        <Badge variant="outline" className="text-xs">
          Unpublished
        </Badge>
      )}
    </div>
  );
}
