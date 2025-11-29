import React, { useState } from 'react';
import { X, RefreshCw, Heart, Gamepad2, Lock } from 'lucide-react';
import { PunishmentLibrary, Punishment } from '../../types';

interface PunishmentGameScreenProps {
  setCurrentScreen: (screen: string) => void;
  PUNISHMENT_DATA: PunishmentLibrary;
}

const PunishmentGameScreen: React.FC<PunishmentGameScreenProps> = ({ 
  setCurrentScreen, 
  PUNISHMENT_DATA 
}) => {
  const [activePunishment, setActivePunishment] = useState<Punishment | null>(null);
  const [cardFlipped, setCardFlipped] = useState(false);
  const [role, setRole] = useState<'male' | 'female'>('male');
  const [punishmentSettings, setPunishmentSettings] = useState({
    mild: true,
    medium: true,
    intense: false 
  });

  const drawPunishment = () => {
    let pool: Punishment[] = [];
    const roleData = PUNISHMENT_DATA[role];
    if (punishmentSettings.mild) pool = [...pool, ...(roleData?.mild || [])];
    if (punishmentSettings.medium) pool = [...pool, ...(roleData?.medium || [])];
    if (punishmentSettings.intense) pool = [...pool, ...(roleData?.intense || [])];
    
    if (pool.length === 0 || pool.every(p => !p.content)) {
      setActivePunishment({ content: "未选择模式或模式库为空。请在任务库中添加卡牌。", icon: "⚠️" });
      setCardFlipped(false);
      return;
    }

    const punishment = pool[Math.floor(Math.random() * pool.length)];
    setCardFlipped(false);
    setActivePunishment(punishment);
  };

  const closePunishment = () => {
    setActivePunishment(null);
    setCardFlipped(false);
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 flex justify-between items-center border-b border-gray-100">
        <button 
          onClick={() => setCurrentScreen('HOME')} 
          className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white shadow-md shadow-orange-200">
            <Gamepad2 size={16} fill="currentColor" />
          </div>
          <span className="font-bold text-gray-800 tracking-tight">惩罚游戏</span>
        </div>
        <div className="w-10"></div>
      </div>

      {/* 角色选择 - 主界面 */}
      <div className="px-6 pt-4">
        <div className="flex gap-2 bg-gray-100 p-2 rounded-xl">
          <button
            onClick={() => setRole('male')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              role === 'male' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            👨 男生
          </button>
          <button
            onClick={() => setRole('female')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              role === 'female' 
              ? 'bg-pink-500 text-white shadow-lg' 
              : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            👩 女生
          </button>
        </div>
      </div>

      {/* 难度选择 - 主界面 */}
      <div className="px-6 pt-3 pb-2">
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 p-3 rounded-xl space-y-2">
          <p className="text-xs font-bold text-gray-600 mb-2">🎯 选择难度级别</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPunishmentSettings({...punishmentSettings, mild: !punishmentSettings.mild})}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                punishmentSettings.mild
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              😊 初级
            </button>
            <button
              onClick={() => setPunishmentSettings({...punishmentSettings, medium: !punishmentSettings.medium})}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                punishmentSettings.medium
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              😈 中级
            </button>
            <button
              onClick={() => setPunishmentSettings({...punishmentSettings, intense: !punishmentSettings.intense})}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                punishmentSettings.intense
                ? 'bg-red-500 text-white shadow-md'
                : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
            >
              🔥 高级
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 flex-col">
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-gray-800 mb-2">准备好接受惩罚了吗？</h3>
          <p className="text-gray-500 text-sm">点击按钮，抽取你的命运卡片！</p>
        </div>

        <div className="w-full max-w-xs aspect-[3/4] bg-gradient-to-br from-orange-300 to-red-300 rounded-3xl shadow-2xl flex items-center justify-center relative overflow-hidden">
          <Heart className="absolute text-white/10 text-9xl animate-pulse" />
          <button
            onClick={drawPunishment}
            className="w-40 h-40 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-lg shadow-xl shadow-orange-300 active:scale-95 transition-all flex flex-col items-center justify-center gap-2"
          >
            <RefreshCw size={28} />
            <span>抽取惩罚</span>
          </button>
        </div>
      </div>

      {activePunishment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div 
            className="relative w-full max-w-xs aspect-[3/4] perspective-1000 group cursor-pointer"
            onClick={() => setCardFlipped(true)}
          >
            <div className={`w-full h-full relative transition-all duration-700 transform-style-3d ${cardFlipped ? 'rotate-y-180' : ''}`}>
              {/* Card Front (Hidden Content) */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-white/10 backface-hidden">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6 animate-pulse">
                  <span className="text-4xl">❓</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">抽取惩罚</h3>
                <p className="text-gray-400 text-sm">点击翻转卡片</p>
              </div>

              {/* Card Back (Revealed Content) */}
              <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-4 border-orange-100 backface-hidden rotate-y-180">
                <div className="absolute top-4 right-4">
                  <Lock className="text-red-400" /> 
                </div>
                
                <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-5xl shadow-inner">
                  {activePunishment.icon}
                </div>
                
                <h3 className="text-xl font-black text-gray-800 mb-4 text-center">
                  惩罚内容
                </h3>
                
                <p className="text-lg font-medium text-gray-700 text-center leading-relaxed mb-8 flex-1 flex items-center">
                  {activePunishment.content}
                </p>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    closePunishment();
                  }}
                  className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
                >
                  我接受了!
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PunishmentGameScreen;
