@echo off
chcp 65001 > nul
cd /d "%~dp0frontend"
if not exist "node_modules" (
  echo Namestitev standardnih paketov React, Vite in Tailwind ...
  call npm install
  if errorlevel 1 (
    echo Namestitev ni uspela. Preverite internetno povezavo in Node.js.
    pause
    exit /b 1
  )
)
echo Odprite http://localhost:5173
call npm run dev
pause
