@echo off
chcp 65001 >nul
cd /d "%~dp0"
if not exist "frontend\node_modules" (
  echo Najprej zazeni 1_NAMESTI.bat.
  pause
  exit /b 1
)
where node >nul 2>nul
if errorlevel 1 (
  echo NAPAKA: Node.js ni namescen.
  pause
  exit /b 1
)
start "Moj Projekt - backend" /D "%~dp0backend" cmd /k "npm start"
start "Moj Projekt - frontend" /D "%~dp0frontend" cmd /k "npm run dev"
echo Odpri http://localhost:5173 v brskalniku.
pause
