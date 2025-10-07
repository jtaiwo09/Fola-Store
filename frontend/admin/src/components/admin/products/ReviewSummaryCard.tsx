import { Star, MessageSquare, ThumbsUp, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ReviewSummaryCardProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export default function ReviewSummaryCard({
  productId,
  averageRating,
  reviewCount,
}: ReviewSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Customer Reviews
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overall Rating */}
          <div className="text-center py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="text-4xl font-light text-gray-900 dark:text-white mb-2">
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

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <ThumbsUp className="w-5 h-5 text-green-600 dark:text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Satisfaction
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reviewCount > 0 ? Math.round((averageRating / 5) * 100) : 0}%
              </p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total Reviews
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reviewCount}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <Link href={`/admin/reviews?product=${productId}`}>
              <Button variant="outline" className="w-full">
                Manage Reviews
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
