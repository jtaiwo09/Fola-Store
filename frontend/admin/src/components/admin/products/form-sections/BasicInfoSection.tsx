import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormInput, FormTextarea, FormSelect } from "@/components/forms";
import { Wand2 } from "lucide-react";
import { useCategoryTree } from "@/lib/hooks/useCategories";
import { ProductFormData } from "@/lib/validations/product.validation";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import TagsInput from "../TagsInput";

interface BasicInfoSectionProps {
  register: UseFormRegister<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  watch: UseFormWatch<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  onGenerateSlug: () => void;
}

const PRODUCT_TYPES = [
  { value: "fabric", label: "Fabric" },
  { value: "readymade", label: "Ready-made" },
  { value: "accessory", label: "Accessory" },
  { value: "other", label: "Other" },
];

const UNIT_OPTIONS = [
  { value: "yard", label: "Yard" },
  { value: "meter", label: "Meter" },
  { value: "piece", label: "Piece" },
  { value: "set", label: "Set" },
];

export default function BasicInfoSection({
  register,
  errors,
  watch,
  setValue,
  onGenerateSlug,
}: BasicInfoSectionProps) {
  const { data: categoriesData } = useCategoryTree();
  const categories = categoriesData?.data.categories || [];

  const flattenCategories = (cats: any[], level = 0): any[] => {
    return cats.reduce((acc, cat) => {
      acc.push({ value: cat._id, label: "—".repeat(level) + " " + cat.name });
      if (cat.children && cat.children.length > 0) {
        acc.push(...flattenCategories(cat.children, level + 1));
      }
      return acc;
    }, []);
  };

  const categoryOptions = flattenCategories(categories);
  const productType = watch("productType");
  const tags = watch("tags");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          id="name"
          label="Product Name"
          placeholder="Enter product name"
          register={register("name")}
          error={errors.name}
          required
        />

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <FormInput
              id="slug"
              label="URL Slug"
              placeholder="product-slug"
              register={register("slug")}
              error={errors.slug}
              required
              description="Used in product URL"
            />
          </div>
          <div className="col-span-3 flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={onGenerateSlug}
              className="w-full"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        <FormTextarea
          id="description"
          label="Description"
          placeholder="Detailed product description"
          register={register("description")}
          error={errors.description}
          rows={6}
          required
        />

        <FormTextarea
          id="shortDescription"
          label="Short Description"
          placeholder="Brief product summary"
          register={register("shortDescription")}
          error={errors.shortDescription}
          rows={3}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            id="category"
            label="Category"
            options={categoryOptions}
            value={watch("category")}
            onValueChange={(value) => setValue("category", value)}
            error={errors.category}
            required
          />

          <FormSelect
            id="productType"
            label="Product Type"
            options={PRODUCT_TYPES}
            value={watch("productType")}
            onValueChange={(value) => setValue("productType", value as any)}
            error={errors.productType}
          />
        </div>

        {productType === "fabric" && (
          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="fabricType"
              label="Fabric Type"
              placeholder="e.g., Swiss Lace, French Lace"
              register={register("fabricType")}
              error={errors.fabricType}
            />

            <FormSelect
              id="unitOfMeasure"
              label="Unit of Measure"
              options={UNIT_OPTIONS}
              value={watch("unitOfMeasure")}
              onValueChange={(value) => setValue("unitOfMeasure", value as any)}
            />
          </div>
        )}

        <TagsInput
          tags={tags}
          onChange={(newTags) => setValue("tags", newTags)}
          placeholder="Add tags (press Enter)"
        />
      </CardContent>
    </Card>
  );
}
