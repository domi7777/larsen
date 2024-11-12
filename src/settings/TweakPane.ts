import Phaser from 'phaser';
import {ButtonApi, Pane} from 'tweakpane';
import {LoopTracksScene} from '../scenes/LoopTracksScene.ts';
import {logger} from '../utils/logger.ts';
import {BindingApi} from '@tweakpane/core';
import {EVENTS} from '../events.ts';
import {PadsSceneSettings} from '../scenes/PadsScene.ts';

export class TweakPane {

  private static logsParams= {
    logs: '',
  }
  private pane: Pane;
  private sceneControls: {
    deleteInstrument?: ButtonApi;
    deleteLoop?: ButtonApi;
    volume?: BindingApi,
    noteDuration?: BindingApi
  } = {};

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
    game.events.on(EVENTS.sceneChange, (settings?: PadsSceneSettings) => {
      this.deleteSettings();
      if (settings) {
        this.addSettings(settings);
      }
    })

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

  private deleteSettings() {
    Object.values(this.sceneControls)
      .filter(Boolean)
      .forEach((binding) => {
        binding.dispose();
        this.pane.remove(binding)
      });
  }

  private addSettings(settings: PadsSceneSettings) {
    const index = 0; // elements are added from the top, so the first ones added here will be at the bottom
    this.sceneControls.deleteInstrument = this.pane.addButton({title: 'Delete instrument & loop', index})
      .on('click', () => LoopTracksScene.deleteCurrentInstrumentScene());
    this.sceneControls.deleteLoop = this.pane.addButton({title: 'Delete current loop', index})
      .on('click', () => LoopTracksScene.deleteCurrentTrack());
    this.sceneControls.volume = this.pane.addBinding(settings, 'volume', {
      min: 0,
      max: 100,
      step: 1,
      index
    });
    if (settings.noteDuration) {
      this.sceneControls.noteDuration = this.pane.addBinding(settings, 'noteDuration', {
        label: 'Note duration',
        min: 0.1,
        max: 5,
        step: 0.1,
        index
      });
    }
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
