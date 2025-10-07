export const Footer = () => (
  <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-light text-gray-900 dark:text-white mb-4">
            FOLA STORE
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Premium lace materials for your most important creations.
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Shop
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                All Products
              </button>
            </li>
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                New Arrivals
              </button>
            </li>
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Collections
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Help
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Contact Us
              </button>
            </li>
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Shipping Info
              </button>
            </li>
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Returns
              </button>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-4">
            Legal
          </h4>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Privacy Policy
              </button>
            </li>
            <li>
              <button className="hover:text-gray-900 dark:hover:text-white">
                Terms of Service
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>&copy; 2025 Fola Store. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
