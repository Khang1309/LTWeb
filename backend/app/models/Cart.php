<?php

class Cart
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function getOrCreateCart($customerId)
    {
        $stmt = $this->conn->prepare("SELECT cart_id FROM carts WHERE customer_id = ?");
        $stmt->execute([$customerId]);

        $cart = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cart) {
            return (int)$cart["cart_id"];
        }

        $stmt = $this->conn->prepare("INSERT INTO carts (customer_id) VALUES (?)");
        $stmt->execute([$customerId]);

        return (int)$this->conn->lastInsertId();
    }

    public function getCartItems($customerId)
    {
        $cartId = $this->getOrCreateCart($customerId);

        $sql = "
            SELECT 
                ci.cart_item_id,
                ci.cart_id,
                ci.version_id,
                ci.quantity,
                p.product_id,
                p.product_name,
                p.brand,
                p.description,
                pv.sku,
                pv.version_name,
                pv.format_type,
                pv.language,
                pv.cover_type,
                pv.edition,
                pv.price,
                pv.stock_quantity,
                pv.image_url,
                pv.version_status,
                (pv.price * ci.quantity) AS subtotal
            FROM cart_items ci
            JOIN product_versions pv ON ci.version_id = pv.version_id
            JOIN products p ON pv.product_id = p.product_id
            WHERE ci.cart_id = ?
            ORDER BY ci.added_at DESC
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$cartId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function addItem($customerId, $versionId, $quantity = 1)
    {
        $cartId = $this->getOrCreateCart($customerId);

        $stmt = $this->conn->prepare("
            SELECT stock_quantity, version_status
            FROM product_versions
            WHERE version_id = ?
        ");
        $stmt->execute([$versionId]);

        $product = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$product) {
            throw new Exception("Sản phẩm không tồn tại");
        }

        if ($product["version_status"] !== "available") {
            throw new Exception("Sản phẩm hiện không khả dụng");
        }

        if ((int)$product["stock_quantity"] < (int)$quantity) {
            throw new Exception("Số lượng tồn kho không đủ");
        }

        $stmt = $this->conn->prepare("
            INSERT INTO cart_items (cart_id, version_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)
        ");

        return $stmt->execute([
            $cartId,
            $versionId,
            $quantity
        ]);
    }

    public function updateQuantity($customerId, $cartItemId, $quantity)
    {
        if ($quantity <= 0) {
            return $this->removeItem($customerId, $cartItemId);
        }

        $cartId = $this->getOrCreateCart($customerId);

        $stmt = $this->conn->prepare("
            UPDATE cart_items
            SET quantity = ?
            WHERE cart_item_id = ? AND cart_id = ?
        ");

        return $stmt->execute([
            $quantity,
            $cartItemId,
            $cartId
        ]);
    }

    public function removeItem($customerId, $cartItemId)
    {
        $cartId = $this->getOrCreateCart($customerId);

        $stmt = $this->conn->prepare("
            DELETE FROM cart_items
            WHERE cart_item_id = ? AND cart_id = ?
        ");

        return $stmt->execute([
            $cartItemId,
            $cartId
        ]);
    }

    public function clearCart($customerId)
    {
        $cartId = $this->getOrCreateCart($customerId);

        $stmt = $this->conn->prepare("
            DELETE FROM cart_items
            WHERE cart_id = ?
        ");

        return $stmt->execute([$cartId]);
    }
}