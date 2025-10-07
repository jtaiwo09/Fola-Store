"use client";

import { useState } from "react";
import { useReviews, useDeleteReview } from "@/lib/hooks/useReviews";
import { ReviewFilters } from "@/lib/api/reviews";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Star } from "lucide-react";
import { Pagination } from "@/components/reusables/Pagination";
import ReviewsTable from "./ReviewsTable";
import DeleteReviewDialog from "./DeleteReviewDialog";
import { Review } from "@/lib/api/reviews";

export default function ReviewsListPage() {
  const [filters, setFilters] = useState<ReviewFilters>({
    page: 1,
    limit: 20,
    sort: "-createdAt",
  });

  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null);

  const { data, isLoading } = useReviews(filters);
  const deleteReview = useDeleteReview();

  const handleFilterChange = (key: keyof ReviewFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleDeleteConfirm = () => {
    if (reviewToDelete) {
      deleteReview.mutate(reviewToDelete._id, {
        onSuccess: () => {
          setReviewToDelete(null);
        },
      });
    }
  };

  const reviews = data?.data || [];
  const pagination = data?.pagination;

  // Calculate stats
  const totalReviews = pagination?.total || 0;
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(
        1
      )
    : "0.0";
  const publishedCount = reviews.filter((r) => r.isPublished).length;
  const pendingCount = reviews.filter((r) => !r.isPublished).length;

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Reviews
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product reviews and ratings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Reviews
              </p>
              <p className="text-2xl font-semibold mt-1">{totalReviews}</p>
            </div>
            <Star className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Average Rating
              </p>
              <p className="text-2xl font-semibold mt-1 flex items-center gap-1">
                {averageRating}
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Published
            </p>
            <p className="text-2xl font-semibold mt-1 text-green-600">
              {publishedCount}
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-2xl font-semibold mt-1 text-yellow-600">
              {pendingCount}
            </p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reviews..."
              className="pl-10"
              // Search not implemented in backend yet
            />
          </div>

          <Select
            value={
              filters.isPublished === undefined
                ? "all"
                : filters.isPublished
                ? "published"
                : "pending"
            }
            onValueChange={(value) =>
              handleFilterChange(
                "isPublished",
                value === "all"
                  ? undefined
                  : value === "published"
                  ? true
                  : false
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Reviews" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.rating?.toString() || "all"}
            onValueChange={(value) =>
              handleFilterChange(
                "rating",
                value === "all" ? undefined : Number(value)
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Reviews Table */}
      <ReviewsTable
        reviews={reviews}
        isLoading={isLoading}
        onDelete={setReviewToDelete}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          onPageChange={handlePageChange}
        />
      )}

      {/* Delete Dialog */}
      <DeleteReviewDialog
        review={reviewToDelete}
        open={!!reviewToDelete}
        onOpenChange={(open) => !open && setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteReview.isPending}
      />
    </div>
  );
}
