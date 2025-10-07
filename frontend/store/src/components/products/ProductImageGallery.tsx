"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
  featuredImage: string;
}

export default function ProductImageGallery({
  images,
  productName,
  featuredImage,
}: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = images.length > 0 ? images : [featuredImage];
  const currentImage = allImages[selectedImage] || featuredImage;

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
        <Image
          src={currentImage}
          alt={productName}
          width={800}
          height={800}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Thumbnail Grid */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={cn(
                "aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-all hover:opacity-80",
                selectedImage === idx
                  ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white ring-offset-2"
                  : "border-transparent hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              <Image
                src={img}
                alt={`${productName} view ${idx + 1}`}
                width={200}
                height={200}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
