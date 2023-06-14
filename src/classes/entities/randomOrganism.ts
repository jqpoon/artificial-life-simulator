import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { Mutation } from '../genetic/mutation';

/**
 * Organism that noves around randomly
 */
export class RandomOrganism extends Organism {
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
      this.changeDirectionCounter -= this.CHANGE_DIRECTION_DELAY_MILLISECONDS;
    }
  }

  protected clone(): any {
    let mutationRate = this.scene.registry.get(REGISTRY_KEYS.mutationRate);

    let newVelocity = this.velocity;
    let newSize = this.size;
    let newEnergy = this.energy / 2;

    // Do some mutation
    if (Math.random() < mutationRate) {
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
      color: this.color,
      velocity: newVelocity,
      size: newSize,
      species: this.species,
      startingEnergy: newEnergy,
      generation: this.generation + 1,
    });
  }

  protected getBrainDirectionInfo(): number[] {
    return [];
  }

  protected onDestroy() {}

  protected getType(): ORGANISM_TYPES {
    return ORGANISM_TYPES.randomOrganism;
  }

  private changeDirection(): void {
    this.body.setVelocity(0, 0);

    // Random speed from -1 to 1 inclusive
    let randomX = Phaser.Math.RND.realInRange(-1, 1);
    let randomY = Phaser.Math.RND.realInRange(-1, 1);

    this.body.setVelocity(this.velocity * randomX, this.velocity * randomY);
  }
}
