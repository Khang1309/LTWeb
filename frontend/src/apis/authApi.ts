import axios from "axios";

const API_BASE = "http://localhost:8000/api";

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  shipping_address: string;
  receiver_name?: string;
  receiver_phone?: string;
};

export const customerLoginApi = async (payload: LoginPayload) => {
  const res = await axios.post(`${API_BASE}/customer/login`, payload);
  return res.data;
};

export const customerRegisterApi = async (payload: RegisterPayload) => {
  const res = await axios.post(`${API_BASE}/register`, payload);
  return res.data;
};

export const adminLoginApi = async (payload: LoginPayload) => {
  const res = await axios.post(`${API_BASE}/admin/login`, payload);
  return res.data;
};

export const checkCustomerStatusApi = async (userId: number) => {
  const res = await axios.get(`${API_BASE}/auth/check-status`, {
    params: {
      user_id: userId,
    },
  });

  return res.data;
};