import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const NewsletterSection = () => (
  <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-white mb-4">
        Stay Updated
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
        Subscribe to our newsletter for exclusive offers, new arrivals, and
        styling inspiration
      </p>
      <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1 bg-gray-50 dark:bg-gray-800"
        />
        <Button className="sm:w-auto">Subscribe</Button>
      </div>
    </div>
  </section>
);
