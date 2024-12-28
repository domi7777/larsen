import Phaser from 'phaser';
import {Colors, colorToHex, HexaColor, hexToColor, PhaserColors} from '../utils/colors.ts';
import {FontColor, FontFamily, FontSize} from '../utils/fonts.ts';
import {EmptyScene} from './EmptyScene.ts';
import {Loop} from '../Loop.ts';
import {PadsScene} from './instruments/PadsScene.ts';
import {EVENTS} from '../events.ts';

const controlIcons = {
  play: 'play_arrow',
  record: 'fiber_manual_record',
  stop: 'stop',
}

const controlColors = {
  idle: Colors.white,
  readyToRecord: '#0FF',
  recording: '#FD0041',
  playing: '#0F0',
}

type Track = {
  button: Phaser.GameObjects.Rectangle;
  buttonText: Phaser.GameObjects.Text;
  selected: boolean,
  loop: Loop;
  controlIcon: Phaser.GameObjects.Text;
  loopProgressArc: Phaser.GameObjects.Graphics;
};

export class LoopTracksScene extends Phaser.Scene {
  static key = 'LoopTracksScene';
  static numTracks = 5;
  private static tracks: Track[]
  private static instance: LoopTracksScene;

  constructor() {
    super(LoopTracksScene.key);
    LoopTracksScene.instance = this;
  }

  static get sceneWidthHeight() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return Math.max(height, width) / 10;
  }

  static deleteCurrentTrack() {
    const track = LoopTracksScene.tracks.find(track => track.selected);
    if (track) {
      const trackIndex = LoopTracksScene.tracks.indexOf(track);
      track.loop.destroy();
      track.loopProgressArc.clear();
      track.loop = new Loop(trackIndex);
      this.instance.updateControlsState();
      return trackIndex;
    }
    throw new Error('No track selected');
  }

  static deleteCurrentInstrumentScene() {
    const trackIndex = LoopTracksScene.deleteCurrentTrack();
    const sceneKey = LoopTracksScene.getTrackSceneKey(trackIndex);
    this.instance.game.scene.remove(sceneKey);
    this.instance.game.scene.start(EmptyScene.key, {index: trackIndex});
    this.instance.updateControlsState();
  }

  public static getTrackSceneKey(index: number) {
    return `track_scene_${index}`;
  }

  create() {
    this.createTracks();
    this.game.events.on(EVENTS.sceneChange, () => {
      this.updateControlsState();
    });
    this.game.events.on(EVENTS.instrumentPlayed, ({callback}: { callback: Function }) => {
      LoopTracksScene.tracks.find(track => track.selected)?.loop?.addLoopEvent(callback);
    });
  }

  update() {
    for (const track of LoopTracksScene.tracks) {
      if (track.loop.isPlaying()) {
        this.updateProgressArc(track);
      }
    }
  }

  public getTrackScene(index: number): PadsScene | undefined {
    return this.scene.get(LoopTracksScene.getTrackSceneKey(index)) as PadsScene;
  }

  updateProgressArc(track: Track) {
    const loopLength = track.loop.getLoopLength();
    if (!loopLength) {
      throw new Error('Loop length is not defined');
    }

    const elapsed = Date.now() - track.loop.getStartPlayingTime();
    const progress = elapsed / loopLength; // 0 to 1 based on loop progress

    // Clear previous arc and redraw
    track.loopProgressArc.clear();
    track.loopProgressArc.lineStyle(4, hexToColor(track.buttonText.style.color as HexaColor).color, 1);

    // Calculate the angle for the arc based on progress
    const startAngle = Phaser.Math.DegToRad(-90); // start from the top
    const endAngle = startAngle + Phaser.Math.DegToRad(360 * progress);

    // Draw the arc around the button
    track.loopProgressArc.beginPath();
    track.loopProgressArc.arc(track.controlIcon.getCenter().x, track.controlIcon.getCenter().y - 5, track.controlIcon.width / 2.5, startAngle, endAngle, false); // radius slightly larger than button
    track.loopProgressArc.strokePath();
  }

  private createTracks() {
    LoopTracksScene.tracks = new Array(LoopTracksScene.numTracks).fill(null).map((_, index) => {
      return {
        loop: new Loop(index),
        button: this.add.rectangle()
          .setOrigin(0, 0)
          .setStrokeStyle(1, PhaserColors.darkGrey.color)
          .setInteractive()
          .on(Phaser.Input.Events.POINTER_DOWN, () => this.selectTrack(index)),
        selected: false,
        buttonText: this.add.text(0, 0, '+', {
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
          }),
        loopProgressArc: this.add.graphics()
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
        controlIcon,
      }, index) => {
      const x = isPortrait ? buttonWidth * index : 0;
      const y = isPortrait ? 0 : buttonHeight * index;
      // hack to make button border fully displayed, for some reason some pixels are missing...
      const borderOffset = 2;
      button
        .setSize(buttonWidth - (borderOffset * 2) , buttonHeight - (borderOffset * 2))
        .setPosition(x + borderOffset, y + borderOffset);

      const textX = isPortrait ? button.getCenter().x : button.getCenter().x - buttonWidth / 4;
      const textY = isPortrait ? button.getCenter().y - buttonHeight / 4 : button.getCenter().y;
      const minWidthHeight = Math.min(buttonHeight, buttonWidth);
      buttonText
        .setResolution(3)
        .setSize(buttonWidth, buttonHeight)
        .setFontSize(minWidthHeight / 4)
        .setPosition(textX, textY)
        .setWordWrapWidth(buttonWidth - 10, true)
        .setRotation(isPortrait ? 0 : - Math.PI / 2);

      controlIcon
        .setOrigin(isPortrait ? 0.5 : 1, isPortrait ? 1 : 0.5)
        .setPosition(
          isPortrait ? button.getCenter().x : button.getRightCenter().x,
          isPortrait ? button.getBottomCenter().y : button.getCenter().y + 5 // +5 because of font not being centered vertically
        );
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
        const settings = trackScene.settings;
        track.buttonText.setColor(colorToHex(trackScene.sceneTextColor)).setText(trackScene.sceneText);
        this.game.events.emit(EVENTS.sceneChange, settings);
      } else {
        this.game.scene.start(EmptyScene.key, {index});
      }
    } else {
      track.loop.handleClick();
      this.updateControlsState();
    }
    this.scene.bringToTop();
  }

  private updateControlsState() {
    LoopTracksScene.tracks.forEach((track, index) => {
      const trackScene = this.getTrackScene(index);
      const sceneTextColor = trackScene?.sceneTextColor.color ?? EmptyScene.sceneTextColor.color;
      const trackColor = track.selected ? sceneTextColor : PhaserColors.darkGrey.color;

      track.button
        .setDepth(track.selected ? 0 : -1)
        .setFillStyle(PhaserColors.black.color)
        .setStrokeStyle(1, trackColor);

      track.buttonText
        .setText(trackScene?.sceneText ?? EmptyScene.sceneText)
        .setColor(colorToHex(trackScene?.sceneTextColor ?? EmptyScene.sceneTextColor))
        .setAlpha(track.selected ? 1 : 0.5);

      track.button.clearFX();
      track.buttonText.clearFX();
      track.buttonText.postFX.addGlow(trackColor, 1, 0);
      if (track.selected) {
        track.button.postFX.addGlow(trackColor, 0, 3);
      }

      const hasLoopControls = trackScene?.canRecord || trackScene?.canPlay;
      if (hasLoopControls) {
        if (trackScene?.canRecord && track.selected && (track.loop.isRecording() || track.loop.isReadyToRecord())) {
          track.controlIcon.setText(controlIcons.record)
            .setColor(track.loop.isRecording() ? controlColors.recording : controlColors.idle)
        } else if (trackScene?.canPlay && (track.loop.isPlaying() || track.loop.isReadyToPlay())) {
          track.controlIcon.setText(controlIcons.play)
            .setColor(track.loop.isPlaying() ? controlColors.playing : controlColors.idle);
        } else {
          track.controlIcon.setText('')
            .setColor(controlColors.idle);
        }
      } else {
        track.controlIcon.setText('')
          .setColor(controlColors.idle);
      }
    });
  }
}
