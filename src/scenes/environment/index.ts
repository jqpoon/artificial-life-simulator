import { Scene } from 'phaser';
import { EVENTS_NAME } from '../../consts';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  timer: number;

  constructor() {
    super('environment-scene');
    this.timer = 0;
  }

  preload(): void {
    this.load.image('blob', 'assets/blob.png');
  }

  create(): void {
    this.obstacles = this.physics.add.staticGroup(); // create group for obstacles

    // Surely there must be a better way to do this...
    let border = this.add.rectangle(400, 0, 800, 1, 0xffffff, 0);
    let border2 = this.add.rectangle(0, 300, 1, 600, 0xffffff, 0);
    let border3 = this.add.rectangle(400, 600, 800, 1, 0xffffff, 0);
    let border4 = this.add.rectangle(800, 300, 1, 600, 0xffffff, 0);
    border.setStrokeStyle(1, 0x000000);
    border2.setStrokeStyle(1, 0x000000);
    border3.setStrokeStyle(1, 0x000000);
    border4.setStrokeStyle(1, 0x000000);
    this.obstacles.add(border);
    this.obstacles.add(border2);
    this.obstacles.add(border3);
    this.obstacles.add(border4);

    this.player = this.physics.add.sprite(300, 300, 'blob');
    this.player.setScale(0.3);
    this.player.setDepth(1);

    let food = this.add.circle(500, 500, 20, 0x64f18e, 0.5);
    this.physics.add.existing(food);
    this.physics.add.overlap(this.player, food, (obj1, obj2) => {
      this.game.events.emit(EVENTS_NAME.addScore);
      obj2.destroy();
    });

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.obstacles);
  }

  update(time: number, delta: number): void {
    let playerVelocity = 300;
    this.player.setVelocityX(0);
    this.player.setVelocityY(0);

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-playerVelocity);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerVelocity);
    }

    if (this.cursors.up.isDown) {
      this.player.setVelocityY(-playerVelocity);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(playerVelocity);
    }

    // Add food randomly across the map at a set interval
    this.timer += delta;
    while (this.timer > 1500) {
      this.timer -= 1500;

      let food = this.add.circle(
        Math.random() * 800,
        Math.random() * 600,
        20,
        0x64f18e,
        0.5
      );
      this.physics.add.existing(food);
      this.physics.add.overlap(this.player, food, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.addScore);
        obj2.destroy();
      });
    }
  }
}
