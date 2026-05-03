@echo off

start "Backend" cmd /k "cd backend\public && php -S localhost:8000 index.php"
timeout /t 1 >nul

start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 >nul

start "Admin" cmd /k "cd admin && php -S localhost:5500"
timeout /t 1 >nul

start http://localhost:5173
start http://localhost:5500

exit