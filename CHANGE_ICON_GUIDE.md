# 🎨 更换应用图标指南

## 方法 1: 使用自动化脚本 (推荐)

### 快速步骤

```powershell
.\change-app-icon.ps1
```

这个脚本会:
1. 🎨 打开图标生成器
2. 📥 等待您下载图标
3. 📋 自动复制图标到正确位置
4. 🔨 重新构建 APK

### 详细流程

1. **运行脚本**
   ```powershell
   .\change-app-icon.ps1
   ```

2. **在浏览器中下载图标**
   - 浏览器会自动打开图标生成器
   - 查看粉色爱心图标预览
   - 点击 "📥 下载所有图标" 按钮
   - 5 个图标文件会保存到下载文件夹

3. **继续脚本**
   - 下载完成后,回到 PowerShell
   - 按任意键继续
   - 脚本会自动复制图标并重新构建 APK

4. **完成!**
   - 新的 APK 将使用粉色爱心图标 💖

---

## 方法 2: 手动操作

### 步骤 1: 生成图标

在浏览器中打开:
```
file:///G:/fei/generate-app-icon.html
```

或双击文件: `generate-app-icon.html`

### 步骤 2: 下载图标

点击 "下载所有图标" 按钮,会下载:
- `ic_launcher_48.png` (48×48)
- `ic_launcher_72.png` (72×72)
- `ic_launcher_96.png` (96×96)
- `ic_launcher_144.png` (144×144)
- `ic_launcher_192.png` (192×192)

### 步骤 3: 复制图标

将下载的图标复制到对应目录:

```
ic_launcher_48.png  → android/app/src/main/res/mipmap-mdpi/ic_launcher.png
ic_launcher_72.png  → android/app/src/main/res/mipmap-hdpi/ic_launcher.png
ic_launcher_96.png  → android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
ic_launcher_144.png → android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
ic_launcher_192.png → android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

### 步骤 4: 重新构建

```powershell
.\build-apk.ps1
```

---

## 图标说明

### 🎨 设计

- **形状**: 爱心 ❤️
- **颜色**: 粉色到玫瑰红渐变
- **背景**: 圆角矩形
- **风格**: 现代、可爱、温馨

### 📐 尺寸

| 密度 | 尺寸 | 用途 |
|------|------|------|
| mdpi | 48×48 | 低分辨率屏幕 |
| hdpi | 72×72 | 中分辨率屏幕 |
| xhdpi | 96×96 | 高分辨率屏幕 |
| xxhdpi | 144×144 | 超高分辨率屏幕 |
| xxxhdpi | 192×192 | 超超高分辨率屏幕 |

---

## 自定义图标

如果您想使用其他图标:

### 方法 1: 在线工具

推荐使用: [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)

1. 上传您的图标图片
2. 调整尺寸和样式
3. 下载生成的所有尺寸
4. 替换到 `android/app/src/main/res/mipmap-*/` 目录

### 方法 2: 修改生成器

编辑 `generate-app-icon.html` 文件中的 `drawHeartIcon` 函数,自定义:
- 背景颜色
- 图案形状
- 渐变效果

---

## 验证图标

构建完成后,安装 APK 到手机,查看:
- 主屏幕上的应用图标
- 应用抽屉中的图标
- 最近任务中的图标

---

## 故障排查

### 问题: 图标没有改变

**解决方案:**
1. 确保所有 5 个尺寸的图标都已替换
2. 卸载旧版本 APK
3. 重新安装新版本

### 问题: 图标显示模糊

**解决方案:**
- 确保使用了正确尺寸的图标
- 检查图标文件是否完整下载

---

## 快速命令

```powershell
# 自动更换图标
.\change-app-icon.ps1

# 仅打开图标生成器
start file:///G:/fei/generate-app-icon.html

# 重新构建 APK
.\build-apk.ps1
```

---

**提示**: 每次更换图标后都需要重新构建 APK 才能看到效果!
