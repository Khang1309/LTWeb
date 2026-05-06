<?php

require_once __DIR__ . "/../models/Contact.php";

class ContactController
{
    private $contactModel;

    public function __construct($conn)
    {
        $this->contactModel = new Contact($conn);
    }

    public function createContact()
    {
        $data = json_decode(file_get_contents("php://input"), true);

        $full_name = trim($data["full_name"] ?? "");
        $email = trim($data["email"] ?? "");
        $subject = trim($data["subject"] ?? "");
        $message = trim($data["message"] ?? "");

        // check required
        if ($full_name === "" || $email === "" || $message === "") {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Vui lòng nhập đầy đủ họ tên, email và nội dung."
            ]);
            return;
        }

        // check full name
        if (strlen($full_name) < 2 || strlen($full_name) > 100) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Họ tên phải từ 2 đến 100 ký tự."
            ]);
            return;
        }

        // check email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Email không hợp lệ."
            ]);
            return;
        }

        // subject optional -> chỉ check nếu có nhập
        if ($subject !== "" && strlen($subject) > 150) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Chủ đề không được vượt quá 150 ký tự."
            ]);
            return;
        }

        // check message
        if (strlen($message) < 10) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Nội dung liên hệ phải có ít nhất 10 ký tự."
            ]);
            return;
        }

        // sanitize
        $full_name = htmlspecialchars($full_name, ENT_QUOTES, "UTF-8");
        $email = htmlspecialchars($email, ENT_QUOTES, "UTF-8");
        $subject = htmlspecialchars($subject, ENT_QUOTES, "UTF-8");
        $message = htmlspecialchars($message, ENT_QUOTES, "UTF-8");

        // insert
        $result = $this->contactModel->create(
            $full_name,
            $email,
            $subject === "" ? null : $subject,
            $message
        );

        if ($result) {
            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Gửi liên hệ thành công."
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => "Không thể gửi liên hệ."
            ]);
        }
    }
}