@echo off
echo ========================================
echo NoShowIQ Vercel Deployment Helper
echo ========================================
echo.
echo Step 1: Opening Vercel Dashboard...
start https://vercel.com/dashboard
timeout /t 3 >nul
echo.
echo Step 2: Opening your GitHub repository...
start https://github.com/Raphasha27/noshowiq-fullstack
timeout /t 3 >nul
echo.
echo Step 3: Opening your deployment URL...
start https://noshowiq-fullstack.vercel.app
echo.
echo ========================================
echo NEXT STEPS TO FIX DEPLOYMENT:
echo ========================================
echo.
echo 1. In Vercel Dashboard:
echo    - Click on 'noshowiq-fullstack' project
echo    - Go to 'Deployments' tab
echo    - Check if latest deployment (18f2d1f) is building
echo.
echo 2. If NO deployment is shown:
echo    - Click 'Settings' at the top
echo    - Under 'Git', verify repository is connected
echo    - Click 'Redeploy' on any previous deployment
echo.
echo 3. If deployment FAILED:
echo    - Click on the failed deployment
echo    - Check the build logs for errors
echo    - Common fixes:
echo      * Verify package.json exists in root
echo      * Check node version (should be 18+)
echo.
echo ========================================
echo.
pause
