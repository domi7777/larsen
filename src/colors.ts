import Phaser from 'phaser';

export type HexaColor = `#${string}`;

export const hexToColor = (hex: HexaColor) => {
  return Phaser.Display.Color.HexStringToColor(hex).color;
}
