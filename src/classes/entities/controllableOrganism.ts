import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  private static readonly CONTROLLABLE_ORGANISM_DEFAULTS = {
    size: 0.5,
    velocity: 300,
  };

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(configs: OrganismConfigs) {
    super({...ControllableOrganism.CONTROLLABLE_ORGANISM_DEFAULTS, ...configs});
    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.name = 'id ' + Date.now();
  }

  protected onDestroy(): void {}

  protected onUpdate(time: number, delta: number): void {
    this.setVelocityX(0);
    this.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.setVelocityX(-this.velocity);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(this.velocity);
    }

    if (this.cursors.up.isDown) {
      this.setVelocityY(-this.velocity);
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(this.velocity);
    }
  }

  protected clone(): any {
    return new ControllableOrganism({
      scene: this.scene,
      texture: this.texture.key,
      x: this.x,
      y: this.y,
      frame: this.frame.name
    });
  }
}
