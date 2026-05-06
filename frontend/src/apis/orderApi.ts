import axios from "axios";
import type { OrderResponse, SingleOrderResponse } from "@/schema/order";

const API_BASE = "http://localhost:8000/api";

export const getCustomerOrdersApi = async (
  customerId: number
): Promise<OrderResponse> => {
  const res = await axios.get(`${API_BASE}/orders/customer`, {
    params: { customer_id: customerId },
  });

  return res.data;
};

export const customerConfirmPaymentApi = async (
  orderId: number,
  customerId: number
): Promise<SingleOrderResponse> => {
  const res = await axios.put(
    `${API_BASE}/orders/customer-confirm-payment`,
    { customer_id: customerId },
    { params: { id: orderId } }
  );

  return res.data;
};

export const customerCancelOrderApi = async (
  orderId: number,
  customerId: number,
  note = "Khách hàng hủy thanh toán"
): Promise<SingleOrderResponse> => {
  const res = await axios.put(
    `${API_BASE}/orders/customer-cancel`,
    { customer_id: customerId, note },
    { params: { id: orderId } }
  );

  return res.data;
};

export const customerConfirmDeliveredApi = async (
  orderId: number,
  customerId: number
): Promise<SingleOrderResponse> => {
  const res = await axios.put(
    `${API_BASE}/orders/customer-confirm-delivered`,
    { customer_id: customerId },
    { params: { id: orderId } }
  );

  return res.data;
};

export const createOrderFromCartApi = async (payload: {
  customer_id: number;
  payment_method?: "cod" | "bank_transfer" | "momo" | "vnpay" | "credit_card";
  note?: string;
}) => {
  const res = await axios.post(`${API_BASE}/orders/create-from-cart`, payload);
  return res.data;
};