import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { getSmartEmoji } from '../../utils/emojiGenerator';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  libraryConfig: any;
  onUpdate: (updatedItem: any, newMode: string, newSubMode: string) => void;
  currentMode: string;
  currentSubMode: string;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  libraryConfig,
  onUpdate,
  currentMode,
  currentSubMode
}) => {
  const [formData, setFormData] = useState<any>({});
  const [selectedMode, setSelectedMode] = useState(currentMode);
  const [selectedSubMode, setSelectedSubMode] = useState(currentSubMode);

  useEffect(() => {
    if (isOpen && item) {
      setFormData({
        content: item.content || '',
        icon: item.icon || '',
        title: item.title || '',
        description: item.description || ''
      });
      setSelectedMode(currentMode);
      setSelectedSubMode(currentSubMode);
    }
  }, [isOpen, item, currentMode, currentSubMode]); // Add isOpen to dependencies

  if (!isOpen || !item) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAutoEmoji = () => {
    const textContent = formData.content || formData.title || '';
    if (textContent) {
      const emoji = getSmartEmoji(textContent);
      setFormData({ ...formData, icon: emoji });
    }
  };

  const handleSubmit = () => {
    const updatedItem = {
      ...item,
      ...formData,
      icon: formData.icon || item.icon
    };
    onUpdate(updatedItem, selectedMode, selectedSubMode);
    onClose();
  };

  // 渲染表单字段（根据实际字段配置动态渲染）
  const renderFields = () => {
    // 将字段字符串转换为完整字段配置
    const fieldConfigs = libraryConfig.fields.map((fieldKey: string) => {
      if (fieldKey === 'content') {
        return { key: 'content', label: '内容', type: 'input', placeholder: '请输入内容' };
      } else if (fieldKey === 'title') {
        return { key: 'title', label: '标题', type: 'input', placeholder: '请输入标题' };
      } else if (fieldKey === 'description') {
        return { key: 'description', label: '描述', type: 'textarea', placeholder: '请输入描述' };
      } else if (fieldKey === 'icon') {
        return { key: 'icon', label: '图标', type: 'icon', placeholder: '请输入表情符号' };
      }
      return { key: fieldKey, label: fieldKey, type: 'input', placeholder: `请输入${fieldKey}` };
    });

    return (
      <React.Fragment>
        {fieldConfigs.map((field: any) => {
          if (field.key === 'icon') {
            // 图标字段特殊处理
            return (
              <div key={field.key} className="mb-3">
                <label className="block text-xs font-bold text-gray-600 mb-1">{field.label}</label>
                <div className="flex gap-2 items-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    {formData.icon ? formData.icon : '❓'}
                  </div>
                  <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={e => handleInputChange('icon', e.target.value)}
                    placeholder={field.placeholder}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:border-pink-400 focus:outline-none"
                  />
                  <button
                    onClick={handleAutoEmoji}
                    className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-1 self-stretch"
                    title="自动生成表情"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            );
          } else if (field.type === 'textarea') {
            // 多行文本字段
            return (
              <div key={field.key} className="mb-3">
                <label className="block text-xs font-bold text-gray-600 mb-1">{field.label}</label>
                <textarea
                  value={formData[field.key] || ''}
                  onChange={e => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:border-pink-400 focus:outline-none resize-none"
                />
              </div>
            );
          } else {
            // 普通文本字段
            return (
              <div key={field.key} className="mb-3">
                <label className="block text-xs font-bold text-gray-600 mb-1">{field.label}</label>
                <input
                  type="text"
                  value={formData[field.key] || ''}
                  onChange={e => handleInputChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-800 focus:border-pink-400 focus:outline-none"
                />
              </div>
            );
          }
        })}
      </React.Fragment>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-black text-gray-800">编辑{libraryConfig.name}</h3>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 模式选择 */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">选择分类</label>
            <div className="flex flex-wrap gap-2">
              {libraryConfig.modes.map((mode: any) => (
                <button
                  key={mode.key}
                  onClick={() => setSelectedMode(mode.key)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    selectedMode === mode.key
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mode.name}
                </button>
              ))}
            </div>
          </div>

          {/* 子模式选择 */}
          {libraryConfig.subModes && libraryConfig.subModes.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">选择子分类</label>
              <div className="flex flex-wrap gap-2">
                {libraryConfig.subModes.map((subMode: any) => (
                  <button
                    key={subMode.key}
                    onClick={() => setSelectedSubMode(subMode.key)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedSubMode === subMode.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {subMode.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 表单字段 */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-gray-700 mb-3">内容编辑</h4>
            {renderFields()}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-400 text-white font-bold py-3 rounded-xl hover:bg-gray-500 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            更新
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditItemModal;
