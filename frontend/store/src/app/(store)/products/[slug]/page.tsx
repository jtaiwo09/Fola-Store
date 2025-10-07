"use client";

import { use, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useProductBySlug } from "@/lib/hooks/useProducts";
import { useCartStore } from "@/lib/store/cartStore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfoHeader from "@/components/products/ProductInfoHeader";
import ColorVariantSelector from "@/components/products/ColorVariantSelector";
import QuantitySelector from "@/components/products/QuantitySelector";
import ProductSpecifications from "@/components/products/ProductSpecifications";
import ProductDetailActions from "@/components/products/ProductDetailActions";
import ProductReviewsSection from "@/components/reviews/ReviewsSection";
import ProductMetadata from "@/components/products/ProductMetadata";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, error } = useProductBySlug(slug);
  const { addItem } = useCartStore();

  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(5);

  // Initialize with first available variant
  useEffect(() => {
    if (product?.variants.length && !selectedColor) {
      const firstAvailable = product.variants.find(
        (v) => v.isAvailable && v.stock > 0
      );
      if (firstAvailable) {
        setSelectedColor(firstAvailable.color);
      }
    }
  }, [product, selectedColor]);

  // Set minimum quantity on product load
  useEffect(() => {
    if (product?.minimumOrder) {
      setQuantity(product.minimumOrder);
    }
  }, [product?.minimumOrder]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !product) {
    return <ErrorState error={error} />;
  }

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor
  );
  const totalPrice = (product.salePrice || product.basePrice) * quantity;
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0;
  const isInStock = selectedVariant && selectedVariant.stock > 0;

  const handleAddToCart = () => {
    if (!selectedVariant) {
      toast.error("Please select a color");
      return;
    }

    if (quantity < (product.minimumOrder || 1)) {
      toast.error(
        `Minimum order is ${product.minimumOrder} ${product.unitOfMeasure}s`
      );
      return;
    }

    if (selectedVariant.stock < quantity) {
      toast.error("Insufficient stock");
      return;
    }

    addItem(product, selectedVariant, quantity);
    toast.success("Added to cart!");
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Main Product Section */}
      {/* <ProductFeaturesBanner /> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          featuredImage={product.featuredImage}
        />

        {/* Product Details */}
        <div className="space-y-8">
          <ProductInfoHeader
            name={product.name}
            badge={product.badge}
            averageRating={product.averageRating}
            reviewCount={product.reviewCount}
            discountPercentage={product.discountPercentage}
            unitOfMeasure={product.unitOfMeasure}
            product={product}
          />

          <Separator />

          {/* Description */}
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {product.description}
          </p>

          <Separator />

          {/* Product Metadata (Shipping, Returns, etc.) */}
          <ProductMetadata metadata={product.metadata} />

          <Separator />

          {/* Color Selection */}
          <ColorVariantSelector
            variants={product.variants}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          <Separator />

          {/* Quantity Selection */}
          <QuantitySelector
            quantity={quantity}
            onQuantityChange={setQuantity}
            minOrder={product.minimumOrder || 1}
            maxOrder={product.maximumOrder}
            availableStock={selectedVariant?.stock || 0}
            unitOfMeasure={product.unitOfMeasure}
          />

          <Separator />

          {/* Actions */}
          <ProductDetailActions
            totalPrice={totalPrice}
            onAddToCart={handleAddToCart}
            isOutOfStock={isOutOfStock}
            isInStock={isInStock}
          />
        </div>
      </div>

      {/* Specifications */}
      <ProductSpecifications specifications={product.specifications} />

      {/* Reviews Section */}
      <ProductReviewsSection
        productId={product._id}
        productName={product.name}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
      />
    </div>
  );
}

function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto" />
        <p className="text-gray-600 dark:text-gray-400">Loading product...</p>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error?: Error }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-light text-gray-900 dark:text-white">
          Product not found
        </h2>
        <p className="text-red-600">
          {error?.message || "This product does not exist"}
        </p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    </div>
  );
}
