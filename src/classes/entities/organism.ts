import { EVENTS_NAME, ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { speciesInfo } from '../../scenes/ui/common/UIConstants';
import { Entity, OrganismConfigs, OrganismInformation } from '../../typedefs';
import { ColorChromosome } from '../genetic/chromosomes/colorChromosome';
import { inversionWithMutationRate } from '../genetic/mutation';
import { OrganismUtils } from '../utils/organismUtils';

/**
 * A basic living thing in the simulator
 */
export abstract class Organism extends Phaser.GameObjects.Container {
  /* Physical limits of some attributes */
  private static readonly MIN_VELOCITY = 1;
  private static readonly MAX_VELOCITY = 100;
  private static readonly MIN_SIZE = 20;
  private static readonly MAX_SIZE = 60;
  private static readonly MIN_VISION = 10;
  private static readonly MAX_VISION = 500;
  private static readonly MAX_AGE = 3000;

  /* Defaults attribute values */
  private static readonly ORGANISM_DEFAULTS = {
    alpha: 1,
    color: 0xe8000b,
    generation: 0,
    size: 25,
    startingEnergy: 100,
    velocity: 20,
    visionDistance: 500,
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
  protected age: number;

  /* Meta-information about an organism */
  protected isSelected: boolean;
  private timeCounter: number;

  /* Parts of this organism */
  public body: Phaser.Physics.Arcade.Body; // Body in physics engine
  private mainBody: Phaser.GameObjects.Ellipse;
  private vision: Phaser.GameObjects.Ellipse;

  // protected abstract reproduce(mutationRate: number): any;
  /* Abstract methods for different organism types to implement */
  protected abstract onReproduce(child: any, mutationRate: number): void;
  protected abstract getType(): any; // Actual class of organism
  protected abstract getOrganismTypeName(): ORGANISM_TYPES;
  protected abstract getBrainDirectionInfo(): number[];
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  /**
   * Refer to type OrganismConfigs for more details
   * @param configs
   */
  constructor(configs: OrganismConfigs) {
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
    this.species = Object.values(speciesInfo).filter((species) => {
      return species.color == this.color;
    })[0].id;

    /* Set generic information of organism */
    this.generation = mergedConfigs.generation;
    this.age = 0;

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
        type: this.getOrganismTypeName(),
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

    /* Clone this organism if a user wants to */
    this.scene.game.events.on(EVENTS_NAME.cloneSelectedOrganism, () => {
      if (this.isSelected) {
        let child = this.clone();
        this.scene.game.events.emit(EVENTS_NAME.reproduceOrganism, child);
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
    let movementEnergyLoss =
      (Math.abs(body.deltaXFinal()) + Math.abs(body.deltaYFinal())) * 0.01;
    let totalEnergyLoss =
      (this.basalEnergyLossPerUpdate + movementEnergyLoss) *
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
        type: this.getOrganismTypeName(),
        color: this.color,
        brainDirectionInfo: this.getBrainDirectionInfo(),
        age: this.age,
      });
    }

    /* Set alpha of organism to show its energy level */
    this.setAlpha(Math.max(this.energy / 100, 0.1));

    /* Update age of organism */
    this.age += 1;

    /* Run update function in subclass */
    this.onUpdate(time, delta);

    /* Kill organism if they are too old */
    if (this.age > Organism.MAX_AGE) {
      this.energy = 0;
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
   * Creates a clone (an exact copy!) of this organism. Use reproduce() to
   * create an offspring that mutates
   *
   * @returns An exact clone of this organism
   */
  protected clone(): any {
    return this.reproduce(0);
  }

  protected reproduce(mutationRate: number = 0.01) {
    /* Mutate physical attributes */
    let newVelocity = this.velocity;
    let newSize = this.size;
    let newVisionDistance = this.visionDistance;
    let newColor = this.color;

    if (this.scene.registry.get(REGISTRY_KEYS.mutateSpeed)) {
      //       newVelocity = parseInt(
      //         Mutation.inversionMutation(this.velocity.toString(10), 10),
      //         10
      //       );
    }

    if (this.scene.registry.get(REGISTRY_KEYS.mutateSize)) {
    }

    if (this.scene.registry.get(REGISTRY_KEYS.mutateColour)) {
      let colorChromosome = new ColorChromosome().fromPhenotype(this.color);
      colorChromosome = colorChromosome.mutateWith(
        inversionWithMutationRate,
        mutationRate
      ) as ColorChromosome;
      newColor = colorChromosome.toPhenotype();
    }

    let child = new (this.getType())({
      scene: this.scene,
      x: this.x,
      y: this.y,
      size: newSize,
      velocity: newVelocity,
      visionDistance: newVisionDistance,
      color: newColor,
      generation: this.generation + 1,
      species: this.species,
      energy: this.energy / 2,
    });

    this.onReproduce(child, mutationRate);

    return child;
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
      let child = this.reproduce(
        this.scene.registry.get(REGISTRY_KEYS.mutationRate)
      );
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
