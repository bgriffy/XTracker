using namespace System.Management.Automation
using namespace System.Management.Automation.Language

$orig = Get-Location
    try {

        # Start database in docker
        docker-compose up -d

        # Kill backend if already running (silent)
        taskkill /F /IM XTracker.Api.exe >$null 2>&1

        # Backend thread
        Start-ThreadJob -Name "XTracker.Api" -ScriptBlock {
            Set-Location "..\backend\XTracker.Api"
            dotnet run
        } | Out-Null

        # Check if frontend is already running on port 3000
        $frontendRunning = $false
        try {
            $connection = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet -WarningAction SilentlyContinue
            if ($connection) {
                Write-Host "Frontend already running on port 3000. Skipping frontend startup."
                $frontendRunning = $true
            }
        } catch {
            # Port check failed, assume not running
        }

        # Frontend thread (only if not already running)
        if (-not $frontendRunning) {
            Start-ThreadJob -Name "XTracker.Web" -ScriptBlock {
                Set-Location "..\frontend"
                npm run dev
            } | Out-Null
        }

        # Continuously stream logs until you stop with Ctrl+C
        if ($frontendRunning) {
            Write-Host "Backend started. Frontend already running. Streaming output... (Ctrl+C to stop)"
            Receive-Job -Name XTracker.Api -Wait
        } else {
            Write-Host "Backend + Frontend started. Streaming output... (Ctrl+C to stop)"
            Receive-Job -Name XTracker.Api,XTracker.Web -Wait
        } 
    }
    finally {
        Set-Location $orig
    }