import { LinearNetwork } from '../../../src/classes/neuralNetworks/linearNetwork';
import { tanhDerivative } from '../../../src/classes/neuralNetworks/networkMath';

describe('Linear Network', () => {
  it('should throw Error if it does not contain at least one layer', () => {
    let t = () => {
      new LinearNetwork([]);
    };

    expect(t).toThrow('Network should contain at least one layer');
  });

  it('can build a one-layer network', () => {
    let network = new LinearNetwork([2, 5]);

    expect(network.getParams()).toHaveLength(1);
  });

  it('can build a multi-layer network', () => {
    let network = new LinearNetwork([2, 3, 5, 6]);

    expect(network.getParams()).toHaveLength(3);
  });

  it('can set and read params properly', () => {
    let network = new LinearNetwork([2, 2]);
    let params = [
      {
        weights: [
          [1, 1],
          [1, 1],
        ],
        bias: [1, 0.5],
      },
    ];

    network.setParams(params);

    expect(network.getParams()).toStrictEqual(params);
  });

  it('can pass inputs properly through a one-layer network', () => {
    let network = new LinearNetwork([2, 2], Math.tanh, tanhDerivative);
    network.setParams([
      {
        weights: [
          [1, 1],
          [1, 1],
        ],
        bias: [1, 0.5],
      },
    ]);

    expect(network.forward([2, 2])).toStrictEqual([
      Math.tanh(5),
      Math.tanh(4.5),
    ]);
  });

  it('can pass inputs properly through a multi-layer network', () => {
    /* Use identity function as activation function */
    let network = new LinearNetwork([2, 2, 2], (x) => {
      return x;
    });
    network.setParams([
      {
        weights: [
          [1, 1],
          [1, 1],
        ],
        bias: [1, 2],
      },
      {
        weights: [
          [1, 1],
          [1, 1],
        ],
        bias: [0.5, 2],
      },
    ]);

    expect(network.forward([2, 2])).toStrictEqual([11.5, 13]);
  });
});

describe('Training a network', () => {

  it('should be able to learn an XOR function', () => {
    let network = new LinearNetwork([2, 4, 1]);

    let data = [
      [0, 0, 0],
      [0, 1, 1],
      [1, 0, 1],
      [1, 1, 0],
    ];

    let randInt = function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    for (let i = 0; i < 5000; i++) {
      let choice = randInt(0, 3);
      let x = data[choice].slice(0, 2);
      let y = data[choice].slice(2)[0];

      let output = network.forward(x);
      let loss = [y - output[0]];

      network.backprop(loss);
      network.updateWeights();
    }
  });
});
