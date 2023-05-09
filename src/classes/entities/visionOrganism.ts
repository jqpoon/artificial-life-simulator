import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class VisionOrganism extends Phaser.GameObjects.Container {

  constructor(configs: OrganismConfigs) {
    super(configs.scene, configs.x, configs.y)

    let test = new Phaser.GameObjects.Ellipse(this.scene, this.x, this.y, 30, 30, 0x00ff00);
    this.scene.add.existing(test);

  }

  protected onUpdate(time: number, delta: number): void {}

  protected clone(): any {
    return new VisionOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
    });
  }

  protected onDestroy() {}
}
