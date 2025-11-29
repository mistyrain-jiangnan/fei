# 更换应用图标为爱心 - 简单步骤

## 第 1 步: 下载爱心图标

浏览器已自动打开图标生成器页面。

**在浏览器中:**
1. 查看生成的粉色爱心图标预览
2. 点击 "📥 下载所有图标" 按钮
3. 5 个 PNG 文件会自动下载到下载文件夹

下载的文件:
- ic_launcher_48.png
- ic_launcher_72.png  
- ic_launcher_96.png
- ic_launcher_144.png
- ic_launcher_192.png

---

## 第 2 步: 复制图标到项目

**下载完成后,在 PowerShell 运行:**

```powershell
.\copy-icons.ps1
```

这个脚本会:
- ✅ 检查所有图标文件是否已下载
- ✅ 自动复制到 Android 项目的正确位置
- ✅ 显示复制进度

---

## 第 3 步: 重新构建 APK

```powershell
.\build-apk.ps1
```

构建完成后,新的 APK 将使用粉色爱心图标! 💖

---

## 快速命令

```powershell
# 1. 在浏览器中下载图标 (已自动打开)

# 2. 复制图标
.\copy-icons.ps1

# 3. 构建 APK
.\build-apk.ps1
```

---

## 图标预览

新图标是一个粉色渐变的爱心:
- 🎨 背景: 粉色 → 玫瑰红渐变
- ❤️ 图案: 白色爱心
- 📐 形状: 圆角矩形
- ✨ 风格: 温馨、可爱、浪漫

与您的 UI 设计完美匹配!

---

## 如果图标生成器没打开

手动打开:
```powershell
start file:///G:/fei/generate-app-icon.html
```

或在浏览器地址栏输入:
```
file:///G:/fei/generate-app-icon.html
```

---

**现在:** 在浏览器中点击 "下载所有图标",然后继续第 2 步!
