@echo off
echo Restoring dependencies...
dotnet restore NoShowIQ.API\NoShowIQ.API.csproj

echo.
echo Building project...
dotnet build NoShowIQ.API\NoShowIQ.API.csproj --no-restore

echo.
echo Running NoShowIQ API...
echo API will be available at http://localhost:5031 (or similar port)
dotnet run --project NoShowIQ.API\NoShowIQ.API.csproj --no-build
pause
