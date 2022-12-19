import { Physics } from 'phaser';

export class Blob extends Physics.Arcade.Sprite {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.getBody().setCollideWorldBounds(true);

    this.cursors = this.scene.input.keyboard.createCursorKeys();
    this.setScale(0.5);
    this.setCircle(50);
    this.setDepth(1);
  }

  protected getBody(): Physics.Arcade.Body {
    return this.body as Physics.Arcade.Body;
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
