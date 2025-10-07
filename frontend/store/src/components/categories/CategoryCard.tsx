import { Category } from "@/lib/api/categories";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 h-full py-0">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                <span className="text-4xl sm:text-5xl md:text-6xl font-light">
                  {category.name[0]}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 text-white">
              <h3 className="text-base sm:text-lg md:text-xl font-medium mb-1 line-clamp-1">
                {category.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/90 line-clamp-2">
                {category.description || "Explore collection"}
              </p>
              <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View details</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
