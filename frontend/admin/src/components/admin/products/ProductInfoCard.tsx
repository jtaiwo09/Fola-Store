import { Calendar, Eye, Package2, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ProductInfoCardProps {
  product: any;
}

export default function ProductInfoCard({ product }: ProductInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package2 className="w-5 h-5" />
          Product Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Featured Image */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Featured Image
          </p>
          <img
            src={product.featuredImage}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
          />
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Product Name
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Slug
            </p>
            <p className="text-sm font-mono text-gray-900 dark:text-white">
              {product.slug}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Category
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.category?.name || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Product Type
            </p>
            <Badge variant="secondary" className="text-xs">
              {product.productType}
            </Badge>
          </div>

          {product.fabricType && (
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Fabric Type
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {product.fabricType}
              </p>
            </div>
          )}

          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Unit of Measure
            </p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {product.unitOfMeasure}
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Pricing
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Base Price
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                ₦{product.basePrice.toLocaleString()}
              </p>
            </div>

            {product.salePrice && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Sale Price
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-500">
                  ₦{product.salePrice.toLocaleString()}
                </p>
              </div>
            )}

            {product.discountPercentage > 0 && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Discount
                </p>
                <Badge
                  variant="secondary"
                  className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                >
                  {product.discountPercentage}% OFF
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Inventory */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Inventory
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total Stock
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {product.totalStock} units
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Minimum Order
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {product.minimumOrder || 1} {product.unitOfMeasure}(s)
              </p>
            </div>

            {product.maximumOrder && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Maximum Order
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {product.maximumOrder} {product.unitOfMeasure}(s)
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Backorder
              </p>
              <Badge
                variant="secondary"
                className={
                  product.allowBackorder
                    ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    : ""
                }
              >
                {product.allowBackorder ? "Allowed" : "Not Allowed"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Status & Dates */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <Eye className="w-3 h-3" />
                Status
              </p>
              <Badge
                variant={product.status === "active" ? "default" : "secondary"}
              >
                {product.status}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Published
              </p>
              <Badge
                variant={product.isPublished ? "default" : "secondary"}
                className={
                  product.isPublished
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : ""
                }
              >
                {product.isPublished ? "Yes" : "No"}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Featured
              </p>
              <Badge variant={product.isFeatured ? "default" : "secondary"}>
                {product.isFeatured ? "Yes" : "No"}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Created
              </p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(product.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
