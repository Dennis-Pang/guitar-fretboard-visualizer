/**
 * Fretboard 组件 - 吉他指板可视化
 */

import React, { useMemo, useRef, useState } from 'react';
import { FRET_COUNT, STRING_COUNT, STANDARD_TUNING, FRET_MARKERS, COLORS } from '../utils/constants';
import { getNoteDisplayText } from '../utils/musicTheory';

const noop = () => {};

const Fretboard = ({
  highlightedPositions = [],
  showDegree = false,
  selectedPositionKeys = new Set(),
  onToggleNote = noop,
  onAreaSelect = noop
}) => {
  // SVG 尺寸配置
  const width = 1200;
  const height = 400;
  const fretSpacing = width / (FRET_COUNT + 1);
  const stringSpacing = height / (STRING_COUNT + 1);
  const nutWidth = 40; // 琴枕宽度
  const svgRef = useRef(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const noteLayouts = useMemo(() => (
    highlightedPositions.map((position, index) => {
      const x = position.fret === 0
        ? nutWidth / 2
        : nutWidth + fretSpacing * position.fret - fretSpacing / 2;
      const y = stringSpacing * (position.string + 1);

      return {
        ...position,
        x,
        y,
        key: `${position.string}-${position.fret}`,
        gradientId: position.isRoot
          ? `root-gradient-${index}`
          : `scale-gradient-${index}`,
        displayText: getNoteDisplayText(position, showDegree)
      };
    })
  ), [highlightedPositions, fretSpacing, stringSpacing, showDegree]);

  const normalizeRect = (rect) => {
    if (!rect) return null;
    const x = Math.min(rect.x1, rect.x2);
    const y = Math.min(rect.y1, rect.y2);
    const width = Math.abs(rect.x2 - rect.x1);
    const height = Math.abs(rect.y2 - rect.y1);
    return { x, y, width, height };
  };

  const selectionRectNormalized = normalizeRect(selectionRect);

  const getRelativePoint = (event) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const xRatio = (event.clientX - rect.left) / rect.width;
    const yRatio = (event.clientY - rect.top) / rect.height;

    return {
      x: xRatio * width,
      y: yRatio * height
    };
  };

  const handlePointerDown = (event) => {
    if (event.target.closest('[data-note-node="true"]')) {
      return;
    }

    const relativePoint = getRelativePoint(event);
    if (!relativePoint) return;

    setIsSelecting(true);
    setSelectionRect({ x1: relativePoint.x, y1: relativePoint.y, x2: relativePoint.x, y2: relativePoint.y });
    svgRef.current?.setPointerCapture?.(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!isSelecting) return;
    event.preventDefault();
    const relativePoint = getRelativePoint(event);
    if (!relativePoint) return;

    setSelectionRect((current) => ({
      ...(current || relativePoint),
      x2: relativePoint.x,
      y2: relativePoint.y
    }));
  };

  const finalizeSelection = (event) => {
    if (isSelecting && selectionRect) {
      const normalized = normalizeRect(selectionRect);
      if (normalized) {
        const selectedNotes = noteLayouts
          .filter(note =>
            note.x >= normalized.x &&
            note.x <= normalized.x + normalized.width &&
            note.y >= normalized.y &&
            note.y <= normalized.y + normalized.height
          )
          .map(({ string, fret, note, degree, isRoot }) => ({ string, fret, note, degree, isRoot }));

        if (selectedNotes.length > 0) {
          onAreaSelect(selectedNotes);
        }
      }
    }

    if (isSelecting && event) {
      svgRef.current?.releasePointerCapture?.(event.pointerId);
    }

    setIsSelecting(false);
    setSelectionRect(null);
  };

  const handlePointerUp = (event) => {
    finalizeSelection(event);
  };

  const handlePointerLeave = () => {
    if (isSelecting) {
      finalizeSelection();
    }
  };

  /**
   * 渲染弦
   */
  const renderStrings = () => {
    return STANDARD_TUNING.map((note, index) => {
      const y = stringSpacing * (index + 1);
      const stringWidth = 1.5 + index * 0.4; // 弦的粗细,低音弦更粗

      return (
        <g key={`string-${index}`}>
          {/* 弦线阴影 */}
          <line
            x1={nutWidth}
            y1={y + 1}
            x2={width}
            y2={y + 1}
            stroke="#000"
            strokeWidth={stringWidth}
            opacity={0.2}
          />
          {/* 弦线 */}
          <line
            x1={nutWidth}
            y1={y}
            x2={width}
            y2={y}
            stroke="#d4af37"
            strokeWidth={stringWidth}
            opacity={0.8}
          />
          {/* 弦名标签 (左侧) */}
          <text
            x={15}
            y={y + 5}
            fontSize="16"
            fill="#fff"
            fontWeight="bold"
            opacity={0.9}
          >
            {note}
          </text>
        </g>
      );
    });
  };

  /**
   * 渲染品丝
   */
  const renderFrets = () => {
    const frets = [];

    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const x = nutWidth + fretSpacing * fret;

      // 第0品(琴枕)用更粗的线
      const strokeWidth = fret === 0 ? 8 : 3;

      frets.push(
        <g key={`fret-${fret}`}>
          {/* 品丝阴影 */}
          <line
            x1={x + 1}
            y1={stringSpacing}
            x2={x + 1}
            y2={height - stringSpacing}
            stroke="#000"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          {/* 品丝 */}
          <line
            x1={x}
            y1={stringSpacing}
            x2={x}
            y2={height - stringSpacing}
            stroke={fret === 0 ? '#e5e5e5' : '#c0c0c0'}
            strokeWidth={strokeWidth}
            opacity={0.9}
          />
        </g>
      );

      // 品号标签 (下方)
      if (fret > 0) {
        frets.push(
          <text
            key={`fret-label-${fret}`}
            x={x - fretSpacing / 2}
            y={height - 15}
            fontSize="14"
            fill="#fff"
            fontWeight="bold"
            textAnchor="middle"
            opacity={0.6}
          >
            {fret}
          </text>
        );
      }
    }

    return frets;
  };

  /**
   * 渲染品记 (圆点标记)
   */
  const renderFretMarkers = () => {
    const markers = [];

    // 单圆点品记
    FRET_MARKERS.single.forEach(fret => {
      const x = nutWidth + fretSpacing * fret - fretSpacing / 2;
      const y = height / 2;

      markers.push(
        <g key={`marker-single-${fret}`}>
          {/* 品记阴影 */}
          <circle cx={x + 1} cy={y + 1} r={10} fill="#000" opacity={0.3} />
          {/* 品记 */}
          <circle cx={x} cy={y} r={10} fill="#8b7355" opacity={0.7} />
        </g>
      );
    });

    // 双圆点品记 (12品)
    FRET_MARKERS.double.forEach(fret => {
      const x = nutWidth + fretSpacing * fret - fretSpacing / 2;
      const y1 = height / 3;
      const y2 = (height / 3) * 2;

      markers.push(
        <g key={`marker-double-${fret}`}>
          {/* 上圆点 */}
          <circle cx={x + 1} cy={y1 + 1} r={10} fill="#000" opacity={0.3} />
          <circle cx={x} cy={y1} r={10} fill="#8b7355" opacity={0.7} />
          {/* 下圆点 */}
          <circle cx={x + 1} cy={y2 + 1} r={10} fill="#000" opacity={0.3} />
          <circle cx={x} cy={y2} r={10} fill="#8b7355" opacity={0.7} />
        </g>
      );
    });

    return markers;
  };

  /**
   * 渲染高亮的音符
   */
  const renderHighlightedNotes = () => {
    return noteLayouts.map((noteLayout) => {
      const { key, isRoot, x, y, gradientId, displayText } = noteLayout;
      const isSelected = selectedPositionKeys?.has(key);
      const glowColor = isRoot ? '#ff5555' : '#4dabf7';

      return (
        <g
          key={key}
          data-note-node="true"
          className="cursor-pointer"
          onClick={(event) => {
            event.stopPropagation();
            onToggleNote(noteLayout);
          }}
        >
          {/* 定义渐变 */}
          <defs>
            <radialGradient id={gradientId}>
              <stop offset="0%" stopColor={isRoot ? '#ff5555' : '#4dabf7'} />
              <stop offset="100%" stopColor={isRoot ? '#cc0000' : '#1971c2'} />
            </radialGradient>
          </defs>

          {/* 音符外发光 */}
          <circle
            cx={x}
            cy={y}
            r={isSelected ? 26 : 22}
            fill={glowColor}
            opacity={isSelected ? 0.4 : 0.3}
          />

          {/* 选中描边 */}
          {isSelected && (
            <circle
              cx={x}
              cy={y}
              r={24}
              fill="none"
              stroke="#fcd34d"
              strokeWidth={3}
              opacity={0.9}
            />
          )}

          {/* 音符阴影 */}
          <circle
            cx={x + 2}
            cy={y + 2}
            r={20}
            fill="#000"
            opacity={0.3}
          />

          {/* 音符圆圈 */}
          <circle
            cx={x}
            cy={y}
            r={20}
            fill={`url(#${gradientId})`}
            stroke={isSelected ? '#fbbf24' : 'white'}
            strokeWidth={3}
            opacity={0.95}
          />

          {/* 音符文本 */}
          <text
            x={x}
            y={y + 6}
            fontSize="15"
            fill="white"
            fontWeight="bold"
            textAnchor="middle"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
          >
            {displayText}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="fretboard-container bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        className="fretboard-svg drop-shadow-2xl"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* 定义木纹效果 */}
        <defs>
          <pattern id="wood-grain" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="#4a3828" />
            <ellipse cx="50" cy="50" rx="40" ry="15" fill="#3d2f22" opacity="0.3" />
          </pattern>

          <linearGradient id="wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5d4a3a" />
            <stop offset="50%" stopColor="#4a3828" />
            <stop offset="100%" stopColor="#3d2f22" />
          </linearGradient>
        </defs>

        {/* 背景 - 木纹效果 */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#wood-gradient)"
          rx={15}
        />

        {/* 木纹纹理 */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#wood-grain)"
          opacity={0.5}
          rx={15}
        />

        {/* 品记 */}
        {renderFretMarkers()}

        {/* 弦 */}
        {renderStrings()}

        {/* 品丝 */}
        {renderFrets()}

        {/* 选区 */}
        {selectionRectNormalized && (
          <rect
            x={selectionRectNormalized.x}
            y={selectionRectNormalized.y}
            width={selectionRectNormalized.width}
            height={selectionRectNormalized.height}
            fill="rgba(59,130,246,0.15)"
            stroke="#3b82f6"
            strokeDasharray="6 4"
            strokeWidth={2}
            rx={6}
            pointerEvents="none"
          />
        )}

        {/* 高亮音符 */}
        {renderHighlightedNotes()}
      </svg>
    </div>
  );
};

export default Fretboard;
