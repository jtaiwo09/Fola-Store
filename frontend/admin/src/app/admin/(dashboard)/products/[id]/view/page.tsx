// app/(admin)/admin/products/[id]/view/page.tsx
"use client";

import { use } from "react";
import { ArrowLeft, Edit, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductInfoCard from "@/components/admin/products/ProductInfoCard";
import VariantDetailsCard from "@/components/admin/products/VariantDetailsCard";
import ReviewSummaryCard from "@/components/admin/products/ReviewSummaryCard";
import SalesAnalyticsCard from "@/components/admin/products/SalesAnalyticsCard";
import SEOPreviewCard from "@/components/admin/products/SEOPreviewCard";
import { useProduct } from "@/lib/hooks/useProducts";

interface ProductViewPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductViewPage({ params }: ProductViewPageProps) {
  const { id } = use(params);
  const { data, isLoading, error } = useProduct(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Product not found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The product you're looking for doesn't exist.
          </p>
          <Link href="/admin/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const product = data.data.product;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
              {product.name}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View product details and analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link href={`/products/${product.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Button>
          </Link>
          <Link href={`/admin/products/${product._id}/edit`}>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Product
            </Button>
          </Link>
        </div>
      </div>

      <Separator />

      {/* Description */}
      {product.description && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Product Info & Variants */}
        <div className="lg:col-span-2 space-y-6">
          <ProductInfoCard product={product} />
          <VariantDetailsCard
            variants={product.variants}
            basePrice={product.basePrice}
          />

          {/* Specifications */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) =>
                      value && (
                        <div key={key}>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </p>
                          <p className="text-sm text-gray-900 dark:text-white">
                            {value as string}
                          </p>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}

          {/* Product Metadata */}
          {product?.metadata && (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shipping & Returns
              </h3>
              <div className="space-y-3">
                {product.metadata.shippingTime && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Shipping Time:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.metadata.shippingTime}
                    </span>
                  </div>
                )}
                {product.metadata.returnPolicy && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Return Policy:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.metadata.returnPolicy}
                    </span>
                  </div>
                )}
                {product.metadata.warranty && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Warranty:
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.metadata.warranty}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Analytics & SEO */}
        <div className="space-y-6">
          <SalesAnalyticsCard productId={product._id} />
          <ReviewSummaryCard
            productId={product._id}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
          />
          <SEOPreviewCard
            name={product.name}
            slug={product.slug}
            metaTitle={product.metaTitle}
            metaDescription={product.metaDescription}
            metaKeywords={product.metaKeywords}
            featuredImage={product.featuredImage}
          />
        </div>
      </div>
    </div>
  );
}
