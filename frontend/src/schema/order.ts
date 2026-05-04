export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  order_item_id: number;
  order_id: number;
  version_id: number;
  product_name_snapshot: string;
  version_name_snapshot: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  order_id: number;
  customer_id: number;
  order_date: string;
  order_status: OrderStatus;
  shipping_address: string;
  receiver_name: string;
  receiver_phone: string;
  total_amount: number;
  note: string | null;
  items?: OrderItem[];
};

export type OrderResponse = {
  success: boolean;
  message?: string;
  data: Order[];
};

export type SingleOrderResponse = {
  success: boolean;
  message?: string;
  data: Order;
};