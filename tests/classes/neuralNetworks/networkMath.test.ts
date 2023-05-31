import {
  matrixElementWiseAdd,
  matrixMultiply,
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
