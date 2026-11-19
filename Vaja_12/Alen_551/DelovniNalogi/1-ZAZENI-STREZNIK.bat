@echo off
chcp 65001 > nul
cd /d "%~dp0backend"
echo Strežnik bo dosegljiv na http://localhost:3001
node server.js
pause
