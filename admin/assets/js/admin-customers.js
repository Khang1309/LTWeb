const CUSTOMER_API_BASE = "http://localhost:8000/api";

let customerCurrentPage = 1;
let customerCurrentSearch = "";
const customerLimit = 10;

async function loadCustomers(page = 1) {
    customerCurrentPage = page;

    const url = `${CUSTOMER_API_BASE}/admin/customers?page=${page}&limit=${customerLimit}&q=${encodeURIComponent(customerCurrentSearch)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
            showCustomerMessage(result.message || "Không tải được khách hàng", "danger");
            return;
        }

        renderCustomers(result.data.items || []);
        renderCustomerPagination(result.data.pagination || {});
    } catch (error) {
        console.error(error);
        showCustomerMessage("Lỗi kết nối server", "danger");
    }
}

function renderCustomers(customers) {
    const list = document.getElementById("customerList");

    if (!customers || customers.length === 0) {
        list.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center">
                        Không có khách hàng nào.
                    </div>
                </div>
            </div>
        `;
        return;
    }

    list.innerHTML = customers.map(customer => `
        <div class="col-lg-6 col-md-12 mt-4">
            <div class="card card-bordered h-100">
                <div class="card-body d-flex flex-column">
                    <h5>${escapeHtml(customer.full_name || "Không có tên")}</h5>

                    <p><strong>ID:</strong> ${customer.customer_id}</p>
                    <p><strong>Email:</strong> ${escapeHtml(customer.email || "")}</p>
                    <p><strong>SĐT tài khoản:</strong> ${escapeHtml(customer.phone || "Không có")}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> ${escapeHtml(customer.shipping_address || "")}</p>
                    <p><strong>Người nhận:</strong> ${escapeHtml(customer.receiver_name || "Không có")}</p>
                    <p><strong>SĐT người nhận:</strong> ${escapeHtml(customer.receiver_phone || "Không có")}</p>

                    <p>
                        <strong>Trạng thái:</strong>
                        ${
                            Number(customer.customer_status) === 1
                            ? `<span class="badge bg-success">Đang hoạt động</span>`
                            : `<span class="badge bg-danger">Đã bị ban</span>`
                        }
                    </p>

                    <div class="mt-auto">
                        ${
                            Number(customer.customer_status) === 1
                            ? `<button class="btn btn-danger btn-sm" onclick="updateCustomerStatus(${customer.customer_id}, 0)">
                                    Ban
                               </button>`
                            : `<button class="btn btn-success btn-sm" onclick="updateCustomerStatus(${customer.customer_id}, 1)">
                                    Unban
                               </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderCustomerPagination(pagination) {
    const paginationEl = document.getElementById("customerPagination");

    const totalPages = pagination.total_pages || 1;
    const currentPage = pagination.current_page || 1;

    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadCustomers(${currentPage - 1}); return false;">
                Previous
            </a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="loadCustomers(${i}); return false;">
                    ${i}
                </a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadCustomers(${currentPage + 1}); return false;">
                Next
            </a>
        </li>
    `;

    paginationEl.innerHTML = html;
}

async function updateCustomerStatus(customerId, status) {
    const admin = JSON.parse(localStorage.getItem("admin") || "{}");

    const adminId =
        admin.admin_id ||
        admin.user_id ||
        admin.id ||
        null;

    const ok = confirm(
        status === 0
            ? "Bạn có chắc muốn ban khách hàng này?"
            : "Bạn có chắc muốn mở khóa khách hàng này?"
    );

    if (!ok) return;

    try {
        const response = await fetch(`${CUSTOMER_API_BASE}/admin/customers/status?id=${customerId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                status,
                admin_id: adminId
            })
        });

        const result = await response.json();

        if (!result.success) {
            showCustomerMessage(result.message || "Không đủ thẩm quyền", "danger");
            return;
        }

        showCustomerMessage(result.message || "Cập nhật trạng thái thành công", "success");
        loadCustomers(customerCurrentPage);
    } catch (error) {
        console.error(error);
        showCustomerMessage("Lỗi kết nối server", "danger");
    }
}

function searchCustomers() {
    customerCurrentSearch = document.getElementById("customerSearchInput").value.trim();
    loadCustomers(1);
}

function clearCustomerSearch() {
    document.getElementById("customerSearchInput").value = "";
    customerCurrentSearch = "";
    loadCustomers(1);
}

function showCustomerMessage(message, type) {
    const el = document.getElementById("customerMessage");

    if (!el) return;

    if (!message) {
        el.innerHTML = "";
        return;
    }

    el.innerHTML = `<span class="text-${type}">${message}</span>`;
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

document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("customerSearchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                searchCustomers();
            }
        });
    }
});