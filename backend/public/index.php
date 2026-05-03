<?php

$allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5500",
];

$origin = $_SERVER["HTTP_ORIGIN"] ?? "";

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");


if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);

    if (str_starts_with($uri, "/uploads/")) {
        $filePath = __DIR__ . $uri;

        if (is_file($filePath)) {
            return false;
        }
    }
}

require_once __DIR__ . "/../config/database.php";
require_once __DIR__ . "/../app/controllers/AuthController.php";
require_once __DIR__ . "/../app/controllers/ContactController.php";
require_once __DIR__ . "/../app/controllers/CustomerController.php";
require_once __DIR__ . "/../app/controllers/AdminController.php";
require_once __DIR__ . "/../app/controllers/ProductController.php";
require_once __DIR__ . "/../app/controllers/OrderController.php";

$uri = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);
$method = $_SERVER["REQUEST_METHOD"];

$authController = new AuthController($conn);
$contactController = new ContactController($conn);
$customerController = new CustomerController($conn);
$adminController = new AdminController($conn);
$productController = new ProductController($conn);
$orderController = new OrderController($conn);

switch ($uri) {
    // CUSTOMER LOGIN
    case "/api/customer/login":
        if ($method === "POST") {
            $authController->loginCustomer();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    // ADMIN LOGIN, thông tin và chỉnh sửa
    case "/api/admin/login":
        if ($method === "POST") {
            $authController->loginAdmin();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/admin/info":
        if ($method === "GET") {
            $adminController->getInfo();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/admin/update":
        if ($method === "PUT") {
            $adminController->updateInfo();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/admin/change-password":
        if ($method === "PUT") {
            $adminController->changePassword();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    // REGISTER CUSTOMER
    case "/api/register":
        if ($method === "POST") {
            $authController->register();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    // CHECK USER BỊ BAN CHƯA
    case "/api/auth/check-status":
        if ($method === "GET") {
            $authController->checkStatus();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;
    // BAN VA UNBAN
    case "/api/admin/customers":
        if ($method === "GET") {
            $customerController->getAllCustomersForAdmin();
        }
        break;

    case "/api/admin/customers/status":
        if ($method === "PUT") {
            $customerController->updateCustomerStatus();
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

    // CUSTOMER INFO
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

   // PRODUCTS
    case "/api/products":
        if ($method === "GET") {
            $productController->index();
        } elseif ($method === "POST") {
            $productController->store();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/products/detail":
        if ($method === "GET") {
            $id = $_GET["id"] ?? 0;
            $productController->show($id);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/products/update":
        if ($method === "PUT") {
            $id = $_GET["id"] ?? 0;
            $productController->update($id);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/products/delete":
        if ($method === "DELETE") {
            $id = $_GET["id"] ?? 0;
            $productController->destroy($id);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/products/upload-image":
        if ($method === "POST") {
            $productController->uploadImage();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    // ORDERS
    case "/api/orders":
        if ($method === "GET") {
            $orderController->index();
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/orders/detail":
        if ($method === "GET") {
            $id = $_GET["id"] ?? 0;
            $orderController->show($id);
        } else {
            http_response_code(405);
            echo json_encode(["success" => false, "message" => "Method không hợp lệ"]);
        }
        break;

    case "/api/orders/move-to-shipping":
        if ($method === "PUT") {
            $id = $_GET["id"] ?? 0;
            $orderController->moveToShipping($id);
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