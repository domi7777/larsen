import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';

const trackColorsState: Record<string, HexaColor> = {
  selected: '#DDD',
  unselected: '#000',
}

type Track = {
    button: Phaser.GameObjects.Rectangle;
    selected: boolean,
};

export class LoopTracksScene extends Phaser.Scene {
  private tracks!: Track[]

  constructor() {
    super('LoopTracksScene');
  }

  static numTracks = 8;

  static get sceneWidthHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(height, width) / 10;
  }

  create() {
    this.cameras.main
      .setOrigin(0, 0)
      .setPosition(0, 0)
      .setViewport(0, 0, LoopTracksScene.sceneWidthHeight, window.innerHeight)
      .setBackgroundColor('#963');// ugly color that should never be seen
    this.createTracks();
  }

  private createTracks() {
    this.tracks = new Array(LoopTracksScene.numTracks).fill(null).map((_, index) => {
      return {
        button: this.add.rectangle()
          .setOrigin(0, 0)
          .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
          .setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, () => this.selectTrack(index)),
        selected: false,
      };
    })
    window.addEventListener('resize', () => this.resizeTracks());
    this.resizeTracks();
    this.selectTrack(0);
  }

  private resizeTracks = () => {
    const isPortrait = window.innerWidth < window.innerHeight;
    const buttonWidth = isPortrait ? window.innerWidth / LoopTracksScene.numTracks : LoopTracksScene.sceneWidthHeight;
    const buttonHeight = isPortrait ? LoopTracksScene.sceneWidthHeight : window.innerHeight / LoopTracksScene.numTracks;

    this.tracks.forEach(({ button }, index) => {
      const x = isPortrait ? buttonWidth * index : 0;
      const y = isPortrait ? -1 : buttonHeight * index;
      button.setSize(buttonWidth, buttonHeight).setPosition(x, y);
    });

    this.cameras.main.setViewport(0, 0, isPortrait ? window.innerWidth : buttonWidth, isPortrait ? buttonHeight : window.innerHeight);
  }

  private selectTrack(index: number) {
    const track = this.tracks[index];
    if (!track.selected) {
      this.tracks.forEach(track => track.selected = false);
      track.selected = true;
      this.updateSelectedColor();
      const trackSceneKey = `track_scene_${index}`;
      if (this.scene.get(trackSceneKey)) {
        this.scene.get(trackSceneKey).scene.bringToTop();
      } else {
        this.game.scene.start('EmptyScene' as any, {index});
      }
    }
  }

  private updateSelectedColor() {
    this.tracks.forEach(({button, selected}) => {
      button.setFillStyle(hexToColor(selected ? trackColorsState.selected : trackColorsState.unselected));
    });
  }
}
