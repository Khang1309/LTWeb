<?php

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../app/controllers/AuthController.php";
require_once __DIR__ . "/../app/controllers/ContactController.php";
require_once __DIR__ . "/../app/controllers/CustomerController.php";

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];

$authController = new AuthController($conn);
$contactController = new ContactController($conn);
$customerController = new CustomerController($conn);

switch ($uri) {
    // ĐĂNG NHẬP VÀ ĐĂNG KÝ
    case "/api/login":
        if ($method === "POST") {
            $authController->login();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/register":
        if ($method === "POST") {
            $authController->register();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;
    // CHECK USER BI BAN CHUA
    case "/api/auth/check-status":
        if ($method === "GET") {
            $authController->checkStatus();
        } else {
            http_response_code(405);
            echo json_encode([
                "success" => false,
                "message" => "Method không hợp lệ"
            ]);
        }
        break;
    // CONTACT
    case "/api/contact":
        if ($method === "POST") {
            $contactController->createContact();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;
    
    // HIỂN THỊ VÀ CHỈNH SỬA THÔNG TIN NGƯỜI DÙNG
    case "/api/customer/info":
        if ($method === "GET") {
            $customerController->getInfo();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/customer/update":
        if ($method === "PUT") {
            $customerController->updateInfo();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/customer/change-password":
        if ($method === "PUT") {
            $customerController->changePassword();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    default:
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "API không tồn tại"
        ]);
        break;
}