import { ChevronRight } from "lucide-react";
import React from "react";

interface IProps {
  items: {
    onClick: any;
    label: string;
  }[];
}
export const Breadcrumb = ({ items }: IProps) => (
  <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
    {items.map((item, idx) => (
      <React.Fragment key={idx}>
        {idx > 0 && <ChevronRight className="w-4 h-4" />}
        <button
          onClick={item.onClick}
          className={`hover:text-gray-900 dark:hover:text-white transition-colors ${
            idx === items.length - 1
              ? "text-gray-900 dark:text-white font-medium"
              : ""
          }`}
        >
          {item.label}
        </button>
      </React.Fragment>
    ))}
  </nav>
);
