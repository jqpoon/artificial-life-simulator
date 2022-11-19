import 'phaser';

class PlayGame extends Phaser.Scene {
  constructor() {
    super('PlayGame');
  }
  preload() {
    this.load.image('logo', 'assets/phaser3-logo.png');
  }
  create() {
    this.image = this.add.image(400, 300, 'logo');
  }
  update() {
    this.image.rotation += 0.01;
  }
}

let config = {
  width: 800,
  height: 600,
  parent: 'thegame',
  scene: PlayGame,
};

new Phaser.Game(config);
console.log('hello');
