import axios from "axios";
import type { CartResponse } from "@/schema/cart";

const API_BASE = "http://localhost:8000/api";

export const getCartApi = async (
  customerId: number
): Promise<CartResponse> => {
  const res = await axios.get(`${API_BASE}/cart`, {
    params: { customer_id: customerId },
  });

  return res.data;
};

export const addToCartApi = async (payload: {
  customer_id: number;
  version_id: number;
  quantity?: number;
}) => {
  const res = await axios.post(`${API_BASE}/cart/add`, payload);
  return res.data;
};

export const updateCartQuantityApi = async (payload: {
  customer_id: number;
  cart_item_id: number;
  quantity: number;
}) => {
  const res = await axios.put(`${API_BASE}/cart/update`, payload);
  return res.data;
};

export const removeCartItemApi = async (payload: {
  customer_id: number;
  cart_item_id: number;
}) => {
  const res = await axios.delete(`${API_BASE}/cart/remove`, {
    data: payload,
  });

  return res.data;
};

export const clearCartApi = async (customer_id: number) => {
  const res = await axios.delete(`${API_BASE}/cart/clear`, {
    data: { customer_id },
  });

  return res.data;
};