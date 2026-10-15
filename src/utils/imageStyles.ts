/**
 * Utilities for calculating and rendering individual image display settings
 * (Zoom, Horizontal & Vertical Position, and Fit mode).
 */

export interface ImageDisplaySettings {
  zoom?: number; // 50 to 200 (percentage, 100 = default)
  posX?: number; // 0 to 100 (percentage, 50 = center)
  posY?: number; // 0 to 100 (percentage, 50 = center)
  fit?: 'cover' | 'contain'; // 'cover' (default) or 'contain'
}

export interface NormalizedImageDisplaySettings {
  zoom: number; // 50 to 200 (percentage, 100 = default)
  posX: number; // 0 to 100 (percentage, 50 = center)
  posY: number; // 0 to 100 (percentage, 50 = center)
  fit: 'cover' | 'contain'; // 'cover' (default) or 'contain'
}

export const DEFAULT_IMAGE_SETTINGS: NormalizedImageDisplaySettings = {
  zoom: 100,
  posX: 50,
  posY: 50,
  fit: 'cover',
};

/**
 * Normalizes input settings with safe bounds and fallbacks.
 */
export function normalizeImageSettings(
  settings?: Partial<ImageDisplaySettings> | null
): NormalizedImageDisplaySettings {
  if (!settings) {
    return { ...DEFAULT_IMAGE_SETTINGS };
  }

  const zoomRaw = typeof settings.zoom === 'number' ? settings.zoom : DEFAULT_IMAGE_SETTINGS.zoom;
  const zoom = Math.min(200, Math.max(50, Math.round(zoomRaw)));

  const posXRaw = typeof settings.posX === 'number' ? settings.posX : DEFAULT_IMAGE_SETTINGS.posX;
  const posX = Math.min(100, Math.max(0, Math.round(posXRaw)));

  const posYRaw = typeof settings.posY === 'number' ? settings.posY : DEFAULT_IMAGE_SETTINGS.posY;
  const posY = Math.min(100, Math.max(0, Math.round(posYRaw)));

  const fit = settings.fit === 'contain' ? 'contain' : 'cover';

  return { zoom, posX, posY, fit };
}

/**
 * Computes CSS styles for rendering an image based on individual zoom, position, and fit mode.
 * Works reliably in both 'cover' and 'contain' modes without distorting image proportions.
 */
export function getImageDisplayStyles(
  settings?: Partial<ImageDisplaySettings> | null
): React.CSSProperties {
  const norm = normalizeImageSettings(settings);
  const scale = norm.zoom! / 100;
  const fit = norm.fit!;
  const posX = norm.posX!;
  const posY = norm.posY!;

  // In contain mode, an image that fits snugly on one axis has no natural margin to shift with object-position alone.
  // A subtle translation factor allows moving the contained image vertically and horizontally.
  const containShiftX = fit === 'contain' ? (posX - 50) * 0.4 : 0;
  const containShiftY = fit === 'contain' ? (posY - 50) * 0.4 : 0;

  return {
    objectFit: fit,
    objectPosition: `${posX}% ${posY}%`,
    transform: `translate(${containShiftX}%, ${containShiftY}%) scale(${scale})`,
    transformOrigin: `${posX}% ${posY}%`,
  };
}
