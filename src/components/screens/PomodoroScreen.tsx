import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, RotateCcw, Pause, Play, SkipForward } from 'lucide-react';
import Modal from '../common/Modal';
import { Settings as SettingsType } from '../../types';
import { formatTime } from '../../utils/helpers';

interface PomodoroScreenProps {
  setCurrentScreen: (screen: string) => void;
  settings: SettingsType;
  setSettings: React.Dispatch<React.SetStateAction<SettingsType>>;
}

const PomodoroScreen: React.FC<PomodoroScreenProps> = ({ 
  setCurrentScreen, 
  settings, 
  setSettings 
}) => {
  const focusTime = settings.pomodoro.focus * 60; 
  const breakTime = settings.pomodoro.break * 60;  
  
  const [timeLeft, setTimeLeft] = useState(focusTime);
  const [isRunning, setIsRunning] = useState(false);
  const [isFocus, setIsFocus] = useState(true); 
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const alertMessageRef = useRef(''); 

  useEffect(() => {
    setIsRunning(false);
    setIsFocus(true);
    setTimeLeft(focusTime);
  }, [focusTime, breakTime]);

  useEffect(() => {
    if (!isRunning || timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0) {
      setIsRunning(false);
      if (isFocus) {
        alertMessageRef.current = `专注时间结束！休息 ${settings.pomodoro.break} 分钟吧。`;
        setShowConfirmModal(true);
        setIsFocus(false);
        setTimeLeft(breakTime);
      } else {
        alertMessageRef.current = `休息时间结束！继续专注 ${settings.pomodoro.focus} 分钟吧。`;
        setShowConfirmModal(true);
        setIsFocus(true);
        setTimeLeft(focusTime);
      }
    }
  }, [timeLeft, isFocus, focusTime, breakTime, settings.pomodoro.break, settings.pomodoro.focus]);

  const handlePlayPause = () => setIsRunning(!isRunning);

  const handleSkip = () => {
    setIsRunning(false);
    setIsFocus(!isFocus);
    setTimeLeft(isFocus ? breakTime : focusTime);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsFocus(true);
    setTimeLeft(focusTime);
  };
  
  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const currentTotalTime = isFocus ? focusTime : breakTime;
  const percentage = ((currentTotalTime) - timeLeft) / (currentTotalTime) * 100;
  const colorClass = isFocus ? 'text-green-500 border-green-500' : 'text-blue-500 border-blue-500';
  const progressColor = isFocus ? '#22c55e' : '#3b82f6'; // green-500 : blue-500

  return (
    <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans p-6">
      <div className="flex justify-between items-center mb-10 pt-4">
        <button 
          onClick={() => setCurrentScreen('HOME')} 
          className="p-2 bg-gray-100/80 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-black text-gray-800">情侣番茄时钟</h2>
        <button 
          onClick={() => setShowSettingsModal(true)}
          className="p-2 bg-gray-100/80 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
        >
          <Settings size={20} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center flex-col">
        <div className={`relative w-64 h-64 rounded-full border-4 ${colorClass}`}>
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage: `conic-gradient(${progressColor} ${percentage}%, #eee ${percentage}%)`,
              transition: 'background-image 1s linear',
            }}
          ></div>
          <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center flex-col">
            <span className={`text-6xl font-black ${colorClass}`}>{formatTime(timeLeft)}</span>
            <span className={`text-lg font-medium ${isFocus ? 'text-green-600' : 'text-blue-600'}`}>
              {isFocus ? '专注时间' : '休息时间'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-4 mt-12 w-full max-w-xs">
          <button
            onClick={handleReset}
            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            title="重置"
          >
            <RotateCcw size={24} />
          </button>
          <button
            onClick={handlePlayPause}
            className={`flex-1 h-16 rounded-2xl flex items-center justify-center gap-3 font-bold text-xl text-white transition-all shadow-lg active:scale-95 ${
              isRunning ? 'bg-red-500 shadow-red-200' : 'bg-gradient-to-r from-green-500 to-cyan-500 shadow-green-300'
            }`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
            <span>{isRunning ? '暂停' : '开始'}</span>
          </button>
          <button
            onClick={handleSkip}
            className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            title="跳过"
          >
            <SkipForward size={24} />
          </button>
        </div>
      </div>

      <div className="pt-8 text-center text-sm text-gray-500">
        <p>当前设置：专注 {settings.pomodoro.focus} 分钟 / 休息 {settings.pomodoro.break} 分钟</p>
        <p>一起享受高效和甜蜜的时光吧！</p>
      </div>
      
      {/* Custom Alert/Confirmation Modal */}
      <Modal isOpen={showConfirmModal} onClose={closeConfirmModal} title="时间到！">
        <p className="text-center text-gray-700 text-lg my-4">{alertMessageRef.current}</p>
        <button 
          onClick={closeConfirmModal}
          className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors"
        >
          好的
        </button>
      </Modal>
       
      {/* Settings Modal for Pomodoro */}
      <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="番茄时钟设置">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-600">专注时长 (分钟)</h4>
          <input
            type="number"
            min="1"
            max="60"
            value={settings.pomodoro.focus}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              pomodoro: { ...prev.pomodoro, focus: parseInt(e.target.value) || 1 } 
            }))}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg font-mono focus:border-green-500 transition-colors text-gray-900"
          />
          <h4 className="text-sm font-bold text-gray-600">休息时长 (分钟)</h4>
          <input
            type="number"
            min="1"
            max="30"
            value={settings.pomodoro.break}
            onChange={(e) => setSettings(prev => ({ 
              ...prev, 
              pomodoro: { ...prev.pomodoro, break: parseInt(e.target.value) || 1 } 
            }))}
            className="w-full p-3 border-2 border-gray-200 rounded-lg text-lg font-mono focus:border-blue-500 transition-colors text-gray-900"
          />
        </div>
        <button 
          onClick={() => setShowSettingsModal(false)}
          className="w-full mt-6 bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
        >
          保存设置
        </button>
      </Modal>
    </div>
  );
};

export default PomodoroScreen;
