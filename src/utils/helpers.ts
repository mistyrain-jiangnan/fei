import { LibraryConfig } from '../types';
import { 
  DEFAULT_TASK_LIBRARY, 
  DEFAULT_POSITION_CARDS_LIBRARY, 
  DEFAULT_PUNISHMENT_LIBRARY 
} from '../constants';

// 获取库配置
export const getLibraryConfig = (key: string): LibraryConfig | null => {
  switch (key) {
    case 'TASK_LIBRARY':
      return {
        name: '飞行棋任务',
        modes: [
          { key: 'male', name: '👨 男生' },
          { key: 'female', name: '👩 女生' }
        ],
        subModes: [
          { key: 'warmup', name: '🌟 热身' },
          { key: 'intimate', name: '💕 亲密' },
          { key: 'adventure', name: '🔥 挑战' }
        ],
        defaultData: DEFAULT_TASK_LIBRARY,
        fields: ['content', 'icon']
      };
    case 'POSITION_CARDS_LIBRARY':
      return {
        name: '姿势卡牌',
        modes: [
          { key: 'male', name: '👨 男生' },
          { key: 'female', name: '👩 女生' }
        ],
        subModes: [
          { key: 'cute', name: '💗 可爱' },
          { key: 'fun', name: '😄 有趣' },
          { key: 'deep', name: '🌹 深度' }
        ],
        defaultData: DEFAULT_POSITION_CARDS_LIBRARY,
        fields: ['title', 'description', 'icon']
      };
    case 'PUNISHMENT_LIBRARY':
      return {
        name: '惩罚游戏',
        modes: [
          { key: 'male', name: '👨 男生' },
          { key: 'female', name: '👩 女生' }
        ],
        subModes: [
          { key: 'mild', name: '😊 初级' },
          { key: 'medium', name: '😈 中级' },
          { key: 'intense', name: '🔥 高级' }
        ],
        defaultData: DEFAULT_PUNISHMENT_LIBRARY,
        fields: ['content', 'icon']
      };
    default:
      return null;
  }
};

// 生成地图路径
export const generateMapPath = (total: number): Array<{ index: number }> => {
  const path: Array<{ index: number }> = [];
  for (let i = 0; i < total; i++) {
    path.push({ index: i });
  }
  return path;
};

// 格式化时间
export const formatTime = (seconds: number): string => {
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
  const remainingSeconds = String(seconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
};

// 为数据添加唯一ID
export const addIds = (obj: any) => {
  const newObj: any = {};
  for (const mode in obj) {
    if (typeof obj[mode] === 'object' && !Array.isArray(obj[mode])) {
      // 双重维度: 例如 male: { warmup: [], intimate: [] }
      newObj[mode] = {};
      for (const subMode in obj[mode]) {
        if (Array.isArray(obj[mode][subMode])) {
          newObj[mode][subMode] = obj[mode][subMode].map((item: any) => ({
            ...item,
            id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          }));
        }
      }
    } else if (Array.isArray(obj[mode])) {
      // 单维度: 直接是数组
      newObj[mode] = obj[mode].map((item: any) => ({
        ...item,
        id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      }));
    }
  }
  return newObj;
};
