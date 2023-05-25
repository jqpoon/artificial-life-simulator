import { LayerBias, LayerParams, LayerWeights } from './network';

/**
 * A single linear layer
 */
export class LinearLayer {
  private weights: LayerWeights;
  private bias: LayerBias;
  private activationFunction: ActivationFunction;

  constructor(
    input: number,
    output: number,
    activationFunction: ActivationFunction = tanh,
    initFunction: Initialiser = glorotUniform
  ) {
    /* Initialise weights and bias */
    let weights = Array.from(Array(input), () => new Array(output).fill(0));
    for (let i = 0; i < input; i++) {
      for (let j = 0; j < output; j++) {
        weights[i][j] = initFunction(input);
      }
    }

    let bias = Array.from(Array(input), () => {
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
    x = matrixMultiply(x, this.weights);
    x = matrixElementWiseAdd(x, this.bias);
    return this.activationFunction(x);
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
  public setbBias(bias: LayerBias) {
    this.assertBiasValidShape(bias);
    this.bias = bias;
  }

  /* Checks shape of weights matrix */
  private assertWeightsValidShape(weights: LayerWeights) {
    if (weights.length != this.weights.length)
      throw new Error('Different weights shape passed to layer');
    if (weights[0].length != this.weights[0].length)
      throw new Error('Different weights shape passed to layer');
  }

  /* Checks shape of bias matrix */
  private assertBiasValidShape(bias: LayerBias) {
    if (bias.length == this.bias.length)
      throw new Error('Different bias shape passed to layer');
  }
}
