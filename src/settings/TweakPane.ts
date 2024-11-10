import Phaser from 'phaser';
import {Pane} from 'tweakpane';
import {LoopTracksScene} from '../scenes/LoopTracksScene.ts';
import {logger} from '../utils/logger.ts';
import {BindingApi} from '@tweakpane/core';

export class TweakPane {

  private static logsParams= {
    logs: '',
  }
  private pane: Pane;
  private volumeControl?: BindingApi;

  public static log(message: string) {
    TweakPane.logsParams.logs += '\n' + message;
  }

  constructor(private game: Phaser.Game) {
    const container = document.getElementById('settings');
    if (!container) {
      throw new Error('No settings container found');
    }
    this.pane = new Pane({
      title: 'settings', // font-family: Icons; see index.html
      expanded: false,
      container,
    });
    game.events.on('scene-change', (settings?: { volume: number }) => {
      if (this.volumeControl) {
        this.pane.remove(this.volumeControl);
      }
      if (settings) {
        this.volumeControl = this.pane.addBinding(settings, 'volume', {
          min: 0,
          max: 100,
          step: 1,
          index: 0 // add on top of pane
        });
      }
    })

    this.pane.addButton({title: 'Delete current loop'}).on('click', () => {
      LoopTracksScene.deleteCurrentTrack();
    });
    this.pane.addButton({title: 'Delete instrument & loop'}).on('click', () => {
      LoopTracksScene.deleteCurrentInstrumentScene();
    });
    // error logging
    window.onerror = function (message, source, lineno, colno, error) {
      logger.error('\n' + message + ' ' + source + ' ' + lineno + ' ' + colno + ' ' + error);
    }

    this.pane.addButton({title: 'Show logs'}).on('click', () => {
      logsPanel.hidden = !logsPanel.hidden;
    });

    const logsPanel = this.pane.addBinding(TweakPane.logsParams, 'logs', {
      label: '',
      readonly: true,
      multiline: true,
      rows: 10,
      hidden: true,
    });

    this.resize();
  }

  resize() {
    // tweak pane dom elements resizing
    const maxMinGameSize = Math.min(this.game.canvas.width, this.game.canvas.height);
    const fontSize = maxMinGameSize / 40 + 'px';
    const buttonHeight = maxMinGameSize / 10 + 'px';
    document.querySelectorAll('button').forEach(button => {
      button.style.fontSize = fontSize;
      button.style.height = buttonHeight;
    });
  }
}
