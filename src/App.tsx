import { useState, useEffect } from 'react';

// Components
import HomeScreen from './components/screens/HomeScreen';
import GlobalSettingsModal from './components/modals/GlobalSettingsModal';
import TaskResultModal from './components/common/TaskResultModal';

// Utils & Constants
import { addIds } from './utils/helpers';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  STORAGE_KEYS 
} from './utils/localStorage';
import {
  DEFAULT_TASK_LIBRARY,
  DEFAULT_POSITION_CARDS_LIBRARY,
  DEFAULT_PUNISHMENT_LIBRARY
} from './constants';

// Types
import { Player, Settings, CustomLibraries, ModalTask } from './types';

// 懒加载屏幕组件
import { lazy, Suspense } from 'react';

const TaskEditorScreen = lazy(() => import('./components/screens/TaskEditorScreen'));
const ChessGameScreen = lazy(() => import('./components/screens/ChessGameScreen'));
const PunishmentGameScreen = lazy(() => import('./components/screens/PunishmentGameScreen'));
const PositionCardsScreen = lazy(() => import('./components/screens/PositionCardsScreen'));
const PomodoroScreen = lazy(() => import('./components/screens/PomodoroScreen'));

// 加载组件
const LoadingFallback = () => (
  <div className="min-h-screen bg-pink-50 flex items-center justify-center">
    <div className="text-pink-500 text-xl font-bold">加载中...</div>
  </div>
);

export default function App() {
  // Application State
  const [currentScreen, setCurrentScreen] = useState<string>('HOME');
  const [gameStarted, setGameStarted] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Custom Libraries - 从 LocalStorage 加载
  const [customLibraries, setCustomLibraries] = useState<CustomLibraries>(() => {
    return loadFromLocalStorage(STORAGE_KEYS.CUSTOM_LIBRARIES, {
      TASK_LIBRARY: addIds(DEFAULT_TASK_LIBRARY),
      POSITION_CARDS_LIBRARY: addIds(DEFAULT_POSITION_CARDS_LIBRARY),
      PUNISHMENT_LIBRARY: addIds(DEFAULT_PUNISHMENT_LIBRARY),
    });
  });

  // Settings - 从 LocalStorage 加载
  const [settings, setSettings] = useState<Settings>(() => {
    return loadFromLocalStorage(STORAGE_KEYS.SETTINGS, {
      pomodoro: { focus: 25, break: 5 },
      chessDifficulty: 'warmup' as const,
    });
  });

  // Players - 从 LocalStorage 加载
  const [players, setPlayers] = useState<Player[]>(() => {
    return loadFromLocalStorage(STORAGE_KEYS.PLAYERS, [
      { id: 0, name: "哥哥", avatar: "👦", pos: 0, color: "bg-blue-500", gender: "male" as const },
      { id: 1, name: "妹妹", avatar: "👧", pos: 0, color: "bg-pink-500", gender: "female" as const },
    ]);
  });

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [activeTask, setActiveTask] = useState<ModalTask | null>(null);

  // 当 customLibraries 改变时，保存到 LocalStorage
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CUSTOM_LIBRARIES, customLibraries);
  }, [customLibraries]);

  // 当 settings 改变时，保存到 LocalStorage
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  // 当 players 改变时，保存到 LocalStorage
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.PLAYERS, players);
  }, [players]);

  // Game Control Functions
  const startGame = () => {
    setGameStarted(true);
    setCurrentScreen('CHESS_GAME');
  };

  const resetGame = () => {
    setGameStarted(false);
    setPlayers(prevPlayers => prevPlayers.map(p => ({ ...p, pos: 0 })));
    setCurrentPlayerIndex(0);
    setCurrentScreen('HOME');
  };

  const showTaskModal = (task: ModalTask) => {
    setActiveTask(task);
  };

  const closeTaskModal = () => {
    setActiveTask(null);
  };

  const nextTurn = () => {
    setCurrentPlayerIndex(prevIndex => (prevIndex + 1) % players.length);
  };

  // Render Screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'HOME':
        return (
          <HomeScreen 
            setCurrentScreen={setCurrentScreen}
            gameStarted={gameStarted}
            startGame={startGame}
            resetGame={resetGame}
            players={players}
            showSettingsModal={() => setShowSettingsModal(true)}
            isLibrariesLoading={false}
          />
        );
      case 'TASK_EDITOR':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <TaskEditorScreen
              setCurrentScreen={setCurrentScreen}
              customLibraries={customLibraries}
              setCustomLibraries={setCustomLibraries}
            />
          </Suspense>
        );
      case 'CHESS_GAME':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <ChessGameScreen
              setCurrentScreen={setCurrentScreen}
              players={players}
              setPlayers={setPlayers}
              currentPlayerIndex={currentPlayerIndex}
              setCurrentPlayerIndex={setCurrentPlayerIndex}
              showTaskModal={showTaskModal}
              resetGame={resetGame}
              TASK_LIBRARY_DATA={customLibraries.TASK_LIBRARY}
              POSITION_CARDS_DATA={customLibraries.POSITION_CARDS_LIBRARY}
              PUNISHMENT_DATA={customLibraries.PUNISHMENT_LIBRARY}
              settings={settings}
              setSettings={setSettings}
            />
          </Suspense>
        );
      case 'PUNISHMENT_GAME':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PunishmentGameScreen
              setCurrentScreen={setCurrentScreen}
              PUNISHMENT_DATA={customLibraries.PUNISHMENT_LIBRARY}
            />
          </Suspense>
        );
      case 'POSITION_CARDS':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PositionCardsScreen
              setCurrentScreen={setCurrentScreen}
              POSITION_CARDS_DATA={customLibraries.POSITION_CARDS_LIBRARY}
            />
          </Suspense>
        );
      case 'POMODORO':
        return (
          <Suspense fallback={<LoadingFallback />}>
            <PomodoroScreen
              setCurrentScreen={setCurrentScreen}
              settings={settings}
              setSettings={setSettings}
            />
          </Suspense>
        );
      default:
        return (
          <HomeScreen
            setCurrentScreen={setCurrentScreen}
            gameStarted={gameStarted}
            startGame={startGame}
            resetGame={resetGame}
            players={players}
            showSettingsModal={() => setShowSettingsModal(true)}
            isLibrariesLoading={false}
          />
        );
    }
  };

  return (
    <>
      {renderScreen()}
      
      {/* Task Result Modal - Only in CHESS_GAME mode */}
      {currentScreen === 'CHESS_GAME' && activeTask && (
        <TaskResultModal
          task={activeTask}
          onClose={closeTaskModal}
          onTaskCompleted={nextTurn}
        />
      )}
      
      {/* Global Settings Modal */}
      <GlobalSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        players={players}
        setPlayers={setPlayers}
      />
    </>
  );
}
