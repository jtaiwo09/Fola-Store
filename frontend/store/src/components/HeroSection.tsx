// components/HeroSection.tsx - Enhanced version with better visuals
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 shadow-sm">
            <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Premium Fabrics Collection
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-7xl font-light text-gray-900 dark:text-white leading-tight">
            Luxury Fabrics for
            <span className="block bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
              Every Occasion
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Discover our curated collection of premium laces, embroidered
            fabrics, and exclusive materials for your special moments.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto min-w-[200px]">
                Shop Collection
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/products?sort=-createdAt">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto min-w-[200px]"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                New Arrivals
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                500+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Premium Fabrics
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                2-3
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Days Delivery
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-gray-900 dark:text-white mb-1">
                100%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Quality Assured
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
