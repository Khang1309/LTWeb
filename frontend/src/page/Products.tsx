import { useEffect, useState } from "react";
import {
  getImageUrl,
  getProductDetailApi,
  getProductsApi,
} from "@/apis/productApi";

import type {
  ProductVersion,
  ProductPagination,
} from "@/schema/product";
import { useToast } from "@/hooks/useToast";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";

function Products() {
  const { toast, showToast } = useToast();

  const [products, setProducts] = useState<ProductVersion[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    limit: 10,
  });

  const [keyword, setKeyword] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedProduct, setSelectedProduct] =  useState<ProductVersion | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const res = await getProductsApi({
        q: searchText,
        page,
        limit: 10,
      });

      if (!res.success) {
        showToast(res.message || "Không lấy được danh sách sản phẩm.", "error");
        return;
      }

      setProducts(res.data.items || []);
      setPagination(res.data.pagination);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [page, searchText]);

  const handleSearch = () => {
    setPage(1);
    setSearchText(keyword.trim());
  };

  const handleClearSearch = () => {
    setKeyword("");
    setSearchText("");
    setPage(1);
  };

  const handleViewDetail = async (id: number) => {
    try {
      const res = await getProductDetailApi(id);

      if (!res.success) {
        showToast(res.message || "Không lấy được chi tiết sản phẩm.", "error");
        return;
      }

      setSelectedProduct(res.data);
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Không kết nối được server.",
        "error"
      );
    }
  };

  const formatPrice = (price: number) => {
    return Number(price).toLocaleString("vi-VN") + " VNĐ";
  };

  const user = useUserStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

    const handleAddToCart = async (versionId: number) => {
    console.log("USER:", user);
    console.log("VERSION ID:", versionId);

    const customerId = user?.user_id;

    if (!customerId) {
    showToast("Vui lòng đăng nhập để thêm vào giỏ hàng.", "error");
    return;
    }

    const res = await addItem(Number(customerId), Number(versionId), 1);

    console.log("ADD CART RESPONSE:", res);

    if (!res.success) {
    showToast(res.message || "Thêm vào giỏ hàng thất bại.", "error");
    return;
    }

    showToast("Đã thêm vào giỏ hàng.", "success");
    };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Danh sách sản phẩm</h1>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
            <input
              className="border rounded-lg px-4 py-3"
              placeholder="Tìm theo tên sách, thương hiệu, SKU..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />

            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Tìm kiếm
            </button>

            <button
              onClick={handleClearSearch}
              className="bg-slate-600 text-white px-6 py-3 rounded-lg"
            >
              Xóa tìm kiếm
            </button>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Đang tải sản phẩm...
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            Không có sản phẩm nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((item) => (
              <div
                key={item.version_id}
                className="bg-white rounded-xl shadow overflow-hidden"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.product_name}
                  className="w-full h-64 object-cover bg-slate-200"
                  onError={(e) => {
                    e.currentTarget.src = "/icons.svg";
                  }}
                />

                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3">
                    {item.product_name}
                  </h2>

                  <p className="mb-2">
                    <b>Thương hiệu:</b> {item.brand || "Chưa có"}
                  </p>

                  <p className="mb-2">
                    <b>SKU:</b> {item.sku}
                  </p>

                  <p className="mb-2">
                    <b>Phiên bản:</b> {item.version_name}
                  </p>

                  <p className="mb-2">
                    <b>Giá:</b> {formatPrice(item.price)}
                  </p>

                  <p className="mb-4">
                    <b>Tồn kho:</b> {item.stock_quantity}
                  </p>

                  <p className="text-slate-600 mb-5 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewDetail(item.version_id)}
                      className="bg-cyan-500 text-white px-4 py-2 rounded-lg"
                    >
                      Chi tiết
                    </button>

                    <button
                        onClick={() => handleAddToCart(item.version_id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg"
                        >
                        Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8 gap-1">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 bg-white"
          >
            Previous
          </button>

          {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 border rounded ${
                  p === page ? "bg-blue-600 text-white" : "bg-white"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={page >= pagination.total_pages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50 bg-white"
          >
            Next
          </button>
        </div>
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-2xl font-bold">Chi tiết sản phẩm</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-3xl leading-none text-slate-500"
              >
                ×
              </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
              <img
                src={getImageUrl(selectedProduct.image_url)}
                alt={selectedProduct.product_name}
                className="w-full h-96 object-cover rounded-lg bg-slate-200"
                onError={(e) => {
                  e.currentTarget.src = "/icons.svg";
                }}
              />

              <div>
                <h3 className="text-2xl font-bold mb-3">
                  {selectedProduct.product_name}
                </h3>

                <p className="mb-2">
                  <b>Thương hiệu:</b> {selectedProduct.brand || "Chưa có"}
                </p>

                <p className="mb-2">
                  <b>SKU:</b> {selectedProduct.sku}
                </p>

                <p className="mb-2">
                  <b>Phiên bản:</b> {selectedProduct.version_name}
                </p>

                <p className="mb-2">
                  <b>Định dạng:</b> {selectedProduct.format_type}
                </p>

                <p className="mb-2">
                  <b>Ngôn ngữ:</b> {selectedProduct.language}
                </p>

                <p className="mb-2">
                  <b>Bìa:</b> {selectedProduct.cover_type || "Không có"}
                </p>

                <p className="mb-2">
                  <b>Ấn bản:</b> {selectedProduct.edition || "Không có"}
                </p>

                <p className="mb-2">
                  <b>Giá:</b> {formatPrice(selectedProduct.price)}
                </p>

                <p className="mb-2">
                  <b>Tồn kho:</b> {selectedProduct.stock_quantity}
                </p>

                <p className="mb-4">
                  <b>Trạng thái:</b> {selectedProduct.version_status}
                </p>

                <hr className="my-4" />

                <p className="text-slate-700">
                  <b>Mô tả:</b>
                  <br />
                  {selectedProduct.description}
                </p>

                <button
                    onClick={() => handleAddToCart(selectedProduct.version_id)}
                    className="mt-6 bg-green-600 text-white px-5 py-2 rounded-lg"
                    >
                    Thêm
                </button>
              </div>
            </div>

            <div className="px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="bg-slate-600 text-white px-5 py-2 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`toast ${toast.type} show`}>{toast.message}</div>
      )}
    </div>
  );
}

export default Products;