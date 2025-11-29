import React from 'react';
import { Users, Sparkles } from 'lucide-react';
import Modal from '../common/Modal';
import { Player } from '../../types';
import { PLAYER_COLORS } from '../../constants';
import { getRandomEmoji } from '../../utils/emojiGenerator';

interface GlobalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
}

const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  players, 
  setPlayers 
}) => {
  const handlePlayerChange = (index: number, field: keyof Player, value: string) => {
    setPlayers(prev => prev.map((p, i) => 
      i === index ? { ...p, [field]: value } : p
    ));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="全局设置">
      <div className="space-y-6">
        
        {/* 玩家设置 */}
        <h4 className="text-sm font-bold text-gray-600 border-b pb-2 flex items-center gap-2">
          <Users size={16}/> 玩家信息设置
        </h4>
        {players.map((p, index) => (
          <div key={index} className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="font-bold text-pink-500">玩家 {index + 1} ({p.avatar})</p>
            <input
              type="text"
              placeholder="昵称"
              value={p.name}
              onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
              className="w-full p-2 border rounded-md text-sm text-gray-900 placeholder-gray-400"
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">头像:</span>
              <input
                type="text"
                maxLength={2}
                placeholder="Emoji"
                value={p.avatar}
                onChange={(e) => handlePlayerChange(index, 'avatar', e.target.value)}
                className="w-16 p-2 border rounded-md text-xl text-center text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => handlePlayerChange(index, 'avatar', getRandomEmoji())}
                className="px-2 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all shadow-md flex items-center gap-1 text-xs font-medium"
                title="随机头像"
              >
                <Sparkles size={14} />
              </button>
              <span className="text-sm text-gray-600">性别:</span>
              <select
                value={p.gender}
                onChange={(e) => handlePlayerChange(index, 'gender', e.target.value as 'male' | 'female')}
                className="flex-1 p-2 border rounded-md text-sm text-gray-900"
              >
                <option value="male">👨 男生</option>
                <option value="female">👩 女生</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">颜色:</span>
              <select
                value={p.color}
                onChange={(e) => handlePlayerChange(index, 'color', e.target.value)}
                className="w-90% p-2 border rounded-md text-sm text-gray-900"
              >
                {PLAYER_COLORS.map(c => (
                  <option key={c.color} value={c.color}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
      >
        保存并返回
      </button>
    </Modal>
  );
};

export default GlobalSettingsModal;
