// components/admin/products/form-sections/SEOSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput, FormTextarea } from "@/components/forms";
import { ProductFormData } from "@/lib/validations/product.validation";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface SEOSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

export default function SEOSection({ register, errors }: SEOSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>SEO Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          id="metaTitle"
          label="Meta Title"
          placeholder="Product name | Store Name"
          register={register("metaTitle")}
          error={errors.metaTitle}
          description="60-70 characters recommended"
        />

        <FormTextarea
          id="metaDescription"
          label="Meta Description"
          placeholder="Brief description for search engines"
          register={register("metaDescription")}
          error={errors.metaDescription}
          rows={3}
          description="150-160 characters recommended"
        />
      </CardContent>
    </Card>
  );
}
