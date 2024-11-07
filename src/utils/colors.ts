import Phaser from 'phaser';

export type HexaColor = `#${string}`;

export const hexToColor = (hex: HexaColor, isDarkMode = false) => {
  return Phaser.Display.Color.HexStringToColor(hex)
    .darken(isDarkMode ? 75 : 0)
    .color;
}
