import ContainerLite from 'phaser3-rex-plugins/plugins/containerlite';
import { OrganismConfigs } from '../../typedefs';
import { Organism } from './organism';

export class ControllableOrganism extends Organism {
  private static readonly CONTROLLABLE_ORGANISM_DEFAULTS = {
    size: 0.5,
    velocity: 300,
  };

  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private vision: any;
  private container: any;

  constructor(configs: OrganismConfigs) {
    super({
      ...ControllableOrganism.CONTROLLABLE_ORGANISM_DEFAULTS,
      ...configs,
    });

    // Check if keyboard plugin exists, should be created by default
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
    }

    // let test2 = new Phaser.GameObjects.Ellipse(this.scene, this.x + 50, this.y + 50, 50, 50, 0x00ff00);
    // this.scene.add.existing(test2);
    // test2.setInteractive()
    //   .on('pointerdown', () => {
    //     this.test.clear();

    //     this.test.fillStyle(0x0000ff, 1);
    //     this.test.fillCircle(this.x, this.y, 20);
    //   }, this)

    // this.test = new Phaser.GameObjects.Graphics(this.scene);
    // this.scene.add.existing(this.test);
    // this.test.setDepth(5);

    // this.test.fillStyle(0x000000, 1);
    // this.test.fillCircle(this.x, this.y, 10);

    // this.vision = new Phaser.GameObjects.Ellipse(this.scene, this.x, this.y, this.height + 20, this.height + 20, 0x000000, 0.5);
    // this.vision.setDepth(5);
    // this.scene.add.existing(this.vision);

    // this.container = new ContainerLite(this.scene, this.x, this.y, [this, this.vision]);
    // this.scene.physics.add.existing(this.container);
    // this.container.body.setCircle(this.height);

    // this.test.setInteractive(new Phaser.Geom.Circle(this.x, this.y, 200), Phaser.Geom.Circle.Contains)
    //   .on('pointerdown', () => {
    //     console.log('HELLO PLEAse');
    //   })
  }

  protected onDestroy(): void {}

  protected onUpdate(time: number, delta: number): void {
    let body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);
    body.setCollideWorldBounds(true);

    if (this.cursors.left.isDown) {
      body.setVelocityX(-this.velocity);
    } else if (this.cursors.right.isDown) {
      body.setVelocityX(this.velocity);
    }

    if (this.cursors.up.isDown) {
      body.setVelocityY(-this.velocity);
    } else if (this.cursors.down.isDown) {
      body.setVelocityY(this.velocity);
    }
  }

  protected clone(): any {
    return new ControllableOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
    });
  }
}
