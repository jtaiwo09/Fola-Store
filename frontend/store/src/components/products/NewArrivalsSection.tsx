import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ProductCard from "./ProductCard";
import { useNewArrivals } from "@/lib/hooks/useProducts";

export default function NewArrivalsSection() {
  const { data, isLoading, error } = useNewArrivals(8);

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !data || data.length === 0) {
    return null; // Don't show section if no new arrivals
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600 dark:text-yellow-500 uppercase tracking-wide">
                Just In
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white">
              New Arrivals
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover our latest additions
            </p>
          </div>

          <Link href="/products?sort=-createdAt">
            <Button variant="outline" className="hidden md:flex">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-8 flex justify-center md:hidden">
          <Link href="/products?sort=-createdAt">
            <Button variant="outline" className="w-full">
              View All New Arrivals
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
