import 'phaser';

class PlayGame extends Phaser.Scene {
  image: Phaser.GameObjects.Image;
  player: Phaser.Physics.Arcade.Sprite;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor() {
    super('PlayGame');
  }

  preload(): void {
    this.load.image('blob', 'assets/blob.png');
    this.load.image('wall', 'assets/wall.png');
  }

  create(): void {
    this.image = this.add.image(600, 600, 'wall');

    let border = this.add.rectangle(400, 300, 800, 600, 0xffffff, 0);
    border.setStrokeStyle(2, 0x000000);

    this.player = this.physics.add.sprite(300, 300, 'blob');
    this.player.setScale(0.4);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update(): void {
    this.image.rotation += 0.01;

    if (this.cursors.left.isDown && this.player.x >= 0) {
      this.player.setVelocityX(-200); //go left
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200); //go right
    } else {
      this.player.setVelocityX(0); //don't move left or right
    }

    if (this.cursors.up.isDown && this.player.y >= 0) {
      this.player.setVelocityY(-200); //move up
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200); //move down
    } else {
      this.player.setVelocityY(0); //don't move up or down
    }

    this.cameras.main.centerOn(this.player.x, this.player.y);
  }
}

let configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'thegame',
    width: 800,
    height: 600,
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
