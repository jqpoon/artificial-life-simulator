import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../classes/ui/score';
import { SliderBar } from '../classes/ui/slider';
import { Text } from '../classes/ui/text';
import { EVENTS_NAME } from '../consts';

export class UIScene extends Scene {
  private score!: Score;
  private energy: Text;
  private timeScale: Text;
  private countText: Text;
  private count: number = 0;

  constructor() {
    super('ui-scene');
  }

  create(): void {
    new Text(this, 0, 0, "Jia's Life\nSimulator");
    new SliderBar(this, (value) => {this.game.events.emit(EVENTS_NAME.updateTimeScale, value * 10)}, this);

    this.score = new Score(this, 1200, 20, 0);
    this.energy = new Text(this, 1200, 200, 'Energy: ');
    this.timeScale = new Text(this, 0, 120, 'Speed: 5.0');
    this.countText = new Text(this, 0, 240, 'Count: 1');

    this.initListeners();
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.addScore, () => {
      this.score.changeValue(ScoreOperations.INCREASE, 1);
    });

    this.game.events.on(EVENTS_NAME.updateEnergy, (energy: number) => {
      this.energy.setText('Energy: ' + energy);
    });

    this.game.events.on(EVENTS_NAME.updateTimeScale, (value: number) => {
      this.timeScale.setText('Speed: ' + value.toLocaleString('en-us', {maximumFractionDigits: 1, minimumFractionDigits: 1}))
    })

    this.game.events.on(EVENTS_NAME.increaseCount, (amount: number) => {
      this.count += amount;
      this.countText.setText('Count: ' + this.count);
    })
  }
}
