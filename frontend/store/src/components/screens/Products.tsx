"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import { ProductFilters } from "@/lib/api/products";
import FilterSidebar from "@/components/products/FilterSidebar";
import { Button } from "@/components/ui/button";
import MobileFilterButton from "@/components/products/MobileFilterButton";
import ProductGrid from "@/components/products/ProductGrid";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 20,
    sort: "-createdAt",
    ...(categoryFromUrl && { category: categoryFromUrl }),
  });

  const { data, isLoading, error } = useProducts(filters);
  const { data: categories } = useCategories({ isActive: true });

  // Handle URL category parameter changes
  useEffect(() => {
    if (categoryFromUrl && categoryFromUrl !== filters.category) {
      setFilters((prev) => ({
        ...prev,
        category: categoryFromUrl,
        page: 1,
      }));
    }
  }, [categoryFromUrl, filters.category]);

  const handleFilterChange = (newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      limit: 20,
      sort: "-createdAt",
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (sort: string) => {
    setFilters((prev) => ({ ...prev, sort }));
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-red-600 mb-6">{error.message}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  const paginationData = data?.pagination;
  const products = data?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-4">
          All Products
        </h1>
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {paginationData?.total || 0} products available
          </p>

          {/* Sort Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={filters.sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
            >
              <option value="-createdAt">Newest</option>
              <option value="basePrice">Price: Low to High</option>
              <option value="-basePrice">Price: High to Low</option>
              <option value="-averageRating">Highest Rated</option>
              <option value="name">Name: A-Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block">
          <FilterSidebar
            categories={categories || []}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3 space-y-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <MobileFilterButton
              categories={categories || []}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Products Grid */}
          <ProductGrid
            products={products}
            isLoading={isLoading}
            pagination={paginationData}
            itemsPerPage={filters.limit || 20}
            onPageChange={handlePageChange}
            onClearFilters={handleClearFilters}
          />
        </main>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
