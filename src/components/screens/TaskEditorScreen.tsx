import React, { useState, useEffect } from 'react';
import { X, Database, Plus, Trash2, Sparkles, Download, Upload, FileDown, Settings, Edit2 } from 'lucide-react';
import { CustomLibraries } from '../../types';
import { getLibraryConfig } from '../../utils/helpers';
import { getRandomEmoji, getSmartEmoji } from '../../utils/emojiGenerator';
import EditItemModal from '../modals/EditItemModal';

interface TaskEditorScreenProps {
  setCurrentScreen: (screen: string) => void;
  customLibraries: CustomLibraries;
  setCustomLibraries: React.Dispatch<React.SetStateAction<CustomLibraries>>;
}

const TaskEditorScreen: React.FC<TaskEditorScreenProps> = ({ 
  setCurrentScreen, 
  customLibraries, 
  setCustomLibraries
}) => {
  const [currentLibraryKey, setCurrentLibraryKey] = useState('TASK_LIBRARY');
  const [currentModeKey, setCurrentModeKey] = useState('male'); // 角色: male/female
  const [currentSubMode, setCurrentSubMode] = useState('warmup'); // 子模式(第二层)
  const [newItem, setNewItem] = useState({ content: '', icon: '', title: '', description: '' });
  const [showSettingsMenu, setShowSettingsMenu] = useState(false); // 设置菜单状态
  const [editingItem, setEditingItem] = useState<any>(null); // 正在编辑的项目
  const [showEditModal, setShowEditModal] = useState(false); // 编辑弹窗状态
  
  const libraryConfig = getLibraryConfig(currentLibraryKey);
  
  // 调试：输出当前库的结构
  useEffect(() => {
    console.log('📚 当前库:', currentLibraryKey);
    console.log('👤 当前角色:', currentModeKey);
    console.log('🎯 当前子模式:', currentSubMode);
    console.log('📊 库数据:', (customLibraries as any)[currentLibraryKey]);
    console.log('📝 当前数据:', (customLibraries as any)[currentLibraryKey]?.[currentModeKey]?.[currentSubMode]);
  }, [currentLibraryKey, currentModeKey, currentSubMode, customLibraries]);
  
  // 所有库现在都使用双重维度: 角色[子模式]
  const getCurrentData = () => {
    return (customLibraries as any)[currentLibraryKey]?.[currentModeKey]?.[currentSubMode] || [];
  };
  
  const currentData = getCurrentData();

  useEffect(() => {
    if (libraryConfig && libraryConfig.subModes && libraryConfig.subModes.length > 0) {
      // 切换库时,重置子模式为第一个
      if (!libraryConfig.subModes.some(m => m.key === currentSubMode)) {
        setCurrentSubMode(libraryConfig.subModes[0].key);
      }
    }
  }, [currentLibraryKey, libraryConfig, currentSubMode]);

  const handleFieldChange = (field: string, value: string) => {
    setNewItem(prev => ({ ...prev, [field]: value }));
  };

  const handleAddItem = async () => {
    if (!libraryConfig) return;
    
    const itemToAdd: any = {};
    libraryConfig.fields.forEach(field => {
      if (field === 'icon') {
        // 如果用户没有填写 icon，自动生成随机 emoji
        const userIcon = newItem[field as keyof typeof newItem].trim().substring(0, 1);
        if (userIcon) {
          itemToAdd[field] = userIcon;
        } else {
          // 根据内容智能选择 emoji
          const contentField = newItem.content || newItem.title || '';
          itemToAdd[field] = contentField ? getSmartEmoji(contentField) : getRandomEmoji();
        }
      } else {
        itemToAdd[field] = newItem[field as keyof typeof newItem].trim();
      }
    });

    if (Object.values(itemToAdd).some(v => v === '') && currentLibraryKey !== 'TASK_LIBRARY') {
      console.error("所有字段不能为空");
      return;
    }

    const textContent = newItem.content || newItem.title || '';
    const finalIcon = newItem.icon.trim() || getSmartEmoji(textContent) || getRandomEmoji();

    const newItemWithId = {
      ...newItem,
      id: Date.now(),
      icon: finalIcon,
    };

    // 清理 newItem 中所有字段的空格
    Object.keys(newItemWithId).forEach(key => {
      if (typeof (newItemWithId as any)[key] === 'string') {
        (newItemWithId as any)[key] = (newItemWithId as any)[key].trim();
      }
    });

    setCustomLibraries(prev => {
      const newLibraries = { ...prev };
      const library: any = newLibraries[currentLibraryKey as keyof CustomLibraries];

      if (libraryConfig?.subModes) {
        const subModeArray = library[currentModeKey]?.[currentSubMode] || [];
        library[currentModeKey] = {
          ...library[currentModeKey],
          [currentSubMode]: [...subModeArray, newItemWithId]
        };
      } else {
        const modeArray = library[currentModeKey] || [];
        library[currentModeKey] = [...modeArray, newItemWithId];
      }
      
      return newLibraries;
    });

    setNewItem({ content: '', icon: '', title: '', description: '' });
    console.log("✅ 新任务已添加到库中");
  };

  const handleDeleteItem = async (itemId: string) => {
    const newLibraries = { ...customLibraries };
    
    // 所有库都使用双重维度: 角色[子模式]
    const roleData = (newLibraries as any)[currentLibraryKey]?.[currentModeKey] || {};
    let newArray = roleData[currentSubMode] || [];
    newArray = newArray.filter((item: any) => item.id !== itemId);
    
    (newLibraries as any)[currentLibraryKey] = {
      ...((newLibraries as any)[currentLibraryKey] || {}),
      [currentModeKey]: {
        ...roleData,
        [currentSubMode]: newArray
      }
    };
    
    setCustomLibraries(newLibraries);

    // 数据会自动通过 App.tsx 的 useEffect 保存到 LocalStorage
    console.log("✅ 任务已从库中删除");
  };

  // 编辑项目 - 打开编辑 Modal
  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  // 更新编辑的项目 - 从 Modal 调用
  const handleUpdateItemFromModal = (updatedItem: any, newMode: string, newSubMode: string) => {
    const currentLibrary: any = customLibraries[currentLibraryKey as keyof CustomLibraries];
    
    // 如果分类没变,直接更新
    if (newMode === currentModeKey && newSubMode === currentSubMode) {
      const currentData = libraryConfig?.subModes 
        ? currentLibrary[currentModeKey][currentSubMode]
        : currentLibrary[currentModeKey];
      
      const newArray = currentData.map((item: any) => 
        item.id === updatedItem.id ? updatedItem : item
      );
      
      setCustomLibraries(prev => ({
        ...prev,
        [currentLibraryKey]: libraryConfig?.subModes
          ? {
              ...currentLibrary,
              [currentModeKey]: {
                ...currentLibrary[currentModeKey],
                [currentSubMode]: newArray
              }
            }
          : {
              ...currentLibrary,
              [currentModeKey]: newArray
            }
      }));
    } else {
      // 分类变了,需要从旧位置删除,添加到新位置
      // 1. 从当前位置删除
      const currentData = libraryConfig?.subModes 
        ? currentLibrary[currentModeKey][currentSubMode]
        : currentLibrary[currentModeKey];
      
      const filteredArray = currentData.filter((item: any) => item.id !== updatedItem.id);
      
      // 2. 添加到新位置
      const targetData = libraryConfig?.subModes 
        ? currentLibrary[newMode][newSubMode]
        : currentLibrary[newMode];
      
      const newTargetArray = [...targetData, updatedItem];
      
      // 3. 更新状态
      setCustomLibraries(prev => {
        const updatedLibrary: any = { ...currentLibrary };
        
        if (libraryConfig?.subModes) {
          updatedLibrary[currentModeKey] = {
            ...updatedLibrary[currentModeKey],
            [currentSubMode]: filteredArray
          };
          updatedLibrary[newMode] = {
            ...updatedLibrary[newMode],
            [newSubMode]: newTargetArray
          };
        } else {
          updatedLibrary[currentModeKey] = filteredArray;
          updatedLibrary[newMode] = newTargetArray;
        }
        
        return {
          ...prev,
          [currentLibraryKey]: updatedLibrary
        };
      });
      
      // 切换到新的分类
      setCurrentModeKey(newMode);
      setCurrentSubMode(newSubMode);
    }
    
    setShowEditModal(false);
    setEditingItem(null);
    console.log("✅ 项目已更新");
  };

  // 导出当前库为 JSON 文件
  const handleExportLibrary = () => {
    const currentLibrary = (customLibraries as any)[currentLibraryKey];
    if (!currentLibrary) {
      alert('当前库没有数据！');
      return;
    }

    const dataStr = JSON.stringify(currentLibrary, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentLibraryKey}_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ ${currentLibraryKey} 已导出`);
  };

  // 导入 JSON 文件 - 支持单个库或全部库
  const handleImportLibrary = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        
        // 检查是否为全库导入格式 (包含 taskLibrary, positionCardsLibrary, punishmentLibrary)
        const isAllLibraries = importedData.taskLibrary || importedData.positionCardsLibrary || importedData.punishmentLibrary;
        
        if (isAllLibraries) {
          // 全库导入模式
          const newLibraries = { ...customLibraries };
          let importCount = 0;
          
          if (importedData.taskLibrary) {
            newLibraries.TASK_LIBRARY = importedData.taskLibrary;
            importCount++;
          }
          if (importedData.positionCardsLibrary) {
            newLibraries.POSITION_CARDS_LIBRARY = importedData.positionCardsLibrary;
            importCount++;
          }
          if (importedData.punishmentLibrary) {
            newLibraries.PUNISHMENT_LIBRARY = importedData.punishmentLibrary;
            importCount++;
          }
          
          setCustomLibraries(newLibraries);
          alert(`✅ 导入成功！已导入 ${importCount} 个库。`);
          console.log(`✅ 全库导入完成: ${importCount} 个库`);
        } else {
          // 单库导入模式 (原有逻辑)
          // 验证数据结构
          if (!importedData.male || !importedData.female) {
            alert('导入失败：数据格式不正确！\n\n单库格式需要包含 male 和 female 两个角色。\n全库格式需要包含 taskLibrary、positionCardsLibrary 或 punishmentLibrary。');
            return;
          }

          const newLibraries = { ...customLibraries };
          (newLibraries as any)[currentLibraryKey] = importedData;
          setCustomLibraries(newLibraries);
          
          alert('✅ 导入成功！');
          console.log(`✅ ${currentLibraryKey} 已导入`);
        }
      } catch (error) {
        alert('导入失败：文件格式错误！');
        console.error('导入错误:', error);
      }
    };
    reader.readAsText(file);
    
    // 重置 input，允许重复导入同一文件
    event.target.value = '';
  };

  // 下载模板文件
  const handleDownloadTemplate = () => {
    const config = getLibraryConfig(currentLibraryKey);
    if (!config) return;

    // 创建模板数据
    const template = {
      male: {} as any,
      female: {} as any
    };

    // 为每个子模式创建示例数据
    config.subModes?.forEach(subMode => {
      const exampleItem: any = {};
      config.fields.forEach(field => {
        switch(field) {
          case 'content':
            exampleItem.content = '示例任务内容';
            break;
          case 'icon':
            exampleItem.icon = '🎯';
            break;
          case 'title':
            exampleItem.title = '示例标题';
            break;
          case 'description':
            exampleItem.description = '示例描述';
            break;
          case 'color':
            exampleItem.color = 'bg-pink-100';
            break;
          case 'textColor':
            exampleItem.textColor = 'text-pink-800';
            break;
        }
      });
      exampleItem.id = 'example-id-1';

      template.male[subMode.key] = [exampleItem];
      template.female[subMode.key] = [exampleItem];
    });

    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentLibraryKey}_template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ ${currentLibraryKey} 模板已下载`);
  };

  const renderInputs = () => {
    if (!libraryConfig) return null;
    
    return libraryConfig.fields.map(field => {
      let label = '';
      let type = 'text';
      let placeholder = '';

      switch(field) {
        case 'content':
          label = '内容/任务描述';
          placeholder = '例如: 亲吻对方嘴唇 5 秒';
          break;
        case 'icon':
          label = 'Emoji/图标';
          placeholder = '留空自动生成 ✨';
          type = 'text';
          break;
        case 'title':
          label = '卡牌标题';
          placeholder = '例如: 甜蜜时刻';
          break;
        case 'description':
          label = '详细描述';
          placeholder = '例如: 闭眼等待对方亲吻';
          break;
        default:
          return null;
      }

      return (
        <div key={field} className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {field === 'icon' ? (
            <div className="flex gap-2">
              <input
                type={type}
                value={newItem[field as keyof typeof newItem]}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                placeholder={placeholder}
                maxLength={1}
                className="flex-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400 text-center text-xl"
              />
              <button
                type="button"
                onClick={() => {
                  const contentField = newItem.content || newItem.title || '';
                  const emoji = contentField ? getSmartEmoji(contentField) : getRandomEmoji();
                  handleFieldChange('icon', emoji);
                }}
                className="px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition-all shadow-md flex items-center gap-1 text-sm font-medium"
                title="随机生成 Emoji"
              >
                <Sparkles size={16} />
                随机
              </button>
            </div>
          ) : (
            <input
              type={type}
              value={newItem[field as keyof typeof newItem]}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              placeholder={placeholder}
              maxLength={100}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500 transition-colors text-gray-900 placeholder-gray-400"
            />
          )}
        </div>
      );
    });
  };

  if (!libraryConfig) return null;

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative font-sans">
      {/* 顶部导航栏 */}
      <div className="bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <button 
            onClick={() => setCurrentScreen('HOME')} 
            className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Database size={20} className="text-pink-500" />
            <span className="font-bold text-gray-800 tracking-tight">任务库管理</span>
          </div>
          
          {/* 设置按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Settings size={20} />
            </button>

            {/* 设置下拉菜单 */}
            {showSettingsMenu && (
              <>
                {/* 遮罩层 */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowSettingsMenu(false)}
                />
                
                {/* 菜单内容 */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                  <div className="p-2 space-y-1">
                    {/* 下载模板 */}
                    <button
                      onClick={() => {
                        handleDownloadTemplate();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <FileDown size={18} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">下载模板</div>
                        <div className="text-xs text-gray-500">下载导入模板文件</div>
                      </div>
                    </button>

                    {/* 导入数据 */}
                    <label className="w-full flex items-center gap-3 px-4 py-3 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors cursor-pointer">
                      <Upload size={18} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">导入数据</div>
                        <div className="text-xs text-gray-500">从文件导入任务</div>
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => {
                          handleImportLibrary(e);
                          setShowSettingsMenu(false);
                        }}
                        className="hidden"
                      />
                    </label>

                    {/* 导出数据 */}
                    <button
                      onClick={() => {
                        handleExportLibrary();
                        setShowSettingsMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Download size={18} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">导出数据</div>
                        <div className="text-xs text-gray-500">导出当前库为JSON</div>
                      </div>
                    </button>

                    {/* 分隔线 */}
                    <div className="border-t border-gray-200 my-2"></div>

                    {/* 重置数据 */}
                    <button
                      onClick={() => {
                        setShowSettingsMenu(false);
                        if (confirm('确定要重置当前库的所有数据吗？这将恢复到默认数据！')) {
                          const config = getLibraryConfig(currentLibraryKey);
                          if (config) {
                            setCustomLibraries(prev => ({
                              ...prev,
                              [currentLibraryKey]: config.defaultData
                            }));
                            alert('已重置为默认数据！');
                          }
                        }
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    >
                      <Database size={18} />
                      <div className="flex-1 text-left">
                        <div className="font-medium">重置数据</div>
                        <div className="text-xs text-gray-500">恢复为默认数据</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="flex space-x-2 mb-4">
          {['TASK_LIBRARY', 'POSITION_CARDS_LIBRARY', 'PUNISHMENT_LIBRARY'].map(key => {
            const config = getLibraryConfig(key);
            return (
              <button
                key={key}
                onClick={() => {
                  setCurrentLibraryKey(key);
                  setNewItem({ content: '', icon: '', title: '', description: '' });
                }}
                className={`flex-1 p-2 text-sm font-medium rounded-xl transition-all ${
                  currentLibraryKey === key 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {config?.name}
              </button>
            );
          })}
        </div>

        <div className="flex space-x-2 mb-6 p-2 bg-gray-100 rounded-xl overflow-x-auto">
          {libraryConfig.modes.map(mode => (
            <button
              key={mode.key}
              onClick={() => setCurrentModeKey(mode.key)}
              className={`px-4 py-1 text-xs font-semibold rounded-full transition-all flex-shrink-0 ${
                currentModeKey === mode.key
                ? 'bg-white text-pink-600 shadow-inner'
                : 'bg-gray-100 text-gray-500 hover:text-pink-500'
              }`}
            >
              {mode.name}
            </button>
          ))}
        </div>

        {/* 子模式选择器 (第二层分类) - 所有库都显示 */}
        {libraryConfig.subModes && libraryConfig.subModes.length > 0 && (
          <div className="flex space-x-2 mb-6 p-2 bg-blue-50 rounded-xl overflow-x-auto">
            {libraryConfig.subModes.map(subMode => (
              <button
                key={subMode.key}
                onClick={() => setCurrentSubMode(subMode.key)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all flex-shrink-0 ${
                  currentSubMode === subMode.key
                  ? 'bg-white text-blue-600 shadow-md scale-105 border-2 border-blue-400'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {subMode.name}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white p-4 rounded-xl shadow-lg mb-6 border border-pink-100">
          <h4 className="text-lg font-bold text-pink-600 mb-3 flex items-center gap-2">
            <Plus size={18} />
            添加新{libraryConfig.name} - {libraryConfig.modes.find(m => m.key === currentModeKey)?.name}
            {libraryConfig.subModes && (
              <span className="text-sm font-normal text-gray-500">
                ({libraryConfig.subModes.find(m => m.key === currentSubMode)?.name})
              </span>
            )}
          </h4>
          {renderInputs()}
          <button
            onClick={handleAddItem}
            className="w-full bg-green-500 text-white font-bold py-2 rounded-xl mt-3 hover:bg-green-600 transition-colors"
          >
            保存到库
          </button>
        </div>

        <h4 className="text-sm font-bold text-gray-600 uppercase tracking-widest mb-3">
          现有 {currentData.length} 个项目
        </h4>
        <div className="grid grid-cols-2 gap-3 pb-8">
          {currentData.map((item: any, index: number) => (
            <div key={item.id || index} className="flex flex-col bg-white p-3 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-2 mb-2">
                <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                  {item.icon || item.title?.substring(0, 1) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  {item.title && <p className="font-bold text-gray-800 text-sm truncate">{item.title}</p>}
                  <p className={`text-xs ${item.title ? 'text-gray-500' : 'font-bold text-gray-800'} line-clamp-2`}>
                    {item.content || item.description}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => handleEditItem(item)}
                  className="flex-1 p-2 text-blue-500 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-xs font-medium"
                  title="编辑"
                >
                  <Edit2 size={14} className="inline mr-1" />
                  编辑
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id || index)}
                  className="flex-1 p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                  title="删除"
                >
                  <Trash2 size={14} className="inline mr-1" />
                  删除
                </button>
              </div>
            </div>
          ))}
          {currentData.length === 0 && (
            <div className="col-span-2 text-center text-gray-400 py-6">该模式下暂无自定义卡牌。请添加！</div>
          )}
        </div>
      </div>

      {/* 编辑 Modal */}
      <EditItemModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        item={editingItem}
        libraryConfig={libraryConfig}
        onUpdate={handleUpdateItemFromModal}
        currentMode={currentModeKey}
        currentSubMode={currentSubMode}
      />
    </div>
  );
};

export default TaskEditorScreen;
