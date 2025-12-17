/**
 * Fretboard Component - Guitar Fretboard Visualization
 */

import React, { useMemo, useRef, useState } from 'react';
import { FRET_COUNT, STRING_COUNT, STANDARD_TUNING, FRET_MARKERS, COLORS } from '../utils/constants';
import { getNoteDisplayText } from '../utils/musicTheory';
import { useTheme } from '../contexts/ThemeContext';

const noop = () => { };

const Fretboard = ({
  highlightedPositions = [],
  showDegree = false,
  selectedPositionKeys = new Set(),
  onToggleNote = noop,
  onAreaSelect = noop
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Theme-based colors
  const colors = {
    // Fretboard background
    fretboardBase: isDark ? ['#1e1410', '#0f0a08'] : ['#fdfaf5', '#eadcc8'],
    fretboardGrain: isDark ? '#2d1f15' : '#f5e7d4',
    grainPattern1: isDark ? '#1a0f0b' : '#e3d0b9',
    grainPattern2: isDark ? '#251812' : '#e9d7c0',

    // Strings
    stringColor: isDark ? '#8b7355' : '#c8a66c',
    stringLabel: isDark ? '#94a3b8' : '#334155',

    // Frets
    nutColor: isDark ? '#8b7355' : '#cbd5f5',
    fretColor: isDark ? '#64748b' : '#94a3b8',
    fretLabel: isDark ? '#64748b' : '#475569',

    // Fret markers
    markerColor: isDark ? '#64532f' : '#d4b48b',

    // Notes
    rootNote: isDark ? '#ef4444' : '#dc2626',
    rootNoteEnd: isDark ? '#b91c1c' : '#991b1b',
    scaleNote: isDark ? '#60a5fa' : '#2563eb',
    scaleNoteEnd: isDark ? '#2563eb' : '#1d4ed8',
    noteStroke: isDark ? '#1e293b' : '#f8fafc',
    noteText: '#ffffff',

    // Inversion Colors (Base, Green, Orange, Purple)
    invBlue: isDark ? '#60a5fa' : '#2563eb',
    invBlueEnd: isDark ? '#2563eb' : '#1d4ed8',
    invGreen: isDark ? '#4ade80' : '#16a34a',
    invGreenEnd: isDark ? '#16a34a' : '#15803d',
    invOrange: isDark ? '#fb923c' : '#ea580c',
    invOrangeEnd: isDark ? '#ea580c' : '#c2410c',
    invPurple: isDark ? '#a78bfa' : '#7c3aed',
    invPurpleEnd: isDark ? '#7c3aed' : '#5b21b6',
    invRed: isDark ? '#f87171' : '#dc2626',
    invRedEnd: isDark ? '#dc2626' : '#991b1b',
    invYellow: isDark ? '#facc15' : '#ca8a04',
    invYellowEnd: isDark ? '#ca8a04' : '#a16207',

    // Selection
    selectionFill: isDark ? 'rgba(59,130,246,0.2)' : 'rgba(37,99,235,0.15)',
    selectionStroke: isDark ? '#3b82f6' : '#2563eb',
  };

  const getColorSet = (colorName) => {
    switch (colorName) {
      case 'green': return { start: colors.invGreen, end: colors.invGreenEnd };
      case 'orange': return { start: colors.invOrange, end: colors.invOrangeEnd };
      case 'purple': return { start: colors.invPurple, end: colors.invPurpleEnd };
      case 'red': return { start: colors.invRed, end: colors.invRedEnd };
      case 'yellow': return { start: colors.invYellow, end: colors.invYellowEnd };
      case 'blue':
      default:
        return { start: colors.invBlue, end: colors.invBlueEnd };
    }
  };

  // SVG 尺寸配置
  const width = 1200;
  const height = 400;
  const fretSpacing = width / (FRET_COUNT + 1);
  const stringSpacing = height / (STRING_COUNT + 1);
  const nutWidth = 40; // Nut width
  const svgRef = useRef(null);
  const [selectionRect, setSelectionRect] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const noteLayouts = useMemo(() => (
    highlightedPositions.map((position, index) => {
      const x = position.fret === 0
        ? nutWidth / 2
        : nutWidth + fretSpacing * position.fret - fretSpacing / 2;
      const y = stringSpacing * (position.string + 1);

      const customColors = position.color ? getColorSet(position.color) : null;

      return {
        ...position,
        x,
        y,
        key: `${position.string}-${position.fret}`,
        gradientId: position.color
          ? `custom-${position.color}-${index}`
          : (position.isRoot ? `root-gradient-${index}` : `scale-gradient-${index}`),
        customColors,
        displayText: getNoteDisplayText(position, showDegree)
      };
    })
  ), [highlightedPositions, fretSpacing, stringSpacing, showDegree, colors]);

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
   * Render Strings
   */
  const renderStrings = () => {
    return STANDARD_TUNING.map((note, index) => {
      const y = stringSpacing * (index + 1);
      const stringWidth = 1.5 + index * 0.4; // String thickness, thicker for low strings

      return (
        <g key={`string-${index}`}>
          {/* String Shadow */}
          <line
            x1={nutWidth}
            y1={y + 1}
            x2={width}
            y2={y + 1}
            stroke="#000"
            strokeWidth={stringWidth}
            opacity={0.08}
          />
          {/* String Line */}
          <line
            x1={nutWidth}
            y1={y}
            x2={width}
            y2={y}
            stroke={colors.stringColor}
            strokeWidth={stringWidth}
            opacity={0.8}
          />
          {/* String Name Label (Left) */}
          <text
            x={15}
            y={y + 5}
            fontSize="16"
            fill={colors.stringLabel}
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
   * Render Frets
   */
  const renderFrets = () => {
    const frets = [];

    for (let fret = 0; fret <= FRET_COUNT; fret++) {
      const x = nutWidth + fretSpacing * fret;

      // Fret 0 (Nut) uses thicker line
      const strokeWidth = fret === 0 ? 8 : 3;

      frets.push(
        <g key={`fret-${fret}`}>
          {/* Fret Shadow */}
          <line
            x1={x + 1}
            y1={stringSpacing}
            x2={x + 1}
            y2={height - stringSpacing}
            stroke="#000"
            strokeWidth={strokeWidth}
            opacity={0.3}
          />
          {/* Fret Wire */}
          <line
            x1={x}
            y1={stringSpacing}
            x2={x}
            y2={height - stringSpacing}
            stroke={fret === 0 ? colors.nutColor : colors.fretColor}
            strokeWidth={strokeWidth}
            opacity={0.9}
          />
        </g>
      );

      // Fret Number Label (Bottom)
      if (fret > 0) {
        frets.push(
          <text
            key={`fret-label-${fret}`}
            x={x - fretSpacing / 2}
            y={height - 15}
            fontSize="14"
            fill={colors.fretLabel}
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
   * Render Fret Markers
   */
  const renderFretMarkers = () => {
    const markers = [];

    // Single Dot Markers
    FRET_MARKERS.single.forEach(fret => {
      const x = nutWidth + fretSpacing * fret - fretSpacing / 2;
      const y = height / 2;

      markers.push(
        <g key={`marker-single-${fret}`}>
          {/* Marker Shadow */}
          <circle cx={x + 1} cy={y + 1} r={8} fill="#000" opacity={0.2} />
          {/* Marker Dot */}
          <circle cx={x} cy={y} r={8} fill={colors.markerColor} opacity={0.8} />
        </g>
      );
    });

    // Double Dot Markers (12th Fret)
    FRET_MARKERS.double.forEach(fret => {
      const x = nutWidth + fretSpacing * fret - fretSpacing / 2;
      const y1 = height / 3;
      const y2 = (height / 3) * 2;

      markers.push(
        <g key={`marker-double-${fret}`}>
          {/* Top Dot */}
          <circle cx={x + 1} cy={y1 + 1} r={8} fill="#000" opacity={0.2} />
          <circle cx={x} cy={y1} r={8} fill={colors.markerColor} opacity={0.8} />
          {/* Bottom Dot */}
          <circle cx={x + 1} cy={y2 + 1} r={8} fill="#000" opacity={0.2} />
          <circle cx={x} cy={y2} r={8} fill={colors.markerColor} opacity={0.8} />
        </g>
      );
    });

    return markers;
  };

  /**
   * Render Highlighted Notes
   */
  const renderHighlightedNotes = () => {
    return noteLayouts.map((noteLayout) => {
      const { key, isRoot, x, y, gradientId, displayText, customColors } = noteLayout;
      const isSelected = selectedPositionKeys?.has(key);

      let startColor = isRoot ? colors.rootNote : colors.scaleNote;
      let endColor = isRoot ? colors.rootNoteEnd : colors.scaleNoteEnd;

      if (customColors) {
        startColor = customColors.start;
        endColor = customColors.end;
      }

      const glowColor = startColor;

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
          {/* Define Gradients */}
          <defs>
            <radialGradient id={gradientId}>
              <stop offset="0%" stopColor={startColor} />
              <stop offset="100%" stopColor={endColor} />
            </radialGradient>
          </defs>

          {/* Note Outer Glow */}
          <circle
            cx={x}
            cy={y}
            r={isSelected ? 26 : 22}
            fill={glowColor}
            opacity={isSelected ? 0.4 : 0.3}
          />

          {/* Selection Stroke */}
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

          {/* Note Shadow */}
          <circle
            cx={x + 2}
            cy={y + 2}
            r={20}
            fill="#000"
            opacity={0.3}
          />

          {/* Note Circle */}
          <circle
            cx={x}
            cy={y}
            r={20}
            fill={`url(#${gradientId})`}
            stroke={isSelected ? '#fbbf24' : colors.noteStroke}
            strokeWidth={3}
            opacity={0.95}
          />

          {/* Note Text */}
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
    <div className="fretboard-container bg-secondary-bg rounded-3xl shadow-2xl shadow-indigo-100 p-8 border border-tertiary-bg transition-colors duration-300">
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
        <defs>
          <linearGradient id="fretboard-base" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colors.fretboardBase[0]} />
            <stop offset="100%" stopColor={colors.fretboardBase[1]} />
          </linearGradient>
          <pattern id="fretboard-grain" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <rect width="80" height="80" fill={colors.fretboardGrain} />
            <ellipse cx="40" cy="40" rx="28" ry="10" fill={colors.grainPattern1} opacity="0.4" />
            <ellipse cx="60" cy="20" rx="15" ry="8" fill={colors.grainPattern2} opacity="0.2" />
          </pattern>
        </defs>

        {/* Background - Light Wood Grain */}
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#fretboard-base)"
          rx={12}
        />
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="url(#fretboard-grain)"
          opacity={0.35}
          rx={12}
        />

        {/* Fret Markers */}
        {renderFretMarkers()}

        {/* Strings */}
        {renderStrings()}

        {/* Frets */}
        {renderFrets()}

        {/* Selection Area */}
        {selectionRectNormalized && (
          <rect
            x={selectionRectNormalized.x}
            y={selectionRectNormalized.y}
            width={selectionRectNormalized.width}
            height={selectionRectNormalized.height}
            fill={colors.selectionFill}
            stroke={colors.selectionStroke}
            strokeDasharray="6 4"
            strokeWidth={2}
            rx={8}
            pointerEvents="none"
          />
        )}

        {/* Highlighted Notes */}
        {renderHighlightedNotes()}
      </svg>
    </div>
  );
};

export default Fretboard;
