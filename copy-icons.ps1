# Copy App Icons from Downloads to Android Project

Write-Host "================================" -ForegroundColor Cyan
Write-Host "  Copy App Icons" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$downloadFolder = "$env:USERPROFILE\Downloads"

# Icon mappings
$icons = @(
    @{ source = "ic_launcher_48.png"; target = "mipmap-mdpi" },
    @{ source = "ic_launcher_72.png"; target = "mipmap-hdpi" },
    @{ source = "ic_launcher_96.png"; target = "mipmap-xhdpi" },
    @{ source = "ic_launcher_144.png"; target = "mipmap-xxhdpi" },
    @{ source = "ic_launcher_192.png"; target = "mipmap-xxxhdpi" }
)

# Check if all icons exist
$allFound = $true
foreach ($icon in $icons) {
    $sourcePath = Join-Path $downloadFolder $icon.source
    if (-not (Test-Path $sourcePath)) {
        Write-Host "[X] Not found: $($icon.source)" -ForegroundColor Red
        $allFound = $false
    } else {
        Write-Host "[OK] Found: $($icon.source)" -ForegroundColor Green
    }
}

if (-not $allFound) {
    Write-Host "" -ForegroundColor Red
    Write-Host "Please download all icon files first!" -ForegroundColor Red
    Write-Host "1. Open: file:///G:/fei/generate-app-icon.html" -ForegroundColor Yellow
    Write-Host "2. Click 'Download All Icons' button" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Copying icons..." -ForegroundColor Yellow

# Copy each icon
foreach ($icon in $icons) {
    $sourcePath = Join-Path $downloadFolder $icon.source
    $targetDir = "G:\fei\android\app\src\main\res\$($icon.target)"
    $targetPath = Join-Path $targetDir "ic_launcher.png"
    
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    Copy-Item -Path $sourcePath -Destination $targetPath -Force
    Write-Host "[OK] Copied to: $($icon.target)/ic_launcher.png" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Icons Copied Successfully!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Build APK" -ForegroundColor Yellow
Write-Host "Run: .\build-apk.ps1" -ForegroundColor Cyan
