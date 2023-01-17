import { Physics } from 'phaser';

import { EVENTS_NAME } from '../../consts';
import { OrganismConfigs } from '../../typedefs';

export abstract class Organism extends Phaser.GameObjects.Ellipse {
  private static readonly ORGANISM_DEFAULTS = {
    velocity: 300,
    size: 0.5,
    x: 300,
    y: 300,
  };

  private decreaseEnergyEvent: Phaser.Time.TimerEvent;

  protected readonly velocity: number;
  protected age: number;
  protected energy: number;

  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = {...Organism.ORGANISM_DEFAULTS, ...configs};

    super(
      mergedConfigs.scene,
      mergedConfigs.x,
      mergedConfigs.y,
      50, 50, 0xff0000
      // mergedConfigs.texture,
      // mergedConfigs.frame
    );
    mergedConfigs.scene.add.existing(this);
    mergedConfigs.scene.physics.add.existing(this);

    this.setScale(mergedConfigs.size);
    // this.setCircle(50);
    this.setDepth(1);
    this.velocity = mergedConfigs.velocity;

    this.age = 0;
    this.energy = 100;

    this.decreaseEnergyEvent = mergedConfigs.scene.time.addEvent({
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
