import { EVENTS_NAME, ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { Entity, OrganismConfigs, OrganismInformation } from '../../typedefs';
import { OrganismUtils } from '../utils/organismUtils';

/**
 * A basic living thing in the simulator
 */
export abstract class Organism extends Phaser.GameObjects.Container {
  /* Physical limits of some attributes */
  private static readonly MIN_VELOCITY = 1;
  private static readonly MAX_VELOCITY = 100;
  private static readonly MIN_SIZE = 20;
  private static readonly MAX_SIZE = 100;
  private static readonly MIN_VISION = 10;
  private static readonly MAX_VISION = 800;

  /* Defaults attribute values */
  private static readonly ORGANISM_DEFAULTS = {
    alpha: 1,
    color: 0xff0000,
    generation: 0,
    size: 25,
    species: -1,
    startingEnergy: 100,
    velocity: 20,
    visionDistance: 800,
    x: 300,
    y: 300,
  };

  /* Physical attributes of an organism */
  protected basalEnergyLossPerUpdate: number;
  protected color: number;
  protected energy: number;
  protected size: number;
  protected species: number;
  protected radius: number; // Half of size
  protected velocity: number;
  protected visionDistance: number;

  /* Generic information of an organism */
  protected generation: number;

  /* Meta-information about an organism */
  protected isSelected: boolean;
  private timeCounter: number;

  /* Parts of this organism */
  public body: Phaser.Physics.Arcade.Body; // Body in physics engine
  private mainBody: Phaser.GameObjects.Ellipse;
  private vision: Phaser.GameObjects.Ellipse;

  /* Abstract methods for different organism types to implement */
  protected abstract clone(): any;
  protected abstract getType(): ORGANISM_TYPES;
  protected abstract getBrainDirectionInfo(): number[];
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  /**
   * Refer to type OrganismConfigs for more details
   * @param configs
   */
  constructor(configs: OrganismConfigs) {
    /* Express chromosomes if they exist */
    if (configs.colorChromosome) {
      configs.color = configs.colorChromosome.toPhenotype();
    }

    let mergedConfigs = { ...Organism.ORGANISM_DEFAULTS, ...configs };
    super(mergedConfigs.scene, mergedConfigs.x, mergedConfigs.y);

    /* Set physical attributes of organism */
    this.color = mergedConfigs.color;
    this.energy = mergedConfigs.startingEnergy;
    this.size = Phaser.Math.Clamp(
      mergedConfigs.size,
      Organism.MIN_SIZE,
      Organism.MAX_SIZE
    );
    this.velocity = Phaser.Math.Clamp(
      mergedConfigs.velocity,
      Organism.MIN_VELOCITY,
      Organism.MAX_VELOCITY
    );
    this.visionDistance = Phaser.Math.Clamp(
      mergedConfigs.visionDistance,
      Organism.MIN_VISION,
      Organism.MAX_VISION
    );
    this.basalEnergyLossPerUpdate =
      mergedConfigs.energyLoss ??
      OrganismUtils.calculateBasalEnergyLoss(this.size, this.visionDistance);
    this.radius = this.size / 2;
    this.species = mergedConfigs.species;

    /* Set generic information of organism */
    this.generation = mergedConfigs.generation;

    /* Set meta-information of organism */
    this.name = Phaser.Math.RND.uuid();
    this.isSelected = false;
    this.timeCounter = 0;

    /* Build visible body */
    this.scene.add.existing(this);
    this.mainBody = this.scene.add.ellipse(
      0, // Centers ellipse with container
      0, // Centers ellipse with container
      this.size,
      this.size,
      this.color
    );
    this.vision = this.scene.add.ellipse(
      0,
      0,
      this.size + this.visionDistance,
      this.size + this.visionDistance,
      this.color,
      0.2
    );
    this.add(this.mainBody).add(this.vision);

    /* Build physics body */
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCircle(
      this.radius,
      -this.radius,
      -this.radius
    );
    this.body.setBounce(1, 1);

    /* Enable clicks to view more information */
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, this.radius),
      Phaser.Geom.Circle.Contains
    );
    this.on('pointerdown', () => {
      this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
        name: this.name,
        generation: this.generation,
        velocity: this.velocity,
        size: this.size,
        energy: this.energy,
        type: this.getType(),
        color: this.color,
        brainDirectionInfo: this.getBrainDirectionInfo(),
      });
      this.toggleOrganismSelected(true);
    });
    // Deselect this organism if another one has been selected
    this.scene.game.events.on(
      EVENTS_NAME.selectOrganism,
      (info: OrganismInformation) => {
        if (info.name !== this.name) {
          this.toggleOrganismSelected(false);
        }
      }
    );
    // Set as unselected by default
    this.toggleOrganismSelected(false);

    /* Kill (delete) this organism if a user wants to */
    this.scene.game.events.on(EVENTS_NAME.killSelectedOrganism, () => {
      if (this.isSelected) {
        this.killOrganism();
      }
    });

    /* Signal that this organism is done initialising */
    this.scene.game.events.emit(EVENTS_NAME.changeCount, 1, this.species);
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

    /* Apply physics effects */
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setCollideWorldBounds(true); // Enable this to make the border a hard wall
    // this.scene.physics.world.wrap(this, -this.radius); // Enable this to make organisms warp across borders

    /* Apply energy loss to organism */
    let totalEnergyLoss =
      (this.basalEnergyLossPerUpdate + body.velocity.length() * 0.01) *
      this.scene.registry.get(REGISTRY_KEYS.energyLoss);
    this.addEnergy(-totalEnergyLoss);

    /* Send information about this organism if it is selected */
    if (this.isSelected) {
      this.scene.game.events.emit(EVENTS_NAME.selectOrganism, {
        name: this.name,
        generation: this.generation,
        velocity: this.velocity,
        size: this.size,
        energy: this.energy,
        type: this.getType(),
        color: this.color,
        brainDirectionInfo: this.getBrainDirectionInfo(),
      });
    }

    /* Run update function in subclass */
    this.onUpdate(time, delta);

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
   * Returns all entities within the organism's circular, except itself. Note
   * that entities are physical bodies in the Phaser definition
   *
   * @returns List of entities within this organism's vision
   */
  protected getEntitiesWithinVision(): Entity[] {
    let entities = this.scene.physics.overlapCirc(
      this.x,
      this.y,
      this.radius + this.visionDistance / 2,
      true,
      true
    ) as Entity[];

    return entities.filter((entity) => {
      return entity.gameObject.name !== this.name;
    });
  }

  /**
   * Finds the nearest entity to this organism and returns it. If there are none,
   * null is returned
   *
   * @returns - nearest entity or null
   */
  protected getNearestEntity(): Entity | null {
    let entities: Entity[] = this.getEntitiesWithinVision();
    let closestEntity = null;
    let closestDistance = Infinity;

    entities.forEach((entity: Entity) => {
      let distance = Phaser.Math.Distance.Squared(
        this.body.center.x,
        this.body.center.y,
        entity.center.x,
        entity.center.y
      );

      if (distance < closestDistance) {
        closestEntity = entity;
        closestDistance = distance;
      }
    });

    return closestEntity;
  }

  /**
   * Updates visual style of the organism when it is selected
   *
   * @param isSelected - Whether this organism has been selected
   */
  private toggleOrganismSelected(isSelected: boolean): void {
    this.isSelected = isSelected;
    if (isSelected) {
      this.mainBody.strokeColor = 0x8f8f9c;
      this.mainBody.setStrokeStyle(3); // Sets a border
      this.toggleOrganismVision(true);
    } else {
      this.mainBody.setStrokeStyle(0);
      this.toggleOrganismVision(false);
    }
  }

  /**
   * Updates whether an organism's vision can be 'seen'
   *
   * @param - Set to true to view vision radius
   */
  private toggleOrganismVision(isVisible: boolean): void {
    if (isVisible) {
      this.vision.setAlpha(1);
    } else {
      this.vision.setAlpha(0);
    }
  }

  /**
   * Logic for deciding what to do depending on energy levels
   */
  private calculateEnergyEffects(): void {
    /* Death */
    if (this.energy <= 0) {
      this.killOrganism();
    }

    /* Birth. Larger sizes need more energy to reproduce */
    if (this.energy > this.size * 5) {
      let child = this.clone();
      this.scene.game.events.emit(EVENTS_NAME.reproduceOrganism, child);
      this.energy = this.energy / 2;
    }
  }

  /* Kills and removes and organism */
  private killOrganism(): void {
    this.onDestroy();
    this.scene.game.events.emit(EVENTS_NAME.changeCount, -1, this.species);
    this.destroy();
  }
}
