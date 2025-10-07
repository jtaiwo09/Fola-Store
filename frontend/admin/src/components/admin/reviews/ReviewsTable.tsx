"use client";

import { Review } from "@/lib/api/reviews";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useUpdateReviewStatus } from "@/lib/hooks/useReviews";

interface ReviewsTableProps {
  reviews: Review[];
  isLoading: boolean;
  onDelete: (review: Review) => void;
}

export default function ReviewsTable({
  reviews,
  isLoading,
  onDelete,
}: ReviewsTableProps) {
  const updateStatus = useUpdateReviewStatus();

  const handleTogglePublish = (review: Review) => {
    updateStatus.mutate({
      id: review._id,
      isPublished: !review.isPublished,
    });
  };

  if (isLoading) {
    return <ReviewsTableSkeleton />;
  }

  return (
    <Card>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {reviews.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500">
            No reviews found
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative">
                    <Image
                      src={review.product.featuredImage}
                      alt={review.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <Link
                        href={`/admin/products/${review.product._id}`}
                        className="font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {review.product.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {review.isVerifiedPurchase && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {review.isPublished ? "Published" : "Hidden"}
                        </span>
                        <Switch
                          checked={review.isPublished}
                          onCheckedChange={() => handleTogglePublish(review)}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(review)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {review.title}
                    </h4>
                  )}

                  {/* Review Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {review.comment}
                    </p>
                  )}

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-3">
                      {review.images.slice(0, 4).map((img, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden relative"
                        >
                          <Image
                            src={img}
                            alt={`Review image ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {review.images.length > 4 && (
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center text-xs">
                          +{review.images.length - 4}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Review Footer */}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        {review.customer.avatar && (
                          <AvatarImage
                            src={review.customer.avatar}
                            alt={review.customer.firstName}
                          />
                        )}
                        <AvatarFallback className="text-xs">
                          {review.customer.firstName[0]}
                          {review.customer.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {review.customer.firstName} {review.customer.lastName}
                      </span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(review.createdAt, "MMM DD, YYYY")}</span>
                    {review.helpfulCount > 0 && (
                      <>
                        <span>•</span>
                        <span>{review.helpfulCount} found helpful</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

function ReviewsTableSkeleton() {
  return (
    <Card>
      <div className="p-6 space-y-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="w-20 h-20 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
