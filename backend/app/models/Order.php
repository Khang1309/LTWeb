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


    public function customerConfirmPayment($orderId, $customerId)
    {
        $order = $this->find($orderId);

        if (!$order) {
            return ["success" => false, "message" => "Không tìm thấy đơn hàng"];
        }

        if ((int)$order["customer_id"] !== (int)$customerId) {
            return ["success" => false, "message" => "Bạn không có quyền xử lý đơn hàng này"];
        }

        if ($order["order_status"] !== "pending") {
            return ["success" => false, "message" => "Chỉ có thể xác nhận thanh toán khi đơn đang pending"];
        }

        $this->conn->beginTransaction();

        try {
            foreach ($order["items"] as $item) {
                $stmt = $this->conn->prepare("
                    SELECT stock_quantity
                    FROM product_versions
                    WHERE version_id = ?
                    FOR UPDATE
                ");
                $stmt->execute([(int)$item["version_id"]]);

                $product = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$product) {
                    throw new Exception("Sản phẩm không tồn tại");
                }

                if ((int)$product["stock_quantity"] < (int)$item["quantity"]) {
                    throw new Exception("Sản phẩm " . $item["product_name_snapshot"] . " không đủ tồn kho");
                }

                $stmt = $this->conn->prepare("
                    UPDATE product_versions
                    SET stock_quantity = stock_quantity - ?
                    WHERE version_id = ?
                ");
                $stmt->execute([
                    (int)$item["quantity"],
                    (int)$item["version_id"]
                ]);
            }

            $stmt = $this->conn->prepare("
                UPDATE orders
                SET order_status = 'confirmed'
                WHERE order_id = ?
            ");
            $stmt->execute([(int)$orderId]);

            $stmt = $this->conn->prepare("
                UPDATE payments
                SET payment_status = 'paid',
                    paid_at = NOW()
                WHERE order_id = ?
            ");
            $stmt->execute([(int)$orderId]);

            $stmt = $this->conn->prepare("
                INSERT INTO order_status_history(
                    order_id, old_status, new_status, changed_by_admin_id, note
                )
                VALUES (?, 'pending', 'confirmed', NULL, ?)
            ");
            $stmt->execute([
                (int)$orderId,
                "Customer confirmed payment"
            ]);

            $this->conn->commit();

            return [
                "success" => true,
                "message" => "Xác nhận thanh toán thành công",
                "data" => $this->find($orderId)
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function customerCancelPendingOrder($orderId, $customerId, $note = null)
    {
        $order = $this->find($orderId);

        if (!$order) {
            return ["success" => false, "message" => "Không tìm thấy đơn hàng"];
        }

        if ((int)$order["customer_id"] !== (int)$customerId) {
            return ["success" => false, "message" => "Bạn không có quyền hủy đơn hàng này"];
        }

        if ($order["order_status"] !== "pending") {
            return ["success" => false, "message" => "Chỉ có thể hủy đơn khi đơn đang pending"];
        }

        $this->conn->beginTransaction();

        try {
            $stmt = $this->conn->prepare("
                UPDATE orders
                SET order_status = 'cancelled',
                    note = COALESCE(?, note)
                WHERE order_id = ?
            ");
            $stmt->execute([$note, (int)$orderId]);

            $stmt = $this->conn->prepare("
                UPDATE payments
                SET payment_status = 'failed'
                WHERE order_id = ?
            ");
            $stmt->execute([(int)$orderId]);

            $stmt = $this->conn->prepare("
                INSERT INTO order_status_history(
                    order_id, old_status, new_status, changed_by_admin_id, note
                )
                VALUES (?, 'pending', 'cancelled', NULL, ?)
            ");
            $stmt->execute([
                (int)$orderId,
                $note ?: "Customer cancelled order"
            ]);

            $this->conn->commit();

            return [
                "success" => true,
                "message" => "Đã hủy đơn hàng",
                "data" => $this->find($orderId)
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function customerConfirmDelivered($orderId, $customerId)
    {
        $order = $this->find($orderId);

        if (!$order) {
            return ["success" => false, "message" => "Không tìm thấy đơn hàng"];
        }

        if ((int)$order["customer_id"] !== (int)$customerId) {
            return ["success" => false, "message" => "Bạn không có quyền xác nhận đơn hàng này"];
        }

        if ($order["order_status"] !== "shipping") {
            return ["success" => false, "message" => "Chỉ có thể xác nhận đã nhận khi đơn đang shipping"];
        }

        $this->conn->beginTransaction();

        try {
            $stmt = $this->conn->prepare("
                UPDATE orders
                SET order_status = 'delivered'
                WHERE order_id = ?
            ");
            $stmt->execute([(int)$orderId]);

            $stmt = $this->conn->prepare("
                INSERT INTO order_status_history(
                    order_id, old_status, new_status, changed_by_admin_id, note
                )
                VALUES (?, 'shipping', 'delivered', NULL, ?)
            ");
            $stmt->execute([
                (int)$orderId,
                "Customer confirmed delivery"
            ]);

            $this->conn->commit();

            return [
                "success" => true,
                "message" => "Đã xác nhận nhận hàng",
                "data" => $this->find($orderId)
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }


    public function createFromCart($customerId, $paymentMethod = "cod", $note = null)
    {
        $this->conn->beginTransaction();

        try {
            $stmt = $this->conn->prepare("
                SELECT 
                    c.cart_id,
                    ci.version_id,
                    ci.quantity,
                    p.product_name,
                    pv.version_name,
                    pv.price,
                    pv.stock_quantity,
                    pv.version_status
                FROM carts c
                JOIN cart_items ci ON c.cart_id = ci.cart_id
                JOIN product_versions pv ON ci.version_id = pv.version_id
                JOIN products p ON pv.product_id = p.product_id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($items) === 0) {
                return ["success" => false, "message" => "Giỏ hàng đang trống"];
            }

            foreach ($items as $item) {
                if ($item["version_status"] !== "available") {
                    return ["success" => false, "message" => "Có sản phẩm không khả dụng"];
                }

                if ((int)$item["stock_quantity"] < (int)$item["quantity"]) {
                    return ["success" => false, "message" => "Có sản phẩm không đủ tồn kho"];
                }
            }

            $stmt = $this->conn->prepare("
                SELECT 
                    u.full_name,
                    u.phone,
                    c.shipping_address,
                    c.receiver_name,
                    c.receiver_phone
                FROM customers c
                JOIN users u ON c.customer_id = u.user_id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);
            $customer = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$customer) {
                return ["success" => false, "message" => "Không tìm thấy khách hàng"];
            }

            $receiverName = $customer["receiver_name"] ?: $customer["full_name"];
            $receiverPhone = $customer["receiver_phone"] ?: $customer["phone"];
            $shippingAddress = $customer["shipping_address"];

            $total = 0;
            foreach ($items as $item) {
                $total += (float)$item["price"] * (int)$item["quantity"];
            }

            $stmt = $this->conn->prepare("
                INSERT INTO orders (
                    customer_id, order_status, shipping_address,
                    receiver_name, receiver_phone, total_amount, note
                )
                VALUES (?, 'pending', ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $customerId,
                $shippingAddress,
                $receiverName,
                $receiverPhone,
                $total,
                $note
            ]);

            $orderId = (int)$this->conn->lastInsertId();

            foreach ($items as $item) {
                $subtotal = (float)$item["price"] * (int)$item["quantity"];

                $stmt = $this->conn->prepare("
                    INSERT INTO order_items (
                        order_id, version_id, product_name_snapshot,
                        version_name_snapshot, unit_price, quantity, subtotal
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                ");
                $stmt->execute([
                    $orderId,
                    (int)$item["version_id"],
                    $item["product_name"],
                    $item["version_name"],
                    (float)$item["price"],
                    (int)$item["quantity"],
                    $subtotal
                ]);
            }

            $stmt = $this->conn->prepare("
                INSERT INTO payments (
                    order_id, payment_method, payment_status, amount
                )
                VALUES (?, ?, 'pending', ?)
            ");
            $stmt->execute([
                $orderId,
                $paymentMethod,
                $total
            ]);

            $stmt = $this->conn->prepare("
                INSERT INTO order_status_history (
                    order_id, old_status, new_status, changed_by_admin_id, note
                )
                VALUES (?, NULL, 'pending', NULL, ?)
            ");
            $stmt->execute([
                $orderId,
                "Order created from cart"
            ]);

            $stmt = $this->conn->prepare("
                DELETE ci
                FROM cart_items ci
                JOIN carts c ON ci.cart_id = c.cart_id
                WHERE c.customer_id = ?
            ");
            $stmt->execute([$customerId]);

            $this->conn->commit();

            return [
                "success" => true,
                "message" => "Tạo đơn hàng thành công",
                "data" => $this->find($orderId)
            ];
        } catch (Throwable $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function getByCustomerId($customerId)
    {
        $stmt = $this->conn->prepare("
            SELECT *
            FROM orders
            WHERE customer_id = ?
            ORDER BY created_at DESC
        ");
        $stmt->execute([$customerId]);

        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($orders as &$order) {
            $order["items"] = $this->getOrderItems((int)$order["order_id"]);
        }

        return $orders;
    }

    private function getOrderItems($orderId)
    {
        $stmt = $this->conn->prepare("
            SELECT *
            FROM order_items
            WHERE order_id = ?
        ");
        $stmt->execute([$orderId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}