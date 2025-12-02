import React, { useState, useEffect } from 'react';
import { User, Settings, BarChart3, Download, Trash2, Lock } from 'lucide-react';
import { Player, Settings as SettingsType } from '../../types';
import Modal from '../common/Modal';
import { gameHistoryService } from '../../services/database';

interface ProfileScreenProps {
  players: Player[];
  settings: SettingsType;
  onUpdate: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ players, settings, onUpdate }) => {
  const [gameStats, setGameStats] = useState<any>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [boardRows, setBoardRows] = useState(8);
  const [boardCols, setBoardCols] = useState(9);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGameStats();
  }, []);

  const loadGameStats = async () => {
    try {
      setLoading(true);
      const stats = await gameHistoryService.getGameStats();
      setGameStats(stats);
    } catch (error) {
      console.error('加载游戏统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      players,
      settings,
      stats: gameStats
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `couple-tools-backup-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    localStorage.clear();
    location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-24">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 玩家信息卡片 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <User size={24} className="text-blue-600" />
            玩家信息
          </h2>

          <div className="space-y-4">
            {players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
              >
                <div
                  className={`w-16 h-16 ${player.color} rounded-full flex items-center justify-center text-3xl shadow-md border-2 border-white`}
                >
                  {player.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-medium">玩家 {index + 1}</p>
                  <p className="text-lg font-black text-gray-800">{player.name}</p>
                  <p className="text-xs text-gray-500">
                    {player.gender === 'male' ? '👨 男生' : '👩 女生'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 游戏统计卡片 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <BarChart3 size={24} className="text-orange-600" />
            游戏统计
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">加载中...</div>
          ) : gameStats ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                <span className="font-medium text-gray-700">总游戏数</span>
                <span className="text-2xl font-black text-orange-600">
                  {gameStats.totalGames || 0}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-xl border border-yellow-100">
                <span className="font-medium text-gray-700">获胜数</span>
                <span className="text-2xl font-black text-yellow-600">
                  {gameStats.wins || 0}
                </span>
              </div>

              <div className="text-sm text-gray-500 pt-2">
                {Object.entries(gameStats.gamesByType).map(([type, count]: [string, any]) => (
                  <div key={type} className="flex justify-between py-1">
                    <span>{type}</span>
                    <span className="font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">暂无数据</div>
          )}
        </div>

        {/* 设置卡片 */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6 border border-gray-100">
          <h2 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
            <Settings size={24} className="text-purple-600" />
            设置
          </h2>

          <div className="space-y-3">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full p-3 text-left bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors font-medium text-gray-700"
            >
              ⚙️ 棋盘和游戏设置
            </button>

            <button
              onClick={handleExportData}
              className="w-full p-3 text-left bg-green-50 border border-green-200 rounded-xl hover:bg-green-100 transition-colors font-medium text-gray-700 flex items-center gap-2"
            >
              <Download size={18} />
              导出数据备份
            </button>

            <button
              onClick={() => setShowClearModal(true)}
              className="w-full p-3 text-left bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors font-medium text-red-700 flex items-center gap-2"
            >
              <Trash2 size={18} />
              清除所有数据
            </button>
          </div>
        </div>

        {/* 信息卡片 */}
        <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 border border-blue-200 text-center">
          <p className="text-xs text-blue-700 font-medium flex items-center justify-center gap-1">
            <Lock size={14} />
            数据安全存储在 Supabase 云端
          </p>
        </div>
      </div>

      {/* 设置模态框 */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="游戏设置"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              飞行棋棋盘大小
            </label>
            <p className="text-xs text-gray-500 mb-4">
              自定义棋盘的行数和列数
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-medium text-gray-600">行数</label>
                <input
                  type="number"
                  min="5"
                  max="15"
                  value={boardRows}
                  onChange={(e) => setBoardRows(parseInt(e.target.value))}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">列数</label>
                <input
                  type="number"
                  min="5"
                  max="15"
                  value={boardCols}
                  onChange={(e) => setBoardCols(parseInt(e.target.value))}
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setBoardRows(8); setBoardCols(9); }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                默认 (8×9)
              </button>
              <button
                onClick={() => { setBoardRows(10); setBoardCols(10); }}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                大 (10×10)
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              总格子数: <span className="font-bold">{boardRows * boardCols}</span>
            </p>
          </div>

          <button
            onClick={() => {
              onUpdate();
              setShowSettingsModal(false);
            }}
            className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
          >
            保存设置
          </button>
        </div>
      </Modal>

      {/* 清除数据确认模态框 */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="确认清除"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            确定要清除所有数据吗？这个操作无法撤销。
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowClearModal(false)}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleClearData}
              className="flex-1 px-4 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors"
            >
              清除
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileScreen;
