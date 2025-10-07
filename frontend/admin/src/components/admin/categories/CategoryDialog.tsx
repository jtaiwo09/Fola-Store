// components/admin/categories/CategoryDialog.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FormInput,
  FormTextarea,
  FormSelect,
  FormSwitch,
} from "@/components/forms";
import {
  useCreateCategory,
  useUpdateCategory,
} from "@/lib/hooks/useCategories";
import { Category } from "@/lib/api/categories";
import { Wand2 } from "lucide-react";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().max(1000).optional(),
  parent: z.string().nullable().optional(),
  level: z.number().min(0).max(5).optional(),
  image: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional(),
  order: z.number().min(0).optional(),
  isActive: z.boolean().default(true),
  metaTitle: z.string().max(100).optional(),
  metaDescription: z.string().max(300).optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  categories: Category[];
}

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
  categories,
}: CategoryDialogProps) {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      parent: null,
      level: 0,
      image: "",
      icon: "",
      order: 0,
      isActive: true,
      metaTitle: "",
      metaDescription: "",
    },
  });

  useEffect(() => {
    if (open && category && category._id) {
      reset({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        parent: category.parent || null,
        level: category.level,
        image: category.image || "",
        icon: category.icon || "",
        order: category.order,
        isActive: category.isActive,
        metaTitle: category.metaTitle || "",
        metaDescription: category.metaDescription || "",
      });
    } else if (open && category?.parent) {
      // Adding a child category
      reset({
        name: "",
        slug: "",
        description: "",
        parent: category.parent,
        level: 0,
        image: "",
        icon: "",
        order: 0,
        isActive: true,
        metaTitle: "",
        metaDescription: "",
      });
    } else if (open) {
      reset();
    }
  }, [open, category, reset]);

  const onSubmit = (data: CategoryFormData) => {
    const payload = {
      ...data,
      parent: data.parent || null,
    };

    if (category?._id) {
      updateCategory.mutate(
        { id: category._id, payload },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createCategory.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const name = watch("name");
  const handleGenerateSlug = () => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setValue("slug", slug);
  };

  // Flatten categories for parent selection
  const flattenCategories = (cats: Category[], level = 0): any[] => {
    return cats.reduce((acc, cat) => {
      if (category?._id !== cat._id) {
        acc.push({
          value: cat._id,
          label: "—".repeat(level) + " " + cat.name,
        });
        if (cat.children && cat.children.length > 0) {
          acc.push(...flattenCategories(cat.children, level + 1));
        }
      }
      return acc;
    }, [] as any[]);
  };

  const parentOptions = [
    { value: "none", label: "None (Root Category)" },
    ...flattenCategories(categories),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {category?._id ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogDescription>
            {category?._id
              ? "Update category information"
              : "Create a new product category"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            id="name"
            label="Category Name"
            placeholder="Enter category name"
            register={register("name")}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-9">
              <FormInput
                id="slug"
                label="URL Slug"
                placeholder="category-slug"
                register={register("slug")}
                error={errors.slug}
                required
              />
            </div>
            <div className="col-span-3 flex items-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleGenerateSlug}
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
            placeholder="Brief description of the category"
            register={register("description")}
            error={errors.description}
            rows={3}
          />

          <FormSelect
            id="parent"
            label="Parent Category"
            options={parentOptions}
            value={watch("parent") || ""}
            onValueChange={(value) => setValue("parent", value || null)}
            error={errors.parent}
            description="Leave empty to create a root category"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput
              id="image"
              label="Category Image URL"
              placeholder="https://example.com/image.jpg"
              register={register("image")}
              error={errors.image}
            />

            <FormInput
              id="order"
              label="Display Order"
              type="number"
              placeholder="0"
              register={register("order", { valueAsNumber: true })}
              error={errors.order}
              description="Lower numbers appear first"
            />
          </div>

          <FormSwitch
            id="isActive"
            label="Active"
            checked={watch("isActive")}
            onCheckedChange={(checked) => setValue("isActive", checked)}
            description="Inactive categories are hidden from customers"
          />

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">SEO Settings</h4>
            <div className="space-y-4">
              <FormInput
                id="metaTitle"
                label="Meta Title"
                placeholder="Category name | Store Name"
                register={register("metaTitle")}
                error={errors.metaTitle}
              />

              <FormTextarea
                id="metaDescription"
                label="Meta Description"
                placeholder="Brief description for search engines"
                register={register("metaDescription")}
                error={errors.metaDescription}
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : category?._id
                ? "Update Category"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
