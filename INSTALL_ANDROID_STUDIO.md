# 安装 Android Studio 和 SDK

## 问题

构建 Android APK 需要 Android SDK,但系统中未找到。

```
SDK location not found
```

## 最简单的解决方案:安装 Android Studio

### 方法 1: 使用 winget 安装 (最快)

```powershell
winget install Google.AndroidStudio
```

安装完成后:

1. **首次启动 Android Studio**
2. **选择 "Standard" 安装**
3. **等待 SDK 下载完成** (约 1-2 GB)
4. **记下 SDK 路径** (通常是 `C:\Users\你的用户名\AppData\Local\Android\Sdk`)

### 方法 2: 手动下载安装

1. 访问: https://developer.android.com/studio
2. 下载 Android Studio
3. 运行安装程序
4. 选择 "Standard" 安装
5. 等待 SDK 下载完成

## 安装完成后

### 配置 Android SDK 路径

创建 `local.properties` 文件:

```powershell
# 在 PowerShell 中运行
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
"sdk.dir=$sdkPath" | Out-File -FilePath "G:\fei\android\local.properties" -Encoding ASCII
```

或手动创建文件 `G:\fei\android\local.properties`:

```
sdk.dir=C:\\Users\\你的用户名\\AppData\\Local\\Android\\Sdk
```

**注意**: Windows 路径需要使用双反斜杠 `\\`

### 重新构建 APK

```powershell
cd G:\fei
.\build-apk.ps1
```

---

## 备选方案:仅安装命令行工具(不推荐)

如果不想安装 Android Studio:

1. 下载 Command Line Tools: https://developer.android.com/studio#command-line-tools-only
2. 解压到某个目录,如 `C:\Android\cmdline-tools`
3. 使用 sdkmanager 安装必需组件

这个方案比较复杂,建议直接安装 Android Studio。

---

## 推荐流程

**最简单的方式:**

```powershell
# 1. 安装 Android Studio
winget install Google.AndroidStudio

# 2. 启动 Android Studio,完成首次设置

# 3. 配置 SDK 路径
$sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
"sdk.dir=$($sdkPath -replace '\\','\\')" | Out-File -FilePath "G:\fei\android\local.properties" -Encoding ASCII

# 4. 重新构建
cd G:\fei
.\build-apk.ps1
```

---

## 时间估算

- **下载 Android Studio**: 5-10 分钟 (约 1 GB)
- **首次启动和 SDK 下载**: 10-15 分钟 (约 1-2 GB)
- **配置**: 1 分钟
- **重新构建 APK**: 2-3 分钟

**总计**: 约 20-30 分钟

---

## 下一步

1. 安装 Android Studio
2. 完成首次设置
3. 运行上面的配置命令
4. 重新构建 APK

需要帮助吗?
