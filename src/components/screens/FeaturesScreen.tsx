import React from 'react';
import { Heart, Zap, Gamepad2, Clock, Hand, Database } from 'lucide-react';

interface FeaturesScreenProps {
  setCurrentScreen: (screen: string) => void;
  isLibrariesLoading: boolean;
  gameStarted: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
  players: any[];
}

const FeaturesScreen: React.FC<FeaturesScreenProps> = ({
  setCurrentScreen,
  isLibrariesLoading,
  gameStarted,
  onStartGame,
  onResetGame,
  players
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-200">
              <Heart className="text-white" size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">甜蜜小工具</h1>
              <p className="text-sm text-gray-500 font-medium">多模式，更精彩</p>
            </div>
          </div>
        </div>

        {/* 游戏模式卡片 */}
        <div className="space-y-4 mb-8">
          {/* 飞行棋 */}
          <button
            onClick={onStartGame}
            className="w-full bg-gradient-to-br from-pink-500 to-rose-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-pink-300 hover:shadow-2xl active:scale-95 transition-all flex items-center justify-between px-6 group"
          >
            <div className="flex items-center gap-3">
              <Zap size={24} />
              <span>情侣飞行棋</span>
            </div>
            <span className="text-sm bg-pink-600 px-3 py-1 rounded-full">开始</span>
          </button>

          {/* 惩罚游戏 */}
          <button
            onClick={() => setCurrentScreen('PUNISHMENT_GAME')}
            className="w-full bg-gradient-to-br from-orange-500 to-red-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-orange-300 hover:shadow-2xl active:scale-95 transition-all flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <Gamepad2 size={24} />
              <span>惩罚游戏</span>
            </div>
            <span className="text-sm bg-orange-600 px-3 py-1 rounded-full">多级</span>
          </button>

          {/* 番茄时钟 */}
          <button
            onClick={() => setCurrentScreen('POMODORO')}
            className="w-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-300 hover:shadow-2xl active:scale-95 transition-all flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <Clock size={24} />
              <span>番茄时钟</span>
            </div>
            <span className="text-sm bg-blue-600 px-3 py-1 rounded-full">计时</span>
          </button>

          {/* 姿势卡牌 */}
          <button
            onClick={() => setCurrentScreen('POSITION_CARDS')}
            className="w-full bg-gradient-to-br from-purple-500 to-violet-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-purple-300 hover:shadow-2xl active:scale-95 transition-all flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <Hand size={24} />
              <span>姿势卡牌</span>
            </div>
            <span className="text-sm bg-purple-600 px-3 py-1 rounded-full">多主题</span>
          </button>

          {/* 任务库管理 */}
          <button
            onClick={() => setCurrentScreen('TASK_EDITOR')}
            disabled={isLibrariesLoading}
            className={`w-full text-white font-black py-5 rounded-2xl shadow-lg hover:shadow-2xl active:scale-95 transition-all flex items-center justify-between px-6 ${
              isLibrariesLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-gray-300 hover:from-gray-800 hover:to-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Database size={24} />
              <span>任务库管理</span>
            </div>
            <span className="text-sm bg-gray-800 px-3 py-1 rounded-full">
              {isLibrariesLoading ? '加载中...' : '编辑'}
            </span>
          </button>
        </div>

        {/* 玩家信息卡片 */}
        <div className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-4 shadow-md">
          <p className="font-bold text-gray-700 flex items-center gap-2 text-sm mb-3">
            👥 当前玩家
          </p>
          <div className="flex justify-between items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <div className={`w-10 h-10 ${players[0]?.color} rounded-full flex items-center justify-center text-lg shadow-md`}>
                {players[0]?.avatar}
              </div>
              <span className="font-bold text-gray-700 text-sm">{players[0]?.name}</span>
            </div>
            <span className="text-gray-400">vs</span>
            <div className="flex-1 flex items-center gap-2 justify-end">
              <span className="font-bold text-gray-700 text-sm">{players[1]?.name}</span>
              <div className={`w-10 h-10 ${players[1]?.color} rounded-full flex items-center justify-center text-lg shadow-md`}>
                {players[1]?.avatar}
              </div>
            </div>
          </div>

          {gameStarted && (
            <button
              onClick={onResetGame}
              className="w-full mt-3 text-xs text-red-500 font-bold hover:underline hover:text-red-600 transition-colors"
            >
              重置飞行棋进度
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturesScreen;
