# 配置 Android SDK - 快速指南

## 第一步:启动 Android Studio 并设置 SDK

### 1. 启动 Android Studio

在开始菜单搜索 "Android Studio" 并打开

### 2. 首次设置向导

当 Android Studio 首次启动时:

1. **欢迎界面** → 点击 "Next"
2. **安装类型** → 选择 "Standard" (推荐)
3. **UI 主题** → 选择您喜欢的主题
4. **验证设置** → 点击 "Next"
5. **许可协议** → 接受所有协议
6. **下载组件** → 等待下载完成 (约 1-2 GB,需要 10-15 分钟)

### 3. 查找 SDK 路径

设置完成后:

**方法 A - 从欢迎界面:**
1. 点击右下角 "Customize"
2. 点击 "All settings..."
3. 展开 "Languages & Frameworks" → "Android SDK"
4. 查看 "Android SDK Location" (通常是 `C:\Users\你的用户名\AppData\Local\Android\Sdk`)

**方法 B - 如果已经打开项目:**
1. File → Settings (或 Ctrl+Alt+S)
2. Appearance & Behavior → System Settings → Android SDK
3. 查看顶部的 "Android SDK Location"

---

## 第二步:配置项目

### 自动配置 (推荐)

在 PowerShell 中运行:

```powershell
# 使用默认 SDK 路径
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$configPath = "G:\fei\android\local.properties"

# 创建配置文件 (路径使用双反斜杠)
$sdkPathEscaped = $sdkPath -replace '\\','\\'
"sdk.dir=$sdkPathEscaped" | Out-File -FilePath $configPath -Encoding ASCII

Write-Host "Configuration created!" -ForegroundColor Green
Write-Host "SDK Path: $sdkPath" -ForegroundColor Cyan
```

### 手动配置

如果 SDK 路径不同,创建文件 `G:\fei\android\local.properties`:

```
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

**重要**: 路径必须使用双反斜杠 `\\`

---

## 第三步:重新构建 APK

```powershell
cd G:\fei
.\build-apk.ps1
```

---

## 快速完成步骤

```powershell
# 1. 等待 Android Studio 首次设置完成

# 2. 配置 SDK 路径 (使用默认路径)
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
$sdkPathEscaped = $sdkPath -replace '\\','\\'
"sdk.dir=$sdkPathEscaped" | Out-File -FilePath "G:\fei\android\local.properties" -Encoding ASCII

# 3. 构建 APK
cd G:\fei
.\build-apk.ps1
```

---

## 下一步

1. **启动 Android Studio**
2. **完成首次设置** (下载 SDK,约 10-15 分钟)
3. **运行上面的配置命令**
4. **构建 APK**

完成后您就能得到可以安装到手机的 APK 文件了!
