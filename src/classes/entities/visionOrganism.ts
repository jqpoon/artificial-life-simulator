import { Food } from './food';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { OrganismUtils } from '../utils/organismUtils';
import { ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { Mutation, inversionWithMutationRate } from '../genetic/mutation';
import { ColorChromosome } from '../genetic/chromosomes/colorChromosome';

/**
 * Organism that noves around randomly, until it sees a food,
 * then it starts moving towards it
 */
export class VisionOrganism extends Organism {
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 400;
  private changeDirectionCounter: number = 0;
  private colorChromosome: ColorChromosome;

  constructor(configs: OrganismConfigs) {
    super(configs);

    this.colorChromosome = new ColorChromosome().fromPhenotype(this.color);
  }

  protected onUpdate(time: number, delta: number): void {
    let food: Food | null = OrganismUtils.getNearestFood(
      this,
      this.getEntitiesWithinVision()
    );

    if (food !== null) {
      this.scene.physics.moveToObject(this, food, this.velocity);
      return;
    }

    this.changeDirectionCounter += delta;
    if (
      this.changeDirectionCounter >= this.CHANGE_DIRECTION_DELAY_MILLISECONDS
    ) {
      this.changeDirection();
      this.changeDirectionCounter -= 200;
    }
  }

  protected clone(): any {
    let mutationRate = this.scene.registry.get(REGISTRY_KEYS.mutationRate);

    let newVelocity = this.velocity;
    let newSize = this.size;
    let newVisionDistance = this.visionDistance / 2;

    // Do some mutation
    if (Math.random() < mutationRate) {
      newVelocity = parseInt(
        Mutation.inversionMutation(this.velocity.toString(10), 10),
        10
      );
      newSize = parseInt(
        Mutation.inversionMutation(this.size.toString(10), 10),
        10
      );
      newVisionDistance = parseInt(
        Mutation.inversionMutation(this.visionDistance.toString(10), 10),
        10
      );
    }

    return new VisionOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      size: newSize,
      velocity: newVelocity,
      visionDistance: newVisionDistance,
      color: this.color,
      generation: this.generation + 1,
      species: this.species,
      colorChromosome: this.colorChromosome.mutateWith(
        inversionWithMutationRate,
        mutationRate
      ),
    });
  }

  protected onDestroy() {}

  protected getType(): ORGANISM_TYPES {
    return ORGANISM_TYPES.visionOrganism;
  }

  protected getBrainDirectionInfo(): number[] {
    return [0, 45, 90, 135, 180, 225, 270, 315];
  }

  private changeDirection(): void {
    this.body.setVelocity(0, 0);

    // Random speed from -1 to 1 inclusive
    let randomX = Phaser.Math.RND.realInRange(-1, 1);
    let randomY = Phaser.Math.RND.realInRange(-1, 1);

    this.body.setVelocity(this.velocity * randomX, this.velocity * randomY);
  }
}
