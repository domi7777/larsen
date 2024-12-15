import Phaser from 'phaser';

export type HexaColor = `#${string}`;

export const Colors = {
  // white: '#b5b7bd',
  // white: '#E0E0E0',
  white: '#D3D3D3',
  black: '#1F2023FF',
  // black: '#1a1a1ac',
  grey: '#2C2C2C',
  darkGrey: '#1F2023',
  orange: '#FDA341',
  red: '#F24E1E',
  blue: '#4A90E2',
  green: '#A0D8C5',
  yellow: '#F9F871',
  yellow2: '#F5C542',
  orange2: '#FF7F50',
  purple: '#9B59B6',
} as const;

export type PhaserColor =  Phaser.Display.Color;

export const PhaserColors = {
  get white() {
    return hexToColor(Colors.white);
  },
  get black() {
    return hexToColor(Colors.black);
  },
  get grey() {
    return hexToColor(Colors.grey);
  },
  get darkGrey() {
    return hexToColor(Colors.darkGrey);
  },
  get orange() {
    return hexToColor(Colors.orange);
  },
  get red() {
    return hexToColor(Colors.red);
  },
  get blue() {
    return hexToColor(Colors.blue);
  },
  get green() {
    return hexToColor(Colors.green);
  },
  get yellow() {
    return hexToColor(Colors.yellow);
  },
  get yellow2() {
    return hexToColor(Colors.yellow2);
  },
  get orange2() {
    return hexToColor(Colors.orange2);
  },
  get purple() {
    return hexToColor(Colors.purple);
  },
} as const satisfies Record<keyof typeof Colors, PhaserColor>;

// @Deprecated
export const hexToColor = (hexColor: HexaColor): PhaserColor => {
  return Phaser.Display.Color.HexStringToColor(hexColor);
}

export const colorToHex = (color: PhaserColor): HexaColor => {
  return Phaser.Display.Color.RGBToString(color.red, color.green, color.blue) as HexaColor;
}
