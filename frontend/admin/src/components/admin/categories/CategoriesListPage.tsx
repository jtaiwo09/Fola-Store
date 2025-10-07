// components/admin/categories/CategoriesListPage.tsx
"use client";

import { useState } from "react";
import { useCategoryTree, useDeleteCategory } from "@/lib/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, FolderTree } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryTreeView from "./CategoryTreeView";
import CategoryDialog from "./CategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import { Category } from "@/lib/api/categories";

export default function CategoriesListPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const { data, isLoading } = useCategoryTree();
  const deleteCategory = useDeleteCategory();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  const handleAdd = (parentId?: string) => {
    setEditingCategory({ parent: parentId } as any);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      deleteCategory.mutate(categoryToDelete._id, {
        onSuccess: () => {
          setCategoryToDelete(null);
        },
      });
    }
  };

  if (isLoading) {
    return <CategoriesListSkeleton />;
  }

  const categories = data?.data.categories || [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 dark:text-white">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product categories and subcategories
          </p>
        </div>
        <Button onClick={() => handleAdd()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Categories Tree */}
      <Card className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <FolderTree className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500 mb-4">No categories yet</p>
            <Button onClick={() => handleAdd()}>
              Create Your First Category
            </Button>
          </div>
        ) : (
          <CategoryTreeView
            categories={categories}
            onEdit={handleEdit}
            onDelete={setCategoryToDelete}
            onAddChild={handleAdd}
          />
        )}
      </Card>

      {/* Category Dialog */}
      <CategoryDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        category={editingCategory}
        categories={categories}
      />

      {/* Delete Dialog */}
      <DeleteCategoryDialog
        category={categoryToDelete}
        open={!!categoryToDelete}
        onOpenChange={(open) => !open && setCategoryToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteCategory.isPending}
      />
    </div>
  );
}

function CategoriesListSkeleton() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Card className="p-6 space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </Card>
    </div>
  );
}
