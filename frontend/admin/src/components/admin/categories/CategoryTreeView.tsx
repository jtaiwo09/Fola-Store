// components/admin/categories/CategoryTreeView.tsx
"use client";

import { Category } from "@/lib/api/categories";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Plus,
  FolderOpen,
  Folder,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CategoryTreeViewProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddChild: (parentId: string) => void;
}

export default function CategoryTreeView({
  categories,
  onEdit,
  onDelete,
  onAddChild,
}: CategoryTreeViewProps) {
  return (
    <div className="space-y-2">
      {categories.map((category) => (
        <CategoryNode
          key={category._id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
          onAddChild={onAddChild}
        />
      ))}
    </div>
  );
}

function CategoryNode({
  category,
  level = 0,
  onEdit,
  onDelete,
  onAddChild,
}: {
  category: Category;
  level?: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onAddChild: (parentId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group",
          level > 0 && "ml-8"
        )}
      >
        <div className="flex items-center gap-3 flex-1">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-6" />
          )}

          {/* Folder Icon */}
          {hasChildren ? (
            <FolderOpen className="w-5 h-5 text-yellow-500" />
          ) : (
            <Folder className="w-5 h-5 text-gray-400" />
          )}

          {/* Category Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {category.name}
              </h3>
              {!category.isActive && (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
              {category.level > 0 && (
                <Badge variant="outline" className="text-xs">
                  Level {category.level}
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 truncate">{category.slug}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddChild(category._id)}
            title="Add subcategory"
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(category)}
            title="Edit category"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(category)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-4">
          {category.children!.map((child) => (
            <CategoryNode
              key={child._id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  );
}
