import { Scene } from 'phaser';
import { ControllableOrganism } from '../classes/entities/controllableOrganism';
import { Food } from '../classes/entities/food';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  timer: number;

  private static readonly foodSpawnDelayInFrames: number = 1500;
  private static readonly worldX: number = 200;
  private static readonly worldY: number = 50;
  private static readonly worldWidth: number = 800;
  private static readonly worldHeight: number = 800;

  constructor() {
    super('environment-scene');
    this.timer = 0;
  }

  preload(): void {
    this.load.image('blob', 'assets/blob.png');
    this.load.image('food', 'assets/food.png');
  }

  create(): void {
    this.physics.world.setBounds(
      EnvironmentScene.worldX,
      EnvironmentScene.worldY,
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight
    );

    let visualBorder = this.add.rectangle(
      EnvironmentScene.worldWidth / 2 + EnvironmentScene.worldX, // x position (center)
      EnvironmentScene.worldHeight / 2 + EnvironmentScene.worldY, // y position (center)
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight,
      0xffffff,
      0
    );
    visualBorder.setStrokeStyle(1, 0x000000);

    this.player = new ControllableOrganism(this, 'blob');
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.physics.world.wrap(this.player, -25);

    // Add food randomly across the map at a set interval
    this.timer += delta;
    while (this.timer > EnvironmentScene.foodSpawnDelayInFrames) {
      this.timer -= EnvironmentScene.foodSpawnDelayInFrames;
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
