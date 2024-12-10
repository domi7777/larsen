import Phaser from 'phaser';

export type HexaColor = `#${string}`;

export const Colors = {
  white: '#b5b7bd',
  black: '#1F2023FF',
  // black: '#1a1a1ac',
} as const;

export const hexToColor = (hex: HexaColor, isDarkMode = false) => {
  return Phaser.Display.Color.HexStringToColor(hex)
    .darken(isDarkMode ? 75 : 0)
    .color;
}
