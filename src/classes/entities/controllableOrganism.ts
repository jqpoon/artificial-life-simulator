import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, 300, frame);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public update(time: number, delta: number): void {
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
