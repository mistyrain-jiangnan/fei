#!/bin/bash

echo "=================================="
echo "  情侣甜蜜小工具 - Android 构建"
echo "=================================="
echo ""

echo "步骤 1: 构建 Web 应用..."
pnpm build

if [ $? -ne 0 ]; then
    echo "构建失败!"
    exit 1
fi

echo "✓ Web 应用构建成功"
echo ""

echo "步骤 2: 同步到 Android..."
npx cap sync android

if [ $? -ne 0 ]; then
    echo "同步失败!"
    exit 1
fi

echo "✓ Android 同步成功"
echo ""

echo "步骤 3: 打开 Android Studio..."
npx cap open android

echo ""
echo "=================================="
echo "  接下来在 Android Studio 中:"
echo "  1. 等待 Gradle 同步完成"
echo "  2. 连接设备或启动模拟器"
echo "  3. 点击运行按钮 ▶️"
echo "=================================="
