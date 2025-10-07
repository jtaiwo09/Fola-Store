// components/admin/products/form-sections/MediaSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductFormData } from "@/lib/validations/product.validation";
import { UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import ImageUploadField from "../ImageUploadField";
import { FormInput } from "@/components/forms";

interface MediaSectionProps {
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export default function MediaSection({
  watch,
  setValue,
  errors,
}: MediaSectionProps) {
  const featuredImage = watch("featuredImage");
  const images = watch("images");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadField
            label="Main Product Image"
            images={featuredImage ? [featuredImage] : []}
            onChange={(imgs) => setValue("featuredImage", imgs[0] || "")}
            error={errors.featuredImage}
            maxImages={1}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Gallery</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUploadField
            label="Additional Images"
            images={images}
            onChange={(imgs) => setValue("images", imgs)}
            error={errors.images}
            maxImages={10}
            required
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Product Video</CardTitle>
        </CardHeader>
        <CardContent>
          <FormInput
            id="video"
            label="Video URL"
            placeholder="https://www.youtube.com/watch?v=..."
            value={watch("video") || ""}
            onChange={(e) => setValue("video", e.target.value)}
            error={errors.video}
            description="Optional: YouTube or Vimeo video URL"
          />
        </CardContent>
      </Card>
    </div>
  );
}
