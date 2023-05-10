import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';

export class RandomOrganism extends Organism {
  /**
   * Moves around randomly only
   */
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 400;
  private changeDirectionCounter: number = 0;

  constructor(configs: OrganismConfigs) {
    super(configs);
  }

  protected onUpdate(time: number, delta: number): void {
    this.changeDirectionCounter += delta;
    if (
      this.changeDirectionCounter >= this.CHANGE_DIRECTION_DELAY_MILLISECONDS
    ) {
      this.changeDirection();
      this.changeDirectionCounter -= 200;
    }
  }

  protected clone(): any {
    let mutationRate = 0.01;

    let newVelocity = this.velocity;
    let newSize = this.size;
    let newEnergy = this.energy / 2;

    // Do some mutation
    if (Math.random() < mutationRate) {
      // newVelocity = parseInt(
      //   Mutation.inversionMutation(this.velocity.toString(10), 10),
      //   10
      // );
      // newSize = parseInt(
      //   Mutation.inversionMutation(this.height.toString(10), 10),
      //   10
      // );
    }

    return new RandomOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      color: this.color,
      velocity: newVelocity,
      size: newSize,
      species: this.species,
      startingEnergy: newEnergy,
      generation: this.generation + 1,
    });
  }

  protected onDestroy() {}

  private changeDirection(): void {
    // Casting required here because of types not properly defined in Phaser
    // https://github.com/photonstorm/phaser/issues/6015
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    // Random speed from -1 to 1 inclusive
    let randomX = Phaser.Math.RND.realInRange(-1, 1);
    let randomY = Phaser.Math.RND.realInRange(-1, 1);

    body.setVelocity(this.velocity * randomX, this.velocity * randomY);
  }
}
