import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';
import { OrganismConfigs } from '../../typedefs';
import { TensorflowNetwork } from '../neuralNetworks/tensorflowNetwork';
import { Conversion } from '../utils/conversion';

export class NeuralNetworkOrganism extends Organism {
  private network: Network;

  constructor(configs: OrganismConfigs) {
    super(configs);

    this.network = new TensorflowNetwork(5, 2); // RGB input and relative x/y
  }

  protected clone() {

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

    /* Find relative x and y to nearest entity */
    let x = 0,
      y = 0;
    if (nearestEntity) {
      x = this.body.center.x - nearestEntity.x;
      y = this.body.center.y - nearestEntity.y;
    }

    /* Pass these values to neural network and let magic happen */
    let [xSpeed, ySpeed] = this.network.forward([r, g, b, x, y]);
    this.body.setVelocity(Math.max(xSpeed, this.velocity), Math.max(ySpeed, this.velocity));
  }

  protected onDestroy(): void {

  }
}
