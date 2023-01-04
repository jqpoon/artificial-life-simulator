import { Physics } from 'phaser';
import { EVENTS_NAME } from '../../consts';
import { Organism } from './organism';

export class Food extends Physics.Arcade.Sprite {
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

    this.setScale(0.3);
    this.setCircle(50);
  }

  public addPredator(group: Phaser.GameObjects.Group) {
    this.scene.physics.add.overlap(group, this, (obj1, obj2) => {
      this.scene.game.events.emit(EVENTS_NAME.addScore);
      obj2.destroy();
      const organism = obj1 as Organism;
      organism.addEnergy(50);
    });
  }
}
 