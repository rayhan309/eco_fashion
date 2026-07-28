const HEX_PATTERN = /^#([0-9A-Fa-f]{6})$/;

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function darkenHex(hex: string, amount = 0.12) {
  if (!HEX_PATTERN.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = clampChannel(((n >> 16) & 255) * (1 - amount));
  const g = clampChannel(((n >> 8) & 255) * (1 - amount));
  const b = clampChannel((n & 255) * (1 - amount));
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function lightenHex(hex: string, amount = 0.92) {
  if (!HEX_PATTERN.test(hex)) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = clampChannel(((n >> 16) & 255) + (255 - ((n >> 16) & 255)) * amount);
  const g = clampChannel(((n >> 8) & 255) + (255 - ((n >> 8) & 255)) * amount);
  const b = clampChannel((n & 255) + (255 - (n & 255)) * amount);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function mixBorder(hex: string) {
  return lightenHex(hex, 0.75);
}

export function expandBrandColors(primaryColor: string) {
  const base = HEX_PATTERN.test(primaryColor) ? primaryColor : "#1f6f5b";
  return {
    primaryColor: base,
    primaryColorHover: darkenHex(base, 0.12),
    primaryColorDark: darkenHex(base, 0.22),
    primaryColorSoft: lightenHex(base, 0.92),
    primaryColorBorder: mixBorder(base),
  };
}
