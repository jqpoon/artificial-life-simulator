// @ts-nocheck
import { EVENTS_NAME } from '../../consts';
import { FoodConfigs } from '../../typedefs';
import { Organism } from './organism';

export class Food extends Phaser.GameObjects.Ellipse {
  private static readonly FOOD_DEFAULTS = {
    size: 10,
    color: 0x6cbf65, // Green,
  };

  constructor(configs: FoodConfigs) {
    let mergedConfigs = { ...Food.FOOD_DEFAULTS, ...configs };

    super(
      mergedConfigs.scene,
      mergedConfigs.x,
      mergedConfigs.y,
      mergedConfigs.size,
      mergedConfigs.size,
      mergedConfigs.color
    );
    mergedConfigs.scene.add.existing(this);
    mergedConfigs.scene.physics.add.existing(this);
  }

  public addPredator(group: Phaser.GameObjects.Group) {
    this.scene.physics.add.overlap(group, this, (obj1, obj2) => {
      obj2.destroy();
      const organism = obj1 as Organism;
      organism.addEnergy(50);
    });
  }
}
