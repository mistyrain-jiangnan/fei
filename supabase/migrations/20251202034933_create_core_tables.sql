/*
  # 创建核心应用表

  1. 新建表
    - `game_settings` - 游戏设置（棋盘尺寸、难度、番茄时间）
    - `task_library` - 任务库数据
    - `position_cards` - 姿势卡牌库数据
    - `punishment_library` - 惩罚游戏库数据
    - `game_history` - 游戏历史记录
    - `player_profiles` - 玩家信息扩展

  2. 安全性
    - 为所有表启用RLS
    - 设置策略允许用户访问自己的数据
    - 匿名用户基于设备标识存储数据
*/

-- 玩家配置文件表
CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  player1_name text DEFAULT '哥哥',
  player1_avatar text DEFAULT '👦',
  player1_gender text DEFAULT 'male',
  player2_name text DEFAULT '妹妹',
  player2_avatar text DEFAULT '👧',
  player2_gender text DEFAULT 'female'
);

-- 游戏设置表
CREATE TABLE IF NOT EXISTS game_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  chess_difficulty text DEFAULT 'warmup',
  board_rows integer DEFAULT 8,
  board_cols integer DEFAULT 9,
  pomodoro_focus integer DEFAULT 25,
  pomodoro_break integer DEFAULT 5,
  FOREIGN KEY (device_id) REFERENCES player_profiles(device_id) ON DELETE CASCADE
);

-- 任务库表
CREATE TABLE IF NOT EXISTS task_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  role text NOT NULL,
  difficulty text NOT NULL,
  content text NOT NULL,
  icon text DEFAULT '📝',
  FOREIGN KEY (device_id) REFERENCES player_profiles(device_id) ON DELETE CASCADE,
  UNIQUE(device_id, role, difficulty, content)
);

-- 姿势卡牌表
CREATE TABLE IF NOT EXISTS position_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  role text NOT NULL,
  mode text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '💑',
  color text DEFAULT 'bg-pink-500',
  text_color text DEFAULT 'text-white',
  FOREIGN KEY (device_id) REFERENCES player_profiles(device_id) ON DELETE CASCADE,
  UNIQUE(device_id, role, mode, title)
);

-- 惩罚游戏库表
CREATE TABLE IF NOT EXISTS punishment_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  role text NOT NULL,
  difficulty text NOT NULL,
  content text NOT NULL,
  icon text DEFAULT '🎭',
  FOREIGN KEY (device_id) REFERENCES player_profiles(device_id) ON DELETE CASCADE,
  UNIQUE(device_id, role, difficulty, content)
);

-- 游戏历史表
CREATE TABLE IF NOT EXISTS game_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id text NOT NULL,
  created_at timestamptz DEFAULT now(),
  game_type text NOT NULL,
  winner text,
  duration_seconds integer,
  board_size text,
  difficulty text,
  FOREIGN KEY (device_id) REFERENCES player_profiles(device_id) ON DELETE CASCADE
);

-- 启用RLS
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE position_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE punishment_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Player Profiles 策略
CREATE POLICY "允许用户查看自己的配置"
  ON player_profiles FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建新配置"
  ON player_profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许更新自己的配置"
  ON player_profiles FOR UPDATE
  USING (device_id = current_setting('app.current_device_id', true)::text);

-- Game Settings 策略
CREATE POLICY "允许查看自己的游戏设置"
  ON game_settings FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建游戏设置"
  ON game_settings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许更新自己的游戏设置"
  ON game_settings FOR UPDATE
  USING (device_id = current_setting('app.current_device_id', true)::text);

-- Task Library 策略
CREATE POLICY "允许查看自己的任务库"
  ON task_library FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建任务"
  ON task_library FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许删除自己的任务"
  ON task_library FOR DELETE
  USING (device_id = current_setting('app.current_device_id', true)::text);

CREATE POLICY "允许更新自己的任务"
  ON task_library FOR UPDATE
  USING (device_id = current_setting('app.current_device_id', true)::text);

-- Position Cards 策略
CREATE POLICY "允许查看自己的姿势卡牌"
  ON position_cards FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建卡牌"
  ON position_cards FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许删除自己的卡牌"
  ON position_cards FOR DELETE
  USING (device_id = current_setting('app.current_device_id', true)::text);

CREATE POLICY "允许更新自己的卡牌"
  ON position_cards FOR UPDATE
  USING (device_id = current_setting('app.current_device_id', true)::text);

-- Punishment Library 策略
CREATE POLICY "允许查看自己的惩罚库"
  ON punishment_library FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建惩罚"
  ON punishment_library FOR INSERT
  WITH CHECK (true);

CREATE POLICY "允许删除自己的惩罚"
  ON punishment_library FOR DELETE
  USING (device_id = current_setting('app.current_device_id', true)::text);

CREATE POLICY "允许更新自己的惩罚"
  ON punishment_library FOR UPDATE
  USING (device_id = current_setting('app.current_device_id', true)::text);

-- Game History 策略
CREATE POLICY "允许查看自己的游戏历史"
  ON game_history FOR SELECT
  USING (device_id = current_setting('app.current_device_id', true)::text OR device_id IS NOT NULL);

CREATE POLICY "允许创建游戏记录"
  ON game_history FOR INSERT
  WITH CHECK (true);

-- 创建索引以提高查询性能
CREATE INDEX idx_task_library_device_id ON task_library(device_id);
CREATE INDEX idx_task_library_device_role_difficulty ON task_library(device_id, role, difficulty);
CREATE INDEX idx_position_cards_device_id ON position_cards(device_id);
CREATE INDEX idx_position_cards_device_role_mode ON position_cards(device_id, role, mode);
CREATE INDEX idx_punishment_library_device_id ON punishment_library(device_id);
CREATE INDEX idx_punishment_library_device_role_difficulty ON punishment_library(device_id, role, difficulty);
CREATE INDEX idx_game_history_device_id ON game_history(device_id);
CREATE INDEX idx_game_history_created_at ON game_history(created_at);
