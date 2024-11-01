import Phaser from 'phaser';
import {Pane} from 'tweakpane';
import {LoopTracksScene} from '../scenes/LoopTracksScene.ts';

export class TweakPane {

  constructor(private game: Phaser.Game) {
    const pane = new Pane({
      title: 'Settings',
      expanded: false,
      container: document.getElementById('settings')!
    });
    pane.on('fold', (e) => {
      if(e.expanded){
        this.game.pause();
      }else{
        this.game.resume();
      }
    });
    pane.addButton({title: 'Delete current loop'}).on('click', (e) => {
      LoopTracksScene.deleteCurrentTrack();
      e.native.preventDefault();
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
