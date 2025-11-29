# Build Android APK
# Encoding: UTF-8

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Build Android APK" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Set JAVA_HOME - try Java 21 first, then 17
if (-not $env:JAVA_HOME) {
    $javaPaths = @(
        "C:\Program Files\Eclipse Adoptium\jdk-21.0.9.10-hotspot",
        "C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
    )
    foreach ($javaPath in $javaPaths) {
        if (Test-Path $javaPath) {
            Write-Host "Setting JAVA_HOME..." -ForegroundColor Yellow
            $env:JAVA_HOME = $javaPath
            $env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
            Write-Host "[OK] JAVA_HOME set to: $javaPath" -ForegroundColor Green
            break
        }
    }
}

# Verify Java
Write-Host "Checking Java installation..." -ForegroundColor Yellow
$javaVersion = & java -version 2>&1 | Select-Object -First 1
Write-Host "[OK] Java found: $javaVersion" -ForegroundColor Green
Write-Host ""

# Step 1: Build Web App
Write-Host "Step 1/3: Building Web App..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Web build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Web build successful" -ForegroundColor Green
Write-Host ""

# Step 2: Sync to Android
Write-Host "Step 2/3: Syncing to Android..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "[X] Sync failed!" -ForegroundColor Red
    exit 1
}
Write-Host "[OK] Sync successful" -ForegroundColor Green
Write-Host ""

# Step 3: Build APK
Write-Host "Step 3/3: Building Debug APK..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Gray
Write-Host ""

Push-Location android
.\gradlew.bat assembleDebug
$buildResult = $LASTEXITCODE
Pop-Location

if ($buildResult -ne 0) {
    Write-Host ""
    Write-Host "[X] APK build failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible causes:" -ForegroundColor Yellow
    Write-Host "1. JDK 17+ not installed" -ForegroundColor White
    Write-Host "2. Network issues downloading dependencies" -ForegroundColor White
    Write-Host "3. Android SDK not configured" -ForegroundColor White
    Write-Host ""
    Write-Host "Check error messages above" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Green
Write-Host "  APK Build Successful!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green
Write-Host ""

$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"
if (Test-Path $apkPath) {
    $apkSize = [math]::Round((Get-Item $apkPath).Length / 1MB, 2)
    $fullPath = (Resolve-Path $apkPath).Path
    
    Write-Host "APK Location:" -ForegroundColor Cyan
    Write-Host "  $fullPath" -ForegroundColor White
    Write-Host ""
    Write-Host "File Size: $apkSize MB" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "  How to Install on Phone:" -ForegroundColor Cyan
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Method 1: Using ADB (Recommended)" -ForegroundColor Yellow
    Write-Host "  1. Enable USB Debugging on phone" -ForegroundColor White
    Write-Host "  2. Connect phone to PC" -ForegroundColor White
    Write-Host "  3. Run: .\install-apk.ps1" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Method 2: File Transfer" -ForegroundColor Yellow
    Write-Host "  1. Copy APK to phone" -ForegroundColor White
    Write-Host "  2. Open file manager on phone" -ForegroundColor White
    Write-Host "  3. Tap APK file to install" -ForegroundColor White
    Write-Host "  4. Allow installation from unknown sources" -ForegroundColor White
    Write-Host ""
    Write-Host "Method 3: One-Click Install" -ForegroundColor Yellow
    Write-Host "  Run: .\build-and-install.ps1" -ForegroundColor Gray
    Write-Host ""
    
    # Ask to open folder
    Write-Host "Open APK folder? (Y/N): " -ForegroundColor Yellow -NoNewline
    $response = Read-Host
    if ($response -eq 'Y' -or $response -eq 'y' -or $response -eq '') {
        explorer.exe (Split-Path -Parent $fullPath)
    }
} else {
    Write-Host "Warning: APK file not found!" -ForegroundColor Red
}
