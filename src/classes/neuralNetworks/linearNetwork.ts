import { Network, linearModelParams } from './network';

export class LinearNetwork implements Network {
  private params: linearModelParams;

  constructor(input: number, output: number) {
    this.params = [{ weights: [], bias: [] }];

    let weights = Array.from(Array(input), () => new Array(output).fill(0));
    for (let i = 0; i < input; i++) {
      for (let j = 0; j < output; j++) {
        weights[i][j] = glorotUniform(input);
      }
    }

    let bias = Array.from(Array(input), () => {
      return Math.random() - 0.5;
    });

    this.params[0].weights = weights;
    this.params[0].bias = bias;
  }

  forward(values: number[]): number[] {
    return matrixElementWiseAdd(
      matrixMultiply(values, this.params[0].weights),
      this.params[0].bias
    ).map((e) => {
      return Math.tanh(e);
    });
  }

  setParams(params: linearModelParams): void {
    // some kind of check here?
    this.params = params;
  }
  getParams(): linearModelParams {
    return this.params;
  }
}

/**
 * Generates a random number using the GlorotUniform distribution.
 * Use to initialise the neural network.
 *
 * @param n - Number of inputs (i.e. size of previous layer)
 * @returns A random number drawn from the distribution
 */
function glorotUniform(n: number) {
  let max = 1 / Math.sqrt(n);
  let min = -max;
  return Math.random() * (max - min) + min;
}

function matrixElementWiseAdd(a: number[], b: number[]): number[] {
  let result: number[] = [];
  for (let i = 0; i < a.length; i++) {
    result.push(a[i] + b[i]);
  }

  return result;
}

function matrixMultiply(a: number[], b: number[][]): number[] {
  const rowsA = a.length;
  const colsA = b.length;
  const colsB = b[0].length;

  const result: number[] = [];

  for (let i = 0; i < rowsA; i++) {
    const row: number[] = new Array(colsB).fill(0);

    for (let j = 0; j < colsA; j++) {
      const scalar = a[j];

      for (let k = 0; k < colsB; k++) {
        row[k] += scalar * b[j][k];
      }
    }

    result.push(...row);
  }

  return result;
}
