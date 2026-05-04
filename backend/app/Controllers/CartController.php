<?php

require_once __DIR__ . "/../models/Cart.php";

class CartController
{
    private $model;

    public function __construct($conn)
    {
        $this->model = new Cart($conn);
    }

    private function response($success, $message, $data = null)
    {
        echo json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }

    private function getBody()
    {
        return json_decode(file_get_contents("php://input"), true) ?? [];
    }

    public function list()
    {
        $customerId = $_GET["customer_id"] ?? null;

        if (!$customerId) {
            $this->response(false, "Thiếu customer_id");
        }

        try {
            $items = $this->model->getCartItems((int)$customerId);

            $total = 0;
            foreach ($items as $item) {
                $total += (float)$item["subtotal"];
            }

            $this->response(true, "Lấy giỏ hàng thành công", [
                "items" => $items,
                "total_amount" => $total
            ]);
        } catch (Exception $e) {
            $this->response(false, $e->getMessage());
        }
    }

    public function add()
    {
        $body = $this->getBody();

        $customerId = $body["customer_id"] ?? null;
        $versionId = $body["version_id"] ?? null;
        $quantity = $body["quantity"] ?? 1;

        if (!$customerId || !$versionId) {
            $this->response(false, "Thiếu customer_id hoặc version_id");
        }

        try {
            $this->model->addItem((int)$customerId, (int)$versionId, (int)$quantity);
            $this->response(true, "Đã thêm vào giỏ hàng");
        } catch (Exception $e) {
            $this->response(false, $e->getMessage());
        }
    }

    public function update()
    {
        $body = $this->getBody();

        $customerId = $body["customer_id"] ?? null;
        $cartItemId = $body["cart_item_id"] ?? null;
        $quantity = $body["quantity"] ?? null;

        if (!$customerId || !$cartItemId || $quantity === null) {
            $this->response(false, "Thiếu dữ liệu cập nhật");
        }

        try {
            $this->model->updateQuantity((int)$customerId, (int)$cartItemId, (int)$quantity);
            $this->response(true, "Cập nhật giỏ hàng thành công");
        } catch (Exception $e) {
            $this->response(false, $e->getMessage());
        }
    }

    public function remove()
    {
        $body = $this->getBody();

        $customerId = $body["customer_id"] ?? null;
        $cartItemId = $body["cart_item_id"] ?? null;

        if (!$customerId || !$cartItemId) {
            $this->response(false, "Thiếu dữ liệu xóa");
        }

        try {
            $this->model->removeItem((int)$customerId, (int)$cartItemId);
            $this->response(true, "Đã xóa sản phẩm khỏi giỏ hàng");
        } catch (Exception $e) {
            $this->response(false, $e->getMessage());
        }
    }

    public function clear()
    {
        $body = $this->getBody();

        $customerId = $body["customer_id"] ?? null;

        if (!$customerId) {
            $this->response(false, "Thiếu customer_id");
        }

        try {
            $this->model->clearCart((int)$customerId);
            $this->response(true, "Đã xóa toàn bộ giỏ hàng");
        } catch (Exception $e) {
            $this->response(false, $e->getMessage());
        }
    }
}