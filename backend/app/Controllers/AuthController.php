<?php

require_once __DIR__ . "/../services/AuthService.php";
require_once __DIR__ . "/../helpers/ResponseHelper.php";

class AuthController
{
    private $authService;

    public function __construct($conn)
    {
        $this->authService = new AuthService($conn);
    }

    public function login()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $identifier = $data["identifier"] ?? "";
            $password = $data["password"] ?? "";

            $user = $this->authService->login($identifier, $password);

            ResponseHelper::success($user, "Đăng nhập thành công");

        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }


    public function loginCustomer()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $identifier = $data["identifier"] ?? "";
            $password = $data["password"] ?? "";

            $user = $this->authService->loginCustomer($identifier, $password);

            ResponseHelper::success($user, "Đăng nhập customer thành công");
        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }

    public function loginAdmin()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $identifier = $data["identifier"] ?? "";
            $password = $data["password"] ?? "";

            $user = $this->authService->loginAdmin($identifier, $password);

            ResponseHelper::success($user, "Đăng nhập admin thành công");
        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }

    public function register()
    {
        try {
            $data = json_decode(file_get_contents("php://input"), true);

            $user = $this->authService->register($data);

            ResponseHelper::success($user, "Đăng ký thành công");

        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }

    public function checkStatus()
    {
        try {
            $userId = $_GET["user_id"] ?? null;

            $result = $this->authService->checkStatus($userId);

            ResponseHelper::success($result, "OK");
        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }

    public function getAdminProfile()
    {
        try {
            $adminId = $_GET["admin_id"] ?? null;

            $admin = $this->authService->getAdminProfile($adminId);

            ResponseHelper::success($admin, "Lấy thông tin admin thành công");
        } catch (Exception $e) {
            ResponseHelper::error($e->getMessage(), 400);
        }
    }
}