import { TaskLibrary, PositionCardsLibrary, PunishmentLibrary } from '../types';

// 游戏常量
export const TOTAL_STEPS = 72;  // 8×9 = 72 格
export const GRID_SIZE = 9;     // 使用较大的边（9列）作为网格大小
export const GRID_ROWS = 8;     // 8 行
export const GRID_COLS = 9;     // 9 列
export const TASK_TRIGGER_CHANCE = 1;  // 60% 概率触发任务

// 默认任务库 - 双重维度: 角色 × 难度
// 提示：这只是示例数据，请使用"任务库管理"中的导入功能来添加更多任务
export const DEFAULT_TASK_LIBRARY: TaskLibrary = {
  male: {
    warmup: [
    
    ],
    intimate: [
     
    ],
    adventure: [
     
    ]
  },
  female: {
    warmup: [
    
    ],
    intimate: [
    
    ],
    adventure: [
      
    ]
  }
};

// 默认姿势卡牌库 - 双重维度: 角色 × 模式
// 提示：这只是示例数据，请使用"任务库管理"中的导入功能来添加更多卡牌
export const DEFAULT_POSITION_CARDS_LIBRARY: PositionCardsLibrary = {
  male: {
    cute: [
     
    ],
    fun: [
    ],
    deep: [
    ]
  },
  female: {
    cute: [
    ],
    fun: [
    ],
    deep: [
    ]
  }
};

// 默认惩罚库 - 双重维度: 角色 × 难度
// 提示：这只是示例数据，请使用"任务库管理"中的导入功能来添加更多惩罚
export const DEFAULT_PUNISHMENT_LIBRARY: PunishmentLibrary = {
  male: {
    mild: [
    ],
    medium: [
    ],
    intense: [
    ]
  },
  female: {
    mild: [
    ],
    medium: [
    ],
    intense: [
    ]
  }
};

// 玩家颜色配置
export const PLAYER_COLORS = [
  { name: '蓝色', color: 'bg-blue-500' },
  { name: '粉色', color: 'bg-pink-500' },
  { name: '绿色', color: 'bg-green-500' },
  { name: '紫色', color: 'bg-purple-500' },
];
