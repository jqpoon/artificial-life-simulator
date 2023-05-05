import { EVENTS_NAME } from '../../consts';
import { OrganismConfigs } from '../../typedefs';

export abstract class Organism extends Phaser.GameObjects.Ellipse {
  private static readonly ORGANISM_DEFAULTS = {
    velocity: 300,
    size: 25,
    x: 300,
    y: 300,
    color: 0xff0000,
    alpha: 1,
    startingEnergy: 100,
    energySplitParentRatio: 0.5,
    generation: 0,
    species: -1,
  };

  private readonly basalEnergyLossPerUpdate: number;
  private isSelected: boolean;
  private timeCounter: number;
  private gameIsPaused: boolean;

  public generation: number;
  public energy: number;
  public readonly velocity: number;
  protected age: number;
  protected species: number;
  public energySplitParentRatio: number;

  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = { ...Organism.ORGANISM_DEFAULTS, ...configs };

    // Limit size and velocity
    mergedConfigs.size = Math.max(10, mergedConfigs.size);
    mergedConfigs.size = Math.min(100, mergedConfigs.size);
    mergedConfigs.velocity = Math.max(1, mergedConfigs.velocity);
    mergedConfigs.velocity = Math.min(100, mergedConfigs.velocity);

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
    this.timeCounter = 0;
    this.isSelected = false;
    this.energy = mergedConfigs.startingEnergy;
    this.energySplitParentRatio = mergedConfigs.energySplitParentRatio;
    this.generation = mergedConfigs.generation;
    this.name = Phaser.Math.RND.uuid();
    this.species = mergedConfigs.species;

    // Energy loss is calculated as a function of size and speed based on Kleiber's law
    // Can be manually overridden if provided
    this.basalEnergyLossPerUpdate =
      mergedConfigs.energyLoss ?? 0.001 * Math.pow(mergedConfigs.size, 0.75);

    // Used to update statistics about this species
    this.scene.game.events.emit(EVENTS_NAME.changeCount, 1, this.species);

    // Logic for selecting an organism to view more information
    this.setInteractive();
    this.on('pointerdown', () => {
      this.scene.game.events.emit(EVENTS_NAME.selectOrganism, this);

      this.selectOrganism(true);
    });

    this.scene.game.events.on(EVENTS_NAME.selectOrganism, (organism: Organism) => {
      if (organism.name !== this.name) {
        this.selectOrganism(false);
      }
    });

    // Stop any updates to this organism
    this.scene.game.events.on(EVENTS_NAME.updateTimeScale, (timeScale: number) => {
      this.gameIsPaused = timeScale === 0;
    });
  }

  public update(time: number, delta: number): void {
    // Don't update anything if game is paused
    if (this.gameIsPaused) {
      return;
    }

    this.age += delta;

    // Collide with world boundaries, cast this because static bodies can't call that function...
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    this.setAlpha(Math.max(Math.round(this.energy / 20) / 5, 0.1)); // Round to nearest 0.05

    this.onUpdate(time, delta);

    // Basal energy loss and energy loss due to organism moving
    let velocity = body.velocity as Phaser.Math.Vector2; // Cast here due to weird typing issue
    let totalEnergyLoss =
      this.basalEnergyLossPerUpdate + velocity.length() * 0.001;
    this.addEnergy(-totalEnergyLoss);

    if (this.energy <= 0) {
      // Send a last update to organism viewer
      if (this.isSelected) {
        this.scene.game.events.emit(EVENTS_NAME.selectOrganism, this);
      }

      this.onDestroy();
      this.scene.game.events.emit(EVENTS_NAME.changeCount, -1, this.species);
      this.destroy();
    }

    // Scale energy needed to reproduce to size of organism
    if (this.energy > this.height * 5) {
      let child = this.clone();
      this.scene.game.events.emit(EVENTS_NAME.reproduceOrganism, child);
      this.energy = this.energy / 2 * this.energySplitParentRatio;
    }

    // Only do these updates once in awhile
    this.timeCounter += delta;
    if (this.timeCounter >= 200) {
      // Update organism information
      if (this.isSelected) {
        this.scene.game.events.emit(EVENTS_NAME.selectOrganism, this);
      }

      this.timeCounter -= 200;
    }
  }

  public addEnergy(amount: number): void {
    this.energy += amount;
  }

  private selectOrganism(isSelected: boolean) {
    this.isSelected = isSelected;
    if (isSelected) {
      this.strokeColor = 0x8f8f9c;
      this.setStrokeStyle(3); // Sets a border
    } else {
      this.setStrokeStyle();
    }
  }
}
