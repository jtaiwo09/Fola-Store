import { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RatingBreakdown from "./RatingBreakdown";
import ReviewCard from "./ReviewCard";
import ReviewSubmissionForm from "./ReviewSubmissionForm";
import { useProductReviews } from "@/lib/hooks/useReviews";
import { useAuth } from "@clerk/nextjs";

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  averageRating: number;
  reviewCount: number;
}

export default function ProductReviewsSection({
  productId,
  productName,
  averageRating,
  reviewCount,
}: ProductReviewsSectionProps) {
  const { userId } = useAuth();
  const [page, setPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data, isLoading, error } = useProductReviews(productId, page, 10);

  // Calculate rating distribution
  const ratingDistribution = data?.data.reduce(
    (acc, review) => {
      acc[review.rating as keyof typeof acc]++;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  ) || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-light text-gray-900 dark:text-white mb-8">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Left Column - Rating Breakdown */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <RatingBreakdown
              averageRating={averageRating}
              reviewCount={reviewCount}
              ratingDistribution={ratingDistribution}
            />

            <Separator className="my-6" />

            {/* Write Review Button */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button className="w-full" size="lg">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Write a Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Write a Review for {productName}
                  </DialogTitle>
                </DialogHeader>
                <ReviewSubmissionForm
                  productId={productId}
                  onSuccess={() => setIsFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Right Column - Reviews List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Failed to load reviews</p>
            </div>
          ) : data?.data.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Be the first to review this product
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                Write a Review
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {data?.data.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
              </div>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={page >= data.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
