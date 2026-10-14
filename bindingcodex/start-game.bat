@echo off
REM ============================================================
REM  BINDING CODEX launcher — double-click this file to play.
REM  It starts a tiny local web server and opens your browser.
REM  To STOP the game: close this black window.
REM ============================================================
cd /d "%~dp0"
echo.
echo   Starting BINDING CODEX...
echo   Your browser will open in a moment.
echo.
echo   If the page says it can't connect, wait a second and
echo   press F5 to refresh.
echo.
echo   ****  To STOP the game, just close this window.  ****
echo.
REM Open the browser after a short delay, while the server boots.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:8001"
REM Try python, and if that name isn't found, fall back to the py launcher.
python -m http.server 8001 || py -m http.server 8001
pause
