/**
 * 吉他指板音阶可视化 - 常量定义
 */

// 指板配置
export const FRET_COUNT = 15; // 0-15品,共16个品位
export const STRING_COUNT = 6;

// 标准调弦 (从高音弦到低音弦 - High E to Low E)
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

// 品记位置 (品丝上的标记点)
export const FRET_MARKERS = {
  single: [3, 5, 7, 9, 15],  // 单圆点品记
  double: [12]                // 双圆点品记
};

// 12个半音
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 根音选项
export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 音阶系统
export const SCALE_SYSTEMS = [
  { id: 'pentatonic', name: '五声音阶 (Pentatonic)', modeCount: 2 },
  { id: 'major', name: '自然大调 (Major)', modeCount: 7 },
  { id: 'melodicMinor', name: '旋律小调 (Melodic Minor)', modeCount: 7 },
  { id: 'harmonicMinor', name: '和声小调 (Harmonic Minor)', modeCount: 7 },
  { id: 'diminished', name: '减音阶 (Diminished)', modeCount: 2 },
  { id: 'wholeTone', name: '全音阶 (Whole Tone)', modeCount: 1 }
];

// 配色方案
export const COLORS = {
  rootNote: '#EF4444',      // 红色 - 根音
  scaleNote: '#3B82F6',     // 蓝色 - 音阶音符
  fretboard: '#3E2723',     // 深棕色 - 指板背景
  fretWire: '#C0C0C0',      // 银色 - 品丝
  string: '#DAA520'         // 金色 - 弦
};

// 级数标记 (罗马数字)

