import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';

const trackColorsState: Record<string, HexaColor> = {
  selected: '#DDD',
  unselected: '#000',
}

type Track = {
    button: Phaser.GameObjects.Rectangle;
    selected: boolean,
    scene?: Phaser.Scene,
};

export class LoopTracksScene extends Phaser.Scene {
  private tracks!: Track[]

  constructor() {
    super('LoopTracksScene');
  }

  static numTracks = 5;

  static get sceneWidthHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(height, width) / 10;
  }

  static get buttonHeight() {
    return window.innerHeight / LoopTracksScene.numTracks;
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
    if (window.innerWidth < window.innerHeight) {
      const buttonHeight = LoopTracksScene.sceneWidthHeight;
      const buttonWidth = window.innerWidth / LoopTracksScene.numTracks;
      this.tracks.forEach(({button}, index) => {
        button.setSize(buttonWidth, buttonHeight).setPosition(buttonWidth * index, -1);
      });
      this.cameras.main.setViewport(0, 0, window.innerWidth, buttonHeight);
    } else {
      const buttonWidth = LoopTracksScene.sceneWidthHeight;
      const buttonHeight = window.innerHeight / LoopTracksScene.numTracks;
      this.tracks.forEach(({button}, index) => {
        button.setSize(buttonWidth, buttonHeight).setPosition(0, buttonHeight * index);
      });
      this.cameras.main.setViewport(0, 0, buttonWidth, window.innerHeight)
    }
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
