/**
 * App 组件 - 主应用
 */

import React, { useState, useEffect } from 'react';
import Fretboard from './components/Fretboard';
import ControlPanel from './components/ControlPanel';
import ThemeToggle from './components/ThemeToggle';
import { calculateScale, calculateFretboardNotes, matchScaleToFretboard, calculateInversions } from './utils/musicTheory';

function App() {
  // 状态管理
  const [rootNote, setRootNote] = useState('C');
  const [scaleSystem, setScaleSystem] = useState('pentatonic');
  const [mode, setMode] = useState('pentatonicMinor');
  const [showDegree, setShowDegree] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState([]);
  const [selectedPositionKeys, setSelectedPositionKeys] = useState(new Set());

  // New State for Inversions
  const [inversionMode, setInversionMode] = useState(false);

  const createPositionKey = (stringIndex, fret) => `${stringIndex}-${fret}`;

  // 当根音、音阶系统或调式改变时,重新计算高亮位置
  useEffect(() => {
    // 如果处于转位模式，且只是切换了其他参数，我们可能想保持转位显示？
    // 或者更安全的是重置回音阶模式以避免混淆
    if (inversionMode) {
      setInversionMode(false);
    }

    // 1. 计算音阶
    const scale = calculateScale(rootNote, scaleSystem, mode);

    // 2. 计算指板音符
    const fretboardNotes = calculateFretboardNotes();

    // 3. 匹配音阶到指板
    const positions = matchScaleToFretboard(scale, fretboardNotes);

    // 4. 更新状态
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
        // Enforce 1 note per string rule
        // Iterate over current keys, if any has same string index, delete it
        for (const existingKey of next) {
          const [strStr] = existingKey.split('-');
          if (parseInt(strStr) === position.string) {
            next.delete(existingKey);
          }
        }
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

      // 2. 检查这些 key 是否全部都已经被选中
      const allAlreadySelected = keysToProcess.every(key => prev.has(key));

      const next = new Set(prev);

      if (allAlreadySelected) {
        // 如果全部都已经选中，则是"反选模式" (Remove Mode) -> 从选区中移除
        keysToProcess.forEach(key => next.delete(key));
      } else {
        // 否则是"添加模式" (Add Mode) -> 加入选区
        // Note: Area select might violate 1-per-string if area covers multiple frets on same string.
        // We will enforce rule: For each string involved, keep only the LATEST (highest fret? or random?)
        // Or just let Area Select be powerful and violate rule?
        // Let's strictly enforce 1-per-string for logical consistency with Inversion generator.

        // Simpler: Just add them, but pre-clean checks? 
        // Iterate through new positions.
        const stringMap = new Map(); // stringIndex -> key

        // Populate with existing selection
        for (const existingKey of prev) {
          const [s, f] = existingKey.split('-');
          stringMap.set(parseInt(s), existingKey);
        }

        // Apply new selection (overwriting existing on conflict)
        keysToProcess.forEach(key => {
          const [s, f] = key.split('-');
          stringMap.set(parseInt(s), key);
        });

        return new Set(stringMap.values());
      }

      return next;
    });
  };

  // 生成转位
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

  // 当音阶系统改变时,重置调式为第一个调式
  const handleScaleSystemChange = (newSystem) => {
    setScaleSystem(newSystem);

    // 根据新的音阶系统设置默认调式
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
      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-secondary-bg to-transparent opacity-70"></div>
        <div className="absolute bottom-0 right-0 w-[460px] h-[460px] bg-accent/15 rounded-full blur-[140px]"></div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center">
        {/* 控制面板 */}
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
          onClearHighlights={handleClearHighlights}
        />

        {/* 指板 - 添加容器样式 */}
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

