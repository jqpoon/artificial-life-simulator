import {
  matrixDotProduct,
  matrixElementWiseAdd,
  matrixMultiply,
  matrixTranspose2D,
} from '../../../src/classes/neuralNetworks/networkMath';

describe('Matrix addition', () => {
  it('works on empty arrays', () => {
    expect(matrixElementWiseAdd([], [])).toStrictEqual([]);
  });
  it('adds element-wise', () => {
    expect(matrixElementWiseAdd([1, 2], [2, 2])).toStrictEqual([3, 4]);
  });
});

describe('Matrix multiplication', () => {
  it('works on 2x2 arrays', () => {
    let a = [
      [1, 2],
      [3, 4],
    ];
    let b = [
      [3, 4],
      [2, 1],
    ];
    expect(matrixMultiply(a, b)).toStrictEqual([
      [7, 6],
      [17, 16],
    ]);
  });
});

describe('Matrix dot product', () => {
  it('works on 1D arrays', () => {
    let a = [1, 2, 3];
    let b = [4, 5, 6];
    expect(matrixDotProduct(a, b)).toStrictEqual(32);
  });
});

describe('Matrix transpose 2D', () => {
  it('works on 2x3 array', () => {
    let a = [
      [1, 2, 3],
      [4, 5, 6],
    ];
    let aT = [
      [1, 4],
      [2, 5],
      [3, 6],
    ];
    expect(matrixTranspose2D(a)).toStrictEqual(aT);
  });
});
