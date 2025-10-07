"use client";

import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useProducts";
import { Product } from "@/lib/api/products";
import {
  productFormSchema,
  ProductFormData,
} from "@/lib/validations/product.validation";
import BasicInfoSection from "./form-sections/BasicInfoSection";
import PricingSection from "./form-sections/PricingSection";
import VariantsSection from "./form-sections/VariantsSection";
import MediaSection from "./form-sections/MediaSection";
import SEOSection from "./form-sections/SEOSection";
import StatusSection from "./form-sections/StatusSection";
import SpecificationsSection from "./form-sections/SpecificationsSection";

interface ProductFormProps {
  product?: Product;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("basic");

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          category: product.category._id,
          tags: product.tags ?? [],
          productType: product.productType,
          basePrice: product.basePrice,
          salePrice: product.salePrice,
          currency: product.currency,
          fabricType: product.fabricType,
          unitOfMeasure: product.unitOfMeasure,
          minimumOrder: product.minimumOrder,
          maximumOrder: product.maximumOrder,
          variants: product.variants,
          specifications: product.specifications,
          featuredImage: product.featuredImage,
          images: product.images,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          status: product.status,
          isPublished: product.isPublished,
          isFeatured: product.isFeatured,
          trackInventory: product.trackInventory,
          allowBackorder: product.allowBackorder,
          lowStockThreshold: product.lowStockThreshold,
        }
      : {
          name: "",
          slug: "",
          description: "",
          category: "",
          tags: [],
          productType: "fabric",
          basePrice: 0,
          currency: "NGN",
          unitOfMeasure: "yard",
          minimumOrder: 1,
          variants: [],
          specifications: {},
          featuredImage: "",
          images: [],
          status: "draft",
          isPublished: false,
          isFeatured: false,
          trackInventory: true,
          allowBackorder: false,
          lowStockThreshold: 0,
        },
  });

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
    if (product) {
      updateProduct.mutate(
        { id: product._id, payload: data },
        {
          onSuccess: () => {
            router.push("/admin/products");
          },
        }
      );
    } else {
      createProduct.mutate(data, {
        onSuccess: () => {
          router.push("/admin/products");
        },
      });
    }
  };

  // Auto-generate slug from name
  const name = watch("name");
  const handleGenerateSlug = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slug);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setValue("status", "draft")}
          >
            Save as Draft
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting
              ? "Saving..."
              : product
              ? "Update Product"
              : "Create Product"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="variants">Variants</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              <BasicInfoSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
                onGenerateSlug={handleGenerateSlug}
              />
              <SpecificationsSection watch={watch} setValue={setValue} />
            </TabsContent>

            <TabsContent value="pricing" className="mt-6">
              <PricingSection
                register={register}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            </TabsContent>

            <TabsContent value="variants" className="mt-6">
              <VariantsSection
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />
            </TabsContent>

            <TabsContent value="media" className="mt-6">
              <MediaSection watch={watch} setValue={setValue} errors={errors} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StatusSection
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
          <SEOSection register={register} errors={errors} />
        </div>
      </div>
    </form>
  );
}
