import { useState } from "react";
import { Loader2, Star, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateReview, useUploadReviewImages } from "@/lib/hooks/useReviews";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

interface ReviewSubmissionFormProps {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewSubmissionForm({
  productId,
  onSuccess,
}: ReviewSubmissionFormProps) {
  const { userId } = useAuth();
  const createReview = useCreateReview();
  const uploadReviewImages = useUploadReviewImages();

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      return;
    }

    if (rating === 0) {
      return;
    }

    await createReview.mutateAsync({
      product: productId,
      rating,
      title: title.trim() || undefined,
      comment: comment.trim() || undefined,
      images: images.length > 0 ? images : undefined,
    });

    // Reset form
    setRating(0);
    setTitle("");
    setComment("");
    setImages([]);

    onSuccess?.();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("images", file);
    });

    uploadReviewImages.mutate(formData, {
      onSuccess: (data) => {
        const uploadedUrls = data.data.images.map((img: any) => img.url);
        setImages((prev) => [...prev, ...uploadedUrls]);
      },
    });

    // In production, upload to your server/Cloudinary
    // For now, just create local URLs
    // const newImages: string[] = [];
    // Array.from(files).forEach((file) => {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     if (event.target?.result) {
    //       setImages((prev) => [...prev, event.target!.result as string]);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (!userId) {
    return (
      <div className="text-center py-8 border border-gray-200 dark:border-gray-700 rounded-lg">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Please sign in to write a review
        </p>
        <Button>Sign In</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating Selection */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Your Rating *
        </Label>
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setRating(idx + 1)}
              onMouseEnter={() => setHoveredRating(idx + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  idx < (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              {rating} out of 5 stars
            </span>
          )}
        </div>
      </div>

      {/* Review Title */}
      <div>
        <Label htmlFor="review-title" className="text-base font-medium">
          Review Title (Optional)
        </Label>
        <Input
          id="review-title"
          placeholder="Summarize your experience"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          className="mt-2"
        />
      </div>

      {/* Review Comment */}
      <div>
        <Label htmlFor="review-comment" className="text-base font-medium">
          Your Review (Optional)
        </Label>
        <Textarea
          id="review-comment"
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          rows={5}
          className="mt-2"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <Label className="text-base font-medium mb-3 block">
          Add Photos (Optional)
        </Label>
        <div className="flex flex-wrap gap-4">
          {images.map((image, idx) => (
            <div key={idx} className="relative">
              <img
                src={image}
                alt={`Review ${idx + 1}`}
                className="w-24 h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {images.length < 5 && (
            <label className="w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              {uploadReviewImages.isPending ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Maximum 5 images
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={rating === 0 || createReview.isPending}
        className="w-full"
        size="lg"
      >
        {createReview.isPending ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
