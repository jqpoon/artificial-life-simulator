type ActivationFunction = typeof tanh;
type Initialiser = typeof glorotUniform;

/**
 * Applies tanh function to each element in this 1D matrix
 * @param a - Input 1D matrix
 * @returns
 */
function tanh(a: number[]): number[] {
  return a.map(Math.tanh);
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

/**
 * Adds two 1D matrices. a and b must be the same size.
 * @param a - First matrix to be added
 * @param b - Second matrix to be added
 * @returns Result of element-wise addition of a and b
 */
function matrixElementWiseAdd(a: number[], b: number[]): number[] {
  let result: number[] = new Array(a.length).fill(0);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i] + b[i];
  }

  return result;
}

/**
 * Performs 2D matrix multiplications. Number of rows in b must be equal to
 * number of columns in b.
 *
 * @param a - First matrix to be multiplied
 * @param b - Second matrix to be multiplied
 * @returns Result of matrix multiplication
 */
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
