import React, { useState, useMemo } from 'react';
import { X, RefreshCw, Zap, Flame } from 'lucide-react';
import Modal from '../common/Modal';
import { Player, Settings, TaskLibrary, PositionCardsLibrary, PunishmentLibrary, ModalTask, Role } from '../../types';
import { TOTAL_STEPS, GRID_COLS, GRID_ROWS, TASK_TRIGGER_CHANCE } from '../../constants';
import { generateMapPath } from '../../utils/helpers';

// 导入骰子 GIF 图片
import dice1Gif from '../../images/sifter1.gif';
import dice2Gif from '../../images/sifter2.gif';
import dice3Gif from '../../images/sifter3.gif';
import dice4Gif from '../../images/sifter4.gif';
import dice5Gif from '../../images/sifter5.gif';
import dice6Gif from '../../images/sifter6.gif';

const DICE_GIFS = [dice1Gif, dice2Gif, dice3Gif, dice4Gif, dice5Gif, dice6Gif];

interface ChessGameScreenProps {
  setCurrentScreen: (screen: string) => void;
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  currentPlayerIndex: number;
  setCurrentPlayerIndex: React.Dispatch<React.SetStateAction<number>>;
  showTaskModal: (task: ModalTask) => void;
  resetGame: () => void;
  TASK_LIBRARY_DATA: TaskLibrary;
  POSITION_CARDS_DATA: PositionCardsLibrary;
  PUNISHMENT_DATA: PunishmentLibrary;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

const ChessGameScreen: React.FC<ChessGameScreenProps> = ({
  setCurrentScreen,
  players,
  setPlayers,
  currentPlayerIndex,
  setCurrentPlayerIndex,
  showTaskModal,
  resetGame,
  TASK_LIBRARY_DATA,
  POSITION_CARDS_DATA,
  PUNISHMENT_DATA,
  settings,
  setSettings
}) => {
  const [diceRoll, setDiceRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const difficultyKey = settings.chessDifficulty;

  // 动态棋盘尺寸计算
  const boardRows = settings.boardRows || GRID_ROWS;
  const boardCols = settings.boardCols || GRID_COLS;
  const DYNAMIC_TOTAL_STEPS = boardRows * boardCols;
  const MAP_PATH = useMemo(() => generateMapPath(DYNAMIC_TOTAL_STEPS), [DYNAMIC_TOTAL_STEPS]);

  const difficultyName = difficultyKey === 'warmup' ? '热身' : 
                         difficultyKey === 'intimate' ? '亲昵' : 
                         '挑战';
  
  // 掷骰子逻辑
  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    const newRoll = Math.floor(Math.random() * 6) + 1;
    setDiceRoll(null);

    setTimeout(() => {
      setDiceRoll(newRoll);
      setTimeout(() => {
        movePiece(newRoll);
        setIsRolling(false);
      }, 800);
    }, 300);
  };

  // 移动棋子逻辑
  const movePiece = (steps: number) => {
    const startPos = currentPlayer.pos;
    const targetPos = Math.min(startPos + steps, DYNAMIC_TOTAL_STEPS - 1);
    let currentStep = 0;

    const moveStep = () => {
      if (currentStep < steps) {
        currentStep++;
        setPlayers(prevPlayers => {
          const newPlayers = [...prevPlayers];
          newPlayers[currentPlayerIndex].pos = Math.min(startPos + currentStep, DYNAMIC_TOTAL_STEPS - 1);
          return newPlayers;
        });

        setTimeout(moveStep, 150);
      } else {
        const finalPos = targetPos;

        // 检查是否获胜
        if (finalPos === DYNAMIC_TOTAL_STEPS - 1) {
          setTimeout(() => {
            showTaskModal({
              title: "游戏结束！",
              content: `${currentPlayer.name} 获胜！请为另一方准备一个小惊喜作为惩罚。`,
              icon: "🎉",
              isWinner: true
            });
          }, 500);
          return;
        }

        // 随机任务触发
        if (Math.random() < TASK_TRIGGER_CHANCE) {
          const roleKey = currentPlayer.gender; // 自动使用当前玩家的性别
          const difficultyKey = settings.chessDifficulty;
          
          // 根据难度关联不同的任务池
          let taskPool: any[] = [];
          let taskSource = '';
          
          if (difficultyKey === 'warmup') {
            // 热身 → 姿势卡牌任务（所有模式）
            taskSource = '姿势卡牌';
            const positionCards = POSITION_CARDS_DATA[roleKey];
            if (positionCards) {
              // 合并所有姿势卡牌模式
              const allCards = [
                ...(positionCards.cute || []),
                ...(positionCards.fun || []),
                ...(positionCards.deep || [])
              ];
              taskPool = allCards.map(card => ({
                content: `${card.title}: ${card.description}`,
                icon: card.icon
              }));
            }
          } else if (difficultyKey === 'intimate') {
            // 亲密 → 飞行棋自定义任务（所有难度）
            taskSource = '飞行棋任务';
            const chessTasks = TASK_LIBRARY_DATA[roleKey];
            if (chessTasks) {
              // 合并所有三个难度的任务
              taskPool = [
                ...(chessTasks.warmup || []),
                ...(chessTasks.intimate || []),
                ...(chessTasks.adventure || [])
              ];
            }
          } else if (difficultyKey === 'adventure') {
            // 挑战 → 惩罚游戏任务（所有难度）
            taskSource = '惩罚游戏';
            const punishments = PUNISHMENT_DATA[roleKey];
            if (punishments) {
              // 合并所有惩罚难度
              taskPool = [
                ...(punishments.mild || []),
                ...(punishments.medium || []),
                ...(punishments.intense || [])
              ];
            }
          }
          
          if (taskPool && taskPool.length > 0) {
            const randomTask = taskPool[Math.floor(Math.random() * taskPool.length)];
            setTimeout(() => {
              showTaskModal({ 
                title: `${difficultyName}任务 (${taskSource})`, 
                content: randomTask.content, 
                icon: randomTask.icon,
                isWinner: false,
              });
            }, 500);
            return;
          } else {
            setTimeout(() => {
              showTaskModal({ 
                title: "提示", 
                content: `当前【${roleKey === 'male' ? '男生' : '女生'} - ${difficultyName} - ${taskSource}】任务库为空，请前往管理页面添加任务！`, 
                icon: "⚠️",
                isWinner: false,
              });
            }, 500);
            return;
          }
        }
        
        setTimeout(nextTurn, 500);
      }
    };
    
    moveStep();
  };

  const nextTurn = () => {
    setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
    setDiceRoll(null);
  };

  const handleDifficultyChange = (key: 'warmup' | 'intimate' | 'adventure') => {
    setSettings(prev => ({ ...prev, chessDifficulty: key }));
    setShowDifficultyModal(false);
  };
  
  const renderMap = () => {
    return (
      <div
        className="w-full h-full grid gap-0.5 p-1 bg-gradient-to-br from-white to-gray-50 border-4 border-purple-300 rounded-3xl shadow-2xl"
        style={{ gridTemplateColumns: `repeat(${boardCols}, minmax(0, 1fr))` }}
      >
        {MAP_PATH.map((_tile, index) => {
          const isStart = index === 0;
          const isEnd = index === DYNAMIC_TOTAL_STEPS - 1;
          
          const playersOnTile = players.filter(p => p.pos === index);
          
          let bgColor = 'bg-gradient-to-br from-pink-50 to-purple-50';
          let icon: string | number = index + 1;
          let textClass = 'text-gray-400 font-medium';
          let borderClass = 'border-gray-200';

          if (isStart) {
            bgColor = 'bg-gradient-to-br from-green-400 to-emerald-500';
            icon = "🏁";
            textClass = 'text-white font-black text-lg';
            borderClass = 'border-green-600';
          } else if (isEnd) {
            bgColor = 'bg-gradient-to-br from-red-500 to-pink-600';
            icon = "🎯";
            textClass = 'text-white font-black text-lg';
            borderClass = 'border-red-600';
          }

          return (
            <div
              key={index}
              className={`w-full aspect-square ${bgColor} flex flex-col items-center justify-center relative border ${borderClass} rounded shadow-sm transition-all duration-200 p-0.5 hover:scale-105`}
            >
              <span className={`text-[8px] ${textClass} leading-none ${isStart || isEnd ? '' : 'opacity-60'}`}>
                {icon}
              </span>

              <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-0.5 p-0.5">
                {playersOnTile.map(p => (
                  <div 
                    key={p.id}
                    className={`w-4 h-4 rounded-full ${p.color} flex items-center justify-center text-xs shadow-lg border-2 border-white ring-1 ring-yellow-400 animate-bounce`}
                    style={{ 
                      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      animation: 'bounce 1s infinite'
                    }}
                  >
                    <span className="text-white drop-shadow">{p.avatar}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      {/* 顶部导航栏 */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 sticky top-0 z-10 flex justify-between items-center border-b border-gray-200 shadow-sm">
        <button 
          onClick={() => setCurrentScreen('HOME')} 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center text-white shadow-md">
            <span className="text-lg">🎲</span>
          </div>
          <h2 className="text-lg font-black bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">情侣飞行棋</h2>
        </div>
        <div className='flex items-center gap-1'>
          <button 
            onClick={() => setShowDifficultyModal(true)}
            className="p-2 text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
            title="设置难度"
          >
            <Flame size={18} />
          </button>
          <button 
            onClick={resetGame}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
            title="重置游戏"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* 当前玩家信息区 */}
      <div className="px-4 py-3 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl shadow-md border-2 border-white">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${currentPlayer.color} flex items-center justify-center text-2xl shadow-lg border-2 border-white`}>
              {currentPlayer.avatar}
            </div>
            <div>
              <p className="text-xs text-purple-600 font-bold">当前回合</p>
              <p className="font-black text-lg text-gray-800">{currentPlayer.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-medium">进度</p>
            <p className="font-black text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              {currentPlayer.pos + 1}/{TOTAL_STEPS}
            </p>
          </div>
        </div>
        <div className="mt-2 px-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
              {difficultyKey === 'warmup' ? '🌟 热身' : difficultyKey === 'intimate' ? '💕 亲密' : '🔥 挑战'}
            </span>
            <span className="text-gray-500">
              {players.map((p, i) => (
                <span key={p.id} className={i === currentPlayerIndex ? 'font-bold text-purple-600' : ''}>
                  {p.name}
                  {i < players.length - 1 && ' vs '}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* 棋盘区域 - 占据中间95%空间 */}
      <div className="flex-1 p-2 flex items-center justify-center overflow-y-auto">
        <div className="w-[95%] h-[95%] flex items-center justify-center">
          {renderMap()}
        </div>
      </div>

      {/* 底部骰子控制区 */}
      <div className="p-4 bg-white/95 backdrop-blur-md border-t-2 border-purple-100 shadow-2xl z-20">
        {/* 骰子显示 */}
        <div className="flex justify-center mb-4">
          <div className={`relative w-32 h-32 rounded-2xl flex items-center justify-center transition-all duration-500 ${
            diceRoll 
            ? 'bg-gradient-to-br from-pink-400 to-purple-500 shadow-2xl shadow-purple-300 scale-110' 
            : 'bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg'
          }`}>
            {diceRoll ? (
              <img 
                src={DICE_GIFS[diceRoll - 1]} 
                alt={`骰子 ${diceRoll}`}
                className={`w-20 h-20 object-contain ${isRolling ? 'animate-spin' : 'animate-in zoom-in-50 duration-500'}`}
              />
            ) : (
              <div className="text-center">
                <Zap size={32} className="text-gray-400 mx-auto mb-1" />
                <span className="text-xs text-gray-500 font-medium">点击掷骰</span>
              </div>
            )}
            {diceRoll && !isRolling && (
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-lg font-black text-white">{diceRoll}</span>
              </div>
            )}
          </div>
        </div>

        {/* 掷骰子按钮 */}
        <button
          onClick={rollDice}
          disabled={isRolling || currentPlayer.pos === TOTAL_STEPS - 1}
          className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-purple-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {isRolling ? (
            <>
              <RefreshCw size={24} className="animate-spin" />
              <span>移动中...</span>
            </>
          ) : currentPlayer.pos === TOTAL_STEPS - 1 ? (
             <>
               <span>🎉 已到达终点！</span>
             </>
          ) : (
            <>
              <Zap size={24} className="animate-pulse" />
              <span>掷骰子 GO!</span>
            </>
          )}
        </button>
      </div>

      {/* 难度选择模态框 */}
      <Modal isOpen={showDifficultyModal} onClose={() => setShowDifficultyModal(false)} title="游戏设置">
        <div className="space-y-6">
          {/* 难度选择 */}
          <div>
            <p className="text-sm font-bold text-gray-700 mb-3">🎯 选择难度（决定任务来源）</p>
            <p className="text-xs text-gray-500 mb-3">💡 任务会根据当前玩家的性别自动选择</p>
            {[
              { key: 'warmup', name: '🌟 热身', desc: '抽取姿势卡牌任务', color: 'bg-green-100 border-green-500', source: '姿势卡牌库' },
              { key: 'intimate', name: '💕 亲密', desc: '抽取飞行棋自定义任务', color: 'bg-pink-100 border-pink-500', source: '飞行棋任务库' },
              { key: 'adventure', name: '🔥 挑战', desc: '抽取惩罚游戏任务', color: 'bg-red-100 border-red-500', source: '惩罚游戏库' }
            ].map(mode => {
              let taskCount = 0;
              
              // 根据难度计算任务数量（男生+女生总和）
              if (mode.key === 'warmup') {
                // 姿势卡牌
                ['male', 'female'].forEach(role => {
                  const cards = POSITION_CARDS_DATA[role as Role];
                  if (cards) {
                    taskCount += (cards.cute?.length || 0) + (cards.fun?.length || 0) + (cards.deep?.length || 0);
                  }
                });
              } else if (mode.key === 'intimate') {
                // 飞行棋任务
                taskCount = (TASK_LIBRARY_DATA.male?.intimate?.length || 0) + (TASK_LIBRARY_DATA.female?.intimate?.length || 0);
              } else if (mode.key === 'adventure') {
                // 惩罚游戏
                ['male', 'female'].forEach(role => {
                  const punishments = PUNISHMENT_DATA[role as Role];
                  if (punishments) {
                    taskCount += (punishments.mild?.length || 0) + (punishments.medium?.length || 0) + (punishments.intense?.length || 0);
                  }
                });
              }
              
              return (
                <div 
                  key={mode.key}
                  onClick={() => handleDifficultyChange(mode.key as 'warmup' | 'intimate' | 'adventure')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all mb-3 ${
                    difficultyKey === mode.key 
                    ? mode.color + ' shadow-md' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <p className="font-bold text-gray-800">{mode.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{mode.desc}</p>
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    任务来源: {mode.source}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    (当前库中包含 {taskCount} 个任务)
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChessGameScreen;
