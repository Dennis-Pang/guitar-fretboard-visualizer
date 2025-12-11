/**
 * ControlPanel 组件 - 控制面板
 * 包含根音选择器、音阶系统选择器、调式选择器、级数开关
 */

import React, { useMemo } from 'react';
import { ROOT_NOTES, SCALE_SYSTEMS } from '../utils/constants';
import { getAllModes } from '../utils/scaleDefinitions';
import { getNoteIndex } from '../utils/musicTheory';

const NOTE_NAMES_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTE_NAMES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const DIMINISHED_OFFSETS = [0, 3, 6, 9];
const FLAT_FRIENDLY_INDICES = new Set([1, 3, 6, 8, 10]);

const getPreferredNoteName = (index, preferFlat) => {
  const normalized = ((index % 12) + 12) % 12;
  if (preferFlat || FLAT_FRIENDLY_INDICES.has(normalized)) {
    return NOTE_NAMES_FLAT[normalized];
  }
  return NOTE_NAMES_SHARP[normalized];
};

const getDiminishedChordSuggestions = (rootNote) => {
  const rootIndex = getNoteIndex(rootNote);
  const preferFlat = rootNote.includes('b');

  return DIMINISHED_OFFSETS.map(offset => {
    const noteName = offset === 0
      ? rootNote
      : getPreferredNoteName(rootIndex + offset, preferFlat);
    return `${noteName}dim7`;
  });
};

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

  const chordSuggestions = useMemo(() => {
    if (!currentMode) return [];

    if (scaleSystem === 'diminished') {
      return getDiminishedChordSuggestions(rootNote);
    }

    if (scaleSystem === 'wholeTone') {
      return [];
    }

    if (currentMode.chords && currentMode.chords.length > 0) {
      return currentMode.chords.map(chord => `${rootNote}${chord}`);
    }

    return [];
  }, [currentMode, rootNote, scaleSystem]);

  return (
    <div className="control-panel w-full max-w-[1200px] mx-auto mb-8 animate-fade-in-up px-4 md:px-0">
      {/* 顶部标题栏 + 当前音阶展示 */}
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl md:text-5xl font-black text-text-main dark:text-dark-text-main mb-3 tracking-tight text-center uppercase font-heading transition-colors">
          Guitar Scale Visualizer
        </h1>
        <div className="h-1 w-24 bg-accent dark:bg-dark-accent rounded-full mb-4 transition-colors"></div>
        <p className="text-text-muted dark:text-dark-text-muted text-sm font-bold tracking-[0.2em] uppercase opacity-80 text-center transition-colors">
          {rootNote} {currentMode?.name || ''}
        </p>
      </div>

      {/* 主控制栏 */}
      <div className="bg-white/95 dark:bg-dark-secondary-bg/95 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 shadow-xl shadow-indigo-100 dark:shadow-slate-900/50 transition-colors duration-300">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 lg:gap-6">

          {/* 1. 根音 */}
          <div className="flex flex-col gap-2 lg:min-w-[80px]">
            <label className="text-[10px] font-bold text-accent dark:text-dark-accent uppercase tracking-widest pl-1 transition-colors">Root</label>
            <div className="relative group">
              <select
                value={rootNote}
                onChange={(e) => onRootNoteChange(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-dark-tertiary-bg text-text-main dark:text-dark-text-main text-sm font-semibold border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:border-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-dark-accent/20 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-500"
              >
                {ROOT_NOTES.map(note => (
                  <option key={note} value={note}>{note}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent dark:text-dark-accent transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-200 dark:bg-slate-700 mx-2 transition-colors"></div>

          {/* 2. 音阶系统 */}
          <div className="flex flex-col gap-2 flex-1 lg:min-w-[180px]">
            <label className="text-[10px] font-bold text-accent dark:text-dark-accent uppercase tracking-widest pl-1 transition-colors">System</label>
            <div className="relative">
              <select
                value={scaleSystem}
                onChange={(e) => onScaleSystemChange(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-dark-tertiary-bg text-text-main dark:text-dark-text-main text-sm font-semibold border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:border-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-dark-accent/20 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-500 truncate"
              >
                {SCALE_SYSTEMS.map(system => (
                  <option key={system.id} value={system.id}>{system.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent dark:text-dark-accent transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* 3. 调式 */}
          <div className="flex flex-col gap-2 flex-[1.5] lg:min-w-[200px]">
            <label className="text-[10px] font-bold text-accent dark:text-dark-accent uppercase tracking-widest pl-1 transition-colors">Mode</label>
            <div className="relative">
              <select
                value={mode}
                onChange={(e) => onModeChange(e.target.value)}
                className="w-full appearance-none bg-white dark:bg-dark-tertiary-bg text-text-main dark:text-dark-text-main text-sm font-semibold border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 shadow-sm focus:outline-none focus:border-accent dark:focus:border-dark-accent focus:ring-2 focus:ring-accent/20 dark:focus:ring-dark-accent/20 transition-all cursor-pointer hover:border-slate-300 dark:hover:border-slate-500 truncate"
              >
                {availableModes.map(modeObj => (
                  <option key={modeObj.id} value={modeObj.id}>{modeObj.name}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-accent dark:text-dark-accent transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="hidden lg:block w-px h-12 bg-slate-200 dark:bg-slate-700 mx-2 transition-colors"></div>

          {/* 4. 显示切换 */}
          <div className="flex flex-col gap-2 lg:min-w-[140px]">
            <label className="text-[10px] font-bold text-accent dark:text-dark-accent uppercase tracking-widest pl-1 transition-colors">Display</label>
            <div className="flex bg-slate-100 dark:bg-dark-tertiary-bg rounded-2xl p-1 border border-slate-200 dark:border-slate-600 h-[46px] transition-colors">
              <button
                onClick={() => onShowDegreeChange(false)}
                className={`flex-1 text-xs font-semibold rounded-xl px-3 transition-all uppercase tracking-wider ${!showDegree
                  ? 'bg-accent dark:bg-dark-accent text-white shadow-md'
                  : 'text-text-muted dark:text-dark-text-muted hover:text-text-main dark:hover:text-dark-text-main'
                  }`}
              >
                Note
              </button>
              <button
                onClick={() => onShowDegreeChange(true)}
                className={`flex-1 text-xs font-semibold rounded-xl px-3 transition-all uppercase tracking-wider ${showDegree
                  ? 'bg-accent dark:bg-dark-accent text-white shadow-md'
                  : 'text-text-muted dark:text-dark-text-muted hover:text-text-main dark:hover:text-dark-text-main'
                  }`}
              >
                Degree
              </button>
            </div>
          </div>
        </div>

        {/* 5. 推荐和弦显示区域 */}
        {chordSuggestions.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
              <span className="text-[10px] font-bold text-accent dark:text-dark-accent uppercase tracking-widest whitespace-nowrap transition-colors">
                Compatible Chords
              </span>
              <div className="flex flex-wrap gap-2">
                {chordSuggestions.map((chord, index) => (
                  <div
                    key={index}
                    className="px-4 py-1.5 bg-slate-50 dark:bg-dark-tertiary-bg border border-slate-200 dark:border-slate-600 rounded-full text-xs font-mono text-accent dark:text-dark-accent shadow-sm transition-colors"
                  >
                    <span className="font-bold">{chord}</span>
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
