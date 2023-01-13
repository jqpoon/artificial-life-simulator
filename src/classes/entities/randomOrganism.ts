import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class RandomOrganism extends Organism {
  private static readonly RANDOM_ORGANISM_DEFAULTS = {
    size: 0.5,
    velocity: 100,
  };
  private static readonly SIZE = 0.5;
  private static readonly VELOCITY = 100;
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 1000;

  private timedEvent: Phaser.Time.TimerEvent;
  private timer: number;

  constructor(configs: OrganismConfigs) {
    super({...RandomOrganism.RANDOM_ORGANISM_DEFAULTS, ...configs});

    this.timer = 0;

    this.timedEvent = configs.scene.time.addEvent({
      delay: this.CHANGE_DIRECTION_DELAY_MILLISECONDS,
      callback: this.changeDirection,
      callbackScope: this,
      loop: true,
    });
  }

  protected onUpdate(time: number, delta: number): void {}

  protected clone(): any {
    return new RandomOrganism({
      scene: this.scene,
      texture: this.texture.key,
      x: this.x,
      y: this.y,
      frame: this.frame.name
    });
  }

  public onDestroy() {
    this.timedEvent.remove(false);
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
