<?php

require_once __DIR__ . "/../models/Order.php";

class OrderController
{
    private $model;

    public function __construct($conn)
    {
        $this->model = new Order($conn);
    }

    private function json($success, $message, $data = null, $code = 200)
    {
        http_response_code($code);
        echo json_encode([
            "success" => $success,
            "message" => $message,
            "data" => $data
        ], JSON_UNESCAPED_UNICODE);
    }

    private function body()
    {
        return json_decode(file_get_contents("php://input"), true) ?? [];
    }

    public function index()
    {
        try {
            $q = $_GET["q"] ?? "";
            $page = $_GET["page"] ?? 1;
            $limit = $_GET["limit"] ?? 10;

            $this->json(true, "Lấy danh sách đơn hàng thành công", $this->model->getAll($q, $page, $limit));
        } catch (Throwable $e) {
            $this->json(false, $e->getMessage(), null, 500);
        }
    }

    public function show($id)
    {
        try {
            $order = $this->model->find($id);

            if (!$order) {
                return $this->json(false, "Không tìm thấy đơn hàng", null, 404);
            }

            $this->json(true, "Lấy chi tiết đơn hàng thành công", $order);
        } catch (Throwable $e) {
            $this->json(false, $e->getMessage(), null, 500);
        }
    }

    public function moveToShipping($id)
    {
        try {
            $data = $this->body();

            $adminId = $data["admin_id"] ?? null;
            $note = $data["note"] ?? null;

            $result = $this->model->adminMoveConfirmedToShipping($id, $adminId, $note);

            if (!$result["success"]) {
                return $this->json(false, $result["message"], null, 422);
            }

            $this->json(true, $result["message"], $result["data"]);
        } catch (Throwable $e) {
            $this->json(false, $e->getMessage(), null, 500);
        }
    }
}