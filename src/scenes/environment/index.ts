import { Scene } from 'phaser';
import { ControllableOrganism } from '../../classes/entities/controllableOrganism';
import { Food } from '../../classes/entities/food';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  wrapGroup: Phaser.GameObjects.Group;
  border: Phaser.Geom.Rectangle;
  timer: number;

  static readonly foodSpawnDelayInFrames = 1500;
  static readonly worldX = 200;
  static readonly worldY = 50;
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
    let visualBorder = this.add.rectangle(
      EnvironmentScene.worldWidth / 2 + EnvironmentScene.worldX, // x position (center)
      EnvironmentScene.worldHeight / 2 + EnvironmentScene.worldY, // y position (center)
      EnvironmentScene.worldWidth,
      EnvironmentScene.worldHeight,
      0xffffff,
      0
    );
    visualBorder.setStrokeStyle(1, 0x000000);

    // Soft border to wrap entities from one side of canvas to other
    this.border = new Phaser.Geom.Rectangle(
      EnvironmentScene.worldX + 25,
      EnvironmentScene.worldY + 25,
      EnvironmentScene.worldWidth - 50,
      EnvironmentScene.worldHeight - 50,
    )

    this.player = new ControllableOrganism(this, 300, 300, 'blob');
    var food = new Food(this, 500, 500, 'food');
    food.addPredator(this.player);

    this.wrapGroup = this.add.group(this.player);
    this.wrapGroup.add(this.player);
  }

  update(time: number, delta: number): void {
    this.player.update();
    Phaser.Actions.WrapInRectangle(this.wrapGroup.getChildren(), this.border);

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
