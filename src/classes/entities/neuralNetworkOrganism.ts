import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import {
  EVENTS_NAME,
  GAME_CONSTANTS,
  ORGANISM_TYPES,
  REGISTRY_KEYS,
} from '../../consts';
import { LinearNetwork } from '../neuralNetworks/linearNetwork';
import { NeuralNetChromosome } from '../genetic/chromosomes/neuralNetChromosome';
import { inversionWithMutationRate } from '../genetic/mutation';
import { OrganismUtils } from '../utils/organismUtils';

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
      // inputs = 6 = isFood, relative x/y, absolute x/y, energy
      // outputs = 8 = direction to move in
      let id = (x: any) => {
        return x;
      };
      this.network = new LinearNetwork([4, 4, 2]);
      this.networkChromosome = new NeuralNetChromosome([4, 4, 2]).fromPhenotype(
        this.network
      );
    }

    // console.log(this.network.getParams()[0]);
    // console.log(this.network.forward([0, -1]));
    // console.log(this.network.forward([1, -1]));
    // console.log(this.network.forward([1, 0]));
    // console.log(this.network.forward([1, 1]));
    // console.log(this.network.forward([0, 1]));
    // console.log(this.network.forward([-1, 1]));
    // console.log(this.network.forward([-1, 0]));
    // console.log(this.network.forward([-1, -1]));
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
    let entities = this.getEntitiesWithinVision();

    let nearestFood = OrganismUtils.getNearestFood(this, entities);

    /* Find relative x and y to nearest entity */
    let x = 0,
      y = 0;
    if (nearestFood) {
      x = nearestFood.x - this.body.center.x;
      y = nearestFood.y - this.body.center.y;
    }

    /* Get relative position of this organism to the world, scaled to -0.5 to 0.5 */
    let pos_x = (this.x - GAME_CONSTANTS.worldX) / GAME_CONSTANTS.worldWidth - 0.5;
    let pos_y = (this.y - GAME_CONSTANTS.worldY) / GAME_CONSTANTS.worldHeight - 0.5;

    /* Pass these values to neural network and let magic happen */
    let inputs = [x, y, pos_x, pos_y];
    let outputs = this.network.forward(inputs);

    /* Execute output of neural network */
    let xSpeed = Phaser.Math.Clamp(
      outputs[0] * this.velocity,
      -this.velocity,
      this.velocity
    );
    let ySpeed = Phaser.Math.Clamp(
      outputs[1] * this.velocity,
      -this.velocity,
      this.velocity
    );
    this.body.setVelocity(xSpeed, ySpeed);
  }

  protected getBrainDirectionInfo(): number[] {
    /* Gather information about the neural network */
    let foodDirections = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];

    let movementDirection = [];
    for (const direction of foodDirections) {
      let [x, y] = this.network.forward(direction);
      let rad = Math.atan2(y, x);
      movementDirection.push(Phaser.Math.RadToDeg(rad) + 90);
    }
    return movementDirection;
  }

  protected onDestroy(): void {}

  protected getType(): ORGANISM_TYPES {
    return ORGANISM_TYPES.neuralNetworkOrganism;
  }
}
