"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import ProductCard from "./products/ProductCard";
import { useFeaturedProducts } from "@/lib/hooks/useProducts";
import { Skeleton } from "./ui/skeleton";

export const FeaturedProductsSection = () => {
  const { data: products, isLoading } = useFeaturedProducts(8);

  console.log(89, products);

  if (isLoading) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) {
    return (
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
            Featured Collection
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            No featured products available at the moment
          </p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-2">
              Featured Collection
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Handpicked premium fabrics for your special projects
            </p>
          </div>
          <Button asChild variant="outline" className="whitespace-nowrap">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
