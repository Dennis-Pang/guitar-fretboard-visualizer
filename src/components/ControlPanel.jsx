/**
 * ControlPanel 组件 - 控制面板
 * 包含根音选择器、音阶系统选择器、调式选择器、级数开关
 */

import React from 'react';
import { ROOT_NOTES, SCALE_SYSTEMS } from '../utils/constants';
import { getAllModes } from '../utils/scaleDefinitions';

const ControlPanel = ({
  rootNote,
  scaleSystem,
  mode,
  showDegree,
  onRootNoteChange,
  onScaleSystemChange,
  onModeChange,
  onShowDegreeChange
}) => {
  // 获取当前音阶系统的所有调式
  const availableModes = getAllModes(scaleSystem);
  const currentMode = availableModes.find(m => m.id === mode);

  return (
    <div className="control-panel w-full max-w-[1200px] mx-auto mb-8 animate-fade-in-up px-4 md:px-0">
      {/* 顶部标题栏 + 当前音阶展示 */}
      <div className="flex flex-col items-center justify-center mb-6">
        <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2 tracking-tight text-center">
          Guitar Scale Visualizer
        </h1>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4"></div>
        <p className="text-slate-400 text-sm font-medium tracking-wide uppercase opacity-80 text-center">
          {rootNote} {currentMode?.name || ''}
        </p>
      </div>

      {/* 主控制栏 - 玻璃拟态效果 */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl ring-1 ring-white/5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6">

          {/* 1. 根音 */}
          <div className="flex flex-col gap-1.5 lg:min-w-[80px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Root</label>
            <div className="relative group">
              <select
                value={rootNote}
                onChange={(e) => onRootNoteChange(e.target.value)}
                className="w-full appearance-none bg-slate-800/80 text-white text-sm font-bold border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer hover:bg-slate-800"
              >
                {ROOT_NOTES.map(note => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-slate-700/50 mx-1"></div>

          {/* 2. 音阶系统 */}
          <div className="flex flex-col gap-1.5 flex-1 lg:min-w-[180px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">System</label>
            <div className="relative">
              <select
                value={scaleSystem}
                onChange={(e) => onScaleSystemChange(e.target.value)}
                className="w-full appearance-none bg-slate-800/80 text-white text-sm font-semibold border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all cursor-pointer hover:bg-slate-800 truncate"
              >
                {SCALE_SYSTEMS.map(system => (
                  <option key={system.id} value={system.id}>{system.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* 3. 调式 */}
          <div className="flex flex-col gap-1.5 flex-[1.5] lg:min-w-[200px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Mode</label>
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => onModeChange(e.target.value)}
                className="w-full appearance-none bg-slate-800/80 text-white text-sm font-semibold border border-slate-700 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all cursor-pointer hover:bg-slate-800 truncate"
              >
                {availableModes.map(modeObj => (
                  <option key={modeObj.id} value={modeObj.id}>{modeObj.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-10 bg-slate-700/50 mx-1"></div>

          {/* 4. 显示切换 */}
          <div className="flex flex-col gap-1.5 lg:min-w-[140px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Display</label>
            <div className="flex bg-slate-800/80 rounded-lg p-1 border border-slate-700 h-[42px]">
              <button
                onClick={() => onShowDegreeChange(false)}
                className={`flex-1 text-xs font-bold rounded px-3 transition-all ${!showDegree
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Note
              </button>
              <button
                onClick={() => onShowDegreeChange(true)}
                className={`flex-1 text-xs font-bold rounded px-3 transition-all ${showDegree
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                Degree
              </button>
            </div>
          </div>
        </div>

        {/* 5. 推荐和弦显示区域 */}
        {currentMode?.chords && currentMode.chords.length > 0 && (
          <div className="mt-6 pt-4 border-t border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                Compatible Chords
              </span>
              <div className="flex flex-wrap gap-2">
                {currentMode.chords.map((chord, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs font-mono text-blue-200 shadow-sm"
                  >
                    <span className="font-bold text-white">{rootNote}</span>
                    <span className="opacity-90">{chord}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
