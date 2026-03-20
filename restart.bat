@echo off
setlocal enabledelayedexpansion

rem Restart script for production build.
rem Stops anything listening on the app port (default 3000) and starts dist/index.js.

cd /d "%~dp0"

rem Default port (can be overridden by setting PORT env var)
if "%PORT%"=="" set "PORT=3000"

if not exist dist\index.js (
  echo.
  echo === Building production (dist missing) ===
  call corepack pnpm build
  if errorlevel 1 (
    echo Build failed, aborting.
    exit /b 1
  )
)

echo.
echo === Stopping processes on port %PORT% ===
for /f "tokens=5" %%P in ('netstat -ano ^| findstr :%PORT%') do (
  taskkill /PID %%P /F >nul 2>&1
)

echo.
echo === Stopping leftover node/tsx processes from this project ===
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and ( ($_.Name -eq 'node.exe' -or $_.Name -eq 'tsx.exe') -and ( $_.CommandLine -like '*dist\index.js*' -or $_.CommandLine -like '*server\_core\index.ts*' -or $_.CommandLine -like '*tsx*server\_core\index.ts*' ) ) } | ForEach-Object { try { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue } catch {} }"

echo.
echo === Starting application ===
set "NODE_ENV=production"
node dist\index.js

