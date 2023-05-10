import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  private static readonly CONTROLLABLE_ORGANISM_DEFAULTS = {
    size: 0.5,
    velocity: 300,
  };

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private container: any;

  constructor(configs: OrganismConfigs) {
    super({
      ...ControllableOrganism.CONTROLLABLE_ORGANISM_DEFAULTS,
      ...configs,
    });

    // Check if keyboard plugin exists, should be created by default
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
    }
  }

  protected onDestroy(): void {}

  protected onUpdate(time: number, delta: number): void {
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.velocity);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.velocity);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-this.velocity);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(this.velocity);
    }
  }

  protected clone(): any {
    return new ControllableOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      size: this.size,
      color: this.color,
      species: this.species,
      startingEnergy: this.energy / 4,
    });
  }
}
