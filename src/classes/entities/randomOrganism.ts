import { Organism } from './organism';

export class RandomOrganism extends Organism {
  private static readonly SIZE = 0.5;
  private static readonly VELOCITY = 100;
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 1000;
  
  private timedEvent: Phaser.Time.TimerEvent;
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

    this.timedEvent = scene.time.addEvent({
      delay: this.CHANGE_DIRECTION_DELAY_MILLISECONDS,
      callback: this.changeDirection,
      callbackScope: this,
      loop: true,
    });
  }

  protected organismUpdate(time: number, delta: number): void {}

  protected clone(): any {
    return new RandomOrganism(this.scene, this.texture.key, this.x, this.y, this.frame.name);
  }

  private changeDirection(): void {
    this.setVelocityX(0);
    this.setVelocityY(0);

    // Random speed from -1 to 1 inclusive
    let randomX = Math.round(Math.random() * 3 - 1.5);
    let randomY = Math.round(Math.random() * 3 - 1.5);

    this.setVelocityX(this.velocity * randomX);
    this.setVelocityY(this.velocity * randomY);
  }
}
