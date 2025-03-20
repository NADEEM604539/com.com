Write-Host "====================================" -ForegroundColor Green
Write-Host "E-Commerce Application Starter" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Ensure uploads folder exists
Write-Host "Checking uploads folder..." -ForegroundColor Yellow
if (-not (Test-Path -Path "frontend\public\uploads")) {
    New-Item -Path "frontend\public\uploads" -ItemType Directory -Force
    Write-Host "Created uploads folder" -ForegroundColor Green
} else {
    Write-Host "Uploads folder exists" -ForegroundColor Green
}

# Check MySQL service if on Windows
if ($IsWindows -or $env:OS -match "Windows") {
    Write-Host "Checking MySQL service..." -ForegroundColor Yellow
    $mysqlService = Get-Service -Name "*mysql*" -ErrorAction SilentlyContinue
    if ($mysqlService) {
        if ($mysqlService.Status -ne "Running") {
            Write-Host "Starting MySQL service..." -ForegroundColor Yellow
            Start-Service -Name $mysqlService.Name
        }
        Write-Host "MySQL service is running" -ForegroundColor Green
    } else {
        Write-Host "MySQL service not found. Make sure MySQL is installed." -ForegroundColor Red
        Write-Host "Check that your .env file has correct database settings" -ForegroundColor Yellow
    }
}

# Start backend server
Write-Host "Starting backend server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c node server.js" -WorkingDirectory (Get-Location).Path

# Wait a moment for backend to initialize
Start-Sleep -Seconds 2

# Start frontend server
Write-Host "Starting frontend server..." -ForegroundColor Yellow
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm start" -WorkingDirectory (Join-Path -Path (Get-Location).Path -ChildPath "frontend")

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "Servers are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 