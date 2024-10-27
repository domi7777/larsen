import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../colors.ts';
import {FontFamily} from '../fonts.ts';
import {EmptyScene} from './EmptyScene.ts';
import {Loop} from '../Loop.ts';
import {Instrument} from '../instruments.ts';

const trackColorsState: Record<string, HexaColor> = {
  selected: '#DDD',
  unselected: '#000',
}

const controlIcons = {
  play: 'play_arrow',
  record: 'fiber_manual_record',
  stop: 'stop',
}

const controlColors = {
  idle: '#FFF',
  readyToRecord: '#0FF',
  recording: '#FD0041',
  playing: '#0F0',
}

type Track = {
  button: Phaser.GameObjects.Rectangle;
  buttonText: Phaser.GameObjects.Text;
  buttonSelectedCircle: Phaser.GameObjects.Ellipse;
  selected: boolean,
  loop: Loop;
  controlIcon: Phaser.GameObjects.Text;
};

export class LoopTracksScene extends Phaser.Scene {
  static key = 'LoopTracksScene';
  private tracks!: Track[]

  constructor() {
    super(LoopTracksScene.key);
  }

  static numTracks = 5;

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
    this.events.on('track-selected', () => {
      this.updateControlsState();
    });
    this.events.on('instrument-played', ({instrument}: {instrument: Instrument}) => {
      this.tracks.find(track => track.selected)?.loop?.addInstrument(instrument);
    });
  }

  private createTracks() {
    this.tracks = new Array(LoopTracksScene.numTracks).fill(null).map((_, index) => {
      return {
        loop: new Loop(index),
        button: this.add.rectangle()
          .setOrigin(0, 0)
          .setStrokeStyle(2, hexToColor('#FFF'), 0.8)
          .setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, () => this.selectTrack(index)),
        selected: false,
        buttonSelectedCircle: this.add.ellipse(0, 0, 0, 0, hexToColor('#FFF')),
        buttonText: this.add.text(0, 0, `${index + 1}`, {
          fontFamily: FontFamily.Text,
          fontSize: '24px',
          color: '#FFF',
        }).setOrigin(0.5, 0.5)
          .setResolution(2),
        controlIcon: this.add.text(0, 0, '', {
          fontFamily: FontFamily.Icons,
          fontSize: '24px',
          color: '#FFF',
        }).setOrigin(0.5, 0.5)
          .setResolution(2)
          .setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.handleControlClicked(index);
          })
      };
    })
    window.addEventListener('resize', () => this.resizeTracks());
    this.resizeTracks();
    this.selectTrack(0);
  }

  private handleControlClicked(index: number) {
    const track = this.tracks[index];
    track.loop.handleClick();
    this.updateControlsState();
  }

  private resizeTracks = () => {
    const isPortrait = window.innerWidth < window.innerHeight;
    const buttonWidth = isPortrait ? window.innerWidth / LoopTracksScene.numTracks : LoopTracksScene.sceneWidthHeight;
    const buttonHeight = isPortrait ? LoopTracksScene.sceneWidthHeight : window.innerHeight / LoopTracksScene.numTracks;

    this.tracks.forEach(({button, buttonText, buttonSelectedCircle, controlIcon}, index) => {
      const x = isPortrait ? buttonWidth * index : 0;
      const y = isPortrait ? -1 : buttonHeight * index;
      button.setSize(buttonWidth, buttonHeight).setPosition(x, y);

      const textX = isPortrait ? button.getCenter().x : button.getCenter().x - buttonWidth / 4;
      const textY = isPortrait ? button.getCenter().y - buttonHeight / 4 : button.getCenter().y;
      const minWidthHeight = Math.min(buttonHeight, buttonWidth);
      buttonText
        .setResolution(3)
        .setSize(buttonWidth, buttonHeight)
        .setFontSize(minWidthHeight / 4)
        .setPosition(textX, textY);

      buttonSelectedCircle
        .setSize(minWidthHeight / 3, minWidthHeight / 3)
        .setPosition(textX, textY);

      const iconX = isPortrait ? button.getCenter().x : button.getCenter().x + buttonWidth / 4;
      const iconY = isPortrait ? button.getCenter().y + buttonHeight / 4 : button.getCenter().y;
      controlIcon
        .setFontSize(minWidthHeight / 2)
        .setPosition(iconX, iconY);
    });

    this.cameras.main.setViewport(0, 0, isPortrait ? window.innerWidth : buttonWidth, isPortrait ? buttonHeight : window.innerHeight);
  }

  private selectTrack(index: number) {
    const track = this.tracks[index];
    if (!track.selected) {
      this.tracks.forEach(track => track.selected = false);
      track.selected = true;
      this.updateControlsState();
      const trackScene = this.getTrackScene(index);
      if (trackScene) {
        trackScene.scene.bringToTop();
      } else {
        this.game.scene.start(EmptyScene.key, {index});
      }
    }
  }

  public static getTrackSceneKey(index: number) {
    return `track_scene_${index}`;
  }

  public getTrackScene(index: number) {
    return this.scene.get(LoopTracksScene.getTrackSceneKey(index));
  }

  private updateControlsState() {
    this.tracks.forEach((track, index) => {
      track.button.setFillStyle(hexToColor(trackColorsState.unselected));
      track.buttonText.setColor(track.selected ? '#000' : '#FFF')
      track.buttonSelectedCircle.setFillStyle(hexToColor(track.selected ? '#FFF' : '#000'));

      if (this.getTrackScene(index)) {
        if (track.selected && (track.loop.isRecording() || track.loop.isReadyToRecord())) {
          track.controlIcon.setText(controlIcons.record)
            .setColor(track.loop.isRecording() ? controlColors.recording : controlColors.idle);
        } else if (track.loop.isPlaying() || track.loop.isReadyToPlay()) {
          track.controlIcon.setText(controlIcons.play)
            .setColor(track.loop.isPlaying() ? controlColors.playing : controlColors.idle);
        } else {
          track.controlIcon.setText('')
            .setColor(controlColors.idle);
        }
      }
    });
  }
}
