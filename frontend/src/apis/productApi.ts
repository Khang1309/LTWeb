import axios from "axios";
import type {
  ProductDetailResponse,
  ProductListResponse,
} from "@/schema/product";

const API_BASE = "http://localhost:8000/api";
const SERVER_BASE = "http://localhost:8000";

export const getImageUrl = (imageUrl?: string | null) => {
  if (!imageUrl) return "/icons.svg";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${SERVER_BASE}/${imageUrl}`;
};

type GetProductsParams = {
  q?: string;
  page?: number;
  limit?: number;
};

export const getProductsApi = async (
  params: GetProductsParams
): Promise<ProductListResponse> => {
  const res = await axios.get(`${API_BASE}/products`, {
    params,
  });

  return res.data;
};

export const getProductDetailApi = async (
  id: number
): Promise<ProductDetailResponse> => {
  const res = await axios.get(`${API_BASE}/products/detail`, {
    params: { id },
  });

  return res.data;
};