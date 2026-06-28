export interface SpokeCoord {
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export function buildSpokes(count: number, innerR: number, outerR: number): SpokeCoord[] {
  return Array.from({ length: count }, (_, i): SpokeCoord => {
    const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
    return {
      x1: Math.cos(angle) * innerR,
      y1: Math.sin(angle) * innerR,
      x2: Math.cos(angle) * outerR,
      y2: Math.sin(angle) * outerR,
    };
  });
}
