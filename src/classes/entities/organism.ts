import { EVENTS_NAME, REGISTRY_KEYS } from '../../consts';
import { OrganismConfigs, OrganismInformation } from '../../typedefs';
import { OrganismMath } from '../utils/organismMath';

export abstract class Organism extends Phaser.GameObjects.Container {
  /**
   * A basic living thing in the simulator.
   */

  /* Physical limits of some attributes */
  private static readonly MIN_VELOCITY = 1;
  private static readonly MAX_VELOCITY = 100;
  private static readonly MIN_SIZE = 1;
  private static readonly MAX_SIZE = 100;

  /* Defaults attribute values */
  private static readonly ORGANISM_DEFAULTS = {
    alpha: 1,
    color: 0xff0000,
    generation: 0,
    size: 25,
    species: -1,
    startingEnergy: 100,
    velocity: 20,
    visionDistance: 50,
    x: 300,
    y: 300,
  };

  /* Physical attributes of an organism */
  protected basalEnergyLossPerUpdate: number;
  protected color: number;
  protected energy: number;
  protected size: number;
  protected species: number;
  protected velocity: number;
  protected visionDistance: number;

  /* Generic information of an organism */
  protected generation: number;

  /* Meta-information about an organism */
  private ID: string;
  private isSelected: boolean;
  private timeCounter: number;

  /* Parts of this organism */
  private mainBody: Phaser.GameObjects.Ellipse;
  private vision: Phaser.GameObjects.Ellipse;

  /* Abstract methods for different organism types to implement */
  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = { ...Organism.ORGANISM_DEFAULTS, ...configs };
    super(mergedConfigs.scene, mergedConfigs.x, mergedConfigs.y);

    /* Set physical attributes of organism */
    this.color = mergedConfigs.color;
    this.energy = mergedConfigs.startingEnergy;
    this.size = OrganismMath.clamp(
      mergedConfigs.size,
      Organism.MIN_SIZE,
      Organism.MAX_SIZE
    );
    this.velocity = OrganismMath.clamp(
      mergedConfigs.velocity,
      Organism.MIN_VELOCITY,
      Organism.MAX_VELOCITY
    );
    this.visionDistance = mergedConfigs.visionDistance;
    this.basalEnergyLossPerUpdate =
      mergedConfigs.energyLoss ??
      OrganismMath.calculateBasalEnergyLoss(this.size);

    /* Set generic information of organism */
    this.generation = mergedConfigs.generation;

    /* Set meta-information of organism */
    this.ID = Phaser.Math.RND.uuid();
    this.isSelected = false;
    this.timeCounter = 0;

    /* Build visible body */
    this.scene.add.existing(this);
    this.mainBody = this.scene.add.ellipse(
      this.size / 2, // Centers ellipse with container
      this.size / 2, // Centers ellipse with container
      this.size,
      this.size,
      this.color
    );
    this.vision = this.scene.add.ellipse(
      this.size / 2,
      this.size / 2,
      this.size + this.visionDistance,
      this.size + this.visionDistance,
      this.color,
      0.5
    );
    this.add(this.mainBody).add(this.vision);

    /* Build physics body */
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCircle(this.size / 2); // Divide by two since size is defined in terms of diameter

    /* Enable clicks to view more information */
    this.setInteractive(
      new Phaser.Geom.Circle(this.size / 2, this.size / 2, this.size / 2),
      Phaser.Geom.Circle.Contains
    );
    this.on('pointerdown', () => {
      this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
        ID: this.ID,
        generation: this.generation,
        velocity: this.velocity,
        size: this.size,
        energy: this.energy,
      });
      this.selectOrganism(true);
    });
    // Deselect this organism if another one has been selected
    this.scene.game.events.on(
      EVENTS_NAME.selectOrganism,
      (info: OrganismInformation) => {
        if (info.ID !== this.ID) {
          this.selectOrganism(false);
        }
      }
    );

    /* Signal that this organism is done initialising */
    // this.scene.game.events.emit(EVENTS_NAME.changeCount, 1, this.species);
  }

  public update(time: number, delta: number): void {
    /* Scale update frequency depending on timescale. Larger timescale = more frequent update */
    this.timeCounter += delta;
    if (
      this.timeCounter <=
      200 / this.scene.registry.get(REGISTRY_KEYS.timeScale)
    )
      return;
    this.timeCounter = 0;

    /* Run update function in subclass */
    this.onUpdate(time, delta);

    /* Apply physics effects */
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true);

    /* Apply energy loss to organism */
    let totalEnergyLoss =
      this.basalEnergyLossPerUpdate + body.velocity.length() * 0.001;
    this.addEnergy(-totalEnergyLoss);

    /* Send information about this organism if it is selected */
    if (this.isSelected) {
      this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
        ID: this.ID,
        generation: this.generation,
        velocity: this.velocity,
        size: this.size,
        energy: this.energy,
      });
    }

    /* Calculate energy effects (either clone or death). This has to be the
     * last call in this function, since it could delete the whole organism.
     */
    this.calculateEnergyEffects();
  }

  /**
   * Adds/removes energy to this organism
   *
   * @param amount - Amount of energy to add, can be negative
   */
  public addEnergy(amount: number): void {
    this.energy += amount;
  }

  /**
   * Updates visual style of the organism when it is selected
   * @param isSelected - Whether this organism has been selected
   */
  private selectOrganism(isSelected: boolean): void {
    this.isSelected = isSelected;
    if (isSelected) {
      this.mainBody.strokeColor = 0x8f8f9c;
      this.mainBody.setStrokeStyle(3); // Sets a border
    } else {
      this.mainBody.setStrokeStyle();
    }
  }

  /**
   * Logic for deciding what to do depending on energy levels
   */
  private calculateEnergyEffects(): void {
    /* Death */
    if (this.energy <= 0) {
      this.onDestroy();
      this.scene.game.events.emit(EVENTS_NAME.changeCount, -1, this.species);
      this.destroy();
    }

    /* Birth. Larger sizes need more energy to reproduce */
    if (this.energy > this.size * 5) {
      let child = this.clone();
      this.scene.game.events.emit(EVENTS_NAME.reproduceOrganism, child);
      this.energy = this.energy / 2;
    }
  }
}
