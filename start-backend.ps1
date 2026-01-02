Write-Host "Starting Noosh Tuft Backend Server..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

Set-Location server
python -m uvicorn api.main:app --reload --host 127.0.0.1 --port 8000
