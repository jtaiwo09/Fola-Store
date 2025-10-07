import { NavLink } from "@/components/reusables/NavLink";
import { SearchBar } from "@/components/reusables/SearchBar";
import { ShoppingCart, User, X } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/lib/store/cartStore";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: IProps) => {
  const { getItemCount } = useCartStore();
  const cartCount = getItemCount();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
            <span className="text-xl font-light text-gray-900 dark:text-white">
              Menu
            </span>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b dark:border-gray-800">
            <SearchBar />
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="space-y-4">
              <NavLink className="block text-lg">Shop All</NavLink>
              <NavLink className="block text-lg">New Arrivals</NavLink>
              <NavLink className="block text-lg">Collections</NavLink>
              <NavLink className="block text-lg">About Us</NavLink>
              <NavLink className="block text-lg">Contact</NavLink>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="p-6 border-t dark:border-gray-800 space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button className="w-full justify-start">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart ({cartCount})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
