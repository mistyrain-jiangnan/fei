# Android Build Quick Start

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  情侣甜蜜小工具 - Android 构建" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "步骤 1: 构建 Web 应用..." -ForegroundColor Yellow
pnpm build

if ($LASTEXITCODE -ne 0) {
    Write-Host "构建失败!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Web 应用构建成功" -ForegroundColor Green
Write-Host ""

Write-Host "步骤 2: 同步到 Android..." -ForegroundColor Yellow
npx cap sync android

if ($LASTEXITCODE -ne 0) {
    Write-Host "同步失败!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Android 同步成功" -ForegroundColor Green
Write-Host ""

Write-Host "步骤 3: 打开 Android Studio..." -ForegroundColor Yellow
npx cap open android

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  接下来在 Android Studio 中:" -ForegroundColor Cyan
Write-Host "  1. 等待 Gradle 同步完成" -ForegroundColor White
Write-Host "  2. 连接设备或启动模拟器" -ForegroundColor White
Write-Host "  3. 点击运行按钮 ▶️" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
