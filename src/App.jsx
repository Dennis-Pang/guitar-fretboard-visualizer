/**
 * App 组件 - 主应用
 */

import React, { useState, useEffect } from 'react';
import Fretboard from './components/Fretboard';
import ControlPanel from './components/ControlPanel';
import { calculateScale, calculateFretboardNotes, matchScaleToFretboard } from './utils/musicTheory';

function App() {
  // 状态管理
  const [rootNote, setRootNote] = useState('C');
  const [scaleSystem, setScaleSystem] = useState('pentatonic');
  const [mode, setMode] = useState('pentatonicMinor');
  const [showDegree, setShowDegree] = useState(false);
  const [highlightedPositions, setHighlightedPositions] = useState([]);

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
  }, [rootNote, scaleSystem, mode]);

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
    <div className="app min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black py-12 px-6">
      {/* 背景装饰 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen animate-pulse delay-1000"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-pink-600/5 rounded-full blur-[80px] mix-blend-screen"></div>
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
        <div className="w-full bg-slate-900/50 backdrop-blur-md rounded-3xl p-2 border border-white/5 shadow-2xl animate-fade-in-up [animation-delay:200ms]">
          <Fretboard
            highlightedPositions={highlightedPositions}
            showDegree={showDegree}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
