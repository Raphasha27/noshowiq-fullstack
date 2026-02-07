@echo off
echo ===========================================
echo   NoShowIQ - Universal Start Script
echo ===========================================
echo.
echo Select start mode:
echo 1. Run FULL APP in Docker (Best for clean setup, requires Docker Desktop)
echo 2. Run API Locally (.NET 8 required)
echo 3. Run Frontend Locally (Node.js required)
echo.
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" goto docker
if "%choice%"=="2" goto local_api
if "%choice%"=="3" goto local_frontend

:docker
echo Starting all services with Docker Compose...
docker-compose up --build
goto end

:local_api
echo Restoring dependencies...
dotnet restore NoShowIQ.API\NoShowIQ.API.csproj
echo Building project...
dotnet build NoShowIQ.API\NoShowIQ.API.csproj --no-restore
echo Running NoShowIQ API...
echo API URL: http://localhost:5000
dotnet run --project NoShowIQ.API\NoShowIQ.API.csproj --urls=http://localhost:5000
goto end

:local_frontend
echo Starting Frontend...
npm run dev
goto end

:end
pause
