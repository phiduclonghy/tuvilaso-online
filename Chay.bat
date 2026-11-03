@echo off
chcp 65001 >nul
title Tử Vi Đẩu Số - Chay
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo [LOI] Chua cai Node.js. Hay tai tu https://nodejs.org roi cai lai.
    pause
    exit /b 1
)

if not exist node_modules (
    echo Lan dau chay - dang cai thu vien (co the mat vai phut)...
    call npm install
    if errorlevel 1 (
        echo [LOI] npm install that bai.
        pause
        exit /b 1
    )
)

echo Dang khoi dong server...
start "" http://localhost:3000
call npm run dev
pause
