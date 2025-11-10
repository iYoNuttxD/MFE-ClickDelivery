import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OrderItem } from '@/entities/order/model/types';
import { config } from '@/shared/config/env';

interface CartState {
  items: OrderItem[];
  restaurantId: string | null;
  restaurantName: string | null;
  addItem: (item: OrderItem, restaurantId: string, restaurantName: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const cartStore = (set: (fn: (state: CartState) => Partial<CartState>) => void, get: () => CartState): CartState => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (item: OrderItem, restaurantId: string, restaurantName: string) =>
    set((state: CartState) => {
      // If adding from different restaurant, clear cart
      if (state.restaurantId && state.restaurantId !== restaurantId) {
        return {
          items: [item],
          restaurantId,
          restaurantName,
        };
      }

      const existingItemIndex = state.items.findIndex((i) => i.menuItemId === item.menuItemId);
      if (existingItemIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingItemIndex].quantity += item.quantity;
        return { items: newItems };
      }

      return {
        items: [...state.items, item],
        restaurantId,
        restaurantName,
      };
    }),

  removeItem: (menuItemId: string) =>
    set((state: CartState) => ({
      items: state.items.filter((item) => item.menuItemId !== menuItemId),
    })),

  updateQuantity: (menuItemId: string, quantity: number) =>
    set((state: CartState) => ({
      items: state.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set(() => ({ items: [], restaurantId: null, restaurantName: null })),

  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },
});

// Use persistence only in internal mode for full offline capability
export const useCartStore = config.useInternalMode
  ? create<CartState>()(
      persist(cartStore, {
        name: 'internal_mode_cart',
      })
    )
  : create<CartState>(cartStore);
