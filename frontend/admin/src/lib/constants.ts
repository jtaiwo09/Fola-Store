// apps/admin/src/lib/api/constants.ts

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh-token",
    ME: "/auth/me",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  // Admin
  ADMIN: {
    STATS: "/admin/stats",
    LOW_STOCK: "/admin/low-stock",
    REPORTS: {
      SALES: "/admin/reports/sales",
      INVENTORY: "/admin/reports/inventory",
      PRODUCT_PERFORMANCE: "/admin/reports/product-performance",
    },
  },

  // Products
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
    BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    FEATURED: "/products/featured",
    NEW_ARRIVALS: "/products/new-arrivals",
    CHECK_STOCK: (id: string) => `/products/${id}/check-stock`,
  },

  // Categories
  CATEGORIES: {
    BASE: "/categories",
    BY_ID: (id: string) => `/categories/${id}`,
    BY_SLUG: (slug: string) => `/categories/slug/${slug}`,
    TREE: "/categories/tree",
    CHILDREN: (slug: string) => `/categories/${slug}/children`,
  },

  // Orders
  ORDERS: {
    BASE: "/orders",
    BY_ID: (id: string) => `/orders/${id}`,
    MY_ORDERS: "/orders/my-orders",
    STATS: "/orders/stats/overview",
    DASHBOARD_STATS: "/orders/dashboard/stats",
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    VERIFY_PAYMENT: "/orders/verify-payment",
    INITIALIZE_PAYMENT: (id: string) => `/orders/${id}/initialize-payment`,
  },

  // Reviews
  REVIEWS: {
    BASE: "/reviews",
    BY_ID: (id: string) => `/reviews/${id}`,
    BY_PRODUCT: (productId: string) => `/reviews/product/${productId}`,
    HELPFUL: (id: string) => `/reviews/${id}/helpful`,
  },

  // Users
  USERS: {
    BASE: "/users",
    BY_ID: (id: string) => `/users/${id}`,
    ADDRESSES: "/users/addresses",
    ADDRESS_BY_ID: (addressId: string) => `/users/addresses/${addressId}`,
    DEFAULT_ADDRESS: (addressId: string) =>
      `/users/addresses/${addressId}/default`,
    SYNC_CLERK: "/users/sync-clerk",
  },

  UPLOAD: {
    IMAGE: "/upload/image",
    IMAGES: "/upload/images",
    DELETE: "/upload/image",
  },
} as const;

export const QUERY_KEYS = {
  AUTH: {
    ME: ["auth", "me"] as const,
  },
  ADMIN: {
    STATS: ["admin", "stats"] as const,
    LOW_STOCK: ["admin", "low-stock"] as const,
    REPORTS: {
      SALES: (dateRange?: any, groupBy?: string) =>
        ["admin", "reports", "sales", dateRange, groupBy] as const,
      INVENTORY: ["admin", "reports", "inventory"] as const,
      PRODUCT_PERFORMANCE: (dateRange?: any, limit?: number) =>
        ["admin", "reports", "product-performance", dateRange, limit] as const,
    },
  },
  PRODUCTS: {
    ALL: ["products"] as const,
    LIST: (filters?: any) => ["products", "list", filters] as const,
    BY_ID: (id: string) => ["products", "detail", id] as const,
    BY_SLUG: (slug: string) => ["products", "slug", slug] as const,
    FEATURED: ["products", "featured"] as const,
    NEW_ARRIVALS: ["products", "new-arrivals"] as const,
  },
  CATEGORIES: {
    ALL: ["categories"] as const,
    LIST: (filters?: any) => ["categories", "list", filters] as const,
    BY_ID: (id: string) => ["categories", "detail", id] as const,
    TREE: ["categories", "tree"] as const,
  },
  ORDERS: {
    ALL: ["orders"] as const,
    LIST: (filters?: any) => ["orders", "list", filters] as const,
    BY_ID: (id: string) => ["orders", "detail", id] as const,
    MY_ORDERS: ["orders", "my-orders"] as const,
    STATS: ["orders", "stats"] as const,
  },
  REVIEWS: {
    ALL: ["reviews"] as const,
    BY_ID: (id: string) => ["reviews", "detail", id] as const,
    BY_PRODUCT: (productId: string) =>
      ["reviews", "product", productId] as const,
  },
  USERS: {
    ALL: ["users"] as const,
    LIST: (filters?: any) => ["users", "list", filters] as const,
    BY_ID: (id: string) => ["users", "detail", id] as const,
  },
} as const;
