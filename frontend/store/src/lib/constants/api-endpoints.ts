export const API_ENDPOINTS = {
  // Orders
  ORDERS: "/orders",
  MY_ORDERS: "/orders/my-orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  VERIFY_PAYMENT: "/orders/verify-payment",
  INITIALIZE_PAYMENT: (orderId: string) =>
    `/orders/${orderId}/initialize-payment`,
  DASHBOARD_STATS: "/orders/dashboard/stats",
  CANCEL_ORDER: (id: string) => `/orders/${id}/cancel`,

  // Products
  PRODUCTS: "/products",
  PRODUCT_DETAIL: (id: string) => `/products/${id}`,
  PRODUCT_BY_SLUG: (slug: string) => `/products/slug/${slug}`,
  FEATURED_PRODUCTS: "/products/featured",
  NEW_ARRIVALS: "/products/new-arrivals",
  CHECK_STOCK: (id: string) => `/products/${id}/check-stock`,
  FILTER_OPTIONS: "/products/filters/options",

  // Categories
  CATEGORIES: "/categories",
  CATEGORY_TREE: "/categories/tree",
  CATEGORY_DETAIL: (id: string) => `/categories/${id}`,
  CATEGORY_BY_SLUG: (slug: string) => `/categories/slug/${slug}`,

  // Reviews
  PRODUCT_REVIEWS: (productId: string) => `/reviews/product/${productId}`,
  CREATE_REVIEW: `/reviews`,
  VOTE_HELPFUL: (reviewId: string) => `/reviews/${reviewId}/vote/helpful`,
  VOTE_NOT_HELPFUL: (reviewId: string) =>
    `/reviews/${reviewId}/vote/not-helpful`,
  REMOVE_VOTE: (reviewId: string) => `/reviews/${reviewId}/vote`,
  CAN_REVIEW: (productId: string) => `/orders/can-review/${productId}`,
  UPLOAD_REVIEW_IMAGES: `/upload/review-images`,

  // Settings
  STORE_SETTINGS: "/settings/public",
} as const;
