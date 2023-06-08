import assert from 'assert';
import { LinearLayer } from './linearLayer';
import { Network, LinearModelParams } from './network';
import {
  ActivationFunction,
  ActivationFunctionDerivatives,
  tanhDerivative,
} from './networkMath';

export class LinearNetwork implements Network {
  private layers: LinearLayer[];

  /**
   * Initialises a neural network with any number of
   * @param nodes
   */
  constructor(
    nodes: number[],
    activation: ActivationFunction = Math.tanh,
    activationDerivative: ActivationFunctionDerivatives = tanhDerivative
  ) {
    assert(nodes.length >= 2, 'Network should contain at least one layer');

    this.layers = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      this.layers.push(
        new LinearLayer(
          nodes[i],
          nodes[i + 1],
          activation,
          activationDerivative
        )
      );
    }
  }

  public forward(x: number[]): number[] {
    for (let layer of this.layers) {
      x = layer.forward(x);
    }

    return x;
  }

  public backprop(loss: number[]): void {
    let layerLoss = loss.slice();
    for (let i = this.layers.length - 1; i >= 0; i--) {
      layerLoss = this.layers[i].backprop(layerLoss);
    }
  }

  public updateWeights(): void {
    this.layers.map((layer: LinearLayer) => {
      layer.updateWeights();
    });
  }

  public setParams(params: LinearModelParams): void {
    for (const [index, param] of params.entries()) {
      this.layers[index].setParams(param);
    }
  }

  public getParams(): LinearModelParams {
    let params: LinearModelParams = [];

    for (let layer of this.layers) {
      params.push(layer.getParams());
    }

    return params;
  }
}
