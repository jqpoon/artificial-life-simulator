import { Physics } from 'phaser';
import { EVENTS_NAME } from '../../consts';

export abstract class Organism extends Physics.Arcade.Sprite {
  private static readonly DEFAULT_X = 300;
  private static readonly DEFAULT_Y = 300;
  private static readonly DEFAULT_SIZE = 0.5;
  protected readonly velocity: number;

  protected age: number;
  protected energy: number;

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
  }

  public update(time: number, delta: number): void {
    this.age += delta;
    this.energy -= 0.001;
    this.organismUpdate(time, delta);
    this.scene.game.events.emit(EVENTS_NAME.updateEnergy, this.energy.toLocaleString('en-us', {maximumFractionDigits: 1}));

    if (this.energy <= 0) {
      this.destroy();
    }
  }

  public addEnergy(amount: number): void {
    this.energy += amount;
  }

  public getEnergy(): number {
    return this.energy;
  }

  protected abstract organismUpdate(time:number, delta: number): void;
}
