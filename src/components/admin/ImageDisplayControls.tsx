import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  ZoomIn,
  Move,
  Check,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import {
  ImageDisplaySettings,
  DEFAULT_IMAGE_SETTINGS,
  getImageDisplayStyles,
  normalizeImageSettings,
} from '../../utils/imageStyles';

interface ImageDisplayControlsProps {
  imageUrl: string;
  imageAlt?: string;
  settings?: Partial<ImageDisplaySettings> | null;
  onChange: (newSettings: ImageDisplaySettings) => void;
  aspectRatioClass?: string; // e.g. 'aspect-4/3' for products, 'aspect-16/9' for hero
  label?: string;
  previewNote?: string;
}

export function ImageDisplayControls({
  imageUrl,
  imageAlt = 'Preview',
  settings,
  onChange,
  aspectRatioClass = 'aspect-4/3',
  label = 'Image Display & Framing Controls',
  previewNote = 'Live preview shows exact scaling and framing as displayed on the live website.',
}: ImageDisplayControlsProps) {
  const current = normalizeImageSettings(settings);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initPosX: number; initPosY: number }>({
    startX: 0,
    startY: 0,
    initPosX: 50,
    initPosY: 50,
  });

  // Updates a single field or partial settings
  const updateSettings = (updates: Partial<ImageDisplaySettings>) => {
    const merged = normalizeImageSettings({ ...current, ...updates });
    onChange(merged);
  };

  const handleReset = () => {
    onChange({ ...DEFAULT_IMAGE_SETTINGS });
  };

  // Drag interaction handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initPosX: current.posX ?? 50,
      initPosY: current.posY ?? 50,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const deltaX = e.clientX - dragStartRef.current.startX;
    const deltaY = e.clientY - dragStartRef.current.startY;

    // Movement sensitivity: dragging right brings the left side into view (increases posX or shifts)
    // When zoomed in, dragging right moves the focal point to follow cursor
    const sensitivity = (current.zoom ?? 100) > 100 ? 1.2 : 1.0;
    const deltaPercentX = (deltaX / rect.width) * 100 * sensitivity;
    const deltaPercentY = (deltaY / rect.height) * 100 * sensitivity;

    // Calculate new position bounded to [0, 100]
    const newPosX = Math.min(100, Math.max(0, Math.round(dragStartRef.current.initPosX + deltaPercentX)));
    const newPosY = Math.min(100, Math.max(0, Math.round(dragStartRef.current.initPosY + deltaPercentY)));

    updateSettings({ posX: newPosX, posY: newPosY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {
        // ignore
      }
      setIsDragging(false);
    }
  };

  const isCustomized =
    current.zoom !== DEFAULT_IMAGE_SETTINGS.zoom ||
    current.posX !== DEFAULT_IMAGE_SETTINGS.posX ||
    current.posY !== DEFAULT_IMAGE_SETTINGS.posY ||
    current.fit !== DEFAULT_IMAGE_SETTINGS.fit;

  return (
    <div className="bg-[#17191B] border border-[#2D3237] rounded-lg p-4 space-y-4 text-xs">
      {/* Header with Title and Reset */}
      <div className="flex items-center justify-between border-b border-[#252A2E] pb-3">
        <div className="flex items-center gap-2">
          <Move className="w-4 h-4 text-[#B79A68]" />
          <span className="font-semibold text-[#DFD9CB] uppercase tracking-wider text-[11px]">
            {label}
          </span>
          {isCustomized && (
            <span className="bg-[#B79A68]/20 text-[#B79A68] text-[10px] font-bold px-2 py-0.5 rounded border border-[#B79A68]/30">
              Custom Framing Active
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleReset}
          disabled={!isCustomized}
          className="inline-flex items-center gap-1.5 text-[11px] text-[#8E8B82] hover:text-[#F5F1E8] disabled:opacity-40 disabled:hover:text-[#8E8B82] transition-colors cursor-pointer disabled:cursor-not-allowed"
          title="Reset image zoom and position to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Default</span>
        </button>
      </div>

      {/* Main Grid: Interactive Preview and Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
        {/* Left Column: Interactive Live Preview with Drag-to-Position */}
        <div className="md:col-span-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#B9B5AC]">
            <span className="font-medium text-[#DFD9CB] flex items-center gap-1.5">
              <span>Live Website Framing Preview</span>
              <span className="text-[10px] text-[#8E8B82] font-mono">
                ({current.fit.toUpperCase()})
              </span>
            </span>
            <span className="text-[10px] text-[#B79A68] italic hidden sm:inline">
              Click & drag image to reposition
            </span>
          </div>

          <div
            ref={previewRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={`relative ${aspectRatioClass} w-full overflow-hidden rounded border-2 transition-colors select-none ${
              isDragging
                ? 'border-[#B79A68] cursor-grabbing shadow-lg'
                : 'border-[#3D434A] hover:border-[#B79A68]/70 cursor-grab'
            } bg-[#121415] flex items-center justify-center group`}
            title="Click and drag image to adjust horizontal and vertical position"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={imageAlt}
                draggable={false}
                style={getImageDisplayStyles(current)}
                className="w-full h-full pointer-events-none select-none transition-transform duration-75"
              />
            ) : (
              <div className="text-center text-[#8E8B82] p-4">
                <p>No image URL specified</p>
              </div>
            )}

            {/* Framing Guide Lines (Subtle Rule of Thirds crosshairs on hover or drag) */}
            <div
              className={`absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 transition-opacity duration-200 ${
                isDragging ? 'opacity-40' : 'opacity-0 group-hover:opacity-25'
              }`}
            >
              <div className="border-r border-b border-[#F5F1E8]/30" />
              <div className="border-r border-b border-[#F5F1E8]/30" />
              <div className="border-b border-[#F5F1E8]/30" />
              <div className="border-r border-b border-[#F5F1E8]/30" />
              <div className="border-r border-b border-[#F5F1E8]/30" />
              <div className="border-b border-[#F5F1E8]/30" />
              <div className="border-r border-[#F5F1E8]/30" />
              <div className="border-r border-[#F5F1E8]/30" />
              <div />
            </div>

            {/* Floating Live Settings Pill */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between pointer-events-none">
              <span className="bg-[#17191B]/90 backdrop-blur-xs text-[10px] text-[#DFD9CB] font-mono px-2 py-0.5 rounded border border-[#2D3237] shadow">
                {current.fit === 'contain' ? 'Fit: Contain' : 'Fit: Cover'} · {current.zoom}% Zoom
              </span>
              <span className="bg-[#17191B]/90 backdrop-blur-xs text-[10px] text-[#B79A68] font-mono px-2 py-0.5 rounded border border-[#2D3237] shadow">
                X: {current.posX}% · Y: {current.posY}%
              </span>
            </div>

            {/* Drag Hint Badge */}
            <div className="absolute top-2 right-2 pointer-events-none">
              <span className="bg-[#17191B]/80 text-[#8E8B82] group-hover:text-[#F5F1E8] text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border border-[#2D3237] flex items-center gap-1 transition-colors">
                <Move className="w-2.5 h-2.5" />
                <span>Drag to Pan</span>
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#8E8B82] leading-tight pt-1">
            {previewNote}
          </p>
        </div>

        {/* Right Column: Controls, Sliders, and Fit Mode */}
        <div className="md:col-span-6 space-y-4">
          {/* 1. Fit Mode Toggle */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold">
              Fit Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => updateSettings({ fit: 'cover' })}
                className={`flex items-center justify-center gap-2 p-2 rounded border text-xs font-semibold transition-all cursor-pointer ${
                  current.fit === 'cover'
                    ? 'bg-[#B79A68] text-[#17191B] border-[#B79A68] shadow-sm font-bold'
                    : 'bg-[#1D2023] text-[#B9B5AC] hover:text-[#F5F1E8] border-[#2D3237] hover:border-[#3D434A]'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Cover (Fill Card)</span>
              </button>

              <button
                type="button"
                onClick={() => updateSettings({ fit: 'contain' })}
                className={`flex items-center justify-center gap-2 p-2 rounded border text-xs font-semibold transition-all cursor-pointer ${
                  current.fit === 'contain'
                    ? 'bg-[#B79A68] text-[#17191B] border-[#B79A68] shadow-sm font-bold'
                    : 'bg-[#1D2023] text-[#B9B5AC] hover:text-[#F5F1E8] border-[#2D3237] hover:border-[#3D434A]'
                }`}
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Contain (Full View)</span>
              </button>
            </div>
            <p className="text-[10px] text-[#8E8B82]">
              {current.fit === 'cover'
                ? 'Cover: Fills the entire frame seamlessly. Use zoom and position to crop into the focal subject.'
                : 'Contain: Displays the complete memorial without any edge cropping. Letterboxed against granite backdrop.'}
            </p>
          </div>

          {/* 2. Zoom Control */}
          <div className="space-y-1.5 bg-[#1D2023] p-3 rounded-lg border border-[#252A2E]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-[#B79A68]" />
                <span>Zoom Scale</span>
              </label>
              <span className="font-mono text-xs font-bold text-[#B79A68] bg-[#17191B] px-2 py-0.5 rounded border border-[#2D3237]">
                {current.zoom}%
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-[#8E8B82] w-8">50%</span>
              <input
                type="range"
                min="50"
                max="200"
                step="1"
                value={current.zoom}
                onChange={(e) => updateSettings({ zoom: Number(e.target.value) })}
                className="flex-1 accent-[#B79A68] cursor-pointer h-1.5 bg-[#2D3237] rounded-lg appearance-none"
              />
              <span className="text-[10px] text-[#8E8B82] w-9 text-right">200%</span>
            </div>

            {/* Quick Zoom Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-[#8E8B82] mr-1">Presets:</span>
              {[75, 100, 125, 150, 200].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateSettings({ zoom: val })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                    current.zoom === val
                      ? 'bg-[#B79A68] text-[#17191B] font-bold'
                      : 'bg-[#17191B] text-[#B9B5AC] hover:text-[#F5F1E8] border border-[#2D3237]'
                  }`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>

          {/* 3. Horizontal Position Slider */}
          <div className="space-y-1.5 bg-[#1D2023] p-3 rounded-lg border border-[#252A2E]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold">
                Horizontal Position (Left / Right)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#DFD9CB]">
                  {current.posX === 50 ? 'Center' : `${current.posX}%`}
                </span>
                <button
                  type="button"
                  onClick={() => updateSettings({ posX: 50 })}
                  disabled={current.posX === 50}
                  className="text-[10px] text-[#B79A68] hover:underline disabled:opacity-30 disabled:no-underline cursor-pointer"
                >
                  Center
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-[#8E8B82] w-8">Left</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={current.posX}
                onChange={(e) => updateSettings({ posX: Number(e.target.value) })}
                className="flex-1 accent-[#B79A68] cursor-pointer h-1.5 bg-[#2D3237] rounded-lg appearance-none"
              />
              <span className="text-[10px] text-[#8E8B82] w-9 text-right">Right</span>
            </div>
          </div>

          {/* 4. Vertical Position Slider */}
          <div className="space-y-1.5 bg-[#1D2023] p-3 rounded-lg border border-[#252A2E]">
            <div className="flex items-center justify-between text-xs">
              <label className="text-[11px] uppercase tracking-wider text-[#DFD9CB] font-semibold">
                Vertical Position (Top / Bottom)
              </label>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-[#DFD9CB]">
                  {current.posY === 50 ? 'Center' : `${current.posY}%`}
                </span>
                <button
                  type="button"
                  onClick={() => updateSettings({ posY: 50 })}
                  disabled={current.posY === 50}
                  className="text-[10px] text-[#B79A68] hover:underline disabled:opacity-30 disabled:no-underline cursor-pointer"
                >
                  Center
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-[10px] text-[#8E8B82] w-8">Top</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={current.posY}
                onChange={(e) => updateSettings({ posY: Number(e.target.value) })}
                className="flex-1 accent-[#B79A68] cursor-pointer h-1.5 bg-[#2D3237] rounded-lg appearance-none"
              />
              <span className="text-[10px] text-[#8E8B82] w-9 text-right">Bottom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
