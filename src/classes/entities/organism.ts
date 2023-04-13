import { EVENTS_NAME, REGISTRY_KEYS } from '../../consts';
import { OrganismConfigs } from '../../typedefs';

export abstract class Organism extends Phaser.GameObjects.Ellipse {
  private static readonly ORGANISM_DEFAULTS = {
    velocity: 300,
    size: 25,
    x: 300,
    y: 300,
    color: 0xff0000,
    alpha: 1,
  };

  private readonly basalEnergyLossPerUpdate: number;

  protected readonly velocity: number;
  protected age: number;
  protected energy: number;
  protected name2: number;

  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = { ...Organism.ORGANISM_DEFAULTS, ...configs };

    super(
      mergedConfigs.scene,
      mergedConfigs.x,
      mergedConfigs.y,
      mergedConfigs.size,
      mergedConfigs.size,
      mergedConfigs.color,
      mergedConfigs.alpha
    );
    mergedConfigs.scene.add.existing(this);
    mergedConfigs.scene.physics.add.existing(this);

    this.setDepth(1);
    this.velocity = mergedConfigs.velocity;

    this.age = 0;
    this.energy = 100;

    // Energy loss is calculated as a function of size and speed based on Kleiber's law
    // Can be manually overridden if provided
    this.basalEnergyLossPerUpdate =
      mergedConfigs.energyLoss ?? 0.001 * Math.pow(mergedConfigs.size, 0.75);

    this.name2 = mergedConfigs.name ?? -1;
    // name = species index aka species count
    this.scene.game.events.emit(EVENTS_NAME.changeCount, 1, this.name2);
  }

  public update(time: number, delta: number): void {
    this.age += delta;
    this.scene.physics.world.wrap(this, -this.width / 2);
    this.setAlpha(Math.round(this.energy / 20) / 5); // Round to nearest 0.05

    this.onUpdate(time, delta);

    // Basal energy loss and energy loss due to organism moving
    let velocity = this.body.velocity as Phaser.Math.Vector2; // Cast here due to weird typing issue
    let totalEnergyLoss =
      this.basalEnergyLossPerUpdate + velocity.length() * 0.001;
    this.addEnergy(-totalEnergyLoss);

    if (this.energy <= 0) {
      this.onDestroy();
      this.scene.game.events.emit(EVENTS_NAME.changeCount, -1, this.name2);
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
