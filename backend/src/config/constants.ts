export const APP_CONSTANTS = {
  // Pagination
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Order
  DEFAULT_CURRENCY: "NGN",
  DEFAULT_SHIPPING_COST: 1500,

  // Product
  MIN_PRODUCT_ORDER: 1,
  DEFAULT_UNIT_OF_MEASURE: "yard",

  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],

  // Rate Limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // User
  PASSWORD_MIN_LENGTH: 8,
  TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  // General
  INTERNAL_SERVER_ERROR: "Internal server error",
  VALIDATION_ERROR: "Validation error",
  NOT_FOUND: "Resource not found",

  // Authentication
  INVALID_CREDENTIALS: "Invalid email or password",
  UNAUTHORIZED: "Unauthorized access",
  TOKEN_EXPIRED: "Token has expired",
  TOKEN_INVALID: "Invalid token",
  EMAIL_ALREADY_EXISTS: "Email already registered",

  // Product
  PRODUCT_NOT_FOUND: "Product not found",
  INSUFFICIENT_STOCK: "Insufficient stock",
  VARIANT_NOT_FOUND: "Product variant not found",

  // Order
  ORDER_NOT_FOUND: "Order not found",
  INVALID_ORDER_STATUS: "Invalid order status",
  PAYMENT_FAILED: "Payment processing failed",

  // Category
  CATEGORY_NOT_FOUND: "Category not found",
  CATEGORY_HAS_PRODUCTS: "Cannot delete category with associated products",
};

export const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  REGISTER_SUCCESS: "Registration successful",

  // Product
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",

  // Order
  ORDER_CREATED: "Order created successfully",
  ORDER_UPDATED: "Order updated successfully",
  PAYMENT_SUCCESS: "Payment processed successfully",
};
