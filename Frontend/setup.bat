@echo off
REM BiznesAsh Frontend Setup Script for Windows

echo ============================================
echo BiznesAsh Frontend Installation
echo ============================================
echo.

echo Installing dependencies...
cd /d "%~dp0"

REM Clear npm cache
npm cache clean --force

REM Remove node_modules and package-lock
if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing old package-lock.json...
    del package-lock.json
)

REM Install dependencies
echo.
echo Running npm install...
call npm install --legacy-peer-deps

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ============================================
    echo ✓ Installation successful!
    echo ============================================
    echo.
    echo To start the development server, run:
    echo   npm run dev
    echo.
    echo The app will be available at:
    echo   http://localhost:5173
    echo.
    echo Make sure your backend is running on:
    echo   http://localhost:8080
    echo.
) else (
    echo.
    echo ✗ Installation failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)
