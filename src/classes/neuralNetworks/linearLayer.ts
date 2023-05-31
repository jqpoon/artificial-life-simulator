import assert from 'assert';
import { LayerBias, LayerParams, LayerWeights } from './network';
import {
  ActivationFunction,
  Initialiser,
  glorotUniform,
  matrixElementWiseAdd,
  matrixMultiply,
} from './networkMath';

/**
 * A single linear layer. The weight matrix has number of rows equal to the
 * number of input nodes. For example, if a layer has input of size 2 and output of
 * size 3, then the weight matrix will look like:
 *
 * [[1, 2, 3],
 *  [4, 5, 6]]
 */
export class LinearLayer {
  private weights: LayerWeights;
  private bias: LayerBias;
  private activationFunction: ActivationFunction;

  constructor(
    input: number,
    output: number,
    activationFunction: ActivationFunction = Math.tanh,
    initFunction: Initialiser = glorotUniform
  ) {
    /* Initialise weights and bias */
    let weights = Array.from(Array(input), () => new Array(output).fill(0));
    for (let i = 0; i < input; i++) {
      for (let j = 0; j < output; j++) {
        weights[i][j] = initFunction(input);
      }
    }

    let bias = Array.from(Array(output), () => {
      return Math.random() - 0.5;
    });

    this.weights = weights;
    this.bias = bias;
    this.activationFunction = activationFunction;
  }

  /**
   * Performs a forward pass with this layer
   * @param x - Input to pass through the layer
   * @returns Output of forward pass, after applying the weights,
   *          biases and activation function
   */
  public forward(x: number[]): number[] {
    x = matrixMultiply([x], this.weights)[0]; // 0th element since x is a 1D array
    x = matrixElementWiseAdd(x, this.bias);
    x = x.map(this.activationFunction);

    return x;
  }

  /**
   * Getter for this layer's parameters
   * @returns Dictionary with weights and biases
   */
  public getParams(): LayerParams {
    return {
      weights: this.weights,
      bias: this.bias,
    };
  }

  /**
   * Setter for this layer's parameters. Note that the shape of weights and
   * biases passed must be the same as the existing Ws and Bs.
   * @param params Dictionary with weights and biases
   */
  public setParams(params: LayerParams) {
    this.assertWeightsValidShape(params.weights);
    this.assertBiasValidShape(params.bias);

    this.weights = params.weights;
    this.bias = params.bias;
  }

  /**
   * Sets the weight of this layer manually. The shape of weights passed in must
   * be the same as the existing weights.
   * @param weights
   */
  public setWeights(weights: LayerWeights) {
    this.assertWeightsValidShape(weights);
    this.weights = weights;
  }

  /**
   * Sets the bias of this layer manually. The shape of bias passed in must
   * be the same as the existing bias.
   * @param bias
   */
  public setBias(bias: LayerBias) {
    this.assertBiasValidShape(bias);
    this.bias = bias;
  }

  /* Checks shape of weights matrix */
  private assertWeightsValidShape(weights: LayerWeights) {
    assert(
      weights.length == this.weights.length,
      `Different weights shape passed to layer. Expected ${this.weights.length}, got ${weights.length}`
    );

    assert(
      weights[0].length == this.weights[0].length,
      `Different weights shape passed to layer. Expected ${this.weights[0].length}, got ${weights[0].length}`
    );
  }

  /* Checks shape of bias matrix */
  private assertBiasValidShape(bias: LayerBias) {
    assert(
      bias.length == this.bias.length,
      `Different bias shape passed to layer. Expected ${this.bias.length}, got ${bias.length}`
    );
  }
}
