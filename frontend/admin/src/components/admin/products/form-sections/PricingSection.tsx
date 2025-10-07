// components/admin/products/form-sections/PricingSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/forms";
import { ProductFormData } from "@/lib/validations/product.validation";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface PricingSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
}

export default function PricingSection({
  register,
  errors,
  watch,
}: PricingSectionProps) {
  const basePrice = watch("basePrice");
  const salePrice = watch("salePrice");
  const compareAtPrice = watch("compareAtPrice");

  const discount =
    basePrice && salePrice && salePrice < basePrice
      ? Math.round(((basePrice - salePrice) / basePrice) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pricing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          id="basePrice"
          label="Base Price"
          type="number"
          placeholder="0.00"
          register={register("basePrice", { valueAsNumber: true })}
          error={errors.basePrice}
          required
          description="Regular selling price"
        />

        <FormInput
          id="salePrice"
          label="Sale Price"
          type="number"
          placeholder="0.00"
          register={register("salePrice", { valueAsNumber: true })}
          error={errors.salePrice}
          description="Leave empty if not on sale"
        />

        {discount > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Discount
              </span>
              <Badge className="bg-green-600">{discount}% OFF</Badge>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                You save
              </span>
              <span className="font-medium">
                {formatCurrency(basePrice - (salePrice || 0))}
              </span>
            </div>
          </div>
        )}

        <FormInput
          id="compareAtPrice"
          label="Compare at Price"
          type="number"
          placeholder="0.00"
          register={register("compareAtPrice", { valueAsNumber: true })}
          error={errors.compareAtPrice}
          description="Show original price for comparison"
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            id="minimumOrder"
            label="Minimum Order"
            type="number"
            placeholder="1"
            register={register("minimumOrder", { valueAsNumber: true })}
            error={errors.minimumOrder}
          />

          <FormInput
            id="maximumOrder"
            label="Maximum Order"
            type="number"
            placeholder="999"
            register={register("maximumOrder", { valueAsNumber: true })}
            error={errors.maximumOrder}
          />
        </div>
      </CardContent>
    </Card>
  );
}
