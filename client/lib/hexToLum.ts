// HEX to RGB function
const hexToRgb = (hex: string): number[] =>
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) => `#${r + r + g + g + b + b}`)
    .substring(1)
    .match(/.{2}/g)!
    .map(x => parseInt(x, 16));

// Determine relation of luminance in color
const luminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map((v) => {
    // eslint-disable-next-line no-param-reassign
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : ((v + 0.055) / 1.055) ** 2;
  });

  return (a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722);
};

export default (hex: string) => luminance(...(hexToRgb(hex) as [number, number, number]));