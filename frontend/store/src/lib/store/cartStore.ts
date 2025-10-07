import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, ProductVariant } from "@/lib/api/products";

export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    product: Product,
    variant: ProductVariant,
    quantity: number
  ) => void;
  removeItem: (productId: string, variantSku: string) => void;
  updateQuantity: (
    productId: string,
    variantSku: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create(
  persist<CartStore>(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.product._id === product._id &&
              item.variant.sku === variant.sku
          );

          if (existingItemIndex > -1) {
            const newItems = [...state.items];
            const existingItem = newItems[existingItemIndex];

            if (existingItem) {
              existingItem.quantity += quantity;
              newItems[existingItemIndex] = existingItem;
            }

            return { items: newItems };
          }

          return { items: [...state.items, { product, variant, quantity }] };
        });
      },

      removeItem: (productId, variantSku) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product._id === productId &&
                item.variant.sku === variantSku
              )
          ),
        }));
      },

      updateQuantity: (productId, variantSku, quantity) => {
        if (quantity < 1) return;

        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId && item.variant.sku === variantSku
              ? { ...item, quantity }
              : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price =
            item.variant.price ||
            item.product.salePrice ||
            item.product.basePrice;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
