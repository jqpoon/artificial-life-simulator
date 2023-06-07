import assert from 'assert';
import { LayerBias, LayerParams, LayerWeights } from './network';
import {
  ActivationFunction,
  ActivationFunctionDerivatives,
  Initialiser,
  glorotUniform,
  matrixElementWiseAdd,
  matrixMultiply,
  matrixTranspose2D,
  sigmoid,
  sigmoidDerivative,
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
  private weightLoss: LayerWeights;
  private biasLoss: LayerBias;
  private inputs: number[];
  private learningRate: number;

  private activationFunction: ActivationFunction;
  private activationFunctionDerivative: ActivationFunctionDerivatives;

  constructor(
    input: number,
    output: number,
    activationFunction: ActivationFunction = sigmoid,
    activationFunctionDerivative: ActivationFunctionDerivatives = sigmoidDerivative,
    initFunction: Initialiser = glorotUniform,
    learningRate: number = 0.05
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
    this.activationFunctionDerivative = activationFunctionDerivative;
    this.learningRate = learningRate;
  }

  /**
   * Performs a forward pass with this layer
   * @param x - Input to pass through the layer
   * @returns Output of forward pass, after applying the weights,
   *          biases and activation function
   */
  public forward(x: number[]): number[] {
    this.inputs = x; // Store this to use in backprop later

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

  /**
   * Calculates the loss for this layer with reference to its inputs, weights and biases.
   * Returns the loss with reference to its inputs.
   *
   * @param loss Loss from the layer above. Must be the same size as the number
   *             of output neurons. Must also be target - output!!
   * @returns    Loss with reference to its inputs
   */
  public backprop(loss: number[]): number[] {
    /* Work backwards, input was weights -> bias -> activation
     * this.weights - input x output
     * this.inputs  - 1 x input
     * loss         - 1 x output
     * biasLoss     - 1 x output
     * inputsLoss   - 1 x input
     * weightsLoss  - input x output
     */

    /* Bias has same size as number of output neurons */
    assert(
      loss.length === this.bias.length,
      `Invalid length of loss passed to backprop in linear layer. Expected ${this.bias.length}, got ${loss.length}`
    );

    /* Calculate loss wrt to activation function, by using the derivative of the activation function */
    let activationLoss = loss.map(this.activationFunctionDerivative);

    /* Then calculate loss wrt to bias */
    let biasLoss = activationLoss; // Since this is just a linear addition, gradient is 1

    /* Calculate loss wrt to weights */
    let weightsLoss = matrixMultiply(matrixTranspose2D([this.inputs]), [
      biasLoss,
    ]);

    /* Calculate loss wrt to inputs */
    let inputsLoss = matrixMultiply(
      [biasLoss],
      matrixTranspose2D(this.weights)
    );

    /* Store losses to update our weights with later */
    this.biasLoss = biasLoss;
    this.weightLoss = weightsLoss;

    return inputsLoss[0];
  }

  /**
   * Updates weights using gradient descent. The backpropogation step must be run first.
   */
  public updateWeights(): void {
    assert(this.weightLoss);
    assert(this.biasLoss);

    let rowsW = this.weights.length;
    let colsW = this.weights[0].length;
    this.learningRate *= 0.999;

    /* Update weights matrix */
    for (let i = 0; i < rowsW; i++) {
      for (let j = 0; j < colsW; j++) {
        this.weights[i][j] += this.learningRate * this.weightLoss[i][j];
      }
    }

    /* Update bias */
    for (let i = 0; i < colsW; i++) {
      this.bias[i] += this.learningRate * this.biasLoss[i];
    }
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
