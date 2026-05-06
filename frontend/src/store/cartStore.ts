import { create } from "zustand";
import type { CartItem } from "@/schema/cart";
import {
  addToCartApi,
  clearCartApi,
  getCartApi,
  removeCartItemApi,
  updateCartQuantityApi,
} from "@/apis/cartApi";

type CartStore = {
  items: CartItem[];
  totalAmount: number;
  loading: boolean;

  loadCart: (customerId: number) => Promise<void>;
  addItem: (customerId: number, versionId: number, quantity?: number) => Promise<any>;
  updateQuantity: (
    customerId: number,
    cartItemId: number,
    quantity: number
  ) => Promise<any>;
  removeItem: (customerId: number, cartItemId: number) => Promise<any>;
  clearCart: (customerId: number) => Promise<any>;
};

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  totalAmount: 0,
  loading: false,

  loadCart: async (customerId) => {
    set({ loading: true });

    try {
      const res = await getCartApi(customerId);

      if (res.success) {
        set({
          items: res.data.items,
          totalAmount: res.data.total_amount,
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (customerId, versionId, quantity = 1) => {
    const res = await addToCartApi({
      customer_id: customerId,
      version_id: versionId,
      quantity,
    });

    if (res.success) {
      await useCartStore.getState().loadCart(customerId);
    }

    return res;
  },

  updateQuantity: async (customerId, cartItemId, quantity) => {
    const res = await updateCartQuantityApi({
      customer_id: customerId,
      cart_item_id: cartItemId,
      quantity,
    });

    if (res.success) {
      await useCartStore.getState().loadCart(customerId);
    }

    return res;
  },

  removeItem: async (customerId, cartItemId) => {
    const res = await removeCartItemApi({
      customer_id: customerId,
      cart_item_id: cartItemId,
    });

    if (res.success) {
      await useCartStore.getState().loadCart(customerId);
    }

    return res;
  },

  clearCart: async (customerId) => {
    const res = await clearCartApi(customerId);

    if (res.success) {
      await useCartStore.getState().loadCart(customerId);
    }

    return res;
  },
}));