# ==========================================
# EBKUST University Management System
# Stop All Servers Script
# ==========================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EBKUST University Management System  " -ForegroundColor Cyan
Write-Host "  Stopping All Servers...              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to get process using a port
function Get-ProcessOnPort {
    param($Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connection) {
            return $connection.OwningProcess
        }
    } catch {
        return $null
    }
    return $null
}

# Function to kill process by port
function Stop-ProcessOnPort {
    param(
        [int]$Port,
        [string]$ServerName
    )

    Write-Host "[$ServerName] Checking port $Port..." -ForegroundColor Yellow

    $processId = Get-ProcessOnPort -Port $Port

    if ($processId) {
        try {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "[$ServerName] Found process: $($process.ProcessName) (PID: $processId)" -ForegroundColor Gray
                Write-Host "[$ServerName] Stopping..." -ForegroundColor Yellow

                Stop-Process -Id $processId -Force -ErrorAction Stop
                Start-Sleep -Seconds 1

                # Verify process is stopped
                $stillRunning = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($stillRunning) {
                    Write-Host "[$ServerName] WARNING: Process still running, trying again..." -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Seconds 1
                }

                Write-Host "[$ServerName] Successfully stopped!" -ForegroundColor Green
                return $true
            }
        } catch {
            Write-Host "[$ServerName] Error stopping process: $_" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "[$ServerName] No process found on port $Port" -ForegroundColor Gray
        return $false
    }
}

# Stop Backend Server (Django on port 8000)
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Stopping Backend Server (Django)     " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$backendStopped = Stop-ProcessOnPort -Port 8000 -ServerName "BACKEND"

# Also kill any remaining Python processes (optional)
$pythonProcesses = Get-Process -Name python -ErrorAction SilentlyContinue
if ($pythonProcesses) {
    Write-Host ""
    Write-Host "[CLEANUP] Found $($pythonProcesses.Count) Python process(es) still running" -ForegroundColor Yellow
    $response = Read-Host "Do you want to kill all Python processes? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $pythonProcesses | Stop-Process -Force
        Write-Host "[CLEANUP] All Python processes stopped" -ForegroundColor Green
    }
}

# Stop Frontend Server (Next.js on port 3000)
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Stopping Frontend Server (Next.js)   " -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

$frontendStopped = Stop-ProcessOnPort -Port 3000 -ServerName "FRONTEND"

# Also kill any remaining Node processes (optional)
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host ""
    Write-Host "[CLEANUP] Found $($nodeProcesses.Count) Node.js process(es) still running" -ForegroundColor Yellow
    $response = Read-Host "Do you want to kill all Node.js processes? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        $nodeProcesses | Stop-Process -Force
        Write-Host "[CLEANUP] All Node.js processes stopped" -ForegroundColor Green
    }
}

# Summary
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Summary                              " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($backendStopped) {
    Write-Host "[BACKEND]  Stopped successfully" -ForegroundColor Green
} else {
    Write-Host "[BACKEND]  Was not running or already stopped" -ForegroundColor Gray
}

if ($frontendStopped) {
    Write-Host "[FRONTEND] Stopped successfully" -ForegroundColor Green
} else {
    Write-Host "[FRONTEND] Was not running or already stopped" -ForegroundColor Gray
}

Write-Host ""

# Verify ports are free
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Port Status                          " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$port8000 = Get-ProcessOnPort -Port 8000
$port3000 = Get-ProcessOnPort -Port 3000

if ($port8000) {
    Write-Host "[PORT 8000] Still in use (PID: $port8000)" -ForegroundColor Red
} else {
    Write-Host "[PORT 8000] Free" -ForegroundColor Green
}

if ($port3000) {
    Write-Host "[PORT 3000] Still in use (PID: $port3000)" -ForegroundColor Red
} else {
    Write-Host "[PORT 3000] Free" -ForegroundColor Green
}

Write-Host ""

if (-not $port8000 -and -not $port3000) {
    Write-Host "All servers stopped successfully!" -ForegroundColor Green
    Write-Host "You can now start servers again using .\START_SERVERS.ps1" -ForegroundColor White
} else {
    Write-Host "Some ports are still in use. You may need to manually kill the processes." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Manual commands:" -ForegroundColor White
    Write-Host "  Kill all Python: taskkill /F /IM python.exe" -ForegroundColor Gray
    Write-Host "  Kill all Node.js: taskkill /F /IM node.exe" -ForegroundColor Gray
}

Write-Host ""
