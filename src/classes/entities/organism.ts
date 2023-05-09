import { OrganismConfigs } from '../../typedefs';

export abstract class Organism extends Phaser.GameObjects.Container {
  /**
   * A basic living thing in the simulator.
   */

  /* Defaults attribute values */
  private static readonly ORGANISM_DEFAULTS = {
    velocity: 20,
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

  /* Physical attributes of an organism */
  private basalEnergyLossPerUpdate: number;
  private energy: number;
  private energySplitParentRatio: number;
  private generation: number;
  private size: number;
  private species: number;
  protected velocity: number;

  /* Meta-information about an organism */
  private isSelected: boolean;
  private gameIsPaused: boolean;
  private timeCounter: number;

  /* Parts of this organism */
  private mainBody: Phaser.GameObjects.Ellipse;

  /* Abstract methods for different organism types to implement */
  protected abstract clone(): any;
  protected abstract onUpdate(time: number, delta: number): void;
  protected abstract onDestroy(): void;

  constructor(configs: OrganismConfigs) {
    let mergedConfigs = { ...Organism.ORGANISM_DEFAULTS, ...configs };
    super(mergedConfigs.scene, mergedConfigs.x, mergedConfigs.y);

    /* Set physical attributes of organism */
    this.size = mergedConfigs.size;
    this.velocity = mergedConfigs.velocity;

    /* Build visible body */
    this.scene.add.existing(this);
    this.mainBody = this.scene.add.ellipse(
      this.size / 2,
      this.size / 2,
      this.size,
      this.size,
      0xff0000
    );
    this.add(this.mainBody);

    /* Build physics body */
    this.scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setCircle(this.size / 2); // Divide by two since size is defined in terms of diameter
  }

  public update(time: number, delta: number): void {
    this.onUpdate(time, delta); // Run update function in subclass
  }
}
