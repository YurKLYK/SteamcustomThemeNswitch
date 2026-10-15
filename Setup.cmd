@echo off
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0runtime\install.ps1"
if errorlevel 1 (
  echo Setup failed. Install Steam and Node.js 24 LTS, then try again.
  pause
  exit /b 1
)
echo Setup complete. Use the Switch Home for Steam desktop shortcut.
echo Enable this theme in CSSLoader Desktop before first use.
pause
