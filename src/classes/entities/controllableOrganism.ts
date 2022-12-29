import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  private static readonly SIZE = 0.5;
  private static readonly VELOCITY = 300;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    x?: number,
    y?: number,
    frame?: string | number
  ) {
    super(
      scene,
      texture,
      ControllableOrganism.VELOCITY,
      ControllableOrganism.SIZE,
      x,
      y,
      frame
    );
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public update(time: number, delta: number): void {
    this.updateAge(delta);
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
}
