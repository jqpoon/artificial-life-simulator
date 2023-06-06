export type LayerWeights = number[][];
export type LayerBias = number[];
export type LayerParams = {
  weights: LayerWeights;
  bias: LayerBias;
};
export type LinearModelParams = LayerParams[];

export interface Network {
  /* Performs a forward pass through the neural network */
  forward(values: number[]): number[];

  /* Performs backpropogation */
  backprop(loss: number[]): void;
  updateWeights(): void;

  /* Getters and setters for the internal matrices */
  setParams(params: LinearModelParams): void;
  getParams(): LinearModelParams;
}
