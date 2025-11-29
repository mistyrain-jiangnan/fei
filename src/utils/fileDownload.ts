/**
 * 移动端文件下载工具
 * 兼容 Web 浏览器和 Android/iOS 原生应用
 */

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

/**
 * 下载文件 (兼容 Web 和移动端)
 * @param data 文件数据
 * @param filename 文件名
 * @param mimeType MIME 类型
 */
export async function downloadFile(
  data: string | Blob,
  filename: string,
  mimeType: string = 'application/json'
): Promise<void> {
  // 检查是否在原生应用中
  if (Capacitor.isNativePlatform()) {
    await downloadFileNative(data, filename, mimeType);
  } else {
    downloadFileWeb(data, filename, mimeType);
  }
}

/**
 * Web 浏览器下载
 */
function downloadFileWeb(
  data: string | Blob,
  filename: string,
  mimeType: string
): void {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 原生应用下载 (Android/iOS)
 * 使用 Capacitor Filesystem + Share API
 */
async function downloadFileNative(
  data: string | Blob,
  filename: string,
  mimeType: string
): Promise<void> {
  try {
    // 转换数据为字符串
    let content: string;
    if (data instanceof Blob) {
      content = await data.text();
    } else {
      content = data;
    }

    // 保存文件到应用缓存目录
    const result = await Filesystem.writeFile({
      path: filename,
      data: content,
      directory: Directory.Cache,
      encoding: mimeType.includes('json') ? undefined : undefined,
    });

    console.log('文件已保存:', result.uri);

    // 使用分享 API 让用户选择保存位置
    const shareResult = await Share.share({
      title: `分享 ${filename}`,
      text: `${filename}`,
      url: result.uri,
      dialogTitle: '保存文件',
    });

    if (shareResult.activityType) {
      console.log('文件已分享:', shareResult.activityType);
    }
  } catch (error) {
    console.error('原生下载失败:', error);
    // 降级到 Web 方式
    downloadFileWeb(data, filename, mimeType);
  }
}

/**
 * 读取文件 (兼容 Web 和移动端)
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * 下载 JSON 数据
 */
export async function downloadJSON(
  data: any,
  filename: string
): Promise<void> {
  const jsonString = JSON.stringify(data, null, 2);
  await downloadFile(jsonString, filename, 'application/json');
}

/**
 * 下载文本文件
 */
export async function downloadText(
  text: string,
  filename: string
): Promise<void> {
  await downloadFile(text, filename, 'text/plain');
}
