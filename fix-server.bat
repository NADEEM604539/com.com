@echo off
echo ===================================
echo E-Commerce Server Error Fixer
echo ===================================

echo Checking MySQL service...
net start MySQL

echo.
echo Starting MySQL if not running...
net start MySQL 2>NUL

echo.
echo Creating uploads directory if not exists...
mkdir frontend\public\uploads 2>NUL

echo.
echo Starting backend server...
start cmd /k "node server.js"

echo.
echo Starting frontend server...
start cmd /k "cd frontend && npm start"

echo.
echo ===================================
echo Servers should now be starting!
echo.
echo If you still see server errors:
echo 1. Make sure MySQL is running (port 3306)
echo 2. Check your .env file has the correct database settings:
echo    - DB_HOST=localhost
echo    - DB_USER=root 
echo    - DB_PASSWORD=[your password]
echo    - DB_NAME=ecommerce_db
echo ===================================
pause 