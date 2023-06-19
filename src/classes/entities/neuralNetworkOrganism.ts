import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { GAME_CONSTANTS, ORGANISM_TYPES, REGISTRY_KEYS } from '../../consts';
import { LinearNetwork } from '../neuralNetworks/linearNetwork';
import { NeuralNetChromosome } from '../genetic/chromosomes/neuralNetChromosome';
import { inversionWithMutationRate } from '../genetic/mutation';
import { OrganismUtils } from '../utils/organismUtils';

export class NeuralNetworkOrganism extends Organism {
  private network: Network;

  constructor(configs: OrganismConfigs) {
    super(configs);

    // inputs = 7 = relative x/y of nearest food, absolute x/y, relative x/y of nearest entity, energy
    // outputs = 2 = x/y speed
    this.network = new LinearNetwork([7, 4, 2]);
  }

  protected onReproduce(child: any, mutationRate: number): void {
    /* Mutate neural network */
    /* But don't mutate if mutate brain is not enabled */
    if (!this.scene.registry.get(REGISTRY_KEYS.mutateBrain)) {
      mutationRate = 0;
    }

    let childNetworkChromosome = new NeuralNetChromosome([7, 4, 2])
      .fromPhenotype(this.network)
      .mutateWith(inversionWithMutationRate, mutationRate);

    child.network = childNetworkChromosome.toPhenotype();
  }

  protected onUpdate(time: number, delta: number): void {
    let entities = this.getEntitiesWithinVision();
    let nearestFood = OrganismUtils.getNearestFood(this, entities);

    let nearestEntity = this.getNearestEntity();

    let entityX = 0;
    let entityY = 0;
    if (nearestEntity) {
      entityX = nearestEntity.x - this.body.center.x;
      entityY = nearestEntity.y - this.body.center.y;
    }

    /* Find relative x and y to nearest food */
    let x = 0,
      y = 0;
    if (nearestFood) {
      x = nearestFood.x - this.body.center.x;
      y = nearestFood.y - this.body.center.y;
    }

    /* Get relative position of this organism to the world, scaled to -0.5 to 0.5 */
    let pos_x =
      (this.x - GAME_CONSTANTS.worldX) / GAME_CONSTANTS.worldWidth - 0.5;
    let pos_y =
      (this.y - GAME_CONSTANTS.worldY) / GAME_CONSTANTS.worldHeight - 0.5;

    /* Pass these values to neural network and let magic happen */
    // let inputs = [x, y, pos_x, pos_y, entityX, entityY, this.energy / 100];
    let inputs = [x, y, pos_x, pos_y, entityX, entityY, this.energy / 100];
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

  protected getType() {
    return NeuralNetworkOrganism;
  }

  protected getOrganismTypeName(): ORGANISM_TYPES {
    return ORGANISM_TYPES.neuralNetworkOrganism;
  }
}
