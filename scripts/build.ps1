using namespace System.Management.Automation
using namespace System.Management.Automation.Language

$orig = Get-Location
    try {
        # Kill backend if already running (silent)
        taskkill /F /IM XTracker.Api.exe >$null 2>&1

        # Backend thread
        Start-ThreadJob -Name "XTracker.Api" -ScriptBlock {
            Set-Location "C:\Users\brent\Code\XTrack\backend\XTracker.Api"
            dotnet run
        } | Out-Null

        # Frontend thread
        Start-ThreadJob -Name "XTracker.Web" -ScriptBlock {
            Set-Location "C:\Users\brent\Code\XTrack\frontend"
            npm run dev
        } | Out-Null

        # Continuously stream logs until you stop with Ctrl+C
        Write-Host "Backend + Frontend started. Streaming output... (Ctrl+C to stop)"
        Receive-Job -Name XTracker.Api,XTracker.Web -Wait 
    }
    finally {
        Set-Location $orig
    }