"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronDown,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

interface NavItem {
  label: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "All Products", href: "/admin/products" },
      { label: "Add Product", href: "/admin/products/new" },
      { label: "Categories", href: "/admin/categories" },
    ],
  },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: MessageSquare },
  { label: "Staff", href: "/admin/staff", icon: UserCog },
  {
    label: "Reports",
    icon: BarChart3,
    children: [
      { label: "Sales", href: "/admin/reports/sales" },
      { label: "Inventory", href: "/admin/reports/inventory" },
      // { label: "Customers", href: "/admin/reports/customers" },
    ],
  },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  isOpen,
  onClose,
  currentPath,
}: AdminSidebarProps) {
  return (
    <>
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <Package className="w-6 h-6 text-gray-900 dark:text-white" />
              <span className="font-semibold text-lg text-gray-900 dark:text-white">
                Admin Panel
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavItemComponent
                  key={item.label}
                  item={item}
                  currentPath={currentPath}
                  onClose={onClose}
                />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}

function NavItemComponent({
  item,
  currentPath,
  onClose,
}: {
  item: NavItem;
  currentPath: string;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(
    item.children?.some((child) => currentPath.startsWith(child.href)) ?? false
  );

  const Icon = item.icon;

  if (item.children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <div
            className={cn(
              "flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700",
              "text-gray-700 dark:text-gray-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-1 ml-8 space-y-1">
            {item.children.map((child) => {
              const isActive = currentPath === child.href;
              return (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    onClick={onClose}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    )}
                  >
                    {child.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    );
  }

  const isActive = currentPath === item.href;

  return (
    <li>
      <Link
        href={item.href!}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        )}
      >
        <Icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    </li>
  );
}
