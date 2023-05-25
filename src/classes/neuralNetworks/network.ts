export type layerWeights = number[][];
export type layerBias = number[];
export type layerParams = {
  weights: layerWeights;
  bias: layerBias;
};
export type linearModelParams = layerParams[];

export interface Network {
  /* Performs a forward pass through the neural network */
  forward(values: number[]): number[];

  /* Getters and setters for the internal matrices */
  setParams(params: linearModelParams): void;
  getParams(): linearModelParams;
}
