@echo off
echo ==========================================
echo   STARTING ZAIN-OS DEVELOPMENT CORE...
echo ==========================================
echo.
echo 1. Launching Vite local server in background terminal...
start cmd /k "npm run dev"
echo 2. Waiting for server initialization...
timeout /t 3 >nul
echo 3. Opening portfolio in default browser...
start http://localhost:5173/
echo.
echo ==========================================
echo   SYSTEM STABLE. LOGS ACTIVE.
echo ==========================================
exit
