import Phaser from 'phaser';
import {HexaColor, hexToColor} from '../utils/colors.ts';
import {FontColor, FontFamily, FontSize} from '../utils/fonts.ts';
import {EmptyScene} from './EmptyScene.ts';
import {Loop} from '../Loop.ts';

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
  private static tracks: Track[]
  private static instance: LoopTracksScene;

  constructor() {
    super(LoopTracksScene.key);
    LoopTracksScene.instance = this;
  }

  static numTracks = 5;

  static get sceneWidthHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(height, width) / 10;
  }

  static deleteCurrentTrack() {
    const track = LoopTracksScene.tracks.find(track => track.selected);
    if (track) {
      track.loop.destroy();
      track.loop = new Loop(LoopTracksScene.tracks.indexOf(track));
      LoopTracksScene.instance.updateControlsState();
    } else {
      console.error('No track selected');
    }
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
    this.events.on('instrument-played', ({callback}: { callback: Function }) => {
      LoopTracksScene.tracks.find(track => track.selected)?.loop?.addLoopEvent(callback);
    });
  }

  private createTracks() {
    LoopTracksScene.tracks = new Array(LoopTracksScene.numTracks).fill(null).map((_, index) => {
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
          fontSize: FontSize.medium,
          color: FontColor.white,
        }).setOrigin(0.5, 0.5)
          .setResolution(2),
        controlIcon: this.add.text(0, 0, '', {
          fontFamily: FontFamily.Icons,
          fontSize: FontSize.medium,
          color: FontColor.white
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
    const track = LoopTracksScene.tracks[index];
    track.loop.handleClick();
    this.updateControlsState();
  }

  private resizeTracks = () => {
    const isPortrait = window.innerWidth < window.innerHeight;
    const buttonWidth = isPortrait ? window.innerWidth / LoopTracksScene.numTracks : LoopTracksScene.sceneWidthHeight;
    const buttonHeight = isPortrait ? LoopTracksScene.sceneWidthHeight : window.innerHeight / LoopTracksScene.numTracks;

    LoopTracksScene.tracks.forEach((
      {
        button,
        buttonText,
        buttonSelectedCircle,
        controlIcon,
      }, index) => {
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
        .setPosition(textX, textY)

      buttonSelectedCircle
        .setSize(minWidthHeight / 3, minWidthHeight / 3)
        .setPosition(textX, textY)

      controlIcon
        .setOrigin(isPortrait ? 0.5 : 1, isPortrait ? 1 : 0.5)
        .setPosition(
          isPortrait ? button.getCenter().x : button.getRightCenter().x,
          isPortrait ? button.getBottomCenter().y : button.getCenter().y
        );
      if (controlIcon.text === controlIcons.record) {
        controlIcon.setPosition(
          isPortrait ? controlIcon.x : controlIcon.x + 5,
          controlIcon.y + 10
        )
      }
    });

    this.cameras.main.setViewport(0, 0, isPortrait ? window.innerWidth : buttonWidth, isPortrait ? buttonHeight : window.innerHeight);
  }

  private selectTrack(index: number) {
    const track = LoopTracksScene.tracks[index];
    if (!track.selected) {
      const previousTrack = LoopTracksScene.tracks.find(track => track.selected);
      if (previousTrack) {
        previousTrack.selected = false;
        if (previousTrack.loop.isRecording()) {
          previousTrack.loop.handleClick();
        }
      }
      track.selected = true;
      this.updateControlsState();
      const trackScene = this.getTrackScene(index);
      if (trackScene) {
        trackScene.scene.bringToTop();
      } else {
        this.game.scene.start(EmptyScene.key, {index});
      }
    } else {
      track.loop.handleClick();
      this.updateControlsState();
    }
  }

  public static getTrackSceneKey(index: number) {
    return `track_scene_${index}`;
  }

  public getTrackScene(index: number) {
    return this.scene.get(LoopTracksScene.getTrackSceneKey(index));
  }

  private updateControlsState() {
    LoopTracksScene.tracks.forEach((track, index) => {
      track.button.setFillStyle(hexToColor(trackColorsState.unselected));
      track.buttonText
        .setVisible(true)
        .setColor(track.selected ? '#000' : '#FFF');
      track.buttonSelectedCircle
        .setVisible(true)
        .setFillStyle(hexToColor(track.selected ? '#FFF' : '#000'));

      if (this.getTrackScene(index)) {
        const isPortrait = window.innerWidth < window.innerHeight;
        track.controlIcon
          .setOrigin(isPortrait ? 0.5 : 1, isPortrait ? 1 : 0.5)
          .setPosition(
            isPortrait ? track.button.getCenter().x : track.button.getRightCenter().x,
            isPortrait ? track.button.getBottomCenter().y : track.button.getCenter().y
          )
          .setFontSize(FontSize.medium);

        if (track.selected && (track.loop.isRecording() || track.loop.isReadyToRecord())) {
          track.controlIcon.setText(controlIcons.record)
            .setColor(track.loop.isRecording() ? controlColors.recording : controlColors.idle)
            .setFontSize(FontSize.big)
            .setPosition(
              isPortrait ? track.controlIcon.x: track.controlIcon.x + 5,
              track.controlIcon.y + 10
            )
          track.buttonSelectedCircle.setVisible(false);
          track.buttonText.setVisible(false);
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
