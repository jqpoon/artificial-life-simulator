import { LinearLayer } from '../../../src/classes/neuralNetworks/linearLayer';

describe('Linear layer', () => {
  it('can set and read params properly', () => {
    let layer = new LinearLayer(2, 2);
    let params = {
      weights: [
        [1, 1],
        [1, 1],
      ],
      bias: [1, 0.5],
    };

    layer.setParams(params);

    expect(layer.getParams()).toStrictEqual(params);
  });

  it('can pass input properly through forward function', () => {
    let layer = new LinearLayer(2, 2, Math.tanh);
    layer.setParams({
      weights: [
        [1, 1],
        [1, 1],
      ],
      bias: [1, 0.5],
    });

    expect(layer.forward([2, 2])).toStrictEqual([Math.tanh(5), Math.tanh(4.5)]);
  });
});