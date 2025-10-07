// components/reviews/RatingBreakdown.tsx
import { Star } from "lucide-react";

interface RatingBreakdownProps {
  averageRating: number;
  reviewCount: number;
  ratingDistribution?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export default function RatingBreakdown({
  averageRating,
  reviewCount,
  ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
}: RatingBreakdownProps) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-6">
      {/* Overall Rating */}
      <div className="text-center border-b pb-6">
        <div className="text-5xl font-light text-gray-900 dark:text-white mb-2">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center justify-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              className={`w-5 h-5 ${
                idx < Math.round(averageRating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
        </p>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-3">
        {ratings.map((rating) => {
          const count =
            ratingDistribution[rating as keyof typeof ratingDistribution] || 0;
          const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {rating}
                </span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </div>

              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
