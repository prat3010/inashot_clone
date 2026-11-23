import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // `${productId}-${packCount}`
  productId: string;
  productTitle: string;
  productHandle: string;
  tierTitle: string;
  packCount: number;
  weightGrams: number;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  image: string;
}

export interface QuickViewProduct {
  id: string;
  title: string;
  handle: string;
  price: number;
  compareAtPrice?: number | null;
  featuredImage: string;
  images: string[];
  badge?: string | null;
  category: string;
  description: string;
  inStock: boolean;
  grams: number;
  macros?: any;
  ingredients?: string | null;
}

interface CartStore {
  // Cart drawer state
  isCartOpen: boolean;
  items: CartItem[];
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  clearCart: () => void;
  subtotal: () => number;

  // Quick view modal state
  quickViewProduct: QuickViewProduct | null;
  openQuickView: (product: QuickViewProduct) => void;
  closeQuickView: () => void;

  // Checkout modal state
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      isCartOpen: false,
      items: [],

      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex((i) => i.id === item.id);
          const addQty = item.quantity || 1;
          let newItems: CartItem[];

          if (existingIndex > -1) {
            newItems = state.items.map((i, idx) =>
              idx === existingIndex ? { ...i, quantity: i.quantity + addQty } : i
            );
          } else {
            newItems = [...state.items, { ...item, quantity: addQty }];
          }

          return {
            items: newItems,
            isCartOpen: true, // auto-open cart on add
          };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, newQuantity) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item.id === id) {
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];

          return { items: newItems };
        });
      },

      clearCart: () => set({ items: [] }),

      subtotal: () => {
        const { items } = get();
        return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },

      // Quick view
      quickViewProduct: null,
      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),

      // Checkout
      isCheckoutOpen: false,
      openCheckout: () => set({ isCheckoutOpen: true, isCartOpen: false }),
      closeCheckout: () => set({ isCheckoutOpen: false }),
    }),
    {
      name: 'inashot-cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
