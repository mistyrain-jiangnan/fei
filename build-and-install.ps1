# 一键构建并安装 APK 到手机

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  一键构建并安装到手机" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 第一步: 构建 APK
Write-Host "正在构建 APK..." -ForegroundColor Yellow
Write-Host ""

& .\build-apk.ps1

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "构建失败,已终止安装" -ForegroundColor Red
    exit 1
}

# 第二步: 安装 APK
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "准备安装到手机..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

& .\install-apk.ps1
