"use client";
import CategoryCard from "@/components/categories/CategoryCard";
import { useCategoryTree } from "@/lib/hooks/useCategories";
import { Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoryTree();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const topCategories = categories?.filter((cat) => cat.level <= 1) || [];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">
          All Categories
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Browse our complete collection of fabric categories
        </p>
      </div>

      {topCategories.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {topCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">
            No categories available at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
