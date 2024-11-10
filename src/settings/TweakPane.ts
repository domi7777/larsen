import Phaser from 'phaser';
import {Pane} from 'tweakpane';
import {LoopTracksScene} from '../scenes/LoopTracksScene.ts';
import {logger} from '../utils/logger.ts';

export class TweakPane {

  private static logsParams= {
    logs: '',
  }

  public static log(message: string) {
    TweakPane.logsParams.logs += '\n' + message;
  }

  constructor(private game: Phaser.Game) {
    const container = document.getElementById('settings');
    if (!container) {
      throw new Error('No settings container found');
    }
    const pane = new Pane({
      title: 'settings', // font-family: Icons; see index.html
      expanded: false,
      container,
    });
    pane.addButton({title: 'Delete current loop'}).on('click', () => {
      LoopTracksScene.deleteCurrentTrack();
    });
    pane.addButton({title: 'Delete instrument & loop'}).on('click', () => {
      LoopTracksScene.deleteCurrentInstrumentScene();
    });
    // error logging
    window.onerror = function (message, source, lineno, colno, error) {
      logger.error('\n' + message + ' ' + source + ' ' + lineno + ' ' + colno + ' ' + error);
    }

    pane.addButton({title: 'Show logs'}).on('click', () => {
      logsPanel.hidden = !logsPanel.hidden;
    });

    const logsPanel = pane.addBinding(TweakPane.logsParams, 'logs', {
      label: '',
      readonly: true,
      multiline: true,
      rows: 10,
      hidden: true,
    });

    // test panels
    // const PARAMS = {
    //   factor: 123,
    //   title: 'hello',
    //   color: '#ff0055',
    // };
    //
    // pane.addBinding(PARAMS, 'factor');
    // pane.addBinding(PARAMS, 'title');
    // pane.addBinding(PARAMS, 'color');
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
