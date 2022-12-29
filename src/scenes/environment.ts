import { Scene } from 'phaser';
import { ControllableOrganism } from '../classes/entities/controllableOrganism';
import { Food } from '../classes/entities/food';
import { RandomOrganism } from '../classes/entities/randomOrganism';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  timer: number;

  private static readonly foodSpawnDelayInMilliseconds: number = 1500;
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

    this.player = new RandomOrganism(this, 'blob');

    this.time.addEvent({
      delay: EnvironmentScene.foodSpawnDelayInMilliseconds,
      callback: this.generateNewFood,
      callbackScope: this,
      loop: true,
    });

    this.updateTimeScale(1);
  }

  update(time: number, delta: number): void {
    this.player.update(time, delta);
    this.physics.world.wrap(this.player, -25);
  }

  private updateTimeScale(timeScale: number): void {
    this.tweens.timeScale = timeScale;
    this.physics.world.timeScale = 1/timeScale;
    this.time.timeScale = timeScale;
  }

  private generateNewFood(): void {
    var food = new Food(
      this,
      Math.random() * EnvironmentScene.worldWidth + EnvironmentScene.worldX,
      Math.random() * EnvironmentScene.worldHeight + EnvironmentScene.worldY,
      'food'
    );
    food.addPredator(this.player);
  }
}
