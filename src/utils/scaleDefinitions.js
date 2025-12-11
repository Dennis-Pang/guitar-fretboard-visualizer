/**
 * 音阶定义 - 包含五声音阶和21个调式的音程结构
 * 音程以半音数表示 (W = 全音 = 2, H = 半音 = 1)
 */

// 五声音阶系统 (2个调式)
export const PENTATONIC_SYSTEM = {
  pentatonicMajor: {
    name: 'Pentatonic Major (大调五声)',
    intervals: [2, 2, 3, 2, 3],  // W-W-WH-W-WH
    degrees: [1, 2, 3, 5, 6],
    chords: ['6', '6/9'], // Default (not in image)
    description: '大调五声音阶,明亮开阔,常用于民谣和流行'
  },
  pentatonicMinor: {
    name: 'Pentatonic Minor (小调五声)',
    intervals: [3, 2, 2, 3, 2],  // WH-W-W-WH-W
    degrees: [1, 3, 4, 5, 7], // 对应的音程其实是 b3, 4, 5, b7
    chords: ['min7', 'min11'], // Default (not in image)
    description: '小调五声音阶,最常用的蓝调/摇滚音阶'
  }
};

// 自然大调系统 (7个调式) - Source: Image 1
export const MAJOR_SYSTEM = {
  ionian: {
    name: 'Ionian (大调)',
    intervals: [2, 2, 1, 2, 2, 2, 1],
    chords: ['maj7', 'maj9', 'maj6', 'maj6/9'],
    description: '自然大调,明亮愉快'
  },
  dorian: {
    name: 'Dorian (多利亚)',
    intervals: [2, 1, 2, 2, 2, 1, 2],
    chords: ['min7', 'min9', 'min11', 'min6', 'min13'],
    description: '小调色彩,带有爵士味'
  },
  phrygian: {
    name: 'Phrygian (弗里几亚)',
    intervals: [1, 2, 2, 2, 1, 2, 2],
    chords: ['min7', 'min7sus4(b9)'],
    description: '西班牙风格,神秘色彩'
  },
  lydian: {
    name: 'Lydian (利底亚)',
    intervals: [2, 2, 2, 1, 2, 2, 1],
    chords: ['maj7', 'maj7(#11)'],
    description: '梦幻色彩,升4音'
  },
  mixolydian: {
    name: 'Mixolydian (混合利底亚)',
    intervals: [2, 2, 1, 2, 2, 1, 2],
    chords: ['7', '9', '13', '7sus4'],
    description: '蓝调摇滚常用,降7音'
  },
  aeolian: {
    name: 'Aeolian (自然小调)',
    intervals: [2, 1, 2, 2, 1, 2, 2],
    chords: ['min7', 'min9', 'min11', 'min7(b6)'],
    description: '自然小调,忧郁感'
  },
  locrian: {
    name: 'Locrian (洛克里亚)',
    intervals: [1, 2, 2, 1, 2, 2, 2],
    chords: ['min7(b5)'],
    description: '不稳定,减五度'
  }
};

// 旋律小调系统 (7个调式) - Source: Image 2
export const MELODIC_MINOR_SYSTEM = {
  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [2, 1, 2, 2, 2, 2, 1],
    chords: ['min/maj7', 'min/maj9'],
    description: '旋律小调,升6、7音'
  },
  dorianB2: {
    name: 'Dorian b2 (Phrygian #6)',
    intervals: [1, 2, 2, 2, 2, 1, 2],
    chords: ['min7sus4(b9)'],
    description: '降2音的多利亚'
  },
  lydianAugmented: {
    name: 'Lydian Augmented',
    intervals: [2, 2, 2, 2, 1, 2, 1],
    chords: ['maj7(#5)'],
    description: '升4、5音,增强利底亚'
  },
  lydianDominant: {
    name: 'Lydian Dominant (Acoustic)',
    intervals: [2, 2, 2, 1, 2, 1, 2],
    chords: ['7(#11)'], // Image: Lydian b7
    description: '升4音,降7音'
  },
  mixolydianB6: {
    name: 'Mixolydian b6 (Hindu)',
    intervals: [2, 2, 1, 2, 1, 2, 2],
    chords: ['7', '7(b13)', '9#5'],
    description: '降6音的混合利底亚'
  },
  locrianNatural2: {
    name: 'Locrian #2 (Half-Diminished)',
    intervals: [2, 1, 2, 1, 2, 2, 2],
    chords: ['min7(b5)'], // Image: Locrian nat. 2
    description: '升2音的洛克里亚'
  },
  altered: {
    name: 'Altered (Super Locrian)',
    intervals: [1, 2, 1, 2, 2, 2, 2],
    chords: ['7 alt'], // Image: Altered Dominant
    description: '变化音阶,爵士常用'
  }
};

// 和声小调系统 (7个调式) - Source: Image 3
export const HARMONIC_MINOR_SYSTEM = {
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [2, 1, 2, 2, 1, 3, 1],
    chords: ['min/maj7'],
    description: '和声小调,升7音'
  },
  locrianNatural6: {
    name: 'Locrian #6',
    intervals: [1, 2, 2, 1, 3, 1, 2],
    chords: ['min7(b5)', 'min11(b5)'], // Image: Locrian nat. 6
    description: '升6音的洛克里亚'
  },
  ionianSharp5: {
    name: 'Ionian #5 (Augmented Major)',
    intervals: [2, 2, 1, 3, 1, 2, 1],
    chords: ['maj7(#5)'], // Image: Ionian Augmented
    description: '升5音的大调'
  },
  dorianSharp4: {
    name: 'Dorian #4 (Ukrainian Dorian)',
    intervals: [2, 1, 3, 1, 2, 1, 2],
    chords: ['min7', 'min7(b5)', 'dim7'],
    description: '升4音的多利亚'
  },
  phrygianDominant: {
    name: 'Phrygian Dominant (Spanish)',
    intervals: [1, 3, 1, 2, 1, 2, 2],
    chords: ['7', '7sus4', '7(b9)'], // Image: Phrygian Major
    description: '弗里几亚属音,西班牙风格'
  },
  lydianSharp2: {
    name: 'Lydian #2',
    intervals: [3, 1, 2, 1, 2, 2, 1],
    chords: ['maj7', 'maj7(#9)', 'dim/maj7'],
    description: '升2音的利底亚'
  },
  superLocrianDiminished: {
    name: 'Super Locrian bb7 (Altered Diminished)',
    intervals: [1, 2, 1, 2, 2, 1, 3],
    chords: ['dim7'], // Image: Altered Dominant bb7
    description: '重降7音的超洛克里亚'
  }
};

// 减音阶系统 - Source: Image 4 & 5
export const DIMINISHED_SYSTEM = {
  diminishedWholeHalf: {
    name: 'Diminished (Whole-Half)',
    intervals: [2, 1, 2, 1, 2, 1, 2, 1],
    degrees: [1, 2, 3, 4, 5, 6, 7, 7],
    chords: ['dim7'], // Image 4
    description: '减音阶(全半),常用于减七和弦'
  },
  diminishedHalfWhole: {
    name: 'Dominant Diminished (Half-Whole)',
    intervals: [1, 2, 1, 2, 1, 2, 1, 2],
    degrees: [1, 2, 3, 4, 5, 6, 7, 7],
    chords: ['7(b9)', '13(b9)'], // Image 5 related
    description: '减音阶(半全),常用于属七和弦'
  }
};

// 全音阶系统
export const WHOLE_TONE_SYSTEM = {
  wholeTone: {
    name: 'Whole Tone',
    intervals: [2, 2, 2, 2, 2, 2],
    degrees: [1, 2, 3, 5, 6, 7],
    chords: ['7(#5)'], // Default
    description: '全音阶,梦幻模糊,无中心感'
  }
};

// 获取所有调式列表 (用于选择器)
export const getAllModes = (system) => {
  switch (system) {
    case 'pentatonic':
      return Object.keys(PENTATONIC_SYSTEM).map(key => ({
        id: key,
        ...PENTATONIC_SYSTEM[key]
      }));
    case 'major':
      return Object.keys(MAJOR_SYSTEM).map(key => ({
        id: key,
        ...MAJOR_SYSTEM[key]
      }));
    case 'melodicMinor':
      return Object.keys(MELODIC_MINOR_SYSTEM).map(key => ({
        id: key,
        ...MELODIC_MINOR_SYSTEM[key]
      }));
    case 'harmonicMinor':
      return Object.keys(HARMONIC_MINOR_SYSTEM).map(key => ({
        id: key,
        ...HARMONIC_MINOR_SYSTEM[key]
      }));
    case 'diminished':
      return Object.keys(DIMINISHED_SYSTEM).map(key => ({
        id: key,
        ...DIMINISHED_SYSTEM[key]
      }));
    case 'wholeTone':
      return Object.keys(WHOLE_TONE_SYSTEM).map(key => ({
        id: key,
        ...WHOLE_TONE_SYSTEM[key]
      }));
    default:
      return [];
  }
};

// 获取音阶音程
export const getScaleIntervals = (system, mode) => {
  const systems = {
    pentatonic: PENTATONIC_SYSTEM,
    major: MAJOR_SYSTEM,
    melodicMinor: MELODIC_MINOR_SYSTEM,
    harmonicMinor: HARMONIC_MINOR_SYSTEM,
    diminished: DIMINISHED_SYSTEM,
    wholeTone: WHOLE_TONE_SYSTEM
  };

  return systems[system]?.[mode]?.intervals || [];
};

export const getScaleDegrees = (system, mode) => {
  const systems = {
    pentatonic: PENTATONIC_SYSTEM,
    major: MAJOR_SYSTEM,
    melodicMinor: MELODIC_MINOR_SYSTEM,
    harmonicMinor: HARMONIC_MINOR_SYSTEM,
    diminished: DIMINISHED_SYSTEM,
    wholeTone: WHOLE_TONE_SYSTEM
  };

  return systems[system]?.[mode]?.degrees;
}
