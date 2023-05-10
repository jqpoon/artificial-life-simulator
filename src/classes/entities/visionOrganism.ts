import { Food } from './food';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { OrganismUtils } from '../utils/organismUtils';

export class VisionOrganism extends Organism {
  /**
   * Moves around randomly, until it sees a food, then it starts moving towards it
   */
  private readonly CHANGE_DIRECTION_DELAY_MILLISECONDS: number = 400;
  private changeDirectionCounter: number = 0;

  constructor(configs: OrganismConfigs) {
    super(configs);
  }

  protected onUpdate(time: number, delta: number): void {
    let food: Food | null = OrganismUtils.getNearestFood(
      this,
      this.scene.physics.overlapCirc(
        this.x + this.radius,
        this.y + this.radius,
        this.radius + this.visionDistance / 2,
        true,
        true
      )
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
    return new VisionOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
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
