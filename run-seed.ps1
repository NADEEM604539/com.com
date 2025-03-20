Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Database Initialization Tool" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "This will reset your database and load all sample data."
Write-Host "All existing data will be lost!" -ForegroundColor Red
Write-Host ""
$confirmation = Read-Host "Are you sure you want to continue? (y/n)"

if ($confirmation -ne 'y') {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Ensure MySQL is running
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
        Write-Host "Continue anyway? This might fail if MySQL isn't available." -ForegroundColor Yellow
        $continue = Read-Host "(y/n)"
        if ($continue -ne 'y') {
            Write-Host "Operation cancelled." -ForegroundColor Yellow
            exit
        }
    }
}

# Run seed script
Write-Host "Initializing database..." -ForegroundColor Yellow
node database/seed.js

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Database initialization complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 