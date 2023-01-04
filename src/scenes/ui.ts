import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../classes/score';
import { Text } from '../classes/text';
import { EVENTS_NAME } from '../consts';

export class UIScene extends Scene {
  private score!: Score;
  private energy: Text;

  constructor() {
    super('ui-scene');
  }
  create(): void {
    this.score = new Score(this, 1200, 20, 0);
    this.energy = new Text(this, 1200, 200, "Energy: ");
    this.initListeners();
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.addScore, () => {
      this.score.changeValue(ScoreOperations.INCREASE, 1);
    });

    this.game.events.on(EVENTS_NAME.updateEnergy, (energy: number) => {
      this.energy.setText("Energy: " + energy);
    });
  }
}
