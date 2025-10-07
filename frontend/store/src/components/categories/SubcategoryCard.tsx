import { Category } from "@/lib/api/categories";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SubcategoryCardProps {
  category: Category;
}

export default function SubcategoryCard({ category }: SubcategoryCardProps) {
  return (
    <Link href={`/products?category=${category._id}`}>
      <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 h-full py-0">
        <CardContent className="p-0">
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-600">
                <span className="text-3xl sm:text-4xl font-light">
                  {category.name[0]}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="p-3 sm:p-4">
            <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2 group-hover:underline">
              {category.name}
            </h3>
            {category.description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {category.description}
              </p>
            )}
            <div className="flex items-center gap-1 mt-2 text-xs sm:text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Shop now</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
