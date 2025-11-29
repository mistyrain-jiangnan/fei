# 自动安装 APK 到连接的 Android 设备

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  安装 APK 到 Android 设备" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$apkPath = "android\app\build\outputs\apk\debug\app-debug.apk"

# 检查 APK 是否存在
if (-not (Test-Path $apkPath)) {
    Write-Host "✗ 未找到 APK 文件!" -ForegroundColor Red
    Write-Host "请先运行: .\build-apk.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host "APK 文件: $apkPath" -ForegroundColor Gray
Write-Host ""

# 检查 ADB 是否可用
Write-Host "检查 ADB 工具..." -ForegroundColor Yellow
$adbCommand = Get-Command adb -ErrorAction SilentlyContinue

if (-not $adbCommand) {
    Write-Host "✗ 未找到 ADB 工具!" -ForegroundColor Red
    Write-Host ""
    Write-Host "请安装 Android SDK Platform Tools:" -ForegroundColor Yellow
    Write-Host "https://developer.android.com/tools/releases/platform-tools" -ForegroundColor White
    Write-Host ""
    Write-Host "或者使用其他方法安装:" -ForegroundColor Yellow
    Write-Host "1. 将 APK 文件传输到手机" -ForegroundColor White
    Write-Host "2. 在手机上打开文件管理器找到 APK" -ForegroundColor White
    Write-Host "3. 点击安装" -ForegroundColor White
    Write-Host ""
    Write-Host "APK 文件位置:" -ForegroundColor Cyan
    Write-Host "  $((Resolve-Path $apkPath).Path)" -ForegroundColor White
    Write-Host ""
    
    # 打开文件夹
    explorer.exe (Split-Path -Parent (Resolve-Path $apkPath))
    exit 1
}

Write-Host "✓ ADB 工具已找到" -ForegroundColor Green
Write-Host ""

# 检查连接的设备
Write-Host "检查连接的设备..." -ForegroundColor Yellow
$devices = adb devices | Select-String -Pattern "device$"

if ($devices.Count -eq 0) {
    Write-Host "✗ 未检测到连接的设备!" -ForegroundColor Red
    Write-Host ""
    Write-Host "请确保:" -ForegroundColor Yellow
    Write-Host "1. 手机已通过 USB 连接到电脑" -ForegroundColor White
    Write-Host "2. 手机已开启 USB 调试模式" -ForegroundColor White
    Write-Host "3. 在手机上允许了 USB 调试授权" -ForegroundColor White
    Write-Host ""
    Write-Host "如何开启 USB 调试:" -ForegroundColor Cyan
    Write-Host "1. 打开'设置' > '关于手机'" -ForegroundColor White
    Write-Host "2. 连续点击'版本号' 7 次启用开发者选项" -ForegroundColor White
    Write-Host "3. 返回'设置' > '系统' > '开发者选项'" -ForegroundColor White
    Write-Host "4. 开启'USB 调试'" -ForegroundColor White
    exit 1
}

Write-Host "✓ 检测到设备:" -ForegroundColor Green
adb devices
Write-Host ""

# 安装 APK
Write-Host "正在安装应用..." -ForegroundColor Yellow
adb install -r $apkPath

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "  ✓ 安装成功!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "应用名称: 情侣甜蜜小工具" -ForegroundColor Cyan
    Write-Host "包名: com.couple.sweettools" -ForegroundColor Gray
    Write-Host ""
    Write-Host "现在可以在手机上打开应用了!" -ForegroundColor Yellow
    
    # 询问是否启动应用
    Write-Host ""
    Write-Host "是否立即启动应用? (Y/N)" -ForegroundColor Yellow -NoNewline
    $response = Read-Host " "
    if ($response -eq 'Y' -or $response -eq 'y') {
        Write-Host ""
        Write-Host "正在启动应用..." -ForegroundColor Yellow
        adb shell am start -n com.couple.sweettools/.MainActivity
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ 应用已启动!" -ForegroundColor Green
        }
    }
} else {
    Write-Host ""
    Write-Host "✗ 安装失败!" -ForegroundColor Red
    Write-Host "请检查上方的错误信息" -ForegroundColor Yellow
}
