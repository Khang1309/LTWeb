const ORDER_API_BASE = "http://localhost:8000/api";

let orderCurrentPage = 1;
let orderCurrentSearch = "";
const orderLimit = 10;

function formatMoney(value) {
    return Number(value || 0).toLocaleString("vi-VN") + " VNĐ";
}

function getStatusBadge(status) {
    const map = {
        pending: "secondary",
        confirmed: "primary",
        shipping: "warning",
        delivered: "success",
        cancelled: "danger"
    };

    return `<span class="badge bg-${map[status] || "secondary"}">${status}</span>`;
}

async function loadOrders(page = 1) {
    orderCurrentPage = page;

    const url = `${ORDER_API_BASE}/orders?page=${page}&limit=${orderLimit}&q=${encodeURIComponent(orderCurrentSearch)}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
            showOrderMessage(result.message || "Không tải được đơn hàng", "danger");
            return;
        }

        renderOrders(result.data.items || []);
        renderOrderPagination(result.data.pagination || {});
    } catch (error) {
        console.error(error);
        showOrderMessage("Lỗi kết nối server", "danger");
    }
}

function renderOrders(orders) {
    const list = document.getElementById("orderList");

    if (!orders || orders.length === 0) {
        list.innerHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-body text-center">
                        Không có đơn hàng nào.
                    </div>
                </div>
            </div>
        `;
        return;
    }

    list.innerHTML = orders.map(order => `
        <div class="col-lg-6 col-md-12 mt-4">
            <div class="card card-bordered h-100">
                <div class="card-body d-flex flex-column">
                    <h5>Đơn hàng #${order.order_id}</h5>

                    <p><strong>Khách hàng:</strong> ${escapeHtml(order.customer_name || "")}</p>
                    <p><strong>Email:</strong> ${escapeHtml(order.customer_email || "")}</p>
                    <p><strong>Người nhận:</strong> ${escapeHtml(order.receiver_name || "")}</p>
                    <p><strong>SĐT:</strong> ${escapeHtml(order.receiver_phone || "")}</p>
                    <p><strong>Địa chỉ:</strong> ${escapeHtml(order.shipping_address || "")}</p>
                    <p><strong>Ngày đặt:</strong> ${escapeHtml(order.order_date || "")}</p>
                    <p><strong>Tổng tiền:</strong> ${formatMoney(order.total_amount)}</p>
                    <p><strong>Thanh toán:</strong> ${escapeHtml(order.payment_method || "Chưa có")} / ${escapeHtml(order.payment_status || "Chưa có")}</p>
                    <p><strong>Trạng thái:</strong> ${getStatusBadge(order.order_status)}</p>

                    <div class="mt-auto">
                        <button class="btn btn-info btn-sm text-white" onclick="viewOrderDetail(${order.order_id})">
                            Chi tiết
                        </button>

                        ${
                            order.order_status === "confirmed"
                            ? `<button class="btn btn-warning btn-sm" onclick="moveOrderToShipping(${order.order_id})">
                                    Chuyển shipping
                               </button>`
                            : `<button class="btn btn-secondary btn-sm" disabled>
                                    Không thể đổi
                               </button>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderOrderPagination(pagination) {
    const paginationEl = document.getElementById("orderPagination");

    const totalPages = pagination.total_pages || 1;
    const currentPage = pagination.current_page || 1;

    if (totalPages <= 1) {
        paginationEl.innerHTML = "";
        return;
    }

    let html = `
        <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadOrders(${currentPage - 1}); return false;">Previous</a>
        </li>
    `;

    for (let i = 1; i <= totalPages; i++) {
        html += `
            <li class="page-item ${i === currentPage ? "active" : ""}">
                <a class="page-link" href="#" onclick="loadOrders(${i}); return false;">${i}</a>
            </li>
        `;
    }

    html += `
        <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
            <a class="page-link" href="#" onclick="loadOrders(${currentPage + 1}); return false;">Next</a>
        </li>
    `;

    paginationEl.innerHTML = html;
}

async function viewOrderDetail(orderId) {
    const content = document.getElementById("orderDetailContent");
    content.innerHTML = "Đang tải...";

    const modal = new bootstrap.Modal(document.getElementById("orderDetailModal"));
    modal.show();

    try {
        const response = await fetch(`${ORDER_API_BASE}/orders/detail?id=${orderId}`);
        const result = await response.json();

        if (!result.success) {
            content.innerHTML = `<p class="text-danger">${result.message}</p>`;
            return;
        }

        const o = result.data;
        const rows = (o.items || []).map(item => `
            <tr>
                <td>${escapeHtml(item.product_name_snapshot)}</td>
                <td>${escapeHtml(item.version_name_snapshot || "")}</td>
                <td>${formatMoney(item.unit_price)}</td>
                <td>${item.quantity}</td>
                <td>${formatMoney(item.subtotal)}</td>
            </tr>
        `).join("");

        content.innerHTML = `
            <h5>Đơn hàng #${o.order_id}</h5>
            <p><strong>Khách hàng:</strong> ${escapeHtml(o.customer_name || "")}</p>
            <p><strong>Người nhận:</strong> ${escapeHtml(o.receiver_name || "")} - ${escapeHtml(o.receiver_phone || "")}</p>
            <p><strong>Địa chỉ:</strong> ${escapeHtml(o.shipping_address || "")}</p>
            <p><strong>Trạng thái:</strong> ${getStatusBadge(o.order_status)}</p>
            <p><strong>Tổng tiền:</strong> ${formatMoney(o.total_amount)}</p>
            <p><strong>Ghi chú:</strong> ${escapeHtml(o.note || "Không có")}</p>

            <hr>

            <h6>Sản phẩm trong đơn</h6>
            <div class="table-responsive">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Phiên bản</th>
                            <th>Đơn giá</th>
                            <th>SL</th>
                            <th>Tạm tính</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows || `<tr><td colspan="5" class="text-center">Không có sản phẩm</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;
    } catch (error) {
        console.error(error);
        content.innerHTML = `<p class="text-danger">Lỗi kết nối server</p>`;
    }
}

async function moveOrderToShipping(orderId) {
    const ok = confirm("Chuyển đơn này từ confirmed sang shipping?");
    if (!ok) return;

    try {
        const response = await fetch(`${ORDER_API_BASE}/orders/move-to-shipping?id=${orderId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                note: "Admin chuyển đơn sang shipping"
            })
        });

        const result = await response.json();

        if (!result.success) {
            showOrderMessage(result.message || "Cập nhật thất bại", "danger");
            return;
        }

        showOrderMessage("Cập nhật trạng thái thành công", "success");
        loadOrders(orderCurrentPage);
    } catch (error) {
        console.error(error);
        showOrderMessage("Lỗi kết nối server", "danger");
    }
}

function searchOrders() {
    orderCurrentSearch = document.getElementById("orderSearchInput").value.trim();
    loadOrders(1);
}

function clearOrderSearch() {
    document.getElementById("orderSearchInput").value = "";
    orderCurrentSearch = "";
    loadOrders(1);
}

function showOrderMessage(message, type) {
    const el = document.getElementById("orderMessage");
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
    const searchInput = document.getElementById("orderSearchInput");

    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                searchOrders();
            }
        });
    }
});