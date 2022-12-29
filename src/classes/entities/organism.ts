import { Physics } from 'phaser';

export abstract class Organism extends Physics.Arcade.Sprite {
  private static readonly DEFAULT_X = 300;
  private static readonly DEFAULT_Y = 300;
  private static readonly DEFAULT_SIZE = 0.5;
  protected readonly velocity: number;
  protected age: number;

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
  }

  protected updateAge(delta: number): void {
    this.age += delta;
  }

  public abstract update(time: number, delta: number): void;
}
