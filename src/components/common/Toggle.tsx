import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: LucideIcon;
  colorClass: string;
}

const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, icon: Icon, colorClass }) => (
  <div 
    onClick={() => onChange(!checked)}
    className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
      checked ? `${colorClass} bg-opacity-10 border-opacity-50` : 'bg-gray-50 border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-full ${checked ? 'bg-white' : 'bg-gray-200'}`}>
        <Icon size={18} className={checked ? colorClass.replace('bg-', 'text-').replace('border-', 'text-') : 'text-gray-400'} />
      </div>
      <span className={`font-bold ${checked ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
    </div>
    <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? colorClass.replace('border-', 'bg-').split(' ')[0] : 'bg-gray-300'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
    </div>
  </div>
);

export default Toggle;
