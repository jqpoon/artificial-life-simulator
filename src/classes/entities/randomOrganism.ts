import { Organism } from './organism';

export class RandomOrganism extends Organism {
  private static readonly SIZE = 0.5;
  private static readonly VELOCITY = 100;
  private readonly CHANGE_DIRECTION_DELAY: number = 1000;
  timer: number;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    x?: number,
    y?: number,
    frame?: string | number
  ) {
    super(
      scene,
      texture,
      RandomOrganism.VELOCITY,
      RandomOrganism.SIZE,
      x,
      y,
      frame
    );
    this.timer = 0;
  }

  public update(time: number, delta: number): void {
    this.timer += delta;
    while (this.timer > this.CHANGE_DIRECTION_DELAY) {
      this.timer -= this.CHANGE_DIRECTION_DELAY;
      this.setVelocityX(0);
      this.setVelocityY(0);

      // Random speed from -1 to 1 inclusive
      let randomX = Math.round(Math.random() * 3 - 1.5);
      let randomY = Math.round(Math.random() * 3 - 1.5);

      this.setVelocityX(this.velocity * randomX);
      this.setVelocityY(this.velocity * randomY);
    }
  }
}
