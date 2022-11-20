import { Scene } from 'phaser';
import { Score } from '../../classes/score';

export class UIScene extends Scene {
  private score!: Score;
  constructor() {
    super('ui-scene');
  }
  create(): void {
    this.score = new Score(this, 1000, 20, 0);
  }
}
