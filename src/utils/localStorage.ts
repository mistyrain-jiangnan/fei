// LocalStorage 工具函数 - 替代 Firebase

const STORAGE_KEYS = {
  CUSTOM_LIBRARIES: 'couple_tools_custom_libraries',
  SETTINGS: 'couple_tools_settings',
  PLAYERS: 'couple_tools_players',
  GAME_STATE: 'couple_tools_game_state',
};

// 保存数据到 LocalStorage
export const saveToLocalStorage = <T>(key: string, data: T): void => {
  try {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
    console.log(`✅ 数据已保存到 LocalStorage: ${key}`);
  } catch (error) {
    console.error(`❌ 保存到 LocalStorage 失败: ${key}`, error);
  }
};

// 从 LocalStorage 读取数据
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const jsonData = localStorage.getItem(key);
    if (jsonData === null) {
      console.log(`📦 LocalStorage 中没有数据，使用默认值: ${key}`);
      return defaultValue;
    }
    const data = JSON.parse(jsonData) as T;
    console.log(`✅ 从 LocalStorage 读取数据: ${key}`);
    return data;
  } catch (error) {
    console.error(`❌ 从 LocalStorage 读取失败: ${key}`, error);
    return defaultValue;
  }
};

// 删除 LocalStorage 中的数据
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ 已从 LocalStorage 删除: ${key}`);
  } catch (error) {
    console.error(`❌ 从 LocalStorage 删除失败: ${key}`, error);
  }
};

// 清空所有应用数据
export const clearAllLocalStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    console.log('🗑️ 已清空所有应用数据');
  } catch (error) {
    console.error('❌ 清空数据失败', error);
  }
};

// 导出存储键
export { STORAGE_KEYS };
