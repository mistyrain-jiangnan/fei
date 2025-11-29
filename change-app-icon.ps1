# 更换应用图标并重新构建 APK

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  更换应用图标" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "步骤 1: 生成图标文件" -ForegroundColor Yellow
Write-Host "已在浏览器中打开图标生成器" -ForegroundColor Gray
Write-Host ""
Write-Host "请在浏览器中:" -ForegroundColor Cyan
Write-Host "  1. 查看生成的图标预览" -ForegroundColor White
Write-Host "  2. 点击 '下载所有图标' 按钮" -ForegroundColor White
Write-Host "  3. 图标将保存到下载文件夹" -ForegroundColor White
Write-Host ""

# 打开图标生成器
Start-Process "file:///G:/fei/generate-app-icon.html"

Write-Host "按任意键继续 (下载完成后)..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "步骤 2: 复制图标文件" -ForegroundColor Yellow

# 检查下载文件夹中的图标
$downloadFolder = "$env:USERPROFILE\Downloads"
$iconFiles = @(
    @{ file = "ic_launcher_48.png"; target = "mipmap-mdpi" },
    @{ file = "ic_launcher_72.png"; target = "mipmap-hdpi" },
    @{ file = "ic_launcher_96.png"; target = "mipmap-xhdpi" },
    @{ file = "ic_launcher_144.png"; target = "mipmap-xxhdpi" },
    @{ file = "ic_launcher_192.png"; target = "mipmap-xxxhdpi" }
)

$allFound = $true
foreach ($icon in $iconFiles) {
    $sourcePath = Join-Path $downloadFolder $icon.file
    if (-not (Test-Path $sourcePath)) {
        Write-Host "[!] 未找到: $($icon.file)" -ForegroundColor Red
        $allFound = $false
    }
}

if (-not $allFound) {
    Write-Host ""
    Write-Host "请确保已下载所有图标文件到下载文件夹" -ForegroundColor Red
    Write-Host "下载文件夹: $downloadFolder" -ForegroundColor Gray
    exit 1
}

Write-Host "[OK] 所有图标文件已找到" -ForegroundColor Green
Write-Host ""

# 复制图标文件
foreach ($icon in $iconFiles) {
    $sourcePath = Join-Path $downloadFolder $icon.file
    $targetDir = "G:\fei\android\app\src\main\res\$($icon.target)"
    $targetPath = Join-Path $targetDir "ic_launcher.png"
    
    # 创建目标目录(如果不存在)
    if (-not (Test-Path $targetDir)) {
        New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    
    # 复制文件
    Copy-Item -Path $sourcePath -Destination $targetPath -Force
    Write-Host "[OK] 已复制: $($icon.target)/ic_launcher.png" -ForegroundColor Green
}

Write-Host ""
Write-Host "步骤 3: 重新构建 APK" -ForegroundColor Yellow
Write-Host "正在构建新的 APK..." -ForegroundColor Gray
Write-Host ""

# 重新构建 APK
& ".\build-apk.ps1"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "==================================" -ForegroundColor Green
    Write-Host "  图标更换成功!" -ForegroundColor Green
    Write-Host "==================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "新的 APK 已使用粉色爱心图标 💖" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "APK 位置:" -ForegroundColor Yellow
    Write-Host "  G:\fei\android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "构建失败,请检查错误信息" -ForegroundColor Red
}
