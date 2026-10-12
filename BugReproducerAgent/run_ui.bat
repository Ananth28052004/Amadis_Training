@echo off
title Bug Reproducer Agent
color 0B
echo.
echo  ============================================================
echo  🤖  BUG REPRODUCER AGENT  --  Autonomous Bug Fixer
echo  ============================================================
echo  Paste any GitHub issue link and the agent will:
echo    1. Read the bug report
echo    2. Clone the repo into workspace/
echo    3. Auto-detect language and install dependencies
echo    4. Write a failing test to confirm the bug
echo    5. Diagnose and patch the root cause
echo    6. Verify the fix passes
echo    7. Show old buggy line vs new fixed line report
echo  ============================================================
echo.
echo  Supported: Python, Node.js, Java, Go, Rust, .NET
echo  Opening at: http://localhost:8501
echo.

REM Try activating local venv first
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo  Using local virtual environment.
) else (
    echo  No local venv found — using system Python.
)
echo.

REM Kill any existing Streamlit on 8501
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8501"') do (
    taskkill /pid %%a /F >nul 2>&1
)

REM Open browser after a short delay
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:8501"

REM Launch the app
streamlit run ui.py --server.port=8501 --server.headless=false --browser.gatherUsageStats=false

pause
