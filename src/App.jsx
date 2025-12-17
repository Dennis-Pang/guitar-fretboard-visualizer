/**
 * App Component - Main Application
 */

import React, { useState, useEffect } from 'react';
import Fretboard from './components/Fretboard';
import ControlPanel from './components/ControlPanel';
import ThemeToggle from './components/ThemeToggle';
import { calculateScale, calculateFretboardNotes, matchScaleToFretboard, calculateInversions, calculateDiatonic } from './utils/musicTheory';

function App() {
  // State Management
  const [rootNote, setRootNote] = useState('C');
  const [scaleSystem, setScaleSystem] = useState('pentatonic');
  const [mode, setMode] = useState('pentatonicMinor');
  const [showDegree, setShowDegree] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState([]);
  const [selectedPositionKeys, setSelectedPositionKeys] = useState(new Set());

  // New State for Inversions/Diatonic
  const [inversionMode, setInversionMode] = useState(false);

  const createPositionKey = (stringIndex, fret) => `${stringIndex}-${fret}`;

  // Recalculate highlights when root, system or mode changes
  useEffect(() => {
    // If in inversion mode and parameters change, safest to reset to scale mode
    // or we could try to keep it, but it might be confusing.
    if (inversionMode) {
      setInversionMode(false);
    }

    // 1. Calculate Scale
    const scale = calculateScale(rootNote, scaleSystem, mode);

    // 2. Calculate Fretboard Notes
    const fretboardNotes = calculateFretboardNotes();

    // 3. Match Scale to Fretboard
    const positions = matchScaleToFretboard(scale, fretboardNotes);

    // 4. Update State
    setHighlightedPositions(positions);
    setSelectedPositionKeys(new Set());
  }, [rootNote, scaleSystem, mode]);

  const handleToggleNoteSelection = (position) => {
    if (!position) return;

    setSelectedPositionKeys((prev) => {
      const next = new Set(prev);
      const key = createPositionKey(position.string, position.fret);

      if (next.has(key)) {
        next.delete(key);
      } else {
        // ALLOW MULTIPLE NOTES PER STRING
        // Removed 1-note-per-string enforcement here
        next.add(key);
      }

      return next;
    });
  };

  const handleAreaSelect = (positions = []) => {
    if (!positions.length) return;

    setSelectedPositionKeys((prev) => {
      // 1. 获取所有选中区域的 key
      const keysToProcess = positions.map(pos => createPositionKey(pos.string, pos.fret));

      // 2. Check if all keys are already selected
      const allAlreadySelected = keysToProcess.every(key => prev.has(key));

      const next = new Set(prev);

      if (allAlreadySelected) {
        // "Remove Mode" -> Deselect
        keysToProcess.forEach(key => next.delete(key));
      } else {
        // "Add Mode" -> Select
        // Relaxed Rule: Allow Area Select to select everything
        keysToProcess.forEach(key => next.add(key));
      }

      return next;
    });
  };

  // Generate Inversions
  const handleGenerateInversions = () => {
    // 1. Gather note info for selected keys
    // We need to look up the full note object (note name, etc) from the current visual state
    // OR recalculate from fretboard knowledge.
    // Since highlightedPositions contains the current scale notes, and user can only select those (mostly),
    // we try to find them there. If not found (shouldn't happen if limited), ignore?

    const selectedNotes = [];
    highlightedPositions.forEach(pos => {
      const key = createPositionKey(pos.string, pos.fret);
      if (selectedPositionKeys.has(key)) {
        selectedNotes.push(pos);
      }
    });

    if (selectedNotes.length < 2) {
      alert("Please select at least 2 notes to generate inversions.");
      return;
    }

    // Validation: Strict 1 note per string
    const stringsWithNotes = new Set();
    for (const note of selectedNotes) {
      if (stringsWithNotes.has(note.string)) {
        alert("Inversion generation requires exactly one note per string. Please check your selection.");
        return;
      }
      stringsWithNotes.add(note.string);
    }

    const inversions = calculateInversions(selectedNotes);

    // Flatten inversions into a single list of positions for the Fretboard to render
    // And attach 'color' property
    const displayPositions = [];
    inversions.forEach(inv => {
      inv.notes.forEach(note => {
        displayPositions.push({
          ...note,
          color: inv.color, // Pass the color name
          // Ensure degree/isRoot logic is handled or bypassed by visualizer
          isRoot: false, // Override to avoid default coloring logic
          degree: note.note // Show note name for inversions to avoid '?'
        });
      });
    });

    setHighlightedPositions(displayPositions);
    setInversionMode(true);
  };

  // Generate Diatonic Series
  const handleGenerateDiatonic = () => {
    const selectedNotes = [];
    highlightedPositions.forEach(pos => {
      const key = createPositionKey(pos.string, pos.fret);
      if (selectedPositionKeys.has(key)) {
        selectedNotes.push(pos);
      }
    });

    if (selectedNotes.length < 1) {
      alert("Please select at least 1 note to generate diatonic series.");
      return;
    }

    // Validation: Strict 1 note per string
    const stringsWithNotes = new Set();
    for (const note of selectedNotes) {
      if (stringsWithNotes.has(note.string)) {
        alert("Diatonic generation requires exactly one note per string. Please check your selection.");
        return;
      }
      stringsWithNotes.add(note.string);
    }

    const diatonicSeries = calculateDiatonic(selectedNotes, rootNote, scaleSystem, mode);

    if (diatonicSeries.length === 0) {
      alert("Could not generate diatonic series (selection might be out of scale).");
      return;
    }

    const displayPositions = [];
    diatonicSeries.forEach(step => {
      step.notes.forEach(note => {
        displayPositions.push({
          ...note,
          color: step.color, // Color coded by step
          isRoot: note.isRoot, // calculated inside calculateDiatonic
          // degree: note.degree // calculated inside calculateDiatonic
          // Ensure displayText logic works:
          // Fretboard uses getNoteDisplayText which checks showDegree
          // showDegree uses position.degree or position.note.
        });
      });
    });

    setHighlightedPositions(displayPositions);
    setInversionMode(true); // Reusing this flag to indicate "Special View"
  };

  const handleClearHighlights = () => {
    // Return to standard scale view
    setInversionMode(false);
    setSelectedPositionKeys(new Set());

    // Recalculate scale (Duplicate logic from useEffect? Or just trigger it?)
    // Since we updated inversionMode, maybe we can just rely on the effect?
    // But the effect depends on [root, system, mode]. If those didn't change, effect won't run.
    // So we must manually restore.
    const scale = calculateScale(rootNote, scaleSystem, mode);
    const fretboardNotes = calculateFretboardNotes();
    const positions = matchScaleToFretboard(scale, fretboardNotes);
    setHighlightedPositions(positions);
  };

  // Reset mode when scale system changes
  const handleScaleSystemChange = (newSystem) => {
    setScaleSystem(newSystem);

    // Set default mode for new system
    const defaultModes = {
      pentatonic: 'pentatonicMinor',
      major: 'ionian',
      melodicMinor: 'melodicMinor',
      harmonicMinor: 'harmonicMinor',
      diminished: 'diminishedWholeHalf',
      wholeTone: 'wholeTone'
    };
    setMode(defaultModes[newSystem] || 'pentatonicMinor');
  };

  return (
    <div className="app min-h-screen bg-gradient-to-br from-primary-bg via-secondary-bg to-tertiary-bg py-8 px-4 md:py-12 md:px-6 font-sans text-text-main selection:bg-accent selection:text-white transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-secondary-bg to-transparent opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-[460px] h-[460px] bg-accent/15 rounded-full blur-[140px]"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
        {/* Control Panel */}
        <ControlPanel
          rootNote={rootNote}
          scaleSystem={scaleSystem}
          mode={mode}
          showDegree={showDegree}
          onRootNoteChange={setRootNote}
          onScaleSystemChange={handleScaleSystemChange}
          onModeChange={setMode}
          onShowDegreeChange={setShowDegree}
          onGenerateInversions={handleGenerateInversions}
          onGenerateDiatonic={handleGenerateDiatonic}
          onClearHighlights={handleClearHighlights}
        />

        {/* Fretboard - Container */}
        <div className="w-full bg-secondary-bg/90 rounded-3xl p-2 md:p-4 border border-slate-200 shadow-xl shadow-indigo-100 animate-fade-in-up [animation-delay:200ms] overflow-x-auto transition-colors duration-300">
          <div className="min-w-[800px] md:min-w-full">
            <Fretboard
              highlightedPositions={highlightedPositions}
              showDegree={showDegree}
              selectedPositionKeys={selectedPositionKeys}
              onToggleNote={handleToggleNoteSelection}
              onAreaSelect={handleAreaSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

