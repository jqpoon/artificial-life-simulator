import { Food } from './food';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { OrganismUtils } from '../utils/organismUtils';
import { ORGANISM_TYPES } from '../../consts';

/**
 * Organism that noves around randomly, until it sees a food,
 * then it starts moving towards it
 */
export class VisionOrganism extends Organism {
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 400;
  private changeDirectionCounter: number = 0;

  constructor(configs: OrganismConfigs) {
    super(configs);
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

  protected onDestroy() {}

  protected onReproduce(child: any): void {}

  protected getType() {
    return VisionOrganism;
  }

  protected getOrganismTypeName(): ORGANISM_TYPES {
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
