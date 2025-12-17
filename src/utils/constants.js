/**
 * Guitar Scale Visualizer - Constants
 */

// Fretboard Configuration
export const FRET_COUNT = 15; // 0-15 frets, 16 total positions
export const STRING_COUNT = 6;

// Standard Tuning (High E to Low E)
export const STANDARD_TUNING = ['E', 'B', 'G', 'D', 'A', 'E'];

// Fret Markers (Dots on the fretboard)
export const FRET_MARKERS = {
  single: [3, 5, 7, 9, 15],  // Single dot
  double: [12]                // Double dot
};

// 12 Semitones
export const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Root Note Options
export const ROOT_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Scale Systems
export const SCALE_SYSTEMS = [
  { id: 'pentatonic', name: 'Pentatonic', modeCount: 2 },
  { id: 'major', name: 'Natural Major', modeCount: 7 },
  { id: 'melodicMinor', name: 'Melodic Minor', modeCount: 7 },
  { id: 'harmonicMinor', name: 'Harmonic Minor', modeCount: 7 },
  { id: 'diminished', name: 'Diminished', modeCount: 2 },
  { id: 'wholeTone', name: 'Whole Tone', modeCount: 1 }
];

// Color Scheme
export const COLORS = {
  rootNote: '#EF4444',      // Red - Root Note
  scaleNote: '#3B82F6',     // Blue - Scale Note
  fretboard: '#3E2723',     // Dark Brown - Fretboard Background
  fretWire: '#C0C0C0',      // Silver - Fret Wire
  string: '#DAA520'         // Gold - String
};

// Degree Label (Roman Numerals)

