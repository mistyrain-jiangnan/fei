import React from 'react';
import { Gamepad2, User } from 'lucide-react';

interface TabBarProps {
  activeTab: 'features' | 'profile';
  onTabChange: (tab: 'features' | 'profile') => void;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl max-w-md mx-auto z-50">
      <div className="flex items-center justify-around px-4 py-3">
        <button
          onClick={() => onTabChange('features')}
          className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
            activeTab === 'features'
              ? 'bg-gradient-to-br from-pink-100 to-purple-100 text-pink-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Gamepad2 size={22} />
          <span className="text-xs font-bold">功能模块</span>
        </button>

        <button
          onClick={() => onTabChange('profile')}
          className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
            activeTab === 'profile'
              ? 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 shadow-md'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <User size={22} />
          <span className="text-xs font-bold">我的</span>
        </button>
      </div>
    </div>
  );
};

export default TabBar;
