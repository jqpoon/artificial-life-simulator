export interface Network {
  /* Performs a forward pass through the neural network */
  forward(values: number[]): number[];

  /* Getters and setters for the internal weights matrices */
  setWeights(weights: number[][][]): void;
  getWeights(): number[][][];
}
