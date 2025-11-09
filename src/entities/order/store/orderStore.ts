import { create } from 'zustand';
import { Order } from '../model/types';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearOrders: () => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  setOrders: (orders) => set({ orders }),
  setCurrentOrder: (currentOrder) => set({ currentOrder }),
  addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
  updateOrder: (id, updates) =>
    set((state) => ({
      orders: state.orders.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearOrders: () => set({ orders: [], currentOrder: null, error: null }),
}));
