import Phaser from 'phaser';

export type HexaColor = `#${string}`;

export const Colors = {
  // white: '#b5b7bd',
  // white: '#E0E0E0',
  white: '#D3D3D3',
  black: '#1F2023FF',
  // black: '#1a1a1ac',
} as const;

export type PhaserColor =  Phaser.Display.Color;

export const PhaserColors = {
  get white() {
    return hexToColor(Colors.white);
  },
  get black() {
    return hexToColor(Colors.black);
  },
} as const;

// @Deprecated
export const hexToColor = (hexColor: HexaColor): PhaserColor => {
  return Phaser.Display.Color.HexStringToColor(hexColor);
}

export const colorToHex = (color: PhaserColor): HexaColor => {
  return Phaser.Display.Color.RGBToString(color.red, color.green, color.blue) as HexaColor;
}
