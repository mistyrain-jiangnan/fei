import { taskLibraryService, positionCardsService, punishmentService, settingsService, playerService } from './database';
import { getDeviceId } from './supabase';
import { STORAGE_KEYS } from '../utils/localStorage';

/**
 * 从localStorage迁移数据到Supabase
 * 这个函数应该在应用首次加载时调用一次
 */
export async function migrateDataToSupabase() {
  try {
    console.log('🚀 开始数据迁移到Supabase...');
    const deviceId = getDeviceId();

    // 检查是否已经迁移过
    const migrationFlag = localStorage.getItem(`${deviceId}_migrated_to_supabase`);
    if (migrationFlag === 'true') {
      console.log('✅ 数据已经迁移过，跳过迁移流程');
      return;
    }

    // 1. 迁移玩家配置
    const localPlayers = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLAYERS) || '[]');
    if (localPlayers.length >= 2) {
      await playerService.updatePlayerInfo(
        localPlayers[0].name,
        localPlayers[0].avatar,
        localPlayers[1].name,
        localPlayers[1].avatar
      );
      console.log('✅ 玩家配置已迁移');
    }

    // 2. 迁移游戏设置
    const localSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}');
    if (Object.keys(localSettings).length > 0) {
      await settingsService.updateSettings({
        chess_difficulty: localSettings.chessDifficulty || 'warmup',
        pomodoro_focus: localSettings.pomodoro?.focus || 25,
        pomodoro_break: localSettings.pomodoro?.break || 5
      });
      console.log('✅ 游戏设置已迁移');
    }

    // 3. 迁移任务库
    const customLibraries = JSON.parse(localStorage.getItem(STORAGE_KEYS.CUSTOM_LIBRARIES) || '{}');
    if (customLibraries.TASK_LIBRARY) {
      const taskLib = customLibraries.TASK_LIBRARY;
      const allTasks: any[] = [];

      for (const [role, roleData] of Object.entries(taskLib)) {
        if (typeof roleData === 'object' && roleData !== null) {
          for (const [difficulty, tasks] of Object.entries(roleData)) {
            if (Array.isArray(tasks)) {
              tasks.forEach((task: any) => {
                if (task.content) {
                  allTasks.push({
                    role,
                    difficulty,
                    content: task.content,
                    icon: task.icon || '📝'
                  });
                }
              });
            }
          }
        }
      }

      if (allTasks.length > 0) {
        await taskLibraryService.bulkImportTasks(allTasks);
        console.log(`✅ 任务库已迁移 (${allTasks.length}个任务)`);
      }
    }

    // 4. 迁移姿势卡牌
    if (customLibraries.POSITION_CARDS_LIBRARY) {
      const cardLib = customLibraries.POSITION_CARDS_LIBRARY;
      const allCards: any[] = [];

      for (const [role, roleData] of Object.entries(cardLib)) {
        if (typeof roleData === 'object' && roleData !== null) {
          for (const [mode, cards] of Object.entries(roleData)) {
            if (Array.isArray(cards)) {
              cards.forEach((card: any) => {
                if (card.title && card.description) {
                  allCards.push({
                    role,
                    mode,
                    title: card.title,
                    description: card.description,
                    icon: card.icon || '💑',
                    color: card.color || 'bg-pink-500'
                  });
                }
              });
            }
          }
        }
      }

      if (allCards.length > 0) {
        await positionCardsService.bulkImportCards(allCards);
        console.log(`✅ 姿势卡牌已迁移 (${allCards.length}张卡牌)`);
      }
    }

    // 5. 迁移惩罚库
    if (customLibraries.PUNISHMENT_LIBRARY) {
      const punishLib = customLibraries.PUNISHMENT_LIBRARY;
      const allPunishments: any[] = [];

      for (const [role, roleData] of Object.entries(punishLib)) {
        if (typeof roleData === 'object' && roleData !== null) {
          for (const [difficulty, punishments] of Object.entries(roleData)) {
            if (Array.isArray(punishments)) {
              punishments.forEach((p: any) => {
                if (p.content) {
                  allPunishments.push({
                    role,
                    difficulty,
                    content: p.content,
                    icon: p.icon || '🎭'
                  });
                }
              });
            }
          }
        }
      }

      if (allPunishments.length > 0) {
        await punishmentService.bulkImportPunishments(allPunishments);
        console.log(`✅ 惩罚库已迁移 (${allPunishments.length}个惩罚)`);
      }
    }

    // 标记已迁移
    localStorage.setItem(`${deviceId}_migrated_to_supabase`, 'true');
    console.log('✅ 数据迁移完成！');
  } catch (error) {
    console.error('❌ 数据迁移失败:', error);
    throw error;
  }
}

/**
 * 从Supabase加载所有数据到内存
 * 用于启动应用时的数据加载
 */
export async function loadDataFromSupabase() {
  try {
    const [tasks, cards, punishments, settings, profile] = await Promise.all([
      taskLibraryService.getAllTasks(),
      positionCardsService.getAllCards(),
      punishmentService.getAllPunishments(),
      settingsService.getOrCreateSettings(),
      playerService.getOrCreateProfile()
    ]);

    // 重建结构化库格式
    const taskLibrary = buildTaskLibrary(tasks);
    const positionCardsLibrary = buildPositionCardsLibrary(cards);
    const punishmentLibrary = buildPunishmentLibrary(punishments);

    return {
      taskLibrary,
      positionCardsLibrary,
      punishmentLibrary,
      settings: {
        pomodoro: {
          focus: settings.pomodoro_focus,
          break: settings.pomodoro_break
        },
        chessDifficulty: settings.chess_difficulty,
        boardRows: settings.board_rows,
        boardCols: settings.board_cols
      },
      profile
    };
  } catch (error) {
    console.error('❌ 从Supabase加载数据失败:', error);
    throw error;
  }
}

// 辅助函数：构建任务库结构
function buildTaskLibrary(tasks: any[]) {
  const lib: any = {
    male: { warmup: [], intimate: [], adventure: [] },
    female: { warmup: [], intimate: [], adventure: [] }
  };

  tasks.forEach(task => {
    if (lib[task.role] && lib[task.role][task.difficulty]) {
      lib[task.role][task.difficulty].push({
        id: task.id,
        content: task.content,
        icon: task.icon
      });
    }
  });

  return lib;
}

// 辅助函数：构建姿势卡牌库结构
function buildPositionCardsLibrary(cards: any[]) {
  const lib: any = {
    male: { cute: [], fun: [], deep: [] },
    female: { cute: [], fun: [], deep: [] }
  };

  cards.forEach(card => {
    if (lib[card.role] && lib[card.role][card.mode]) {
      lib[card.role][card.mode].push({
        id: card.id,
        title: card.title,
        description: card.description,
        icon: card.icon,
        color: card.color,
        textColor: card.text_color
      });
    }
  });

  return lib;
}

// 辅助函数：构建惩罚库结构
function buildPunishmentLibrary(punishments: any[]) {
  const lib: any = {
    male: { mild: [], medium: [], intense: [] },
    female: { mild: [], medium: [], intense: [] }
  };

  punishments.forEach(p => {
    if (lib[p.role] && lib[p.role][p.difficulty]) {
      lib[p.role][p.difficulty].push({
        id: p.id,
        content: p.content,
        icon: p.icon
      });
    }
  });

  return lib;
}
