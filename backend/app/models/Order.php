<?php

class Order
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getAll($keyword = '', $page = 1, $limit = 10)
    {
        $page = max(1, (int)$page);
        $limit = max(1, min(50, (int)$limit));
        $offset = ($page - 1) * $limit;

        $kw = "%" . trim($keyword) . "%";

        $countSql = "
            SELECT COUNT(*)
            FROM orders o
            JOIN users u ON o.customer_id = u.user_id
            WHERE u.full_name LIKE ?
               OR u.email LIKE ?
               OR o.receiver_name LIKE ?
               OR o.receiver_phone LIKE ?
               OR o.order_status LIKE ?
        ";

        $stmt = $this->conn->prepare($countSql);
        $stmt->execute([$kw, $kw, $kw, $kw, $kw]);
        $total = (int)$stmt->fetchColumn();

        $sql = "
            SELECT
                o.order_id,
                o.customer_id,
                u.full_name AS customer_name,
                u.email AS customer_email,
                o.order_date,
                o.order_status,
                o.shipping_address,
                o.receiver_name,
                o.receiver_phone,
                o.total_amount,
                o.note,
                o.processed_by_admin_id,
                p.payment_method,
                p.payment_status
            FROM orders o
            JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN payments p ON o.order_id = p.order_id
            WHERE u.full_name LIKE ?
               OR u.email LIKE ?
               OR o.receiver_name LIKE ?
               OR o.receiver_phone LIKE ?
               OR o.order_status LIKE ?
            ORDER BY o.order_id DESC
            LIMIT {$limit} OFFSET {$offset}
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$kw, $kw, $kw, $kw, $kw]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "items" => $items,
            "pagination" => [
                "current_page" => $page,
                "total_pages" => max(1, (int)ceil($total / $limit)),
                "total_items" => $total,
                "limit" => $limit
            ]
        ];
    }

    public function find($orderId)
    {
        $stmt = $this->conn->prepare("
            SELECT
                o.*,
                u.full_name AS customer_name,
                u.email AS customer_email,
                p.payment_method,
                p.payment_status,
                p.transaction_code,
                p.paid_at
            FROM orders o
            JOIN users u ON o.customer_id = u.user_id
            LEFT JOIN payments p ON o.order_id = p.order_id
            WHERE o.order_id = ?
        ");

        $stmt->execute([(int)$orderId]);
        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            return false;
        }

        $stmt = $this->conn->prepare("
            SELECT
                order_item_id,
                version_id,
                product_name_snapshot,
                version_name_snapshot,
                unit_price,
                quantity,
                subtotal
            FROM order_items
            WHERE order_id = ?
        ");

        $stmt->execute([(int)$orderId]);
        $order["items"] = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $order;
    }

    public function adminMoveConfirmedToShipping($orderId, $adminId = null, $note = null)
    {
        $old = $this->find($orderId);

        if (!$old) {
            return ["success" => false, "message" => "Không tìm thấy đơn hàng"];
        }

        if ($old["order_status"] !== "confirmed") {
            return [
                "success" => false,
                "message" => "Admin chỉ được chuyển đơn từ confirmed sang shipping"
            ];
        }

        $this->conn->beginTransaction();

        try {
            $stmt = $this->conn->prepare("
                UPDATE orders
                SET order_status = 'shipping',
                    processed_by_admin_id = ?,
                    note = COALESCE(?, note)
                WHERE order_id = ?
            ");

            $stmt->execute([$adminId, $note, (int)$orderId]);

            $stmt = $this->conn->prepare("
                INSERT INTO order_status_history(
                    order_id, old_status, new_status, changed_by_admin_id, note
                )
                VALUES (?, 'confirmed', 'shipping', ?, ?)
            ");

            $stmt->execute([(int)$orderId, $adminId, $note]);

            $this->conn->commit();

            return [
                "success" => true,
                "message" => "Đã chuyển đơn sang shipping",
                "data" => $this->find($orderId)
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }
}