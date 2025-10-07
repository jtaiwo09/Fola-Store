// components/admin/products/ProductFiltersBar.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { ProductFilters } from "@/lib/api/products";
import { useCategoryTree } from "@/lib/hooks/useCategories";

interface ProductFiltersBarProps {
  filters: ProductFilters;
  onFilterChange: (key: keyof ProductFilters, value: any) => void;
}

export default function ProductFiltersBar({
  filters,
  onFilterChange,
}: ProductFiltersBarProps) {
  const { data: categoriesData } = useCategoryTree();
  const categories = categoriesData?.data.categories || [];

  // Flatten categories for select options
  const flattenCategories = (cats: any[], level = 0): any[] => {
    return cats.reduce((acc, cat) => {
      acc.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        acc.push(...flattenCategories(cat.children, level + 1));
      }
      return acc;
    }, []);
  };

  const flatCategories = flattenCategories(categories);

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <Select
          value={filters.category || "all"}
          onValueChange={(value) =>
            onFilterChange("category", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {flatCategories.map((cat) => (
              <SelectItem key={cat._id} value={cat._id}>
                {"—".repeat(cat.level)} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFilterChange("status", value === "all" ? undefined : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
            <SelectItem value="out_of_stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>

        {/* Published Filter */}
        <Select
          value={
            filters.isPublished === undefined
              ? "all"
              : filters.isPublished
              ? "published"
              : "unpublished"
          }
          onValueChange={(value) =>
            onFilterChange(
              "isPublished",
              value === "all" ? undefined : value === "published" ? true : false
            )
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Published" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="unpublished">Unpublished</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
