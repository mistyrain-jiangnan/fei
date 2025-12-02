import { supabase, getDeviceId } from './supabase';

const deviceId = getDeviceId();

// ===== 玩家配置 =====
export const playerService = {
  // 获取或创建玩家配置
  async getOrCreateProfile() {
    let { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      // 创建新配置
      const { data: newProfile, error: createError } = await supabase
        .from('player_profiles')
        .insert([{ device_id: deviceId }])
        .select()
        .single();

      if (createError) throw createError;
      return newProfile;
    }

    return data;
  },

  // 更新玩家名称和头像
  async updatePlayerInfo(player1Name: string, player1Avatar: string, player2Name: string, player2Avatar: string) {
    const { data, error } = await supabase
      .from('player_profiles')
      .update({
        player1_name: player1Name,
        player1_avatar: player1Avatar,
        player2_name: player2Name,
        player2_avatar: player2Avatar,
        updated_at: new Date().toISOString()
      })
      .eq('device_id', deviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ===== 游戏设置 =====
export const settingsService = {
  // 获取或创建游戏设置
  async getOrCreateSettings() {
    let { data, error } = await supabase
      .from('game_settings')
      .select('*')
      .eq('device_id', deviceId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const { data: newSettings, error: createError } = await supabase
        .from('game_settings')
        .insert([{ device_id: deviceId }])
        .select()
        .single();

      if (createError) throw createError;
      return newSettings;
    }

    return data;
  },

  // 更新游戏设置
  async updateSettings(updates: Partial<any>) {
    const { data, error } = await supabase
      .from('game_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('device_id', deviceId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ===== 任务库 =====
export const taskLibraryService = {
  // 获取所有任务
  async getAllTasks() {
    const { data, error } = await supabase
      .from('task_library')
      .select('*')
      .eq('device_id', deviceId);

    if (error) throw error;
    return data || [];
  },

  // 按角色和难度获取任务
  async getTasksByRoleAndDifficulty(role: string, difficulty: string) {
    const { data, error } = await supabase
      .from('task_library')
      .select('*')
      .eq('device_id', deviceId)
      .eq('role', role)
      .eq('difficulty', difficulty);

    if (error) throw error;
    return data || [];
  },

  // 添加任务
  async addTask(role: string, difficulty: string, content: string, icon: string) {
    const { data, error } = await supabase
      .from('task_library')
      .insert([
        {
          device_id: deviceId,
          role,
          difficulty,
          content,
          icon
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 删除任务
  async deleteTask(id: string) {
    const { error } = await supabase
      .from('task_library')
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId);

    if (error) throw error;
  },

  // 批量导入任务
  async bulkImportTasks(tasks: any[]) {
    const taskData = tasks.map(task => ({
      device_id: deviceId,
      role: task.role,
      difficulty: task.difficulty,
      content: task.content,
      icon: task.icon || '📝'
    }));

    const { error } = await supabase
      .from('task_library')
      .insert(taskData);

    if (error) throw error;
  }
};

// ===== 姿势卡牌库 =====
export const positionCardsService = {
  // 获取所有卡牌
  async getAllCards() {
    const { data, error } = await supabase
      .from('position_cards')
      .select('*')
      .eq('device_id', deviceId);

    if (error) throw error;
    return data || [];
  },

  // 按角色和模式获取卡牌
  async getCardsByRoleAndMode(role: string, mode: string) {
    const { data, error } = await supabase
      .from('position_cards')
      .select('*')
      .eq('device_id', deviceId)
      .eq('role', role)
      .eq('mode', mode);

    if (error) throw error;
    return data || [];
  },

  // 添加卡牌
  async addCard(role: string, mode: string, title: string, description: string, icon: string, color: string = 'bg-pink-500') {
    const { data, error } = await supabase
      .from('position_cards')
      .insert([
        {
          device_id: deviceId,
          role,
          mode,
          title,
          description,
          icon,
          color,
          text_color: 'text-white'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 删除卡牌
  async deleteCard(id: string) {
    const { error } = await supabase
      .from('position_cards')
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId);

    if (error) throw error;
  },

  // 批量导入卡牌
  async bulkImportCards(cards: any[]) {
    const cardData = cards.map(card => ({
      device_id: deviceId,
      role: card.role,
      mode: card.mode,
      title: card.title,
      description: card.description,
      icon: card.icon || '💑',
      color: card.color || 'bg-pink-500',
      text_color: card.textColor || 'text-white'
    }));

    const { error } = await supabase
      .from('position_cards')
      .insert(cardData);

    if (error) throw error;
  }
};

// ===== 惩罚库 =====
export const punishmentService = {
  // 获取所有惩罚
  async getAllPunishments() {
    const { data, error } = await supabase
      .from('punishment_library')
      .select('*')
      .eq('device_id', deviceId);

    if (error) throw error;
    return data || [];
  },

  // 按角色和难度获取惩罚
  async getPunishmentsByRoleAndDifficulty(role: string, difficulty: string) {
    const { data, error } = await supabase
      .from('punishment_library')
      .select('*')
      .eq('device_id', deviceId)
      .eq('role', role)
      .eq('difficulty', difficulty);

    if (error) throw error;
    return data || [];
  },

  // 添加惩罚
  async addPunishment(role: string, difficulty: string, content: string, icon: string) {
    const { data, error } = await supabase
      .from('punishment_library')
      .insert([
        {
          device_id: deviceId,
          role,
          difficulty,
          content,
          icon
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 删除惩罚
  async deletePunishment(id: string) {
    const { error } = await supabase
      .from('punishment_library')
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId);

    if (error) throw error;
  },

  // 批量导入惩罚
  async bulkImportPunishments(punishments: any[]) {
    const punishmentData = punishments.map(p => ({
      device_id: deviceId,
      role: p.role,
      difficulty: p.difficulty,
      content: p.content,
      icon: p.icon || '🎭'
    }));

    const { error } = await supabase
      .from('punishment_library')
      .insert(punishmentData);

    if (error) throw error;
  }
};

// ===== 游戏历史 =====
export const gameHistoryService = {
  // 记录游戏
  async recordGame(gameType: string, winner: string | null, duration: number, boardSize: string, difficulty: string) {
    const { data, error } = await supabase
      .from('game_history')
      .insert([
        {
          device_id: deviceId,
          game_type: gameType,
          winner,
          duration_seconds: duration,
          board_size: boardSize,
          difficulty
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 获取游戏历史
  async getGameHistory(limit: number = 50) {
    const { data, error } = await supabase
      .from('game_history')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  },

  // 获取游戏统计
  async getGameStats() {
    const { data, error } = await supabase
      .from('game_history')
      .select('game_type, winner')
      .eq('device_id', deviceId);

    if (error) throw error;

    const stats = {
      totalGames: data?.length || 0,
      gamesByType: {} as Record<string, number>,
      wins: 0
    };

    data?.forEach(record => {
      stats.gamesByType[record.game_type] = (stats.gamesByType[record.game_type] || 0) + 1;
      if (record.winner) stats.wins++;
    });

    return stats;
  }
};
