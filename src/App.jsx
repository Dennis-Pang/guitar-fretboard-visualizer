/**
 * App 组件 - 主应用
 */

import React, { useState, useEffect } from 'react';
import Fretboard from './components/Fretboard';
import ControlPanel from './components/ControlPanel';
import ThemeToggle from './components/ThemeToggle';
import { calculateScale, calculateFretboardNotes, matchScaleToFretboard } from './utils/musicTheory';

function App() {
  // 状态管理
  const [rootNote, setRootNote] = useState('C');
  const [scaleSystem, setScaleSystem] = useState('pentatonic');
  const [mode, setMode] = useState('pentatonicMinor');
  const [showDegree, setShowDegree] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState([]);
  const [selectedPositionKeys, setSelectedPositionKeys] = useState(new Set());

  const createPositionKey = (stringIndex, fret) => `${stringIndex}-${fret}`;

  // 当根音、音阶系统或调式改变时,重新计算高亮位置
  useEffect(() => {
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
        next.add(key);
      }

      return next;
    });
  };

  const handleAreaSelect = (positions = []) => {
    if (!positions.length) return;

    setSelectedPositionKeys((prev) => {
      const next = new Set(prev);
      positions.forEach((pos) => {
        const key = createPositionKey(pos.string, pos.fret);
        next.add(key);
      });
      return next;
    });
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
    <div className="app min-h-screen bg-gradient-to-br from-primary-bg via-white to-tertiary-bg dark:from-dark-primary-bg dark:via-dark-secondary-bg dark:to-dark-tertiary-bg py-8 px-4 md:py-12 md:px-6 font-sans text-text-main dark:text-dark-text-main selection:bg-accent dark:selection:bg-dark-accent selection:text-white transition-colors duration-300">
      {/* 主题切换按钮 */}
      <ThemeToggle />

      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent dark:from-dark-secondary-bg dark:to-transparent opacity-70 dark:opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[460px] h-[460px] bg-accent/15 dark:bg-dark-accent/10 rounded-full blur-[140px]"></div>
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
        />

        {/* 指板 - 添加容器样式 */}
        <div className="w-full bg-secondary-bg/90 dark:bg-dark-secondary-bg/90 rounded-3xl p-2 md:p-4 border border-slate-200 dark:border-slate-700 shadow-xl shadow-indigo-100 dark:shadow-slate-900/50 animate-fade-in-up [animation-delay:200ms] overflow-x-auto transition-colors duration-300">
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
