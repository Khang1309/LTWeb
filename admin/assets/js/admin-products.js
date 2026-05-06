const PRODUCT_API_BASE  = "http://localhost:8000/api";

let currentPage = 1;
let totalPages = 1;
let currentSearch = "";
const limit = 10;

function getProductImage(imageUrl) {
    if (!imageUrl || imageUrl.trim() === "") {
        return "http://localhost:8000/uploads/products/no_img.jpg";
    }

    if (imageUrl.startsWith("http")) {
        return imageUrl;
    }

    return `http://localhost:8000/${imageUrl}`;
}

function formatPrice(price) {
    return Number(price || 0).toLocaleString("vi-VN") + " VNĐ";
}

function shortText(text, maxLength = 120) {
    if (!text) return "Chưa có mô tả";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
}

async function loadProducts(page = 1) {
    currentPage = page;

    const url = `${PRODUCT_API_BASE}/products?page=${page}&limit=${limit}&q=${encodeURIComponent(currentSearch)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
            showProductMessage(result.message || "Không tải được sản phẩm", "danger");
            return;
        }

        renderProducts(result.data.items || []);
        renderPagination(result.data.pagination || {});
    } catch (error) {
        console.error(error);
        showProductMessage("Lỗi kết nối server", "danger");
    }
}

function renderProducts(products) {
    const productList = document.getElementById("productList");

    if (!products || products.length === 0) {
        productList.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center">
                        Không có sản phẩm nào.
                    </div>
                </div>
            </div>
        `;
        return;
    }

    productList.innerHTML = products.map(product => `
        <div class="col-lg-6 col-md-12 mt-4">
            <div class="card card-bordered h-100">
                <img 
                    class="card-img-top img-fluid"
                    src="${getProductImage(product.image_url)}"
                    alt="${escapeHtml(product.product_name)}"
                    style="height: 260px; object-fit: cover;"
                    onerror="this.src='http://localhost:8000/uploads/products/no_img.jpg'"
                >

                <div class="card-body d-flex flex-column">
                    <h5 class="title">${escapeHtml(product.product_name)}</h5>

                    <p class="mb-1">
                        <strong>Thương hiệu:</strong> ${escapeHtml(product.brand || "Không có")}
                    </p>

                    <p class="mb-1">
                        <strong>SKU:</strong> ${escapeHtml(product.sku || "")}
                    </p>

                    <p class="mb-1">
                        <strong>Phiên bản:</strong> ${escapeHtml(product.version_name || "")}
                    </p>

                    <p class="mb-1">
                        <strong>Giá:</strong> ${formatPrice(product.price)}
                    </p>

                    <p class="mb-1">
                        <strong>Tồn kho:</strong> ${product.stock_quantity}
                    </p>

                    <p class="card-text mt-2">
                        ${escapeHtml(shortText(product.description))}
                    </p>

                    <div class="mt-auto">
                        <button class="btn btn-info btn-sm text-white" onclick="viewProductDetail(${product.version_id})">
                            Chi tiết
                        </button>

                        <button class="btn btn-warning btn-sm" onclick="editProduct(${product.version_id})">
                            Sửa
                        </button>

                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.version_id})">
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderPagination(pagination) {
    const paginationEl = document.getElementById("productPagination");

    totalPages = pagination.total_pages || 1;
    currentPage = pagination.current_page || 1;

    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }

    let html = "";

    html += `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadProducts(${currentPage - 1}); return false;">
                Previous
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="loadProducts(${i}); return false;">
                    ${i}
                </a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadProducts(${currentPage + 1}); return false;">
                Next
            </a>
        </li>
    `;

    paginationEl.innerHTML = html;
}

function searchProducts() {
    currentSearch = document.getElementById("productSearchInput").value.trim();
    loadProducts(1);
}

function clearSearch() {
    document.getElementById("productSearchInput").value = "";
    currentSearch = "";
    loadProducts(1);
}

async function viewProductDetail(versionId) {
    const content = document.getElementById("productDetailContent");
    content.innerHTML = "Đang tải...";

    const modal = new bootstrap.Modal(
        document.getElementById("productDetailModal")
    );

    modal.show();

    try {
        const response = await fetch(`${PRODUCT_API_BASE}/products/detail?id=${versionId}`);
        const result = await response.json();

        if (!result.success) {
            content.innerHTML = `<p class="text-danger">${result.message || "Không lấy được chi tiết sản phẩm"}</p>`;
            return;
        }

        const p = result.data;

        content.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <img 
                        src="${getProductImage(p.image_url)}"
                        class="img-fluid rounded border"
                        style="width: 100%; max-height: 350px; object-fit: cover;"
                        onerror="this.src='http://localhost:8000/uploads/products/no_img.jpg'"
                    >
                </div>

                <div class="col-md-7">
                    <h4>${escapeHtml(p.product_name)}</h4>

                    <p><strong>Thương hiệu:</strong> ${escapeHtml(p.brand || "Không có")}</p>
                    <p><strong>SKU:</strong> ${escapeHtml(p.sku || "")}</p>
                    <p><strong>Phiên bản:</strong> ${escapeHtml(p.version_name || "")}</p>
                    <p><strong>Định dạng:</strong> ${escapeHtml(p.format_type || "")}</p>
                    <p><strong>Ngôn ngữ:</strong> ${escapeHtml(p.language || "Vietnamese")}</p>
                    <p><strong>Giá:</strong> ${formatPrice(p.price)}</p>
                    <p><strong>Tồn kho:</strong> ${p.stock_quantity}</p>
                    <p><strong>Trạng thái:</strong> ${escapeHtml(p.version_status || "")}</p>

                    <hr>

                    <p><strong>Mô tả:</strong></p>
                    <p>${escapeHtml(p.description || "Chưa có mô tả")}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error(error);
        content.innerHTML = `<p class="text-danger">Lỗi kết nối server</p>`;
    }
}

async function editProduct(versionId) {
    try {
        const response = await fetch(`${PRODUCT_API_BASE }/products/detail?id=${versionId}`);
        const result = await response.json();

        if (!result.success) {
            showProductMessage(result.message || "Không lấy được chi tiết sản phẩm", "danger");
            return;
        }

        const p = result.data;

        document.getElementById("productId").value = p.version_id;
        document.getElementById("productName").value = p.product_name || "";
        document.getElementById("brand").value = p.brand || "";
        document.getElementById("sku").value = p.sku || "";
        document.getElementById("versionName").value = p.version_name || "";
        document.getElementById("formatType").value = p.format_type || "paperback";
        document.getElementById("price").value = p.price || 0;
        document.getElementById("stockQuantity").value = p.stock_quantity || 0;
        document.getElementById("imageUrl").value = p.image_url || "";
        document.getElementById("versionStatus").value = p.version_status || "available";
        document.getElementById("description").value = p.description || "";

        document.getElementById("productFormTitle").innerText = "Sửa sản phẩm";
        document.getElementById("submitProductBtn").innerText = "Cập nhật sản phẩm";

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error(error);
        showProductMessage("Lỗi kết nối server", "danger");
    }
}

async function deleteProduct(versionId) {
    const ok = confirm("Bạn có chắc muốn xóa sản phẩm này không?");
    if (!ok) return;

    try {
        const response = await fetch(`${PRODUCT_API_BASE }/products/delete?id=${versionId}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!result.success) {
            showProductMessage(result.message || "Xóa thất bại", "danger");
            return;
        }

        showProductMessage("Xóa sản phẩm thành công", "success");
        loadProducts(currentPage);
    } catch (error) {
        console.error(error);
        showProductMessage("Lỗi kết nối server", "danger");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("productForm");

    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const versionId = document.getElementById("productId").value;

        let uploadedImageUrl = "";

        try {
            uploadedImageUrl = await uploadProductImageIfNeeded();
        } catch (error) {
            showProductMessage(error.message, "danger");
            return;
        }
        const payload = {
            product_name: document.getElementById("productName").value.trim(),
            brand: document.getElementById("brand").value.trim(),
            sku: document.getElementById("sku").value.trim(),
            version_name: document.getElementById("versionName").value.trim(),
            format_type: document.getElementById("formatType").value,
            price: Number(document.getElementById("price").value),
            stock_quantity: Number(document.getElementById("stockQuantity").value),
            // image_url: document.getElementById("imageUrl").value.trim(),
            image_url: uploadedImageUrl,
            version_status: document.getElementById("versionStatus").value,
            description: document.getElementById("description").value.trim()
        };

        if (!payload.product_name || !payload.sku || !payload.version_name) {
            showProductMessage("Vui lòng nhập tên sản phẩm, SKU và tên phiên bản", "danger");
            return;
        }

        const isUpdate = versionId !== "";
        const url = isUpdate
            ? `${PRODUCT_API_BASE }/products/update?id=${versionId}`
            : `${PRODUCT_API_BASE }/products`;

        const method = isUpdate ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!result.success) {
                showProductMessage(result.message || "Lưu sản phẩm thất bại", "danger");
                return;
            }

            showProductMessage(
                isUpdate ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công",
                "success"
            );

            resetProductForm();
            loadProducts(currentPage);
        } catch (error) {
            console.error(error);
            showProductMessage("Lỗi kết nối server", "danger");
        }
    });

    const searchInput = document.getElementById("productSearchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                searchProducts();
            }
        });
    }
});

function resetProductForm() {
    document.getElementById("productForm").reset();
    document.getElementById("productId").value = "";
    document.getElementById("productFormTitle").innerText = "Thêm sản phẩm";
    document.getElementById("submitProductBtn").innerText = "Thêm sản phẩm";
    showProductMessage("", "");
}

function showProductMessage(message, type) {
    const messageEl = document.getElementById("productMessage");

    if (!messageEl) return;

    if (!message) {
        messageEl.innerHTML = "";
        return;
    }

    messageEl.innerHTML = `
        <span class="text-${type}">
            ${message}
        </span>
    `;
}

function escapeHtml(value) {
    if (value === null || value === undefined) return "";

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


async function uploadProductImageIfNeeded() {
    const fileInput = document.getElementById("productImageFile");

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        return document.getElementById("imageUrl").value.trim();
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    const response = await fetch(`${PRODUCT_API_BASE}/products/upload-image`, {
        method: "POST",
        body: formData
    });

    const result = await response.json();

    if (!result.success) {
        throw new Error(result.message || "Upload ảnh thất bại");
    }

    return result.data.image_url;
}