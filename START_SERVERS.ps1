# ==========================================
# EBKUST University Management System
# Start All Servers Script
# ==========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EBKUST University Management System  " -ForegroundColor Cyan
Write-Host "  Starting All Servers...              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the project root directory
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"

# Check if directories exist
if (-not (Test-Path $BackendPath)) {
    Write-Host "[ERROR] Backend directory not found at: $BackendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $FrontendPath)) {
    Write-Host "[ERROR] Frontend directory not found at: $FrontendPath" -ForegroundColor Red
    exit 1
}

# Function to check if port is in use
function Test-Port {
    param($Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if ports are already in use
Write-Host "[CHECK] Checking if ports are available..." -ForegroundColor Yellow

if (Test-Port 8000) {
    Write-Host "[WARNING] Port 8000 is already in use (Backend)" -ForegroundColor Yellow
    Write-Host "          Please stop the existing server or use STOP_SERVERS.ps1" -ForegroundColor Yellow
    $response = Read-Host "Do you want to kill the existing process? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $process = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "[KILLED] Stopped process on port 8000" -ForegroundColor Green
            Start-Sleep -Seconds 2
        }
    } else {
        Write-Host "[ABORT] Please stop the existing server manually" -ForegroundColor Red
        exit 1
    }
}

if (Test-Port 3000) {
    Write-Host "[WARNING] Port 3000 is already in use (Frontend)" -ForegroundColor Yellow
    Write-Host "          Please stop the existing server or use STOP_SERVERS.ps1" -ForegroundColor Yellow
    $response = Read-Host "Do you want to kill the existing process? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $process = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
        if ($process) {
            Stop-Process -Id $process -Force
            Write-Host "[KILLED] Stopped process on port 3000" -ForegroundColor Green
            Start-Sleep -Seconds 2
        }
    } else {
        Write-Host "[ABORT] Please stop the existing server manually" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting Backend Server (Django)     " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Start Backend Server in new window
Write-Host "[BACKEND] Starting Django server on http://localhost:8000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host 'Django Backend Server' -ForegroundColor Green; Write-Host '=====================' -ForegroundColor Green; Write-Host ''; python manage.py runserver"

# Wait for backend to start
Write-Host "[BACKEND] Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check if backend started successfully
$backendStarted = Test-Port 8000
if ($backendStarted) {
    Write-Host "[SUCCESS] Backend server started successfully!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Backend server failed to start" -ForegroundColor Red
    Write-Host "        Check the backend terminal window for errors" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Starting Frontend Server (Next.js)   " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Start Frontend Server in new window
Write-Host "[FRONTEND] Starting Next.js server on http://localhost:3000" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host 'Next.js Frontend Server' -ForegroundColor Green; Write-Host '=======================' -ForegroundColor Green; Write-Host ''; npm run dev"

# Wait for frontend to start
Write-Host "[FRONTEND] Waiting for server to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check if frontend started successfully
$frontendStarted = Test-Port 3000
if ($frontendStarted) {
    Write-Host "[SUCCESS] Frontend server started successfully!" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Frontend server failed to start" -ForegroundColor Red
    Write-Host "        Check the frontend terminal window for errors" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Servers Status                       " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Display server status
if ($backendStarted) {
    Write-Host "[BACKEND]  Running  - http://localhost:8000" -ForegroundColor Green
    Write-Host "           API Docs - http://localhost:8000/api/docs" -ForegroundColor Gray
    Write-Host "           Admin    - http://localhost:8000/admin" -ForegroundColor Gray
} else {
    Write-Host "[BACKEND]  Failed to start" -ForegroundColor Red
}

Write-Host ""

if ($frontendStarted) {
    Write-Host "[FRONTEND] Running  - http://localhost:3000" -ForegroundColor Green
} else {
    Write-Host "[FRONTEND] Failed to start" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Instructions                         " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "- Two terminal windows have been opened (Backend & Frontend)" -ForegroundColor White
Write-Host "- To stop servers: Run .\STOP_SERVERS.ps1" -ForegroundColor White
Write-Host "- To stop manually: Press Ctrl+C in each terminal window" -ForegroundColor White
Write-Host ""
Write-Host "Ready! Open http://localhost:3000 in your browser" -ForegroundColor Green
Write-Host ""
