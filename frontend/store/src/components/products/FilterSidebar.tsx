"use client";

import { Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Category } from "@/lib/api/categories";
import { ProductFilters } from "@/lib/api/products";
import { useFilterOptions } from "@/lib/hooks/useFilterOptions";
import FilterSection from "./FilterSection";

interface FilterSidebarProps {
  categories: Category[];
  filters: ProductFilters;
  onFilterChange: (filters: Partial<ProductFilters>) => void;
}

const PRICE_STEP = 1000;

export default function FilterSidebar({
  categories,
  filters,
  onFilterChange,
}: FilterSidebarProps) {
  const { data: filterOptions, isLoading } = useFilterOptions();

  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice || 0,
    filters.maxPrice || 100000,
  ]);

  // Update price range when filter options load
  useEffect(() => {
    if (filterOptions?.priceRange) {
      setPriceRange([
        filters.minPrice || filterOptions.priceRange.min,
        filters.maxPrice || filterOptions.priceRange.max,
      ]);
    }
  }, [filterOptions, filters.minPrice, filters.maxPrice]);

  const handleCategoryChange = (categoryId: string) => {
    const newCategory =
      filters.category === categoryId ? undefined : categoryId;
    onFilterChange({ category: newCategory });
  };

  const handleFabricTypeChange = (fabricType: string) => {
    const newFabricType =
      filters.fabricType === fabricType ? undefined : fabricType;
    onFilterChange({ fabricType: newFabricType });
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    onFilterChange({ minPrice: value[0], maxPrice: value[1] });
  };

  const handleColorFilter = (colorName: string) => {
    const currentSearch = filters.search || "";
    const isSelected = currentSearch.includes(colorName);

    onFilterChange({
      search: isSelected
        ? currentSearch.replace(colorName, "").trim()
        : colorName,
    });
  };

  const handleClearAll = () => {
    if (filterOptions?.priceRange) {
      setPriceRange([
        filterOptions.priceRange.min,
        filterOptions.priceRange.max,
      ]);
    }
    onFilterChange({
      category: undefined,
      fabricType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      search: undefined,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.fabricType ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.search;

  const topLevelCategories = categories.filter((cat) => cat.level === 1);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const minPrice = filterOptions?.priceRange.min || 0;
  const maxPrice = filterOptions?.priceRange.max || 100000;

  return (
    <div className="space-y-6 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Filters
        </h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>

      <Separator />

      {/* Category Filter */}
      {topLevelCategories.length > 0 && (
        <>
          <FilterSection title="Category" defaultOpen>
            <div className="space-y-3">
              {topLevelCategories.map((category) => (
                <div key={category._id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`category-${category._id}`}
                    checked={filters.category === category._id}
                    onCheckedChange={() => handleCategoryChange(category._id)}
                  />
                  <Label
                    htmlFor={`category-${category._id}`}
                    className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </FilterSection>
          <Separator />
        </>
      )}

      {/* Fabric Type Filter */}
      {filterOptions?.fabricTypes && filterOptions.fabricTypes.length > 0 && (
        <>
          <FilterSection title="Fabric Type" defaultOpen>
            <RadioGroup
              value={filters.fabricType || "all"}
              onValueChange={(value) =>
                handleFabricTypeChange(value === "all" ? "" : value)
              }
            >
              <div className="flex items-center space-x-3 mb-3">
                <RadioGroupItem value="all" id="fabric-all" />
                <Label
                  htmlFor="fabric-all"
                  className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  All Types
                </Label>
              </div>
              {filterOptions.fabricTypes.map((fabricType) => (
                <div
                  key={fabricType}
                  className="flex items-center space-x-3 mb-3"
                >
                  <RadioGroupItem
                    value={fabricType}
                    id={`fabric-${fabricType}`}
                  />
                  <Label
                    htmlFor={`fabric-${fabricType}`}
                    className="text-sm font-normal text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    {fabricType}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </FilterSection>
          <Separator />
        </>
      )}

      {/* Price Filter */}
      <FilterSection title="Price Range" defaultOpen>
        <div className="space-y-6">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
            min={minPrice}
            max={maxPrice}
            step={PRICE_STEP}
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Min
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ₦{priceRange[0]?.toLocaleString() ?? minPrice}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Max
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                ₦{priceRange[1]?.toLocaleString() ?? maxPrice}
              </span>
            </div>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Color Filter */}
      {filterOptions?.colors && filterOptions.colors.length > 0 && (
        <>
          <FilterSection title="Colors" defaultOpen>
            <div className="grid grid-cols-5 gap-3">
              {filterOptions.colors.map((color) => {
                const isSelected = filters.search?.includes(color.name);
                const isLightColor = ["White", "Ivory", "Cream"].includes(
                  color.name
                );

                return (
                  <button
                    key={color.name}
                    onClick={() => handleColorFilter(color.name)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative ${
                      isSelected
                        ? "border-gray-900 dark:border-white ring-2 ring-gray-900 dark:ring-white ring-offset-2"
                        : isLightColor
                        ? "border-gray-300 dark:border-gray-600"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`Filter by ${color.name}`}
                  >
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check
                          className={`w-5 h-5 drop-shadow-lg ${
                            isLightColor ? "text-gray-900" : "text-white"
                          }`}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </FilterSection>
        </>
      )}
    </div>
  );
}
