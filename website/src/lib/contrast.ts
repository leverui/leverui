/** Convert an sRGB channel to its linear value for contrast calculations. */
function linearChannel(value: number): number {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}

/** Choose readable black or white text for a six-digit CSS hex color. */
export function contrastTextColor(hex: string): '#000000' | '#ffffff' {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) {
    throw new Error('Expected a six-digit CSS hex color.');
  }

  const red = linearChannel(Number.parseInt(hex.slice(1, 3), 16));
  const green = linearChannel(Number.parseInt(hex.slice(3, 5), 16));
  const blue = linearChannel(Number.parseInt(hex.slice(5, 7), 16));
  const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}
