"use client";

interface ProductSpecificationsProps {
  specifications: Record<string, any>;
}

export default function ProductSpecifications({
  specifications,
}: ProductSpecificationsProps) {
  const formatKey = (key: string): string => {
    return key
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const entries = Object.entries(specifications);

  if (entries.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 space-y-6">
      <h2 className="text-2xl font-light text-gray-900 dark:text-white">
        Specifications
      </h2>

      <div className="bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">
              {formatKey(key)}
            </span>
            <span className="text-gray-600 dark:text-gray-400 sm:text-right">
              {String(value)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
