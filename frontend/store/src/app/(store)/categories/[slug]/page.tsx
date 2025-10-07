"use client";

import { use } from "react";
import { useCategoryBySlug } from "@/lib/hooks/useCategories";
import { Loader2, ChevronRight } from "lucide-react";
import Link from "next/link";
import SubcategoryCard from "@/components/categories/SubcategoryCard";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);
  const { data: category, isLoading } = useCategoryBySlug(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-light mb-2">Category not found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          The category you're looking for doesn't exist.
        </p>
        <Link href="/categories" className="text-primary hover:underline">
          Browse all categories
        </Link>
      </div>
    );
  }

  const hasChildren = category.children && category.children.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6 sm:mb-8">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href="/categories"
          className="hover:text-gray-900 dark:hover:text-white"
        >
          Categories
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 dark:text-white">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light mb-3 sm:mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      {/* Subcategories or Products Link */}
      {hasChildren ? (
        <div>
          <h2 className="text-xl sm:text-2xl font-light mb-4 sm:mb-6">
            Subcategories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {category.children?.map((subCategory) => (
              <SubcategoryCard key={subCategory._id} category={subCategory} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            No subcategories available. Browse products in this category.
          </p>
          <Link
            href={`/products?category=${category._id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-90 transition-opacity"
          >
            View Products
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
