@echo off
echo ==============================================
echo Starting local server for OREON website
echo ==============================================
echo.

cd /d "%~dp0"

IF NOT EXIST "node_modules\" (
    echo [INFO] First run setup... Installing dependencies.
    echo Please wait 1-2 minutes while packages are downloaded...
    call npm install
    echo Setup complete!
)

echo [OK] Starting server... Opening browser.
echo.
echo NOTE: If the browser shows "Site cannot be reached" immediately,
echo please wait 5-10 seconds for the server to spin up and press F5 to refresh.
echo.

timeout /t 3 /nobreak >nul
start http://localhost:3000

call npm run dev

pause
