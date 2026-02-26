@echo off
REM Peer Review Platform - Installation Script for Windows
REM This script installs all required dependencies

echo.
echo ========================================
echo Peer Review Platform - Setup
echo ========================================
echo.

REM Check if node_modules exists
if exist "node_modules" (
    echo node_modules already exists, skipping installation...
    echo.
    echo Attempting to start development server...
    echo.
    call npm run dev
) else (
    echo Installing dependencies...
    echo.
    
    REM Clear npm cache to prevent issues
    call npm cache clean --force
    echo.
    
    REM Remove old package-lock.json if it exists
    if exist "package-lock.json" (
        del package-lock.json
        echo Removed old package-lock.json
    )
    echo.
    
    REM Install dependencies
    call npm install
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo Installation completed successfully!
        echo ========================================
        echo.
        echo Starting development server...
        echo.
        call npm run dev
    ) else (
        echo.
        echo ========================================
        echo ERROR: Installation failed
        echo ========================================
        echo.
        echo Please try running these commands manually:
        echo 1. npm cache clean --force
        echo 2. npm install
        echo 3. npm run dev
        echo.
        pause
    )
)
