import 'phaser';

class PlayGame extends Phaser.Scene {
  image: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  obstacles: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super('PlayGame');
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
    this.player.setScale(0.2);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.obstacles);
  }

  update(): void {
    let playerVelocity = 300;
    if (this.cursors.left.isDown && this.player.x >= 0) {
      this.player.setVelocityX(-playerVelocity); //go left
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(playerVelocity); //go right
    } else {
      this.player.setVelocityX(0); //don't move left or right
    }

    if (this.cursors.up.isDown && this.player.y >= 0) {
      this.player.setVelocityY(-playerVelocity); //move up
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(playerVelocity); //move down
    } else {
      this.player.setVelocityY(0); //don't move up or down
    }

    this.cameras.main.centerOn(this.player.x, this.player.y);
  }
}

let configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'canvas',
    width: 1600,
    height: 900,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  backgroundColor: '#FFFFFF',
  scene: PlayGame,
};

new Phaser.Game(configObject);
