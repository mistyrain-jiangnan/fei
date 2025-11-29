import React from 'react';
import { Heart, Gamepad2 } from 'lucide-react';
import { ModalTask } from '../../types';

interface TaskResultModalProps {
  task: ModalTask | null;
  onClose: () => void;
  onTaskCompleted: () => void;
}

const TaskResultModal: React.FC<TaskResultModalProps> = ({ task, onClose, onTaskCompleted }) => {
  if (!task) return null;

  const handleClose = () => {
    onClose();
    if (!task.isWinner) {
      onTaskCompleted();
    }
  };

  const Icon = task.isWinner ? Heart : Gamepad2;
  const color = task.isWinner ? 'bg-green-500' : 'bg-orange-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className={`bg-white w-full max-w-xs rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative text-center border-t-8 ${task.isWinner ? 'border-green-500' : 'border-orange-500'}`}>
        
        <div className={`w-16 h-16 mx-auto ${color} rounded-full flex items-center justify-center text-white text-3xl mb-4 shadow-lg`}>
          <Icon size={30} fill="currentColor" />
        </div>
        
        <h3 className="text-2xl font-black text-gray-800 mb-3">{task.title}</h3>
        
        <p className="text-lg font-medium text-gray-700 leading-relaxed mb-6">
          {task.content}
        </p>

        <button 
          onClick={handleClose}
          className={`w-full ${color} text-white font-bold py-3 rounded-xl shadow-md active:scale-98 transition-all`}
        >
          {task.isWinner ? '查看奖励 (游戏结束)' : '完成任务/继续'}
        </button>
      </div>
    </div>
  );
};

export default TaskResultModal;
