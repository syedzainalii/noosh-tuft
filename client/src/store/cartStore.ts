import { create } from 'zustand';
import { CartItem } from '@/types';
import api from '@/lib/api';

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/api/cart');
      set({ items: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  addToCart: async (productId: number, quantity: number) => {
    try {
      await api.post('/api/cart', { product_id: productId, quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  updateCartItem: async (itemId: number, quantity: number) => {
    try {
      await api.put(`/api/cart/${itemId}`, { quantity });
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (itemId: number) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      await get().fetchCart();
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/api/cart');
      set({ items: [] });
    } catch (error) {
      throw error;
    }
  },

  getTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
}));
