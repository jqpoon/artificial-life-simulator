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
    super(scene, x, y, texture, frame);
    this.cursors = this.scene.input.keyboard.createCursorKeys();
  }

  public update() {
    let playerVelocity = 300;
    this.setVelocityX(0);
    this.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.setVelocityX(-playerVelocity);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(playerVelocity);
    }

    if (this.cursors.up.isDown) {
      this.setVelocityY(-playerVelocity);
    } else if (this.cursors.down.isDown) {
      this.setVelocityY(playerVelocity);
    }
  }
}
