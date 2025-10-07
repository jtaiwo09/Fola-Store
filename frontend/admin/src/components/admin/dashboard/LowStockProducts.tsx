"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Product {
  _id: string;
  name: string;
  category?: { name: string };
  totalStock: number;
}

interface LowStockProductsProps {
  products?: Product[];
}

export default function LowStockProducts({ products }: LowStockProductsProps) {
  const displayProducts = products?.slice(0, 5) || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Low Stock Alert</CardTitle>
          <Link
            href="/admin/products?stock=low"
            className="text-sm text-blue-600 hover:underline"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {displayProducts.length === 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
            All products are well stocked
          </p>
        ) : (
          <div className="space-y-2">
            {displayProducts.map((product) => (
              <Link
                key={product._id}
                href={`/admin/products/${product._id}`}
                className="block"
              >
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {product.category?.name || "Uncategorized"}
                    </p>
                  </div>
                  <Badge
                    variant={
                      product.totalStock === 0 ? "destructive" : "secondary"
                    }
                    className="text-xs ml-4"
                  >
                    {product.totalStock} in stock
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
