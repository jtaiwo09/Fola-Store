"use client";

import { Product } from "@/lib/api/products";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { ProductImage } from "./ProductImage";
import { ProductInfo } from "./ProductInfo";
import { ProductPrice } from "./ProductPrice";
import { ColorSwatches } from "./ColorSwatches";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group">
      <Card
        className="overflow-hidden hover:shadow-lg transition-all duration-300 py-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <Link href={`/products/${product.slug}`}>
            <ProductImage product={product} isHovered={isHovered} />
          </Link>

          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <ProductInfo product={product} />
            <ProductPrice product={product} />
            <ColorSwatches variants={product.variants} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
