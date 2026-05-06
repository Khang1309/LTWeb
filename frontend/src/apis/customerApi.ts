import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export type UpdateCustomerPayload = {
  user_id: number;
  full_name: string;
  phone: string;
  shipping_address: string;
  receiver_name: string;
  receiver_phone: string;
};

export type ChangePasswordPayload = {
  user_id: number;
  old_password: string;
  new_password: string;
  confirm_password: string;
};

export const getCustomerInfoApi = async (userId: number) => {
  const res = await axios.get(`${API_BASE}/customer/info?user_id=${userId}`);
  return res.data;
};

export const updateCustomerApi = async (payload: UpdateCustomerPayload) => {
  const res = await axios.put(`${API_BASE}/customer/update`, payload);
  return res.data;
};

export const changeCustomerPasswordApi = async (
  payload: ChangePasswordPayload
) => {
  const res = await axios.put(`${API_BASE}/customer/change-password`, payload);
  return res.data;
};