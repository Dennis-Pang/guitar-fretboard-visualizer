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
const getSmartNoteName = (rootNote, intervalSum, stepIndex, scaleDegree) => {
  const rootIndex = getNoteIndex(rootNote);
  const targetIndex = (rootIndex + intervalSum) % 12;

  // 1. 确定目标字母
  // 根音字母在字母表中的位置
  const rootLetter = rootNote.charAt(0);
  const rootLetterIndex = NOTE_LETTERS.indexOf(rootLetter);

  // 优先使用真实的级数来确定字母(如五声音阶跳过2级)
  let letterShift = stepIndex;
  if (typeof scaleDegree === 'number' && Number.isFinite(scaleDegree)) {
    letterShift = (scaleDegree - 1) % 7;
  }

  // 目标字母应该是根音字母往后推 letterShift 个
  const targetLetterIndex = (rootLetterIndex + letterShift + 7) % 7;
  const targetLetter = NOTE_LETTERS[targetLetterIndex];

  // 根据与自然大调的偏移猜测使用降号还是升号
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  let preferredAccidental = null;
  if (typeof scaleDegree === 'number' && Number.isFinite(scaleDegree)) {
    const expectedMajorInterval = majorIntervals[(scaleDegree - 1) % 7];
    const diff = intervalSum - expectedMajorInterval;
    if (diff < 0) preferredAccidental = 'flat';
    if (diff > 0) preferredAccidental = 'sharp';
  }

  // 2. 尝试匹配 Sharp 或 Flat 或 Natural
  // 比如目标是 F，但实际音高对应 'E' (4半音)，那就是 Fb (不常用) 或者是 E
  // 我们的策略：优先匹配包含目标字母的变体

  // 生成所有可能的变体 (Standard only for now: Natural, Sharp, Flat)
  // 更复杂的比如 Double Sharp/Flat 暂时不处理，除非必要
  const possibleNotes = [targetLetter];
  const sharpVariant = `${targetLetter}#`;
  const flatVariant = `${targetLetter}b`;

  if (preferredAccidental === 'flat') {
    possibleNotes.push(flatVariant, sharpVariant);
  } else if (preferredAccidental === 'sharp') {
    possibleNotes.push(sharpVariant, flatVariant);
  } else {
    possibleNotes.push(sharpVariant, flatVariant);
  }

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

    const smartNote = getSmartNoteName(rootNote, currentIntervalSum, stepIndex, scaleDegree);
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

/**
 * 计算和弦转位
 * @param {Array<{string: number, fret: number, note: string}>} selectedNotes - 用户选中的音符
 * @param {number} totalFrets - 指板总品数
 * @returns {Array<{name: string, color: string, notes: Array<Object>}>} 转位组
 */
export const calculateInversions = (selectedNotes, totalFrets = FRET_COUNT) => {
  if (!selectedNotes || selectedNotes.length < 2) return [];

  // 1. 提取去重后的音级序列 (0-11)
  const chordTones = [...new Set(selectedNotes.map(p => getNoteIndex(p.note)))].sort((a, b) => a - b);
  const toneCount = chordTones.length;

  const inversions = [];
  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow']; // 颜色代号，将在组件中映射

  // 初始形状 (按弦排序)
  let currentShape = [...selectedNotes].sort((a, b) => a.string - b.string);

  // 生成 N 个转位 (包括原位)
  for (let i = 0; i < toneCount; i++) {
    const inversionName = i === 0 ? 'Root Position' : `${i}${getOrdinalSuffix(i)} Inversion`;

    // 如果是第一次迭代(i=0), 直接使用用户的选择(经过排序)作为原位
    // 注意: 用户选择的可能已经是某种转位, 但我们在上下文中将其视为"起始"
    // 或者, 我们可以重新标准化位置, 但为了尊重用户输入, 我们保留 i=0 为 original selection

    let shape;
    if (i === 0) {
      shape = currentShape.map(n => ({
        ...n,
        // 重新计算 degree 可能是必要的，如果我们需要准确的 degree 显示
        // 这里暂时保留原始 note info
      }));
    } else {
      // 基于上一个形状计算下一个
      const prevShape = inversions[i - 1].notes;
      shape = prevShape.map(prevNote => {
        // 找到当前音在 chordTones 中的位置
        const currentToneIndex = chordTones.indexOf(getNoteIndex(prevNote.note));

        // 下一个目标音 (循环)
        const nextToneIndex = (currentToneIndex + 1) % toneCount;
        const targetPitchClass = chordTones[nextToneIndex];

        // 在同弦上寻找位置
        // 策略: 寻找 > prevFret 的最近位置. 如果超出指板, 则回绕到低要把位
        // 这样可以模拟在指板上不断上行的效果, 直到尽头

        const nextNoteName = getNoteName(targetPitchClass); // 获取标准Sharp名

        // 计算目标 fret
        // basic calculation: find smallest k >= 0 such that (stringOpen + k) % 12 == targetPitchClass
        // constraint: k > prevFret (ascend)
        // logic: k = prevFret + distance
        const currentPitch = (getNoteIndex(prevNote.note) + 12) % 12; // sanity check, should equal chordTones[currentToneIndex]
        const dist = (targetPitchClass - currentPitch + 12) % 12;

        // dist is semitones to next pitch class up
        // minimal move up is dist, or dist + 12, etc.
        let nextFret = prevNote.fret + (dist === 0 ? 12 : dist); // If same note, must move octave up

        // 如果超出了指板范围, 尝试寻找该弦上最低的可用位置
        if (nextFret > totalFrets) {
          // Find lowest instance on string
          // openString note index
          const openNoteIndex = getNoteIndex(STANDARD_TUNING[prevNote.string]);
          // target note index
          // diff = target - open
          let lowFret = (targetPitchClass - openNoteIndex + 12) % 12;
          nextFret = lowFret;
        }

        return {
          string: prevNote.string,
          fret: nextFret,
          note: nextNoteName,
          degree: '?', // 可以重新计算如果需要
          isRoot: false // 只是个标记
        };
      });
    }

    inversions.push({
      name: inversionName,
      color: colors[i % colors.length],
      notes: shape
    });
  }

  return inversions;
};

const getOrdinalSuffix = (i) => {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};
