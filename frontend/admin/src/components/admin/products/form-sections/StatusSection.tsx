import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSelect, FormSwitch, FormInput } from "@/components/forms";
import { ProductFormData } from "@/lib/validations/product.validation";
import {
  UseFormWatch,
  UseFormSetValue,
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface StatusSectionProps {
  register: UseFormRegister<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
}

const STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "active", label: "Active" },
  { value: "archived", label: "Archived" },
  { value: "out_of_stock", label: "Out of Stock" },
];

export default function StatusSection({
  register,
  watch,
  setValue,
  errors,
}: StatusSectionProps) {
  const trackInventory = watch("trackInventory");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormSelect
          id="status"
          label="Status"
          options={STATUS_OPTIONS}
          value={watch("status")}
          onValueChange={(value) => setValue("status", value as any)}
        />

        <FormSwitch
          id="isPublished"
          label="Published"
          checked={watch("isPublished")}
          onCheckedChange={(checked) => setValue("isPublished", checked)}
          description="Make this product visible to customers"
        />

        <FormSwitch
          id="isFeatured"
          label="Featured Product"
          checked={watch("isFeatured")}
          onCheckedChange={(checked) => setValue("isFeatured", checked)}
          description="Show on homepage and featured sections"
        />

        <div className="space-y-3 pt-4 border-t">
          <FormSwitch
            id="trackInventory"
            label="Track Inventory"
            checked={trackInventory}
            onCheckedChange={(checked) => setValue("trackInventory", checked)}
            description="Monitor stock levels and receive low stock alerts"
          />

          {trackInventory && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  You'll receive email and in-app notifications when stock falls
                  below this threshold
                </AlertDescription>
              </Alert>

              <FormInput
                id="lowStockThreshold"
                label="Low Stock Threshold"
                type="number"
                placeholder="10"
                register={register("lowStockThreshold", {
                  valueAsNumber: true,
                })}
                error={errors.lowStockThreshold}
                description="Alert when total stock falls below this number"
                required={trackInventory}
              />
            </>
          )}
        </div>

        <FormSwitch
          id="allowBackorder"
          label="Allow Backorder"
          checked={watch("allowBackorder")}
          onCheckedChange={(checked) => setValue("allowBackorder", checked)}
          description="Accept orders when out of stock"
        />
      </CardContent>
    </Card>
  );
}
