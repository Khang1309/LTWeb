export type ProductVersion = {
  version_id: number;
  product_id: number;
  product_name: string;
  brand: string | null;
  description: string | null;
  sku: string;
  version_name: string;
  format_type: "paperback" | "hardcover" | "ebook" | "special_edition";
  language: string;
  cover_type: string | null;
  edition: string | null;
  price: number;
  stock_quantity: number;
  image_url: string | null;
  version_status: "available" | "out_of_stock" | "hidden";
};

export type ProductPagination = {
  current_page: number;
  total_pages: number;
  total_items: number;
  limit: number;
};