# 环境配置 - 安装 Java JDK

## 问题

构建 Android APK 需要 Java JDK 17 或更高版本,但系统中未找到 Java。

```
ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
```

## 解决方案

### 方法 1: 使用 winget 安装 (最简单)

打开 PowerShell (管理员),运行:

```powershell
winget install EclipseAdoptium.Temurin.17.JDK
```

安装完成后,**关闭并重新打开 PowerShell**,然后验证:

```powershell
java -version
```

应该显示类似:

```
openjdk version "17.0.x"
```

### 方法 2: 手动下载安装

1. 访问: https://adoptium.net/
2. 选择:
   - Version: **17 - LTS**
   - Operating System: **Windows**
   - Architecture: **x64**
3. 下载并运行安装程序
4. 安装时勾选 "Set JAVA_HOME variable"
5. 安装完成后重启 PowerShell

### 方法 3: 通过 Android Studio

如果您已安装 Android Studio:

1. 打开 Android Studio
2. File → Project Structure → SDK Location
3. JDK Location 显示了 JDK 路径

手动设置环境变量:

```powershell
# 临时设置 (仅当前会话)
$env:JAVA_HOME="C:\Program Files\Android\Android Studio\jbr"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"

# 然后重试构建
cd G:\fei\android
.\gradlew.bat assembleDebug
```

## 安装后验证

```powershell
# 检查 Java 版本
java -version

# 检查 JAVA_HOME
echo $env:JAVA_HOME

# 重试构建 APK
cd G:\fei
.\build-apk.ps1
```

## 推荐配置

**Java Version:** 17 (LTS)  
**Provider:** Eclipse Temurin (AdoptOpenJDK)

这是 Android 开发的标准 JDK。

## 快速安装命令

```powershell
# 1. 安装 JDK 17
winget install EclipseAdoptium.Temurin.17.JDK

# 2. 重新打开 PowerShell

# 3. 验证安装
java -version

# 4. 构建 APK
cd G:\fei
.\build-apk.ps1
```

安装大约需要 2-3 分钟。
