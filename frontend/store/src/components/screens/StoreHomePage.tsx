"use client";

import { HeroSection } from "../HeroSection";
import { FeaturedProductsSection } from "../FeaturedProductsSection";
import { NewsletterSection } from "../NewsletterSection";
import { CategoriesSection } from "../categories/CategoriesSection";
import NewArrivalsSection from "../products/NewArrivalsSection";

export const StoreHomePage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <main>
        <HeroSection />
        <CategoriesSection />
        <NewArrivalsSection />
        <FeaturedProductsSection />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default StoreHomePage;
