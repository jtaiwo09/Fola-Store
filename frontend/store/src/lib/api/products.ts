import apiClient, { ApiResponse } from "./client";

export interface IProductMetadata {
  shippingTime?: string; // e.g., "2-3 business days"
  returnPolicy?: string; // e.g., "30-day return policy"
  warranty?: string; // e.g., "1-year manufacturer warranty"
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  productType: "fabric" | "readymade" | "accessory" | "other";
  basePrice: number;
  salePrice: number;
  currency: string;
  fabricType?: string;
  unitOfMeasure: "yard" | "meter" | "piece" | "set";
  minimumOrder?: number;
  maximumOrder?: number;
  variants: ProductVariant[];
  specifications: Record<string, any>;
  totalStock: number;
  featuredImage: string;
  images: string[];
  status: "draft" | "active" | "archived" | "out_of_stock";
  isPublished: boolean;
  isFeatured: boolean;
  averageRating: number;
  reviewCount: number;
  // effectivePrice: number;
  metadata: IProductMetadata;
  discountPercentage: number;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductVariant {
  sku: string;
  color: string;
  colorHex: string;
  images: string[];
  stock: number;
  price?: number;
  isAvailable: boolean;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  fabricType?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  status?: string;
  isPublished?: boolean;
}

export interface CheckStockPayload {
  color: string;
  quantity: number;
}

export const productsApi = {
  // Get all products with filters
  getProducts: async (
    filters?: ProductFilters
  ): Promise<ApiResponse<Product[]>> => {
    const response = await apiClient.get("/products", { params: filters });
    return response.data;
  },

  // Get single product by ID
  getProductById: async (
    id: string
  ): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.get(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (
    slug: string
  ): Promise<ApiResponse<{ product: Product }>> => {
    const response = await apiClient.get(`/products/slug/${slug}`);
    console.log(13, response);
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (
    limit = 8
  ): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get("/products/featured", {
      params: { limit },
    });
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (
    limit = 8
  ): Promise<ApiResponse<{ products: Product[] }>> => {
    const response = await apiClient.get("/products/new-arrivals", {
      params: { limit },
    });
    return response.data;
  },

  // Check stock availability
  checkStock: async (
    id: string,
    payload: CheckStockPayload
  ): Promise<
    ApiResponse<{
      isAvailable: boolean;
      availableStock: number;
      requestedQuantity: number;
    }>
  > => {
    const response = await apiClient.post(
      `/products/${id}/check-stock`,
      payload
    );
    return response.data;
  },
};
