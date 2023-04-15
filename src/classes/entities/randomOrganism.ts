import { OrganismConfigs } from '../../typedefs';
import { Conversion } from '../utils/conversion';
import { Mutation } from '../utils/mutation';
import { Organism } from './organism';

export class RandomOrganism extends Organism {
  private static readonly RANDOM_ORGANISM_DEFAULTS = {
    size: 25,
    velocity: 100,
  };
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 1000;

  private timedEvent: Phaser.Time.TimerEvent;

  constructor(configs: OrganismConfigs) {
    super({ ...RandomOrganism.RANDOM_ORGANISM_DEFAULTS, ...configs });

    this.scene.physics.add.existing(this, false);

    this.timedEvent = configs.scene.time.addEvent({
      delay: this.CHANGE_DIRECTION_DELAY_MILLISECONDS,
      callback: this.changeDirection,
      callbackScope: this,
      loop: true,
    });
  }

  protected onUpdate(time: number, delta: number): void {}

  protected clone(): any {
    let mutationRate = 0.1;

    let newColor = this.fillColor;
    let newVelocity = this.velocity;
    let newSize = this.height;

    // Do some mutation
    if (Math.random() < mutationRate) {
      // newColor = Conversion.stringColorToNumberColour(
      //   '#' +
      //     Mutation.inversionMutation(
      //       Conversion.numberColorToStringColour(this.fillColor).substring(1),
      //       16
      //     )
      // );

      newVelocity = parseInt(
        Mutation.inversionMutation(this.velocity.toString(10), 10),
        10
      );
      newSize = parseInt(
        Mutation.inversionMutation(this.height.toString(10), 10),
        10
      );
    }

    return new RandomOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      color: newColor,
      velocity: newVelocity,
      size: newSize,
      species: this.species,
    });
  }

  public onDestroy() {
    this.timedEvent.remove(false);
  }

  private changeDirection(): void {
    // Casting required here because of types not properly defined in Phaser
    // https://github.com/photonstorm/phaser/issues/6015
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    // Random speed from -1 to 1 inclusive
    let randomX = Math.round(Math.random() * 3 - 1.5);
    let randomY = Math.round(Math.random() * 3 - 1.5);

    body.setVelocity(this.velocity * randomX, this.velocity * randomY);
  }
}
