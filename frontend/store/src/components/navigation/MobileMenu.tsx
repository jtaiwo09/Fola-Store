"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ShoppingCart, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { navLinks, profileLinks } from "./data";

export default function MobileMenu({
  isOpen,
  onClose,
  isSignedIn,
  isLoaded,
  cartCount,
  mounted,
  onSignOut,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  isSignedIn?: boolean;
  isLoaded: boolean;
  cartCount: number;
  mounted: boolean;
  onSignOut: () => void;
  user: any;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-full max-w-sm px-0">
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <SheetHeader className="border-b px-6 py-4 dark:border-gray-800">
            <SheetTitle className="text-xl font-light">Menu</SheetTitle>
          </SheetHeader>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Main Links */}
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Shop
              </p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Profile Links */}
            {isSignedIn && (
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Account
                </p>
                {profileLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={onClose}
                      className="flex items-center gap-3 px-3 py-2 text-base font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </nav>

          {/* Footer */}
          <div className="px-6 py-6 border-t dark:border-gray-800 flex flex-col gap-y-3">
            {isLoaded && (
              <>
                {/* Cart Button */}
                <Link href="/cart" onClick={onClose}>
                  <Button variant="outline" className="w-full justify-between">
                    <span className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Cart
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({mounted ? cartCount : 0})
                    </span>
                  </Button>
                </Link>

                {/* Auth Buttons */}
                {isSignedIn ? (
                  <Button
                    onClick={onSignOut}
                    variant="ghost"
                    className="w-full justify-start text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/sign-in" onClick={onClose}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" onClick={onClose}>
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
