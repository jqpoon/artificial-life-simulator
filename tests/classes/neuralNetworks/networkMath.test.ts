import { matrixElementWiseAdd } from "../../../src/classes/neuralNetworks/networkMath";

describe('Matrix addition', () => {
  it('works on empty arrays', () => {
    expect(matrixElementWiseAdd([], [])).toStrictEqual([]);
  });
  it('adds element-wise', () => {
    expect(matrixElementWiseAdd([1,2], [2,2])).toStrictEqual([3, 4]);
  });
});

