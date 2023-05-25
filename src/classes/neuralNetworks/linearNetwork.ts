import { LinearLayer } from './linearLayer';
import { Network, LinearModelParams } from './network';

export class LinearNetwork implements Network {
  private layers: LinearLayer[];

  constructor(input: number, output: number) {
    this.layers.push(new LinearLayer(input, output));
  }

  public forward(values: number[]): number[] {
    return this.layers[0].forward(values);
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
