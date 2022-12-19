import { Scene } from 'phaser';
import { EVENTS_NAME } from '../../consts';
import { Blob } from '../../classes/entities/blob';
import { Food } from '../../classes/entities/food';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  foodGroup: Phaser.Physics.Arcade.StaticGroup;
  timer: number;

  static readonly worldX = 200;
  static readonly worldY = 0;
  static readonly worldWidth = 800;
  static readonly worldHeight = 800;

  constructor() {
    super('environment-scene');
    this.timer = 0;
  }

  preload(): void {
    this.load.image('blob', 'assets/blob.png');
    this.load.image('food', 'assets/food.png');
  }

  create(): void {
    this.obstacles = this.physics.add.staticGroup();
    this.foodGroup = this.physics.add.staticGroup();

    let world = this.physics.world;
    world.setBounds(
      EnvironmentScene.worldX,
      EnvironmentScene.worldY,
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight
    );

    let border = this.add.rectangle(
      EnvironmentScene.worldWidth / 2 + EnvironmentScene.worldX, // x position (center)
      EnvironmentScene.worldHeight / 2, // y position (center)
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight,
      0xffffff,
      0
    );
    border.setStrokeStyle(1, 0x000000);
    this.obstacles.add(border);

    this.player = new Blob(this, 300, 300, 'blob');
    var food = new Food(this, 500, 500, 'food');
    food.addPredator(this.player);

    this.physics.add.collider(this.player, this.obstacles);
  }

  update(time: number, delta: number): void {
    this.player.update();

    // Add food randomly across the map at a set interval
    this.timer += delta;
    while (this.timer > 1500) {
      this.timer -= 1500;
      var food = new Food(
        this,
        Math.random() * EnvironmentScene.worldWidth + EnvironmentScene.worldX,
        Math.random() * EnvironmentScene.worldHeight + EnvironmentScene.worldY,
        'food'
      );
      food.addPredator(this.player);
    }
  }
}
