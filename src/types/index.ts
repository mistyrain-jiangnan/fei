// 玩家类型
export interface Player {
  id: number;
  name: string;
  avatar: string;
  pos: number;
  color: string;
  gender: 'male' | 'female'; // 玩家性别
}

// 任务类型
export interface Task {
  id?: string;
  content: string;
  icon: string;
}

// 难度类型
export type Difficulty = 'warmup' | 'intimate' | 'adventure';

// 角色类型
export type Role = 'male' | 'female';

// 任务库类型 - 双重维度: 角色 × 难度
export interface RoleDifficultyTasks {
  warmup: Task[];
  intimate: Task[];
  adventure: Task[];
}

export interface TaskLibrary {
  male: RoleDifficultyTasks;
  female: RoleDifficultyTasks;
}

// 姿势卡牌类型
export interface PositionCard {
  id?: string;
  title: string;
  description: string;
  icon: string;
  color?: string;
  textColor?: string;
}

// 惩罚类型
export interface Punishment {
  id?: string;
  content: string;
  icon: string;
}

// 姿势卡牌库类型 - 双重维度: 角色 × 模式
export interface RoleModePositionCards {
  cute: PositionCard[];
  fun: PositionCard[];
  deep: PositionCard[];
}

export interface PositionCardsLibrary {
  male: RoleModePositionCards;
  female: RoleModePositionCards;
}

// 惩罚库类型 - 双重维度: 角色 × 难度
export interface RoleModePunishments {
  mild: Punishment[];
  medium: Punishment[];
  intense: Punishment[];
}

export interface PunishmentLibrary {
  male: RoleModePunishments;
  female: RoleModePunishments;
}

// 自定义库集合类型
export interface CustomLibraries {
  TASK_LIBRARY: TaskLibrary;
  POSITION_CARDS_LIBRARY: PositionCardsLibrary;
  PUNISHMENT_LIBRARY: PunishmentLibrary;
}

// 设置类型
export interface Settings {
  pomodoro: {
    focus: number;
    break: number;
  };
  chessDifficulty: Difficulty;
}

// 模态框任务类型
export interface ModalTask {
  title: string;
  content: string;
  icon: string;
  isWinner: boolean;
}

// 库配置类型
export interface LibraryMode {
  key: string;
  name: string;
}

export interface LibraryConfig {
  name: string;
  modes: LibraryMode[];
  subModes?: LibraryMode[]; // 可选的子模式(第二层分类)
  defaultData: any;
  fields: string[];
}
