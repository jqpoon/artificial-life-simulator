import { GAME_CONSTANTS, ORGANISM_TYPES } from '../../consts';
import { OrganismConfigs } from '../../typedefs';
import { LinearNetwork } from '../neuralNetworks/linearNetwork';
import { Network } from '../neuralNetworks/network';
import { Organism } from './organism';

export class ReinforcementLearningOrganism extends Organism {
  private network: Network;
  private action: number;
  private qValues: number[];
  private epsilon: number;

  constructor(configs: OrganismConfigs) {
    super(configs);

    this.epsilon = 1;

    this.network = new LinearNetwork([3, 8]);
  }

  protected clone() {
    let child = new ReinforcementLearningOrganism({
      scene: this.scene,
      x: this.x,
      y: this.y,
      generation: this.generation + 1,
      size: this.size,
      color: this.color,
      startingEnergy: this.energy / 2,
      species: this.species,
    });

    child.network.setParams(this.network.getParams());

    return child;
  }

  protected onUpdate(time: number, delta: number): void {
    /* Construct state array */
    let nearestEntity = this.getNearestEntity();
    let isFood = 0;

    // Find nearest entity and its relative position
    if (nearestEntity) {
      isFood = nearestEntity.gameObject.name == 'food' ? 1 : 0;
    }

    let x = 0,
      y = 0;
    if (nearestEntity) {
      x = nearestEntity.x - this.body.center.x;
      y = nearestEntity.y - this.body.center.y;
    }
    x /= this.visionDistance / 2;
    y /= this.visionDistance / 2;

    let state = [isFood, x, y];

    /* Calculate Q values for this state */
    let qValues = this.network.forward(state);

    let randInt = function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /* Calculate optimal action based on Q policy */
    let action = 0;
    this.epsilon *= 0.99;
    if (Math.random() < this.epsilon) {
      action = randInt(0, qValues.length - 1);
    } else {
      action = qValues.indexOf(Math.max(...qValues));
    }

    /* Calculate loss and update network only if there is a previous state */
    if (this.action && this.qValues) {
      let reward = this.calculateReward(state);
      let loss: number[] = this.calculateLoss(qValues, this.qValues, reward);
      this.network.backprop(loss);
      this.network.updateWeights();
    }
    console.log(qValues);

    /* Save current state and Q values to use in next iteration */
    this.action = action;
    this.qValues = qValues;

    /* Actually execute the action */
    let xSpeed = 0;
    let ySpeed = 0;

    switch (action) {
      case 0:
        ySpeed = -1;
        break;
      case 1:
        xSpeed = 1;
        ySpeed = -1;
        break;
      case 2:
        xSpeed = 1;
        break;
      case 3:
        xSpeed = 1;
        ySpeed = 1;
        break;
      case 4:
        ySpeed = 1;
        break;
      case 5:
        xSpeed = -1;
        ySpeed = 1;
        break;
      case 6:
        xSpeed = -1;
        break;
      case 7:
        xSpeed = -1;
        ySpeed = -1;
        break;
    }

    xSpeed = Phaser.Math.Clamp(
      xSpeed * this.velocity,
      -this.velocity,
      this.velocity
    );
    ySpeed = Phaser.Math.Clamp(
      ySpeed * this.velocity,
      -this.velocity,
      this.velocity
    );
    this.body.setVelocity(xSpeed, ySpeed);
  }

  protected onDestroy(): void {}

  protected getType(): ORGANISM_TYPES {
    return ORGANISM_TYPES.reinforcementLearningOrganism;
  }

  private calculateLoss(
    qValues: number[],
    prevQValues: number[],
    reward: number
  ): number[] {
    let losses: number[] = new Array(qValues.length).fill(0);
    let prevAction = prevQValues.indexOf(Math.max(...prevQValues));

    /* Calculate target value, i.e. (r + max a' of Q(s', a')) */
    let target = reward + Math.max(...qValues);
    /* Calculate L2 loss */
    let loss = (target - prevQValues[prevAction]) ** 2;

    /* Rest of loss should be 0 since we didn't take that action */
    losses[prevAction] = loss;

    return losses;
  }

  private calculateReward(state: number[]): number {
    let reward = 2;
    let [isFood, x, y] = state;

    /* Reward organism for moving near food */
    if (isFood) {
      reward += (-Math.abs(x) - Math.abs(y));
    }

    // /* Reward organism for gaining energy */
    // if (energy > 1) {
    //   reward += 10;
    // }

    // /* Penalise organism for moving near edge of world */
    // if (pos_x < 0.05 || pos_x > 0.95) {
    //   reward -= 2;
    // }

    // if (pos_y < 0.05 || pos_y > 0.95) {
    //   reward -= 2;
    // }

    return reward;
  }

  protected getBrainDirectionInfo(): number[] {
    throw new Error('Method not implemented.');
  }
}
