<?php

class User
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function findByEmailOrPhone($identifier)
    {
        $sql = "SELECT * FROM users WHERE email = :identifier OR phone = :identifier LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            ":identifier" => $identifier
        ]);

        return $stmt->fetch();
    }

    public function emailExists($email)
    {
        $sql = "SELECT user_id FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([":email" => $email]);

        return $stmt->fetch() ? true : false;
    }

    public function createCustomer($data)
    {
        $this->conn->beginTransaction();

        try {
            $sqlUser = "INSERT INTO users 
                (full_name, email, password_hash, phone)
                VALUES 
                (:full_name, :email, :password_hash, :phone)";

            $stmtUser = $this->conn->prepare($sqlUser);
            $stmtUser->execute([
                ":full_name" => $data["full_name"],
                ":email" => $data["email"],
                ":password_hash" => password_hash($data["password"], PASSWORD_DEFAULT),
                ":phone" => $data["phone"]
            ]);

            $userId = $this->conn->lastInsertId();

            $sqlCustomer = "INSERT INTO customers
                (customer_id, shipping_address, receiver_name, receiver_phone, customer_status)
                VALUES
                (:customer_id, :shipping_address, :receiver_name, :receiver_phone, 1)";

            $stmtCustomer = $this->conn->prepare($sqlCustomer);
            $stmtCustomer->execute([
                ":customer_id" => $userId,
                ":shipping_address" => $data["shipping_address"],
                ":receiver_name" => $data["receiver_name"] ?? $data["full_name"],
                ":receiver_phone" => $data["receiver_phone"] ?? $data["phone"]
            ]);

            $this->conn->commit();

            return [
                "user_id" => $userId,
                "full_name" => $data["full_name"],
                "email" => $data["email"],
                "phone" => $data["phone"]
            ];

        } catch (Exception $e) {
            $this->conn->rollBack();
            throw $e;
        }
    }

    public function findCustomerById($user_id)
    {
        $sql = "
            SELECT 
                u.user_id,
                u.full_name,
                u.email,
                u.phone,
                u.created_at,
                u.updated_at,
                c.shipping_address,
                c.receiver_name,
                c.receiver_phone
            FROM users u
            INNER JOIN customers c ON u.user_id = c.customer_id
            WHERE u.user_id = ?
        ";

        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$user_id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateCustomerInfo($user_id, $data)
    {
        $sqlUser = "
            UPDATE users
            SET full_name = ?, phone = ?
            WHERE user_id = ?
        ";

        $stmtUser = $this->conn->prepare($sqlUser);
        $stmtUser->execute([
            $data["full_name"],
            $data["phone"],
            $user_id
        ]);

        $sqlCustomer = "
            UPDATE customers
            SET shipping_address = ?, receiver_name = ?, receiver_phone = ?
            WHERE customer_id = ?
        ";

        $stmtCustomer = $this->conn->prepare($sqlCustomer);
        return $stmtCustomer->execute([
            $data["shipping_address"],
            $data["receiver_name"],
            $data["receiver_phone"],
            $user_id
        ]);
    }

    public function findById($user_id)
    {
        $sql = "SELECT * FROM users WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([$user_id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updatePassword($user_id, $password_hash)
    {
        $sql = "UPDATE users SET password_hash = ? WHERE user_id = ?";
        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([$password_hash, $user_id]);
    }
}