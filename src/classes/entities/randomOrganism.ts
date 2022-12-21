import { Organism } from './organism';

export class RandomOrganism extends Organism {
  readonly changeDirectionDelay = 1000;
  timer: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    this.timer = 0;
  }

  public update(time: number, delta: number): void {
    let playerVelocity = 100;

    this.timer += delta;
    while (this.timer > this.changeDirectionDelay) {
      this.timer -= this.changeDirectionDelay;
      this.setVelocityX(0);
      this.setVelocityY(0);

      let randomX = Math.round(Math.random() * 3 - 1.5);
      let randomY = Math.round(Math.random() * 3 - 1.5);

      this.setVelocityX(playerVelocity * randomX);
      this.setVelocityY(playerVelocity * randomY);
    }
  }
}
