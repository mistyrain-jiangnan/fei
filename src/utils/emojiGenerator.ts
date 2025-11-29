// 随机 Emoji 生成器

// 各种类别的 emoji 集合
const EMOJI_POOLS = {
  // 情感类
  emotions: ['😊', '😍', '🥰', '😘', '💋', '💕', '💖', '💗', '💓', '💞', '💝', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍'],
  
  // 动作类
  actions: ['👋', '🤝', '👏', '🙌', '👐', '🤲', '🙏', '✋', '🤚', '👆', '👇', '👉', '👈', '✌️', '🤞', '🤟', '🤘', '👌', '🤌', '🤏'],
  
  // 身体部位
  body: ['👀', '👁️', '👄', '👅', '👃', '👂', '🦶', '🦵', '💪', '🫂', '🫱', '🫲', '🫳', '🫴', '🫰'],
  
  // 表情动作
  faces: ['😳', '😈', '😇', '🥺', '🤭', '🤫', '🤗', '🙈', '🙊', '🙉', '💁', '🙆', '🙅', '🤷', '🤦', '🙋'],
  
  // 游戏娱乐
  games: ['🎮', '🎲', '🎯', '🎪', '🎭', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🎸', '🎺', '🎻', '🥁', '🎰', '🃏'],
  
  // 爱情浪漫
  romance: ['💐', '🌹', '🌺', '🌸', '🌼', '🌻', '💍', '💎', '👑', '🎀', '🎁', '🎈', '🎉', '🎊', '✨', '⭐', '🌟', '💫'],
  
  // 食物饮料
  food: ['🍓', '🍒', '🍑', '🍇', '🍉', '🍌', '🍍', '🥝', '🍰', '🎂', '🧁', '🍪', '🍫', '🍬', '🍭', '🍮', '🍯', '🍷', '🥂', '🍾'],
  
  // 动物
  animals: ['🐱', '🐶', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐔', '🐧'],
  
  // 自然天气
  nature: ['🌈', '☀️', '🌙', '⭐', '💫', '✨', '⚡', '🔥', '💧', '❄️', '🌊', '🌸', '🌺', '🌻', '🌹', '🌷', '🌴', '🌵', '🌾', '🍀'],
  
  // 符号标记
  symbols: ['✅', '❌', '⭕', '💯', '🔥', '💥', '💢', '💤', '💨', '💦', '💫', '💬', '💭', '🗨️', '🗯️', '💕', '💞', '💓', '💗', '💖'],
  
  // 工具物品
  objects: ['🎭', '🎨', '🖼️', '🎬', '🎪', '🎢', '🎡', '🎠', '🎰', '🧸', '🪆', '🎁', '🎀', '🎏', '🎐', '🧧', '🎑', '🧨', '🎇', '🎆'],
  
  // 服装配饰
  fashion: ['👗', '👔', '👕', '👖', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '🧢'],
  
  // 亲密暧昧
  intimate: ['🔥', '💋', '👄', '😈', '😏', '🤤', '🥵', '💦', '🍑', '🍆', '🌶️', '🔞', '⛓️', '🎀', '🕯️', '🧊', '🪶'],
  
  // 可爱甜美
  cute: ['🎀', '💗', '🌸', '🌺', '🦄', '🌈', '✨', '💫', '🧁', '🍰', '🍬', '🍭', '🧸', '🎈', '🌟', '⭐', '💖', '🫧', '🪅'],
};

// 所有 emoji 的集合
const ALL_EMOJIS = Object.values(EMOJI_POOLS).flat();

/**
 * 从指定类别或所有类别中随机选择一个 emoji
 * @param category - 可选的类别名称
 * @returns 随机的 emoji 字符串
 */
export function getRandomEmoji(category?: keyof typeof EMOJI_POOLS): string {
  if (category && EMOJI_POOLS[category]) {
    const pool = EMOJI_POOLS[category];
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return ALL_EMOJIS[Math.floor(Math.random() * ALL_EMOJIS.length)];
}

/**
 * 根据任务内容智能选择 emoji
 * @param content - 任务内容描述
 * @returns 相关的 emoji
 */
export function getSmartEmoji(content: string): string {
  const lowerContent = content.toLowerCase();
  
  // 亲密相关
  if (lowerContent.includes('亲') || lowerContent.includes('吻') || lowerContent.includes('kiss')) {
    return getRandomEmoji('intimate');
  }
  
  // 拥抱相关
  if (lowerContent.includes('抱') || lowerContent.includes('hug')) {
    return getRandomEmoji('emotions');
  }
  
  // 运动相关
  if (lowerContent.includes('深蹲') || lowerContent.includes('俯卧撑') || lowerContent.includes('运动')) {
    return getRandomEmoji('actions');
  }
  
  // 可爱相关
  if (lowerContent.includes('可爱') || lowerContent.includes('萌') || lowerContent.includes('猫')) {
    return getRandomEmoji('cute');
  }
  
  // 浪漫相关
  if (lowerContent.includes('情话') || lowerContent.includes('浪漫') || lowerContent.includes('玫瑰')) {
    return getRandomEmoji('romance');
  }
  
  // 惩罚相关
  if (lowerContent.includes('惩罚') || lowerContent.includes('绑') || lowerContent.includes('跪')) {
    return getRandomEmoji('intimate');
  }
  
  // 表演相关
  if (lowerContent.includes('表演') || lowerContent.includes('跳舞') || lowerContent.includes('唱')) {
    return getRandomEmoji('games');
  }
  
  // 默认随机
  return getRandomEmoji();
}

/**
 * 批量生成随机 emoji
 * @param count - 需要生成的数量
 * @param unique - 是否保证不重复
 * @returns emoji 数组
 */
export function getRandomEmojis(count: number, unique: boolean = false): string[] {
  if (!unique) {
    return Array.from({ length: count }, () => getRandomEmoji());
  }
  
  const result: string[] = [];
  const used = new Set<string>();
  
  while (result.length < count && used.size < ALL_EMOJIS.length) {
    const emoji = getRandomEmoji();
    if (!used.has(emoji)) {
      used.add(emoji);
      result.push(emoji);
    }
  }
  
  return result;
}

export default {
  getRandomEmoji,
  getSmartEmoji,
  getRandomEmojis,
  EMOJI_POOLS,
};
