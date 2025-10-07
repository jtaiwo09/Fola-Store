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
    <div className="group h-full">
      <Card
        className="h-full flex flex-col gap-0 overflow-hidden hover:shadow-lg transition-all duration-300 py-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* <Link href={`/products/${product.slug}`} className="block"> */}
        <ProductImage product={product} isHovered={isHovered} />
        {/* </Link> */}

        <CardContent className="flex flex-col flex-1 p-3 sm:p-4">
          <div className="flex flex-col justify-between h-full space-y-2 sm:space-y-3">
            <ProductInfo product={product} />
            <ProductPrice product={product} />
            <ColorSwatches variants={product.variants} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
