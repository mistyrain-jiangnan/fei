import React, { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { PositionCardsLibrary, PositionCard } from '../../types';

interface PositionCardsScreenProps {
  setCurrentScreen: (screen: string) => void;
  POSITION_CARDS_DATA: PositionCardsLibrary;
}

const PositionCardsScreen: React.FC<PositionCardsScreenProps> = ({ 
  setCurrentScreen, 
  POSITION_CARDS_DATA 
}) => {
  const [role, setRole] = useState<'male' | 'female'>('male');
  const [mode, setMode] = useState<'cute' | 'fun' | 'deep'>('cute');
  const [randomCard, setRandomCard] = useState<PositionCard>({
    title: "加载中...",
    description: "正在初始化卡牌",
    icon: "🎴",
    color: "bg-pink-100",
    textColor: "text-pink-800"
  });

  const drawCard = useCallback(() => {
    const pool = POSITION_CARDS_DATA[role]?.[mode];
    if (!pool || pool.length === 0) {
      setRandomCard({ 
        title: "无卡牌", 
        description: "请前往任务库添加", 
        icon: "⚠️", 
        color: "bg-red-100", 
        textColor: "text-red-800" 
      });
      return;
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const card = pool[randomIndex];
    setRandomCard({
      ...card,
      color: card.color || "bg-pink-100", 
      textColor: card.textColor || "text-pink-800"
    });
  }, [role, mode, POSITION_CARDS_DATA]);

  useEffect(() => {
    drawCard();
  }, [mode, role, drawCard]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans p-6">
      <div className="flex justify-between items-center mb-6 pt-4">
        <button 
          onClick={() => setCurrentScreen('HOME')} 
          className="p-2 bg-gray-700/50 text-white rounded-full hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-black text-pink-400">姿势卡牌</h2>
        <div className="w-10"></div>
      </div>

      {/* 角色选择 - 主界面 */}
      <div className="mb-4">
        <div className="flex gap-2 bg-gray-800/50 p-2 rounded-xl">
          <button
            onClick={() => setRole('male')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              role === 'male' 
              ? 'bg-blue-500 text-white shadow-lg' 
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👨 男生
          </button>
          <button
            onClick={() => setRole('female')}
            className={`flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all ${
              role === 'female' 
              ? 'bg-pink-500 text-white shadow-lg' 
              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            👩 女生
          </button>
        </div>
      </div>

      {/* 模式选择 - 主界面 */}
      <div className="mb-6">
        <div className="flex gap-2">
          {[
            { key: 'cute' as const, name: '💗 可爱', color: 'pink' },
            { key: 'fun' as const, name: '😄 有趣', color: 'yellow' },
            { key: 'deep' as const, name: '🌹 深度', color: 'purple' }
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                mode === m.key
                ? `bg-${m.color}-500 text-white shadow-lg scale-105`
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center flex-col">
        <div 
          className={`w-full max-w-xs aspect-[3/4] rounded-3xl p-8 shadow-2xl flex flex-col justify-center items-center text-center transition-colors ${randomCard.color} ${randomCard.textColor}`}
        >
          <div className="text-6xl mb-4">{randomCard.icon}</div>
          <h3 className="text-3xl font-black mb-4">{randomCard.title}</h3>
          <p className="text-lg leading-relaxed font-medium">{randomCard.description}</p>
        </div>
        
   
      </div>

      <div className="pb-8 pt-4">
        <button 
          onClick={drawCard}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-2xl shadow-xl shadow-purple-900/50 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={20} /> 重新抽取
        </button>
      </div>
    </div>
  );
};

export default PositionCardsScreen;
