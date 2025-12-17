/**
 * Scale Definitions - Includes Pentatonic and 21 Mode Intervals
 * Intervals are represented in semitones (W = Whole = 2, H = Half = 1)
 */

// Pentatonic System (2 Modes)
export const PENTATONIC_SYSTEM = {
  pentatonicMajor: {
    name: 'Pentatonic Major',
    intervals: [2, 2, 3, 2, 3],  // W-W-WH-W-WH
    degrees: [1, 2, 3, 5, 6],
    chords: ['6', '6/9'], // Default (not in image)
    description: 'Pentatonic Major scale, bright and open, often used in folk and pop.'
  },
  pentatonicMinor: {
    name: 'Pentatonic Minor',
    intervals: [3, 2, 2, 3, 2],  // WH-W-W-WH-W
    degrees: [1, 3, 4, 5, 7], // Corresponding intervals are b3, 4, 5, b7
    chords: ['min7', 'min11'], // Default (not in image)
    description: 'Pentatonic Minor scale, the most common blues/rock scale.'
  }
};

// Natural Major System (7 Modes) - Source: Image 1
export const MAJOR_SYSTEM = {
  ionian: {
    name: 'Ionian',
    intervals: [2, 2, 1, 2, 2, 2, 1],
    chords: ['maj7', 'maj9', 'maj6', 'maj6/9'],
    description: 'Natural Major, bright and happy.'
  },
  dorian: {
    name: 'Dorian',
    intervals: [2, 1, 2, 2, 2, 1, 2],
    chords: ['min7', 'min9', 'min11', 'min6', 'min13'],
    description: 'Minor quality with a jazzy feel.'
  },
  phrygian: {
    name: 'Phrygian',
    intervals: [1, 2, 2, 2, 1, 2, 2],
    chords: ['min7', 'min7sus4(b9)'],
    description: 'Spanish style, mysterious quality.'
  },
  lydian: {
    name: 'Lydian',
    intervals: [2, 2, 2, 1, 2, 2, 1],
    chords: ['maj7', 'maj7(#11)'],
    description: 'Dreamy quality, raised 4th.'
  },
  mixolydian: {
    name: 'Mixolydian',
    intervals: [2, 2, 1, 2, 2, 1, 2],
    chords: ['7', '9', '13', '7sus4'],
    description: 'Common in blues rock, flat 7th.'
  },
  aeolian: {
    name: 'Aeolian',
    intervals: [2, 1, 2, 2, 1, 2, 2],
    chords: ['min7', 'min9', 'min11', 'min7(b6)'],
    description: 'Natural Minor, sad feel.'
  },
  locrian: {
    name: 'Locrian',
    intervals: [1, 2, 2, 1, 2, 2, 2],
    chords: ['min7(b5)'],
    description: 'Unstable, diminished 5th.'
  }
};

// Melodic Minor System (7 Modes) - Source: Image 2
export const MELODIC_MINOR_SYSTEM = {
  melodicMinor: {
    name: 'Melodic Minor',
    intervals: [2, 1, 2, 2, 2, 2, 1],
    chords: ['min/maj7', 'min/maj9'],
    description: 'Melodic Minor, raised 6th and 7th.'
  },
  dorianB2: {
    name: 'Dorian b2 (Phrygian #6)',
    intervals: [1, 2, 2, 2, 2, 1, 2],
    chords: ['min7sus4(b9)'],
    description: 'Dorian with a flat 2nd.'
  },
  lydianAugmented: {
    name: 'Lydian Augmented',
    intervals: [2, 2, 2, 2, 1, 2, 1],
    chords: ['maj7(#5)'],
    description: 'Raised 4th and 5th.'
  },
  lydianDominant: {
    name: 'Lydian Dominant (Acoustic)',
    intervals: [2, 2, 2, 1, 2, 1, 2],
    chords: ['7(#11)'], // Image: Lydian b7
    description: 'Raised 4th, flat 7th.'
  },
  mixolydianB6: {
    name: 'Mixolydian b6 (Hindu)',
    intervals: [2, 2, 1, 2, 1, 2, 2],
    chords: ['7', '7(b13)', '9#5'],
    description: 'Mixolydian with a flat 6th.'
  },
  locrianNatural2: {
    name: 'Locrian #2 (Half-Diminished)',
    intervals: [2, 1, 2, 1, 2, 2, 2],
    chords: ['min7(b5)'], // Image: Locrian nat. 2
    description: 'Locrian with a natural 2nd.'
  },
  altered: {
    name: 'Altered (Super Locrian)',
    intervals: [1, 2, 1, 2, 2, 2, 2],
    chords: ['7 alt'], // Image: Altered Dominant
    description: 'Altered scale, common in jazz.'
  }
};

// Harmonic Minor System (7 Modes) - Source: Image 3
export const HARMONIC_MINOR_SYSTEM = {
  harmonicMinor: {
    name: 'Harmonic Minor',
    intervals: [2, 1, 2, 2, 1, 3, 1],
    chords: ['min/maj7'],
    description: 'Harmonic Minor, raised 7th.'
  },
  locrianNatural6: {
    name: 'Locrian #6',
    intervals: [1, 2, 2, 1, 3, 1, 2],
    chords: ['min7(b5)', 'min11(b5)'], // Image: Locrian nat. 6
    description: 'Locrian with a raised 6th.'
  },
  ionianSharp5: {
    name: 'Ionian #5 (Augmented Major)',
    intervals: [2, 2, 1, 3, 1, 2, 1],
    chords: ['maj7(#5)'], // Image: Ionian Augmented
    description: 'Major with a raised 5th.'
  },
  dorianSharp4: {
    name: 'Dorian #4 (Ukrainian Dorian)',
    intervals: [2, 1, 3, 1, 2, 1, 2],
    chords: ['min7', 'min7(b5)', 'dim7'],
    description: 'Dorian with a raised 4th.'
  },
  phrygianDominant: {
    name: 'Phrygian Dominant (Spanish)',
    intervals: [1, 3, 1, 2, 1, 2, 2],
    chords: ['7', '7sus4', '7(b9)'], // Image: Phrygian Major
    description: 'Phrygian Dominant, Spanish style.'
  },
  lydianSharp2: {
    name: 'Lydian #2',
    intervals: [3, 1, 2, 1, 2, 2, 1],
    chords: ['maj7', 'maj7(#9)', 'dim/maj7'],
    description: 'Lydian with a raised 2nd.'
  },
  superLocrianDiminished: {
    name: 'Super Locrian bb7 (Altered Diminished)',
    intervals: [1, 2, 1, 2, 2, 1, 3],
    chords: ['dim7'], // Image: Altered Dominant bb7
    description: 'Super Locrian with a double flat 7th.'
  }
};

// Diminished System - Source: Image 4 & 5
export const DIMINISHED_SYSTEM = {
  diminishedWholeHalf: {
    name: 'Diminished (Whole-Half)',
    intervals: [2, 1, 2, 1, 2, 1, 2, 1],
    degrees: [1, 2, 3, 4, 5, 6, 7, 7],
    chords: ['dim7'], // Image 4
    description: 'Diminished scale (Whole-Half).'
  },
  diminishedHalfWhole: {
    name: 'Dominant Diminished (Half-Whole)',
    intervals: [1, 2, 1, 2, 1, 2, 1, 2],
    degrees: [1, 2, 3, 4, 5, 6, 7, 7],
    chords: ['7(b9)', '13(b9)'], // Image 5 related
    description: 'Diminished scale (Half-Whole), used for dominant 7th chords.'
  }
};

// Whole Tone System
export const WHOLE_TONE_SYSTEM = {
  wholeTone: {
    name: 'Whole Tone',
    intervals: [2, 2, 2, 2, 2, 2],
    degrees: [1, 2, 3, 5, 6, 7],
    chords: ['7(#5)'], // Default
    description: 'Whole Tone scale, dreamy and ambiguous.'
  }
};

// Get all modes list (for selector)
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

// Get scale intervals
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
