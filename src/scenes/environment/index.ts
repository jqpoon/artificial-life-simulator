import { Scene } from 'phaser';
import { EVENTS_NAME } from '../../consts';
import { Blob } from '../../classes/entities/blob';
import { Food } from '../../classes/entities/food';

export class EnvironmentScene extends Scene {
  player: Phaser.Physics.Arcade.Sprite;
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  foodGroup: Phaser.Physics.Arcade.StaticGroup;
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
    this.foodGroup = this.physics.add.staticGroup();

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

    this.player = new Blob(this, 300, 300, 'blob');

    var food = new Food(this, 500, 500, 'blob');
    food.addPredator(this.player);

    this.physics.add.collider(this.player, this.obstacles);
  }

  update(time: number, delta: number): void {
    this.player.update();

    // Add food randomly across the map at a set interval
    this.timer += delta;
    while (this.timer > 1500) {
      this.timer -= 1500;
      var food = new Food(this, Math.random() * 800, Math.random() * 600, 'blob');
      food.addPredator(this.player);
    }
  }
}
