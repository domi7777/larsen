
import Phaser from 'phaser';
import {playHiHat} from '../samples/hihat.ts';
import {playSnare} from '../samples/snare.ts';
import {playKick} from '../samples/kick.ts';
import {playCrashCymbal} from '../samples/crash.ts';

export class KitScene extends Phaser.Scene {
  private recordButton!: Phaser.GameObjects.Arc;

  protected hexToColor(hex: string) {
    return Phaser.Display.Color.HexStringToColor(hex).color;
  }

  create () {
    this.createPads();
    this.createRecordButton();
  }

  private createPads() {
    const pads = [
      this.add.rectangle().setFillStyle(this.hexToColor('#FDA341')).on('pointerdown', () => playHiHat()),
      this.add.rectangle().setFillStyle(this.hexToColor('#F24E1E')).on('pointerdown', () => playKick()),
      this.add.rectangle().setFillStyle(this.hexToColor('#4A90E2')).on('pointerdown', () => playSnare()),
      this.add.rectangle().setFillStyle(this.hexToColor('#A0D8C5')).on('pointerdown', () => playCrashCymbal())
    ];
    pads.forEach(rectangle => rectangle
      .setInteractive()
      .setOrigin(0, 0)
      .on('pointerdown', () => {
        rectangle.setAlpha(0.7);
        this.tweens.add({
          targets: rectangle,
          alpha: 1,
          duration: 250
        });
      })
    );

    const resizePads = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Update the pads
      pads[0].setSize(width / 2, height / 2).setPosition(0, 0);
      pads[1].setSize(width / 2, height / 2).setPosition(width / 2, 0);
      pads[2].setSize(width / 2, height / 2).setPosition(0, height / 2);
      pads[3].setSize(width / 2, height / 2).setPosition(width / 2, height / 2);
    };
    window.addEventListener('resize', resizePads);
    resizePads();
  }

  private createRecordButton() {
    const recordRectangle = this.add.rectangle()
      .setFillStyle(this.hexToColor('#000000'))
      .setOrigin(0, 0)
    this.recordButton = this.add.circle()
      .setFillStyle(this.hexToColor('#FD0041'))
      .setOrigin(0.5, 0)
    let isRecordingReady = false;
    let blinkingRecordButtonTween: Phaser.Tweens.Tween;
    [recordRectangle, this.recordButton].forEach(button => {
      button.setInteractive()
        .on('pointerdown', () => {
          isRecordingReady = !isRecordingReady;
          this.recordButton.setAlpha(0.7);
          this.tweens.add({
            targets: this.recordButton,
            alpha: 1,
            duration: 250
          });

          if (isRecordingReady) {
            blinkingRecordButtonTween = this.tweens.add({
              targets: this.recordButton,
              alpha: 0.5,
              duration: 750,
              repeat: -1,
              yoyo: true,
              ease: 'Sine.easeInOut'
            });
          } else {
            blinkingRecordButtonTween.stop();
            this.recordButton.setAlpha(1);
          }
        });
    });

    const resizeRecordButton = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      let recordButtonSize = Math.max(height, width) / 20;
      recordRectangle.setSize(width, recordButtonSize).setPosition(0, 0);
      this.recordButton
        .setRadius((recordButtonSize / 2) - 5)
        .setPosition(width / 2, 5)
        .setStrokeStyle(recordButtonSize / 20, this.hexToColor('#FFF'), 0.8)

    };
    window.addEventListener('resize', resizeRecordButton);
    resizeRecordButton();
  }
}
