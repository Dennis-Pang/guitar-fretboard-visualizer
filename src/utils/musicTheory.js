/**
 * 音乐理论核心算法
 */

import { NOTES, STANDARD_TUNING, FRET_COUNT } from './constants.js';
import { getScaleIntervals, getScaleDegrees } from './scaleDefinitions.js';

// 用于智能拼写的音名列表 (包含同音异名)
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 字母序列，用于确定音级字母 (C -> D -> E ...)
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * 获取音符在12音列表中的索引
 * @param {string} noteName - 音符名称 (如 'C', 'D#')
 * @returns {number} 索引 (0-11)
 */
export const getNoteIndex = (noteName) => {
  // 统一转为标准 Sharp 格式来查找索引
  const sharpIndex = NOTE_NAMES_SHARP.indexOf(noteName);
  if (sharpIndex !== -1) return sharpIndex;

  const flatIndex = NOTE_NAMES_FLAT.indexOf(noteName);
  if (flatIndex !== -1) return flatIndex;

  // 处理特殊情况 (如 E#, Fb 等，虽然目前常量中没有用)
  return 0;
};

/**
 * 根据索引获取音符名称 (默认返回Sharp格式，仅用于内部计算)
 * @param {number} index - 音符索引
 * @returns {string} 音符名称
 */
export const getNoteName = (index) => {
  const normalizedIndex = ((index % 12) + 12) % 12;
  return NOTE_NAMES_SHARP[normalizedIndex];
};

/**
 * 智能获取音符名称，基于音级和上下文
 * @param {string} rootNote - 根音
 * @param {number} intervalSum - 距离根音的半音数
 * @param {number} stepIndex - 在音阶中的第几步 (0-based)
 * @returns {string} 正确拼写的音符名称
 */
const getSmartNoteName = (rootNote, intervalSum, stepIndex) => {
  const rootIndex = getNoteIndex(rootNote);
  const targetIndex = (rootIndex + intervalSum) % 12;

  // 1. 确定目标字母
  // 根音字母在字母表中的位置
  const rootLetter = rootNote.charAt(0);
  const rootLetterIndex = NOTE_LETTERS.indexOf(rootLetter);

  // 目标字母应该是根音字母往后推 stepIndex 个
  const targetLetterIndex = (rootLetterIndex + stepIndex) % 7;
  const targetLetter = NOTE_LETTERS[targetLetterIndex];

  // 2. 尝试匹配 Sharp 或 Flat 或 Natural
  // 比如目标是 F，但实际音高对应 'E' (4半音)，那就是 Fb (不常用) 或者是 E
  // 我们的策略：优先匹配包含目标字母的变体

  // 生成所有可能的变体 (Standard only for now: Natural, Sharp, Flat)
  // 更复杂的比如 Double Sharp/Flat 暂时不处理，除非必要
  const possibleNotes = [
    targetLetter,
    targetLetter + '#',
    targetLetter + 'b'
  ];

  for (const note of possibleNotes) {
    if (getNoteIndex(note) === targetIndex) {
      return note;
    }
  }

  // 如果没有匹配到标准变体 (比如需要重升/重降，或者 E#=F 这种情况)
  // 简单的回退策略：如果是自然大调或常见调式，尽量减少变音记号
  // 这里简化处理：直接返回 Sharp 或 Flat 列表中最"干净"的一个
  // 依据：根音如果是 Flat 系列，倾向于用 Flat
  if (rootNote.includes('b') || rootNote === 'F') {
    return NOTE_NAMES_FLAT[targetIndex];
  }
  return NOTE_NAMES_SHARP[targetIndex];
};

/**
 * 获取级数显示标签
 * @param {number} interval - 距离根音的半音数
 * @param {number} scaleDegree - 音阶中的第几个音 (1-based)
 * @returns {string} 级数标签 (如 'b3', '#4')
 */
const getDegreeLabel = (interval, scaleDegree) => {
  // 标准大调音程对应表
  // 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];

  // 计算预期的大调音程
  // scaleDegree 1 -> index 0 (0 semitones)
  // scaleDegree 2 -> index 1 (2 semitones)
  // Wrap around for octaves not strictly needed here as we deal with simple modes < 12 notes usually
  const expectedMajorInterval = majorIntervals[(scaleDegree - 1) % 7];

  const diff = interval - expectedMajorInterval;

  let label = scaleDegree.toString();

  if (diff === 0) {
    return label;
  } else if (diff === -1) {
    return 'b' + label;
  } else if (diff === -2) {
    return 'bb' + label;
  } else if (diff === 1) {
    return '#' + label;
  } else if (diff === 2) {
    return '##' + label;
  }

  // Fallback
  return label;
};

/**
 * 计算音阶
 * @param {string} rootNote - 根音 (如 'C')
 * @param {string} system - 音阶系统
 * @param {string} mode - 调式
 * @returns {Array<{note: string, degree: string, isRoot: boolean}>} 音阶音符数组
 */
export const calculateScale = (rootNote, system, mode) => {
  const intervals = getScaleIntervals(system, mode);
  const explicitDegrees = getScaleDegrees(system, mode);

  if (!intervals || intervals.length === 0) {
    return [];
  }

  const scale = [];
  let currentIntervalSum = 0;

  // 根音
  scale.push({
    note: rootNote,
    degree: '1',
    isRoot: true,
    interval: 0 // 内部使用
  });

  // 计算其他音
  for (let i = 0; i < intervals.length - 1; i++) {
    currentIntervalSum += intervals[i];

    // 智能计算音名
    // i=0 是第2个音 (degree 2), stepIndex = 1
    const stepIndex = i + 1;
    let scaleDegree = i + 2; // Default 1-based degree

    // 如果有 explicitDegrees, use explicitDegrees[stepIndex]
    // explicitDegrees inclues root at index 0
    if (explicitDegrees && explicitDegrees.length > stepIndex) {
      scaleDegree = explicitDegrees[stepIndex];
    }

    const smartNote = getSmartNoteName(rootNote, currentIntervalSum, stepIndex);
    const degreeLabel = getDegreeLabel(currentIntervalSum, scaleDegree);

    scale.push({
      note: smartNote,
      degree: degreeLabel,
      isRoot: false,
      interval: currentIntervalSum
    });
  }

  return scale;
};

/**
 * 计算指板上每个位置的音符 (保留 Sharp 格式用于匹配，或者我们可以优化显示)
 * @returns {Array<Array<{note: string, fret: number}>>}
 */
export const calculateFretboardNotes = (tuning = STANDARD_TUNING, frets = FRET_COUNT) => {
  return tuning.map((openStringNote, stringIndex) => {
    const stringNotes = [];
    for (let fret = 0; fret <= frets; fret++) {
      const noteIndex = (getNoteIndex(openStringNote) + fret) % 12;
      stringNotes.push({
        noteIndex: noteIndex, // Store index for reliable matching
        defaultNote: getNoteName(noteIndex), // Default sharp name
        fret: fret,
        string: stringIndex
      });
    }
    return stringNotes;
  });
};

/**
 * 匹配音阶到指板
 */
export const matchScaleToFretboard = (scale, fretboardNotes) => {
  const highlightedPositions = [];

  // Map distinct intervals (mod 12) to scale notes
  // Note: We use interval to match, to simply bypass spelling mismatches on the fretboard grid
  const intervalMap = new Map();
  scale.forEach(scaleNote => {
    // interval calculated in calculateScale is semitones from root
    // We need normalized interval 0-11
    const normalizedInterval = scaleNote.interval % 12;
    intervalMap.set(normalizedInterval, scaleNote);
  });

  // Need Root Index to calculate interval relative to root on fretboard
  const rootIndex = getNoteIndex(scale[0].note);

  fretboardNotes.forEach((stringNotes) => {
    stringNotes.forEach(fretNote => {
      // Calculate interval of this fret relative to Scale Root
      // (NoteIndex - RootIndex + 12) % 12
      const intervalFromRoot = (fretNote.noteIndex - rootIndex + 12) % 12;

      if (intervalMap.has(intervalFromRoot)) {
        const scaleInfo = intervalMap.get(intervalFromRoot);
        highlightedPositions.push({
          string: fretNote.string,
          fret: fretNote.fret,
          note: scaleInfo.note, // Use the SMART spelling from the scale
          degree: scaleInfo.degree, // Use the SMART degree label
          isRoot: scaleInfo.isRoot
        });
      }
    });
  });

  return highlightedPositions;
};

/**
 * 获取音符的显示文本
 */
export const getNoteDisplayText = (position, showDegree) => {
  if (showDegree) {
    return position.degree;
  } else {
    return position.note;
  }
};
