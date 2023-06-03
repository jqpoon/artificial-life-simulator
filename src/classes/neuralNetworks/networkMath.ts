import assert from "assert";

export type ActivationFunction = typeof Math.tanh;
export type ActivationFunctionDerivatives = typeof tanhDerivative;
export type Initialiser = typeof glorotUniform;

/**
 * Generates a random number using the GlorotUniform distribution.
 * Use to initialise the neural network.
 *
 * @param n - Number of inputs (i.e. size of previous layer)
 * @returns A random number drawn from the distribution
 */
export function glorotUniform(n: number): number {
  let max = 1 / Math.sqrt(n);
  let min = -max;
  return Math.random() * (max - min) + min;
}

export function tanhDerivative(x: number): number {
  return 1 - Math.tanh(x) ** 2;
}

/**
 * Adds two 1D matrices. a and b must be the same size.
 * @param a - First matrix to be added
 * @param b - Second matrix to be added
 * @returns Result of element-wise addition of a and b
 */
export function matrixElementWiseAdd(a: number[], b: number[]): number[] {
  let result: number[] = new Array(a.length).fill(0);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] + b[i];
  }

  return result;
}

/**
 * Performs 2D matrix multiplications. Number of rows in a must be equal to
 * number of columns in b.
 *
 * @param a - First matrix to be multiplied
 * @param b - Second matrix to be multiplied
 * @returns Result of matrix multiplication
 */
export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const rowsA = a.length;
  const colsA = a[0].length;
  const colsB = b[0].length;

  const result: number[][] = new Array(rowsA);
  for (let i = 0; i < rowsA; i++) {
    result[i] = new Array(colsB);
  }

  for (let i = 0; i < rowsA; i++) {
    for (let k = 0; k < colsB; k++) {
      let sum = 0;
      for (let j = 0; j < colsA; j++) {
        sum += a[i][j] * b[j][k];
      }
      result[i][k] = sum;
    }
  }

  return result;
}

/**
 * Performs matrix dot product. Both matrices must have the same dimensions.
 *
 * @param a First matrix, must be 1D
 * @param b Second matrix, must be 1D
 * @returns Dot product of both matrices, as a scalar
 */
export function matrixDotProduct(a: number[], b: number[]): number {
  assert(a.length === b.length);
  const rowsA = a.length;

  let result: number = 0;

  for (let i = 0; i < rowsA; i++) {
    result += a[i] * b[i];
  }

  return result;
}

/**
 * Transposes a 2D matrix
 *
 * @param a Matrix to be transposed
 * @returns Transposed matrix
 */
export function matrixTranspose2D(a: number[][]): number[][] {
  const rowsA = a.length;
  const colsA = a[0].length;

  const copy: number[][] = new Array(colsA);
  for (let i = 0; i < colsA; i++) {
    copy[i] = new Array(rowsA);
  }

  for (let i = 0; i < rowsA; i++) {
    for (let j = 0; j < colsA; j++) {
      copy[j][i] = a[i][j];
    }
  }

  return copy;
}
