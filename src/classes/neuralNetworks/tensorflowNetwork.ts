import * as tf from '@tensorflow/tfjs';
import { Network } from './network';

export class TensorflowNetwork implements Network {
  private readonly model: tf.Sequential;

  /**
   * Initialises a simple neural network based on tensorflow. For a start,
   * there will be no hidden layers nor bias terms.
   *
   * @param input - Number of inputs to this network
   * @param output - Number of outputs of this network
   */
  constructor(input: number, output: number, seed?: number) {
    this.model = tf.sequential();

    this.model.add(
      tf.layers.dense({
        name: 'layer1',
        batchSize: 1,
        inputShape: [input],
        units: output,
        useBias: false,
      })
    );
  }

  /**
   * Performs a forward pass through the neural network and returns the result
   *
   * @param values - Input values
   * @returns Result of forward pass
   */
  forward(values: number[]): number[] {
    let y_tensor = this.model.call(tf.tensor([values]), {}) as tf.Tensor[];
    let y_array = (y_tensor[0].arraySync() as number[][])[0];

    return y_array;
  }

  /**
   * Sets the weights of this network
   *
   * @param weights - A 2D array of weights
   */
  setWeights(weights: number[][]): void {
    let w_tensor = tf.tensor(weights);
    this.model.setWeights([w_tensor]);
  }

  /**
   * Returns the weights of this neural network as a 2D array
   *
   * @returns Weights of this neural network
   */
  getWeights(): number[][] {
    return this.model.getWeights()[0].arraySync() as number[][];
  }
}
