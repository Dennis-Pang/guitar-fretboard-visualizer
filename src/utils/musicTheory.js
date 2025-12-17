/**
 * Music Theory Core Algorithms
 */

import { NOTES, STANDARD_TUNING, FRET_COUNT } from './constants.js';
import { getScaleIntervals, getScaleDegrees } from './scaleDefinitions.js';

// List of note names for smart spelling (including enharmonic equivalents)
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Letter sequence for determining note letters (C -> D -> E ...)
const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

/**
 * Get the index of a note in the 12-note list
 * @param {string} noteName - Note name (e.g., 'C', 'D#')
 * @returns {number} Index (0-11)
 */
export const getNoteIndex = (noteName) => {
  // Unify to standard Sharp format for index lookup
  const sharpIndex = NOTE_NAMES_SHARP.indexOf(noteName);
  if (sharpIndex !== -1) return sharpIndex;

  const flatIndex = NOTE_NAMES_FLAT.indexOf(noteName);
  if (flatIndex !== -1) return flatIndex;

  // Handle special cases (e.g., E#, Fb, though currently unused in constants)
  return 0;
};

/**
 * Get note name by index (Default returns Sharp format, used for internal calculation only)
 * @param {number} index - Note index
 * @returns {string} Note name
 */
export const getNoteName = (index) => {
  const normalizedIndex = ((index % 12) + 12) % 12;
  return NOTE_NAMES_SHARP[normalizedIndex];
};

/**
 * Smartly get note name based on degree and context
 * @param {string} rootNote - Root note
 * @param {number} intervalSum - Semitones from root
 * @param {number} stepIndex - Steps in the scale (0-based)
 * @returns {string} Correctly spelled note name
 */
const getSmartNoteName = (rootNote, intervalSum, stepIndex, scaleDegree) => {
  const rootIndex = getNoteIndex(rootNote);
  const targetIndex = (rootIndex + intervalSum) % 12;

  // 1. Determine target letter
  // Root letter position in alphabet
  const rootLetter = rootNote.charAt(0);
  const rootLetterIndex = NOTE_LETTERS.indexOf(rootLetter);

  // Prefer actual degrees for letter determination (e.g. pentatonic skips 2nd)
  let letterShift = stepIndex;
  if (typeof scaleDegree === 'number' && Number.isFinite(scaleDegree)) {
    letterShift = (scaleDegree - 1) % 7;
  }

  // Target letter should be letterShift positions after root letter
  const targetLetterIndex = (rootLetterIndex + letterShift + 7) % 7;
  const targetLetter = NOTE_LETTERS[targetLetterIndex];

  // Guess accidental based on offset from natural major
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];
  let preferredAccidental = null;
  if (typeof scaleDegree === 'number' && Number.isFinite(scaleDegree)) {
    const expectedMajorInterval = majorIntervals[(scaleDegree - 1) % 7];
    const diff = intervalSum - expectedMajorInterval;
    if (diff < 0) preferredAccidental = 'flat';
    if (diff > 0) preferredAccidental = 'sharp';
  }

  // 2. Try to match Sharp or Flat or Natural
  // e.g. Target F, but pitch is 'E' (4 semitones), so it's Fb (uncommon) or E
  // Strategy: Prioritize variant containing target letter

  // Generate all possible variants (Standard only for now: Natural, Sharp, Flat)
  // Complex ones like Double Sharp/Flat ignored unless necessary
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

  // If no standard variant matched (e.g. need Double Sharp/Flat, or E#=F)
  // Simple fallback: If natural major or common mode, minimize accidentals
  // Simplified: Return cleanest one from Sharp or Flat lists
  // Basis: If root is Flat, prefer Flat
  if (rootNote.includes('b') || rootNote === 'F') {
    return NOTE_NAMES_FLAT[targetIndex];
  }
  return NOTE_NAMES_SHARP[targetIndex];
};

/**
 * Get degree display label
 * @param {number} interval - Semitones from root
 * @param {number} scaleDegree - Degree in scale (1-based)
 * @returns {string} Degree label (e.g., 'b3', '#4')
 */
const getDegreeLabel = (interval, scaleDegree) => {
  // Standard Major Intervals
  // 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11
  const majorIntervals = [0, 2, 4, 5, 7, 9, 11];

  // Calculate expected major interval
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
 * Calculate Scale
 * @param {string} rootNote - Root note (e.g., 'C')
 * @param {string} system - Scale system
 * @param {string} mode - Scale mode
 * @returns {Array<{note: string, degree: string, isRoot: boolean}>} Scale notes array
 */
export const calculateScale = (rootNote, system, mode) => {
  const intervals = getScaleIntervals(system, mode);
  const explicitDegrees = getScaleDegrees(system, mode);

  if (!intervals || intervals.length === 0) {
    return [];
  }

  const scale = [];
  let currentIntervalSum = 0;

  // Root
  scale.push({
    note: rootNote,
    degree: '1',
    isRoot: true,
    interval: 0 // Internal use
  });

  // Calculate other notes
  for (let i = 0; i < intervals.length - 1; i++) {
    currentIntervalSum += intervals[i];

    // Smart note naming
    // i=0 is 2nd note (degree 2), stepIndex = 1
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
 * Calculate notes on fretboard (Keeps Sharp format for matching)
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
 * Match scale to fretboard
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
 * Get display text for note
 */
export const getNoteDisplayText = (position, showDegree) => {
  if (showDegree) {
    return position.degree;
  } else {
    return position.note;
  }
};

/**
 * Calculate Chord Inversions
 * @param {Array<{string: number, fret: number, note: string}>} selectedNotes - User selected notes
 * @param {number} totalFrets - Total frets
 * @returns {Array<{name: string, color: string, notes: Array<Object>}>} Inversions group
 */
export const calculateInversions = (selectedNotes, totalFrets = FRET_COUNT) => {
  if (!selectedNotes || selectedNotes.length < 2) return [];

  // 1. Extract distinct pitch classes (0-11)
  const chordTones = [...new Set(selectedNotes.map(p => getNoteIndex(p.note)))].sort((a, b) => a - b);
  const toneCount = chordTones.length;

  const inversions = [];
  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow']; // Color codes mapped in component

  // Initial shape (sorted by string)
  let currentShape = [...selectedNotes].sort((a, b) => a.string - b.string);

  // Generate N inversions (including root position)
  for (let i = 0; i < toneCount; i++) {
    const inversionName = i === 0 ? 'Root Position' : `${i}${getOrdinalSuffix(i)} Inversion`;

    // If first iteration (i=0), use user selection (sorted) as root position
    // Note: User selection might already be an inversion, but we treat it as "start"
    // Or we could normalize, but to respect user input, we keep i=0 as original selection

    let shape;
    if (i === 0) {
      shape = currentShape.map(n => ({
        ...n,
        // Recalculating degree might be necessary if we need accurate degree display
        // Keeping original note info for now
      }));
    } else {
      // Calculate next shape based on previous
      const prevShape = inversions[i - 1].notes;
      shape = prevShape.map(prevNote => {
        // Find current note in chordTones
        const currentToneIndex = chordTones.indexOf(getNoteIndex(prevNote.note));

        // Next target note (cyclic)
        const nextToneIndex = (currentToneIndex + 1) % toneCount;
        const targetPitchClass = chordTones[nextToneIndex];

        // Find position on same string
        // Strategy: Find nearest position > prevFret. If exceeds fretboard, wrap to low frets
        // Simulates ascending on the string until end

        const nextNoteName = getNoteName(targetPitchClass); // Get standard Sharp name

        // Calculate target fret
        // basic calculation: find smallest k >= 0 such that (stringOpen + k) % 12 == targetPitchClass
        // constraint: k > prevFret (ascend)
        // logic: k = prevFret + distance
        const currentPitch = (getNoteIndex(prevNote.note) + 12) % 12; // sanity check, should equal chordTones[currentToneIndex]
        const dist = (targetPitchClass - currentPitch + 12) % 12;

        // dist is semitones to next pitch class up
        // minimal move up is dist, or dist + 12, etc.
        let nextFret = prevNote.fret + (dist === 0 ? 12 : dist); // If same note, must move octave up

        // If exceeds fretboard range, try to find lowest available position on string
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
          degree: '?', // Recalculate if needed
          isRoot: false // Just a flag
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

/**
 * Calculate Diatonic Series
 * @param {Array<{string: number, fret: number, note: string}>} selectedNotes - User selected notes
 * @param {string} rootNote - Key Root Note
 * @param {string} system - Scale System
 * @param {string} mode - Scale Mode
 * @param {number} totalFrets - Fret count
 * @returns {Array<{name: string, color: string, notes: Array<Object>}>} Diatonic series
 */
export const calculateDiatonic = (selectedNotes, rootNote, scaleSystem, mode, totalFrets = FRET_COUNT) => {
  if (!selectedNotes || selectedNotes.length === 0) return [];

  // 1. Get full scale
  const scale = calculateScale(rootNote, scaleSystem, mode);
  if (!scale || scale.length === 0) return [];

  // Get degrees definition if available
  const explicitDegrees = getScaleDegrees(scaleSystem, mode);

  // 2. Map selected notes to scale indices
  // We need to know which index in the scale (0, 1, 2...) each selected note corresponds to.
  // We use note name to match.
  const scaleNoteNames = scale.map(s => s.note);

  // Helper to find index in scale (handling enharmonics loosely by index checking if name fails?)
  // For now, assume 'calculateScale' smart spelling matches fretboard spelling or we check indexes.
  const scaleNoteIndices = scaleNoteNames.map(n => getNoteIndex(n));

  const selectionIndices = selectedNotes.map(pos => {
    const noteIndex = getNoteIndex(pos.note);
    const idx = scaleNoteIndices.indexOf(noteIndex);
    return {
      ...pos,
      scaleIndex: idx, // -1 if not in scale
      originalNoteIndex: noteIndex
    };
  });

  // Filter out notes not in scale? Or keep them static?
  // Request implies we are moving scale degrees. If note is chromatic, undefined behavior.
  // We will filter only in-scale notes for generating the sequence.
  const validSelection = selectionIndices.filter(s => s.scaleIndex !== -1);

  if (validSelection.length === 0) return [];

  const diatonicSeries = [];
  const colors = ['blue', 'green', 'orange', 'purple', 'red', 'yellow', 'blue']; // 7 steps
  const scaleLength = scale.length;

  // We sort validSelection by string/fret to maintain "shape" logic
  // But wait, user order preference? User said "1735 -> 2146". 
  // If user selected randomly, we might want to respect that structure or just spatial.
  // Spatial (String/Fret) is safer for visual rendering.
  const sortedSelection = [...validSelection].sort((a, b) => a.string - b.string || a.fret - b.fret);

  // Generate scaleLength steps (usually 7)
  for (let step = 0; step < scaleLength; step++) {
    // Current Scale Root for this Step
    // Step 0: Root is scale[0] (C)
    // Step 1: Root is scale[1] (D)
    // ...
    const stepRootObj = scale[step];
    const stepRootIndex = getNoteIndex(stepRootObj.note);

    const stepNotes = sortedSelection.map(item => {
      // Calculate new scale index
      const nextScaleIndex = (item.scaleIndex + step) % scaleLength;
      const targetScaleNoteObj = scale[nextScaleIndex];
      const targetNoteIndex = getNoteIndex(targetScaleNoteObj.note);

      // Calculate visual properties
      // 1. Note Name
      const noteName = targetScaleNoteObj.note;

      // 2. Degree relative to Step Root
      // We calculate interval from stepRoot to targetNote
      const interval = (targetNoteIndex - stepRootIndex + 12) % 12;

      // Calculate estimated degree for getDegreeLabel
      let scaleDegree = -1;

      // If we have explicit degrees (e.g. 1, 2, 3, 4...)
      // We want the degree of 'target' RELATIVE to 'stepRoot'.
      // Assuming heptatonic-like degrees (modulo 7 behavior)
      if (explicitDegrees && explicitDegrees.length > step && explicitDegrees.length > nextScaleIndex) {
        const rootDeg = explicitDegrees[step];
        const targetDeg = explicitDegrees[nextScaleIndex];
        // Calculate relative degree 1-7
        // (Target - Root)
        let diff = targetDeg - rootDeg;
        // Normalize diff to 0-6 range (wrapper 7)
        while (diff < 0) diff += 7;
        diff = diff % 7;
        scaleDegree = diff + 1;
      } else {
        // Fallback based on indices (assuming 1-step = 1-degree)
        let diff = nextScaleIndex - step;
        while (diff < 0) diff += scaleLength;
        scaleDegree = (diff % 7) + 1;
      }

      const degree = getDegreeLabel(interval, scaleDegree);

      // 3. Fret Position
      // Find position on the same string
      // Logic: Find smallest fret >= prevFret (of previous step)
      // If step == 0, use original fret.

      let targetFret = item.fret;

      if (step > 0) {
        // Check previous step's fret for this string/item
        // validSelection is parallel to diatonicSeries[step-1].notes?
        // sort order is preserved.
        const prevNote = diatonicSeries[step - 1].notes.find(n => n.initialKey === `${item.string}-${item.fret}`);
        if (prevNote) {
          const prevFret = prevNote.fret;
          const openStringIndex = getNoteIndex(STANDARD_TUNING[item.string]);
          // We want fret such that (open + fret) % 12 == targetNoteIndex
          // AND fret >= prevFret (usually asc, unless wrapping)

          // dist from prevNote to targetNote
          // But wait, we just need targetNote on this string.

          // Calc 'min' fret for this note on string
          const baseFret = (targetNoteIndex - openStringIndex + 12) % 12;

          // We want nearest fret >= prevFret
          // k * 12 + baseFret >= prevFret
          let k = 0;
          while ((k * 12 + baseFret) < prevFret) {
            k++;
          }
          // If spacing is too big (e.g. > 4 frets jump), maybe we should have stayed lower?
          // But diatonic steps are usually close (1 or 2 frets).
          // Exception: crossing 12th fret.

          targetFret = k * 12 + baseFret;

          // Wrap if out of bounds
          if (targetFret > totalFrets) {
            targetFret = baseFret; // Wrap to bottom
          }
        }
      }

      return {
        string: item.string,
        fret: targetFret,
        note: noteName,
        degree: degree, // Relative degree
        isRoot: interval === 0,
        initialKey: `${item.string}-${item.fret}` // ID to track continuity
      };
    });

    diatonicSeries.push({
      name: `Step ${step + 1}`,
      color: colors[step % colors.length],
      notes: stepNotes
    });
  }

  return diatonicSeries;
};
