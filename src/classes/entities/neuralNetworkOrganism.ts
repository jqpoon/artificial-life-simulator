import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { Conversion } from '../utils/conversion';
import { ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { LinearNetwork } from '../neuralNetworks/linearNetwork';
import { NeuralNetChromosome } from '../genetic/chromosomes/neuralNetChromosome';
import { inversionWithMutationRate } from '../genetic/mutation';

export class NeuralNetworkOrganism extends Organism {
  private network: Network;
  private networkChromosome: NeuralNetChromosome;

  constructor(configs: OrganismConfigs) {
    super(configs);

    if (configs.neuralNetChromosome) {
      this.network = configs.neuralNetChromosome.toPhenotype();
      this.networkChromosome =
        configs.neuralNetChromosome as NeuralNetChromosome;
    } else {
      this.network = new LinearNetwork([5, 2]); // RGB input, relative x/y and absolute x/y
      this.networkChromosome = new NeuralNetChromosome([5, 2]).fromPhenotype(
        this.network
      );
    }
  }

  protected clone() {
    /* Mutate neural network */
    let mutationRate = this.scene.registry.get(REGISTRY_KEYS.mutationRate);
    let childNetworkChromosome = this.networkChromosome.mutateWith(
      inversionWithMutationRate,
      mutationRate
    );

    let child = new NeuralNetworkOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      generation: this.generation + 1,
      size: this.size,
      color: this.color,
      startingEnergy: this.energy / 2,
      species: this.species,
      neuralNetChromosome: childNetworkChromosome,
    });

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
