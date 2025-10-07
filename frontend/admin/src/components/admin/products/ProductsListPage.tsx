// components/admin/products/ProductsListPage.tsx (Updated)
"use client";

import { useState } from "react";
import {
  useProducts,
  useDeleteProduct,
  useBulkPublishProducts,
  useBulkDeleteProducts,
} from "@/lib/hooks/useProducts";
import { ProductFilters } from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Download } from "lucide-react";
import Link from "next/link";
import { Pagination } from "@/components/reusables/Pagination";
import ProductsTable from "./ProductsTable";
import ProductFiltersBar from "./ProductFiltersBar";
import DeleteProductDialog from "./DeleteProductDialog";
import BulkDeleteDialog from "./BulkDeleteDialog";
import { Product } from "@/lib/api/products";

export default function ProductsListPage() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sort: "-createdAt",
    status: "active",
    isPublished: true,
  });

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);

  const { data, isLoading } = useProducts(filters);
  const deleteProduct = useDeleteProduct();
  const bulkPublish = useBulkPublishProducts();
  const bulkDelete = useBulkDeleteProducts();

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    setSelectedProducts([]);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked && data?.data) {
      setSelectedProducts(data.data.map((p) => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts((prev) => [...prev, productId]);
    } else {
      setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedProducts.length === 0) return;

    switch (action) {
      case "publish":
        bulkPublish.mutate(
          { productIds: selectedProducts, isPublished: true },
          {
            onSuccess: () => {
              setSelectedProducts([]);
            },
          }
        );
        break;

      case "unpublish":
        bulkPublish.mutate(
          { productIds: selectedProducts, isPublished: false },
          {
            onSuccess: () => {
              setSelectedProducts([]);
            },
          }
        );
        break;

      case "delete":
        setShowBulkDeleteDialog(true);
        break;

      default:
        break;
    }
  };

  const handleBulkDeleteConfirm = () => {
    bulkDelete.mutate(selectedProducts, {
      onSuccess: () => {
        setSelectedProducts([]);
        setShowBulkDeleteDialog(false);
      },
    });
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete._id, {
        onSuccess: () => {
          setProductToDelete(null);
        },
      });
    }
  };

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {pagination?.total || 0} total products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Link href="/admin/products/new">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ProductFiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Bulk Actions Bar */}
      {selectedProducts.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {selectedProducts.length} product(s) selected
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("publish")}
                disabled={bulkPublish.isPending}
              >
                {bulkPublish.isPending ? "Publishing..." : "Publish"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("unpublish")}
                disabled={bulkPublish.isPending}
              >
                {bulkPublish.isPending ? "Unpublishing..." : "Unpublish"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction("delete")}
                disabled={bulkDelete.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Products Table */}
      <ProductsTable
        products={products}
        isLoading={isLoading}
        selectedProducts={selectedProducts}
        onSelectAll={handleSelectAll}
        onSelectProduct={handleSelectProduct}
        onDeleteProduct={setProductToDelete}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Single Delete Dialog */}
      <DeleteProductDialog
        product={productToDelete}
        open={!!productToDelete}
        onOpenChange={(open) => !open && setProductToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteProduct.isPending}
      />

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDeleteConfirm}
        isDeleting={bulkDelete.isPending}
        count={selectedProducts.length}
      />
    </div>
  );
}
