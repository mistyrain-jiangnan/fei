import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少 Supabase 环境变量');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 获取设备ID（用于区分不同设备的用户）
export const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('couple_tools_device_id');

  if (!deviceId) {
    deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('couple_tools_device_id', deviceId);
  }

  return deviceId;
};
