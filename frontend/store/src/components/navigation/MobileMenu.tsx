import { LogOut, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { navLinks, profileLinks } from "./data";

export default function MobileMenu({
  isOpen,
  onClose,
  isSignedIn,
  isLoaded,
  cartCount,
  mounted,
  onSignOut,
}: {
  isOpen: boolean;
  onClose: () => void;
  isSignedIn?: boolean;
  isLoaded: boolean;
  user: any;
  cartCount: number;
  mounted: boolean;
  onSignOut: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
            <span className="text-xl font-light">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <span className="sr-only">Close menu</span>
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-6 space-y-6">
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
          <div className="p-6 border-t dark:border-gray-800 flex flex-col gap-y-3">
            {isLoaded && (
              <>
                {isSignedIn ? (
                  <>
                    <Link href="/cart" onClick={onClose}>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Cart
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({mounted ? cartCount : 0})
                        </span>
                      </Button>
                    </Link>
                    <Button
                      onClick={onSignOut}
                      variant="ghost"
                      className="w-full justify-start text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/cart" onClick={onClose}>
                      <Button
                        variant="outline"
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Cart
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ({mounted ? cartCount : 0})
                        </span>
                      </Button>
                    </Link>
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
      </div>
    </div>
  );
}
