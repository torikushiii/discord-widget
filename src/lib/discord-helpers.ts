/**
 * Returns a CSS gradient string based on the nameplate palette
 */
export function getNameplateGradient(palette: string | null): string {
  if (!palette) return 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)';

  const gradients: Record<string, string> = {
    'cobalt': 'linear-gradient(90deg, rgba(47,128,237,0.1) 0%, rgba(47,128,237,0.4) 100%)',
    'sky': 'linear-gradient(90deg, rgba(0,128,183,0.1) 0%, rgba(0,128,183,0.4) 100%)',
    'crimson': 'linear-gradient(90deg, rgba(235,87,87,0.1) 0%, rgba(235,87,87,0.4) 100%)',
    'emerald': 'linear-gradient(90deg, rgba(39,174,96,0.1) 0%, rgba(39,174,96,0.4) 100%)',
    'amethyst': 'linear-gradient(90deg, rgba(155,81,224,0.1) 0%, rgba(155,81,224,0.4) 100%)',
    'gold': 'linear-gradient(90deg, rgba(242,201,76,0.1) 0%, rgba(242,201,76,0.4) 100%)',
    'orange': 'linear-gradient(90deg, rgba(242,153,74,0.1) 0%, rgba(242,153,74,0.4) 100%)',
    'pink': 'linear-gradient(90deg, rgba(242,166,166,0.1) 0%, rgba(242,166,166,0.4) 100%)',
    'berry': 'linear-gradient(90deg, transparent 0%, rgba(137, 58, 153, 0.08) 20%, rgba(137, 58, 153, 0.08) 50%, rgba(137, 58, 153, 0.2) 100%)',
  };

  return gradients[palette.toLowerCase()] || 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)';
}

/**
 * Converts a Discord hex color to RGB string
 */
export function hexToRgb(hex: number | null, defaultColor: string = '#5865F2'): string {
  if (hex === null) {
    return defaultColor;
  }

  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;

  return `rgb(${r}, ${g}, ${b})`;
}