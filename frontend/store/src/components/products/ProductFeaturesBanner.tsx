// Add this above the fold on product detail pages for key info
import { Shield, Truck, RotateCcw, Award } from "lucide-react";

export default function ProductFeaturesBanner() {
  const features = [
    {
      icon: Truck,
      title: "Fast Shipping",
      description: "2-3 business days",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "30-day policy",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "100% protected",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Guaranteed",
    },
  ];

  return (
    <div className="border-t border-b border-gray-200 dark:border-gray-700 py-6 my-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <feature.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {feature.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
