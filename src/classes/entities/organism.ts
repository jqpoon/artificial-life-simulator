import { Physics } from 'phaser';

import { EVENTS_NAME } from '../../consts';

export abstract class Organism extends Physics.Arcade.Sprite {
  private static readonly DEFAULT_X = 300;
  private static readonly DEFAULT_Y = 300;
  private static readonly DEFAULT_SIZE = 0.5;

  private decreaseEnergyEvent: Phaser.Time.TimerEvent;

  protected readonly velocity: number;
  protected age: number;
  protected energy: number;

  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(
    scene: Phaser.Scene,
    texture: string,
    velocity: number,
    size: number,
    x?: number,
    y?: number,
    frame?: string | number
  ) {
    super(
      scene,
      x ?? Organism.DEFAULT_X,
      y ?? Organism.DEFAULT_Y,
      texture,
      frame
    );
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(size ?? Organism.DEFAULT_SIZE);
    this.setCircle(50);
    this.setDepth(1);
    this.velocity = velocity;

    this.age = 0;
    this.energy = 100;

    this.decreaseEnergyEvent = scene.time.addEvent({
      delay: 100,
      args: [-0.3],
      callback: this.addEnergy,
      callbackScope: this,
      loop: true,
    });

    this.scene.game.events.emit(EVENTS_NAME.increaseCount, 1);
  }

  public update(time: number, delta: number): void {
    this.age += delta;
    this.scene.physics.world.wrap(this, -25);

    this.onUpdate(time, delta);

    if (this.energy <= 0) {
      this.onDestroy();
      this.scene.game.events.emit(EVENTS_NAME.increaseCount, -1);
      this.decreaseEnergyEvent.remove(false);
      this.destroy();
    }

    if (this.energy > 100) {
      let child = this.clone();
      this.scene.game.events.emit(EVENTS_NAME.reproduceOrganism, child);
      this.energy -= 50;
    }
  }

  public addEnergy(amount: number): void {
    this.energy += amount;
  }
}
