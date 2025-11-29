import React from 'react';
import { 
  Heart, Settings, Zap, Gamepad2, Clock, 
  Hand, Database, RefreshCw, Users 
} from 'lucide-react';
import { Player } from '../../types';

interface HomeScreenProps {
  setCurrentScreen: (screen: string) => void;
  gameStarted: boolean;
  startGame: () => void;
  resetGame: () => void;
  players: Player[];
  showSettingsModal: () => void;
  isLibrariesLoading: boolean;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  setCurrentScreen, 
  gameStarted, 
  startGame, 
  resetGame, 
  players, 
  showSettingsModal, 
  isLibrariesLoading 
}) => (
  <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    {/* 背景装饰 */}
    <div className="absolute top-0 left-0 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    
    <div className="relative z-10 space-y-8 bg-white/40 backdrop-blur-xl p-8 rounded-[40px] border border-white/60 shadow-2xl w-full max-w-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-rose-500 rounded-lg flex items-center justify-center shadow-lg shadow-pink-200 rotate-3">
            <Heart className="text-white" size={24} fill="currentColor" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-800 tracking-tight">甜蜜小工具</h1>
            <p className="text-gray-500 font-medium text-xs">多模式，更精彩</p>
          </div>
        </div>
        <button 
          onClick={showSettingsModal}
          className="p-2 bg-pink-100 text-pink-600 rounded-full hover:bg-pink-200 transition-colors shadow-md"
          title="全局设置"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* 互动游戏 Section */}
        <h3 className="text-sm font-bold text-pink-600 uppercase tracking-widest">互动游戏</h3>
        <button 
          onClick={() => startGame()}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-300 active:scale-95 transition-all flex items-center justify-between px-6"
        >
          情侣飞行棋
          <Zap size={20} />
        </button>
        <button 
          onClick={() => setCurrentScreen('PUNISHMENT_GAME')}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-300 active:scale-95 transition-all flex items-center justify-between px-6"
        >
          惩罚游戏 (多级难度)
          <Gamepad2 size={20} />
        </button>
        <button 
          onClick={() => setCurrentScreen('POMODORO')}
          className="w-full bg-blue-500/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-300 active:scale-95 transition-all flex items-center justify-between px-6"
        >
          情侣番茄时钟 (自定义时长)
          <Clock size={20} />
        </button>

        {/* 卡牌 Section */}
        <h3 className="text-sm font-bold text-purple-600 uppercase tracking-widest pt-4">卡牌与设置</h3>
        <button 
          onClick={() => setCurrentScreen('POSITION_CARDS')}
          className="w-full bg-purple-500/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-200 active:scale-95 transition-all flex items-center justify-between px-6"
        >
          姿势卡牌 (多主题)
          <Hand size={20} />
        </button>
        
        <button 
          onClick={() => setCurrentScreen('TASK_EDITOR')}
          disabled={isLibrariesLoading}
          className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-between px-6 ${
            isLibrariesLoading ? 'bg-gray-400' : 'bg-gray-700 hover:bg-gray-800 shadow-gray-300'
          }`}
        >
          任务库管理 (新增/修改)
          {isLibrariesLoading ? <RefreshCw size={20} className='animate-spin' /> : <Database size={20} />}
        </button>

        {/* 玩家信息 & 进度 */}
        <div className="bg-white/50 p-3 rounded-xl border border-white/80 text-sm text-gray-600">
          <p className="font-medium flex items-center gap-2">
            <Users size={16} className="text-gray-500"/> 玩家信息:
          </p>
          <div className='flex justify-between items-center mt-1'>
            <span className={`font-bold ${players[0].color.replace('bg-', 'text-')}`}>{players[0].avatar} {players[0].name}</span>
            <span className={`font-bold ${players[1].color.replace('bg-', 'text-')}`}>{players[1].avatar} {players[1].name}</span>
          </div>
          {gameStarted && (
            <button 
              onClick={resetGame} 
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              重置飞行棋进度
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default HomeScreen;
