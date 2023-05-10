import { OrganismConfigs } from '../../typedefs';
import { OrganismUtils } from '../utils/organismUtils';
import { Food } from './food';
import { Organism } from './organism';

export class RandomOrganism extends Organism {
  private static readonly RANDOM_ORGANISM_DEFAULTS = {
    size: 25,
    velocity: 100,
  };
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 400;
  private changeDirectionCounter: number = 0;

  constructor(configs: OrganismConfigs) {
    super({ ...RandomOrganism.RANDOM_ORGANISM_DEFAULTS, ...configs });
  }

  protected onUpdate(time: number, delta: number): void {
    let food: Food | null = OrganismUtils.getNearestFood(this, this.scene.physics.overlapCirc(this.x + this.radius, this.y + this.radius, this.radius + this.visionDistance / 2, true, true));

    if (food !== null) {
      this.scene.physics.moveToObject(this, food, this.velocity);
      return;
    }

    this.changeDirectionCounter += delta;
    if (this.changeDirectionCounter >= this.CHANGE_DIRECTION_DELAY_MILLISECONDS) {
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
