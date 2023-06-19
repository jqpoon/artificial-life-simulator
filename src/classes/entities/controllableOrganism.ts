import { ORGANISM_TYPES } from '../../consts';
import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(configs: OrganismConfigs) {
    super(configs);

    // Check if keyboard plugin exists, should be created by default
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  }

  protected onDestroy(): void {}

  protected onUpdate(time: number, delta: number): void {
    this.body.setVelocity(0, 0);

    if (this.cursors.left.isDown) {
      this.body.setVelocityX(-this.velocity);
    } else if (this.cursors.right.isDown) {
      this.body.setVelocityX(this.velocity);
    }

    if (this.cursors.up.isDown) {
      this.body.setVelocityY(-this.velocity);
    } else if (this.cursors.down.isDown) {
      this.body.setVelocityY(this.velocity);
    }
  }

  protected getBrainDirectionInfo(): number[] {
    return [];
  }

  protected onReproduce(child: any): void {}

  protected getType() {
    return ControllableOrganism;
  }

  protected getOrganismTypeName(): ORGANISM_TYPES {
    return ORGANISM_TYPES.controllableOrganism;
  }
}
