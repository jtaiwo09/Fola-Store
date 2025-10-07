// app/admin/products/[id]/edit/page.tsx
"use client";

import { use } from "react";
import { useProduct } from "@/lib/hooks/useProducts";
import ProductForm from "@/components/admin/products/ProductForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);
  const { data, isLoading } = useProduct(id);

  if (isLoading) {
    return <ProductFormSkeleton />;
  }

  if (!data?.data.product) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Update product information
          </p>
        </div>
        <ProductForm product={data.data.product} />
      </div>
    </div>
  );
}

function ProductFormSkeleton() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card className="p-6 space-y-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </Card>
      </div>
    </div>
  );
}
