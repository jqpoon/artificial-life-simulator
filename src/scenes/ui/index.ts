import { Scene } from 'phaser';
import { Score, ScoreOperations } from '../../classes/score';
import { EVENTS_NAME } from '../../consts';

export class UIScene extends Scene {
  private score!: Score;
  constructor() {
    super('ui-scene');
  }
  create(): void {
    this.score = new Score(this, 1000, 20, 0);
    this.initListeners();
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.addScore, () => {
      this.score.changeValue(ScoreOperations.INCREASE, 1);
    })
  }
}
