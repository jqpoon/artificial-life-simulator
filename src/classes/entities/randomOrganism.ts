import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';

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

  protected getBrainDirectionInfo(): number[] {
    return [];
  }

  protected onDestroy() {}

  protected onReproduce(): void {}

  protected getType(): any {
    return RandomOrganism;
  }

  protected getOrganismTypeName(): ORGANISM_TYPES {
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
