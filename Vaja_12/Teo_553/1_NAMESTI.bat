@echo off
chcp 65001 >nul
title Moj Projekt - namestitev
cd /d "%~dp0frontend"
where node >nul 2>nul
if errorlevel 1 (
  echo NAPAKA: Node.js ni namescen. Namesti ga z https://nodejs.org/
  pause
  exit /b 1
)
echo Namescanje paketov React, Vite in Tailwind CSS ...
call npm install
if errorlevel 1 (
  echo NAPAKA: Namestitev ni uspela. Preveri internet in Node.js.
  pause
  exit /b 1
)
echo.
echo Namestitev je koncana. Zdaj dvoklikni 2_ZAZENI.bat.
pause
