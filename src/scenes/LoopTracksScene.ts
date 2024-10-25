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
  static get sceneWidth() {
    return window.innerWidth / 10;
  }

  static get buttonHeight() {
    return window.innerHeight / LoopTracksScene.numTracks;
  }

  create() {
    this.cameras.main
      .setOrigin(0, 0)
      .setPosition(0, 0)
      .setViewport(0, 0, LoopTracksScene.sceneWidth, window.innerHeight)
      .setBackgroundColor('#963');
    this.createTracks();
  }

  private createTracks() {
    this.tracks = new Array(LoopTracksScene.numTracks).fill(null).map((_, index) => {
      return {
        button: this.add.rectangle()
          .setOrigin(0, 0)
          .setPosition(0, index * LoopTracksScene.buttonHeight)
          .setSize(LoopTracksScene.sceneWidth, LoopTracksScene.buttonHeight)
          .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
          .setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, () => this.selectTrack(index)),
        selected: false,
      };
    })
    this.selectTrack(0);
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
      button.setFillStyle(hexToColor(selected? trackColorsState.selected: trackColorsState.unselected));
    });
  }
}
