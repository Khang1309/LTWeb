import type { ProductVersion } from "./product";

export type CartItem = ProductVersion & {
  cart_item_id: number;
  cart_id: number;
  quantity: number;
  subtotal: number;
};

export type CartResponse = {
  success: boolean;
  message?: string;
  data: {
    items: CartItem[];
    total_amount: number;
  };
};