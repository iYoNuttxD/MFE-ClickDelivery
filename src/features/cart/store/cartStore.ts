import { create } from 'zustand';
import { OrderItem } from '@/entities/order/model/types';

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

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  restaurantId: null,
  restaurantName: null,

  addItem: (item, restaurantId, restaurantName) =>
    set((state) => {
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

  removeItem: (menuItemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.menuItemId !== menuItemId),
    })),

  updateQuantity: (menuItemId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      ),
    })),

  clearCart: () => set({ items: [], restaurantId: null, restaurantName: null }),

  getTotal: () => {
    const state = get();
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  },

  getItemCount: () => {
    const state = get();
    return state.items.reduce((count, item) => count + item.quantity, 0);
  },
}));
