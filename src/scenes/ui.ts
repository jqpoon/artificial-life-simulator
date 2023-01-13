import { GameObjects, Scene } from 'phaser';

import { Label } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';

import { SliderBar } from '../classes/ui/slider';
import { EVENTS_NAME } from '../consts';

const textDefaults = {
  fontSize: '30px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

export class UIScene extends Scene {
  private timeScale: GameObjects.Text;
  private countText: GameObjects.Text;
  private count: number = 0;
  private worldAgeText: GameObjects.Text;
  private worldAge: number = 0;

  constructor() {
    super('ui-scene');
  }

  create(): void {
    new SliderBar(
      this,
      (value) => {
        this.game.events.emit(EVENTS_NAME.updateTimeScale, value * 10);
      },
      this,
      {
        x1: 15,
        y1: 100,
        x2: 140,
        y2: 100,
      }
    );

    let rec = new RoundRectangleCanvas(this, 0, 0, 0, 0, 10, 0x333333);
    this.add.existing(rec);
    let btn = new Label(this, {
      background: rec,
      text: this.add.text(0, 0, 'Reset'),
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    })
      .setPosition(50, 350)
      .layout()
      .setInteractive()
      .on('pointerdown', () => {
        let envScene = this.scene.get('environment-scene');
        envScene.scene.restart();
        this.count = 0;
        this.worldAge = 0;
      });

    this.initTexts();
    this.initListeners();
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);
    this.add.text(
      1200,
      50,
      'This is an artificial life simulator!\n\nControl simulation parameters by using the controls on the left.',
      textDefaults
    );

    this.timeScale = this.add.text(0, 120, 'Speed: 5.0', textDefaults);
    this.countText = this.add.text(0, 240, 'Count: 1', textDefaults);
    this.worldAgeText = this.add.text(0, 180, 'World Age: 0', textDefaults);
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.updateTimeScale, (value: number) => {
      this.timeScale.setText(
        'Speed: ' +
          value.toLocaleString('en-us', {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })
      );
    });

    this.game.events.on(EVENTS_NAME.increaseCount, (amount: number) => {
      this.count += amount;
      this.countText.setText('Count: ' + this.count);
    });

    this.game.events.on(EVENTS_NAME.updateWorldAge, (age: number) => {
      this.worldAge += age;
      this.worldAgeText.setText(
        'World Age: ' +
          this.worldAge.toLocaleString('en-us', { maximumFractionDigits: 0 })
      );
    });
  }
}
