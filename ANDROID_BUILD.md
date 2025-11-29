# Android 应用构建指南

## 📱 已配置完成

您的项目已成功配置为 Android 应用!以下是构建和发布的步骤。

## 🚀 快速开始

### 1. 开发流程

```bash
# 修改代码后,重新构建并同步到 Android
pnpm run android:build

# 或者分步执行:
pnpm build                 # 构建 Web 应用
pnpm run android:sync      # 同步到 Android
pnpm run android:open      # 打开 Android Studio
```

### 2. 在 Android Studio 中运行

1. 运行 `pnpm run android:open` 打开 Android Studio
2. 等待 Gradle 同步完成
3. 连接 Android 设备或启动模拟器
4. 点击运行按钮 ▶️

### 3. 直接运行到设备

```bash
# 需要先连接 Android 设备或启动模拟器
pnpm run android:run
```

## 📦 构建 APK

### Debug 版本

1. 打开 Android Studio (`pnpm run android:open`)
2. 选择 **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. APK 位置: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release 版本 (发布到应用商店)

#### 第一步: 生成签名密钥

```bash
# 在项目根目录运行
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

#### 第二步: 配置签名

编辑 `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../my-release-key.keystore')
            storePassword 'your-keystore-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

#### 第三步: 构建 Release APK

1. 在 Android Studio 中选择 **Build > Select Build Variant**
2. 选择 **release**
3. 选择 **Build > Build Bundle(s) / APK(s) > Build APK(s)**
4. APK 位置: `android/app/build/outputs/apk/release/app-release.apk`

## 🎨 自定义应用图标和启动屏幕

### 应用图标

1. 准备不同尺寸的图标:
   - `res/mipmap-mdpi/ic_launcher.png` (48x48)
   - `res/mipmap-hdpi/ic_launcher.png` (72x72)
   - `res/mipmap-xhdpi/ic_launcher.png` (96x96)
   - `res/mipmap-xxhdpi/ic_launcher.png` (144x144)
   - `res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

2. 放置在 `android/app/src/main/res/` 对应目录

或使用在线工具生成: https://romannurik.github.io/AndroidAssetStudio/

### 启动屏幕

编辑 `android/app/src/main/res/values/styles.xml` 和 `android/app/src/main/res/drawable/splash.xml`

## 🔧 常用配置

### 修改应用名称

编辑 `capacitor.config.ts`:
```typescript
appName: '你的应用名称'
```

### 修改包名

编辑 `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.yourapp'
```

### 权限配置

编辑 `android/app/src/main/AndroidManifest.xml` 添加所需权限:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
```

## 📋 前置要求

- **Java JDK** 17 或更高版本
- **Android Studio** (包含 Android SDK)
- **Gradle** (随 Android Studio 安装)

### 检查环境

```bash
# 检查 Java
java -version

# 检查 Android SDK (在 Android Studio 中配置)
```

## 🐛 常见问题

### Gradle 同步失败

- 确保网络连接正常
- 使用国内镜像加速 (编辑 `android/build.gradle`)

### 应用无法安装

- 检查包名是否冲突
- 卸载旧版本后重新安装

### 白屏问题

- 确保运行了 `pnpm build`
- 检查 `capacitor.config.ts` 中 `webDir` 配置正确

## 📱 测试设备

### 使用真机

1. 启用开发者选项和 USB 调试
2. 连接手机到电脑
3. 运行 `pnpm run android:run`

### 使用模拟器

1. 在 Android Studio 打开 **Device Manager**
2. 创建新的虚拟设备
3. 启动模拟器
4. 运行应用

## 🎯 下一步

- 安装 Capacitor 插件添加原生功能
- 优化应用图标和启动屏幕
- 配置应用权限
- 测试不同设备
- 准备发布到 Google Play

## 📚 相关资源

- [Capacitor 文档](https://capacitorjs.com/docs)
- [Android 开发文档](https://developer.android.com/)
- [发布到 Google Play](https://support.google.com/googleplay/android-developer/answer/9859152)
