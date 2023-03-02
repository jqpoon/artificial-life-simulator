import { EVENTS_NAME } from '../../consts';
import { OrganismConfigs } from '../../typedefs';

export abstract class Organism extends Phaser.GameObjects.Ellipse {
  private static readonly ORGANISM_DEFAULTS = {
    velocity: 300,
    size: 25,
    x: 300,
    y: 300,
    color: 0xFF0000,
    energyLoss: 0.3,
    alpha: 1,
  };

  private decreaseEnergyEvent: Phaser.Time.TimerEvent;

  protected readonly velocity: number;
  protected age: number;
  protected energy: number;
  protected name2: number;

  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = {...Organism.ORGANISM_DEFAULTS, ...configs};

    super(
      mergedConfigs.scene,
      mergedConfigs.x,
      mergedConfigs.y,
      mergedConfigs.size,
      mergedConfigs.size,
      mergedConfigs.color,
      mergedConfigs.alpha,
    );
    mergedConfigs.scene.add.existing(this);
    mergedConfigs.scene.physics.add.existing(this);

    this.setDepth(1);
    this.velocity = mergedConfigs.velocity;

    this.age = 0;
    this.energy = 100;

    this.decreaseEnergyEvent = mergedConfigs.scene.time.addEvent({
      delay: 100,
      args: [-mergedConfigs.energyLoss],
      callback: this.addEnergy,
      callbackScope: this,
      loop: true,
    });

    this.name2 = mergedConfigs.name ?? -1;
    // name = species index aka species count
    this.scene.game.events.emit(EVENTS_NAME.changeCount, 1, this.name2);
  }

  public update(time: number, delta: number): void {
    this.age += delta;
    this.scene.physics.world.wrap(this, -this.width/2);
    this.setAlpha(Math.round(this.energy / 20) / 5); // Round to nearest 0.05

    this.onUpdate(time, delta);

    if (this.energy <= 0) {
      this.onDestroy();
      this.scene.game.events.emit(EVENTS_NAME.changeCount, -1, this.name2);
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
