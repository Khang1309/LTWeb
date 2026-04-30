<?php

require_once __DIR__ . "/../models/User.php";

class AuthService
{
    private $conn;
    private $userModel;

    public function __construct($conn)
    {
        $this->conn = $conn;
        $this->userModel = new User($conn);
    }

    public function login($identifier, $password)
    {
        if (empty($identifier) || empty($password)) {
            throw new Exception("Vui lòng nhập đầy đủ thông tin");
        }

        $user = $this->userModel->findByEmailOrPhone($identifier);

        if (!$user) {
            throw new Exception("Tài khoản không tồn tại");
        }

        if (!password_verify($password, $user["password_hash"])) {
            throw new Exception("Mật khẩu không đúng");
        }

        // Nếu user là customer thì kiểm tra bị ban chưa
        $sqlCustomer = "SELECT customer_status FROM customers WHERE customer_id = ?";
        $stmtCustomer = $this->conn->prepare($sqlCustomer);
        $stmtCustomer->execute([$user["user_id"]]);
        $customer = $stmtCustomer->fetch(PDO::FETCH_ASSOC);

        if ($customer && (int)$customer["customer_status"] === 0) {
            throw new Exception("Tài khoản của bạn đã bị vô hiệu hóa");
        }

        // Check admin nếu không phải customer
        $sqlAdmin = "SELECT is_super_admin FROM admins WHERE admin_id = ?";
        $stmtAdmin = $this->conn->prepare($sqlAdmin);
        $stmtAdmin->execute([$user["user_id"]]);
        $admin = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

        unset($user["password_hash"]);

        if ($customer) {
            $user["role"] = "customer";
            $user["customer_status"] = (int)$customer["customer_status"];
        } elseif ($admin) {
            $user["role"] = "admin";
            $user["is_super_admin"] = (int)$admin["is_super_admin"];
        } else {
            $user["role"] = "unknown";
        }

        return $user;
    }

    public function register($data)
    {
        if (
            empty($data["full_name"]) ||
            empty($data["email"]) ||
            empty($data["password"]) ||
            empty($data["phone"]) ||
            empty($data["shipping_address"])
        ) {
            throw new Exception("Vui lòng nhập đầy đủ thông tin bắt buộc");
        }

        if (!filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
            throw new Exception("Email không hợp lệ");
        }

        if (!preg_match('/^0[0-9]{9}$/', $data["phone"])) {
            throw new Exception("Số điện thoại phải có 10 số và bắt đầu bằng 0");
        }

        if ($this->userModel->emailExists($data["email"])) {
            throw new Exception("Email đã tồn tại");
        }

        return $this->userModel->createCustomer($data);
    }

    public function checkStatus($userId)
    {
        if (!$userId) {
            throw new Exception("Thiếu user_id");
        }

        $sql = "SELECT customer_status FROM customers WHERE customer_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$userId]);
        $customer = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($customer && (int)$customer["customer_status"] === 0) {
            return [
                "active" => false
            ];
        }

        return [
            "active" => true
        ];
    }
}