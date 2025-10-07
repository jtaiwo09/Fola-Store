"use client";

import { Product } from "@/lib/api/products";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { MoreVertical, Edit, Eye, Copy, Trash2, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import ProductStatusBadge from "./ProductStatusBadge";
import StockBadge from "./StockBadge";
import { useEffect, useRef } from "react";

interface ProductsTableProps {
  products: Product[];
  isLoading: boolean;
  selectedProducts: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectProduct: (productId: string, checked: boolean) => void;
  onDeleteProduct: (product: Product) => void;
}

export default function ProductsTable({
  products,
  isLoading,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  onDeleteProduct,
}: ProductsTableProps) {
  const selectAllCheckboxRef = useRef<any>(null);

  const allSelected =
    products.length > 0 && selectedProducts.length === products.length;
  const someSelected = selectedProducts.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">
                <Checkbox
                  ref={selectAllCheckboxRef}
                  checked={allSelected}
                  onCheckedChange={onSelectAll}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product._id}
                  product={product}
                  isSelected={selectedProducts.includes(product._id)}
                  onSelect={onSelectProduct}
                  onDelete={onDeleteProduct}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function ProductRow({
  product,
  isSelected,
  onSelect,
  onDelete,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: (productId: string, checked: boolean) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      <td className="px-6 py-4">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) =>
            onSelect(product._id, checked as boolean)
          }
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0 relative">
            <Image
              src={product.featuredImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/products/${product._id}`}
                className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 truncate"
              >
                {product.name}
              </Link>
              {product.isFeatured && (
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">{product.slug}</p>
            <div className="flex items-center gap-2 mt-1">
              {product.salePrice > 0 && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                >
                  {product.discountPercentage}% OFF
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {product.variants.length} variant(s)
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {product.category.name}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          {product.salePrice > 0 ? (
            <>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(product.salePrice)}
              </span>
              <span className="text-xs text-gray-500 line-through">
                {formatCurrency(product.basePrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {formatCurrency(product.basePrice)}
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StockBadge stock={product.totalStock} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ProductStatusBadge
          status={product.status}
          isPublished={product.isPublished}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product._id}/view`}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/admin/products/${product._id}/edit`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(product)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}

function ProductsTableSkeleton() {
  return (
    <Card>
      <div className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    </Card>
  );
}
