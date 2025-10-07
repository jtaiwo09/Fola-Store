// components/reviews/ReviewCard.tsx
import { Star, ThumbsUp, ThumbsDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/lib/hooks/useReviews";
import { useAuth } from "@clerk/nextjs";
import {
  useVoteReviewHelpful,
  useVoteReviewNotHelpful,
  useRemoveReviewVote,
} from "@/lib/hooks/useReviews";
import { formatRelativeTime } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const { userId } = useAuth();
  const voteHelpful = useVoteReviewHelpful();
  const voteNotHelpful = useVoteReviewNotHelpful();
  const removeVote = useRemoveReviewVote();

  const userVotedHelpful = userId
    ? review.helpfulVotes?.includes(userId)
    : false;
  const userVotedNotHelpful = userId
    ? review.notHelpfulVotes?.includes(userId)
    : false;

  const handleHelpfulClick = () => {
    if (!userId) {
      return;
    }

    if (userVotedHelpful) {
      removeVote.mutate(review._id);
    } else {
      voteHelpful.mutate(review._id);
    }
  };

  const handleNotHelpfulClick = () => {
    if (!userId) {
      return;
    }

    if (userVotedNotHelpful) {
      removeVote.mutate(review._id);
    } else {
      voteNotHelpful.mutate(review._id);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={review.customer.avatar}
            alt={`${review.customer.firstName} ${review.customer.lastName}`}
          />
          <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {getInitials(review.customer.firstName, review.customer.lastName)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 dark:text-white">
              {review.customer.firstName} {review.customer.lastName}
            </h4>
            {review.isVerifiedPurchase && (
              <Badge
                variant="secondary"
                className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified Purchase
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < review.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatRelativeTime(review.createdAt)}
            </span>
          </div>

          {review.title && (
            <h5 className="font-medium text-gray-900 dark:text-white mb-2">
              {review.title}
            </h5>
          )}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {review.comment}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-4">
              {review.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt={`Review image ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ))}
            </div>
          )}

          {/* Helpful Buttons */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Was this helpful?
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpfulClick}
                disabled={
                  !userId ||
                  voteHelpful.isPending ||
                  voteNotHelpful.isPending ||
                  removeVote.isPending
                }
                className={`h-8 text-xs ${
                  userVotedHelpful
                    ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : ""
                }`}
              >
                <ThumbsUp
                  className={`w-3.5 h-3.5 mr-1 ${
                    userVotedHelpful ? "fill-current" : ""
                  }`}
                />
                Helpful ({review.helpfulCount || 0})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleNotHelpfulClick}
                disabled={
                  !userId ||
                  voteHelpful.isPending ||
                  voteNotHelpful.isPending ||
                  removeVote.isPending
                }
                className={`h-8 text-xs ${
                  userVotedNotHelpful
                    ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : ""
                }`}
              >
                <ThumbsDown
                  className={`w-3.5 h-3.5 mr-1 ${
                    userVotedNotHelpful ? "fill-current" : ""
                  }`}
                />
                Not Helpful ({review.notHelpfulCount || 0})
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
