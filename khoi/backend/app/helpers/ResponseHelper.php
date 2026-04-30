<?php

class ResponseHelper
{
    public static function success($data = null, $message = "Success")
    {
        echo json_encode([
            "success" => true,
            "message" => $message,
            "data" => $data
        ]);
        exit;
    }

    public static function error($message = "Error", $code = 400)
    {
        http_response_code($code);

        echo json_encode([
            "success" => false,
            "message" => $message
        ]);
        exit;
    }
}