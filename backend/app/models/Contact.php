<?php

class Contact {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function create($full_name, $email, $subject, $message) {
        $sql = "
            INSERT INTO contacts (full_name, email, subject, message)
            VALUES (?, ?, ?, ?)
        ";

        $stmt = $this->conn->prepare($sql);
        return $stmt->execute([$full_name, $email, $subject, $message]);
    }
}