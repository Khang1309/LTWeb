# LTWeb

## Setup project

### 1) Setup database config

Vào thư mục:

backend/config

Tạo file:

database.local.php

Nội dung:
 ```
<?php

$host = "127.0.0.1";
$dbname = "web";
$username = "root";
$password = "your_password";
```
Lưu ý:
- File này là config riêng cho từng máy
- Không push file này lên Git

--------------------------------------------------

### 2) Install frontend dependencies

Vào thư mục:

frontend

Chạy lệnh:

npm install

--------------------------------------------------

### 3) Run project

Quay về thư mục gốc project và chạy:

./start.bat