import { Heart, Package, Settings, User } from "lucide-react";

export const navLinks = [
  { href: "/products", label: "Shop All" },
  { href: "/products?sort=-createdAt", label: "New Arrivals" },
  { href: "/products?isFeatured=true", label: "Featured" },
  { href: "/categories", label: "Categories" },
];

export const profileLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/profile/orders", label: "My Orders", icon: Package },
  { href: "/profile/wishlist", label: "Wishlist", icon: Heart },
  { href: "/profile/settings", label: "Settings", icon: Settings },
];
