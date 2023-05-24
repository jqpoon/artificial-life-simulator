import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { TensorflowNetwork } from '../neuralNetworks/tensorflowNetwork';
import { Conversion } from '../utils/conversion';
import { ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';

export class NeuralNetworkOrganism extends Organism {
  private network: Network;

  constructor(configs: OrganismConfigs) {
    super(configs);

    this.network = new TensorflowNetwork(5, 2); // RGB input and relative x/y
  }

  public setWeights(weights: number[][][]): void {
    this.network.setWeights(weights);
  }

  protected clone() {
    let child = new NeuralNetworkOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      generation: this.generation + 1,
      size: this.size,
      color: this.color,
      startingEnergy: this.energy / 2,
      species: this.species,
    });

    /* Mutate neural network */
    let mutationRate = this.scene.registry.get(REGISTRY_KEYS.mutationRate);
    if (Math.random() < mutationRate) {
      let weights = this.network.getWeights();
      let layer = Phaser.Math.RND.integerInRange(0, weights.length - 1);

      /* Bias layers */
      if (layer === 1 || layer === 3) {
        let n1 = Phaser.Math.RND.integerInRange(0, weights[layer].length - 1);
        let m = weights[layer].length;

        let newValue = Phaser.Math.RND.realInRange(-(1.0 / Math.sqrt(m)), (1.0 / Math.sqrt(m)));

        (weights[layer] as unknown as number[])[n1] = newValue;
      } else {
        let n1 = Phaser.Math.RND.integerInRange(0, weights[layer].length - 1);
        let n2 = Phaser.Math.RND.integerInRange(0, weights[layer][n1].length - 1);
        let m = weights[layer].length;

        let newValue = Phaser.Math.RND.realInRange(-(1.0 / Math.sqrt(m)), (1.0 / Math.sqrt(m)));
        weights[layer][n1][n2] = newValue;
      }

      child.setWeights(weights);
    }

    return child;
  }

  protected onUpdate(time: number, delta: number): void {
    let nearestEntity = this.getNearestEntity();
    let color = 0;

    // TODO: refactor this instead of casting to any!
    /* Find rgb colour of nearest entity */
    if (nearestEntity) {
      color = (nearestEntity.gameObject as any).color;
    }
    let [r, g, b] = Conversion.numberColorToRGB(color);
    r = r / 255;
    g = g / 255;
    b = b / 255;

    /* Find relative x and y to nearest entity */
    let x = 0,
      y = 0;
    if (nearestEntity) {
      x = this.body.center.x - nearestEntity.x;
      y = this.body.center.y - nearestEntity.y;
    }
    x /= this.visionDistance / 2;
    y /= this.visionDistance / 2;

    /* Pass these values to neural network and let magic happen */
    let [xSpeed, ySpeed] = this.network.forward([r, g, b, x, y]);
    xSpeed = Phaser.Math.Clamp(xSpeed, -this.velocity, this.velocity);
    ySpeed = Phaser.Math.Clamp(ySpeed, -this.velocity, this.velocity);

    this.body.setVelocity(xSpeed * this.velocity, ySpeed * this.velocity);
  }

  protected onDestroy(): void {}

  protected getType(): ORGANISM_TYPES {
    return ORGANISM_TYPES.neuralNetworkOrganism;
  }
}
