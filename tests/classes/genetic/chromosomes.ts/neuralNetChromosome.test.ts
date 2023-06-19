import { NeuralNetChromosome } from '../../../../src/classes/genetic/chromosomes/neuralNetChromosome';
import { LinearNetwork } from '../../../../src/classes/neuralNetworks/linearNetwork';

describe('Neural Network Chromosome', () => {
  it('can be built from a single layer network', () => {
    /* Manually set weights for this network and compare them later */
    let network = new LinearNetwork([2, 3]);
    network.setParams([
      {
        weights: [
          [1, 1, 1],
          [2, 2, 2],
        ],
        bias: [3, 3, 3],
      },
    ]);

    let nnChromosome = new NeuralNetChromosome([2, 3]);
    nnChromosome = nnChromosome.fromPhenotype(network);

    let genes = nnChromosome.getGenes();
    expect(genes).toStrictEqual([1, 1, 1, 2, 2, 2, 30, 30, 30]);
  });

  it('can be built from a multi layer network', () => {
    /* Manually set weights for this network and compare them later */
    let network = new LinearNetwork([1, 2, 3]);
    network.setParams([
      {
        weights: [[1, 1]],
        bias: [2, 2],
      },
      {
        weights: [
          [4, 5, 6],
          [7, 8, 9],
        ],
        bias: [0, 0.5, 1],
      },
    ]);

    let nnChromosome = new NeuralNetChromosome([1, 2, 3]);
    nnChromosome = nnChromosome.fromPhenotype(network);

    let genes = nnChromosome.getGenes();
    expect(genes).toStrictEqual([1, 1, 20, 20, 4, 5, 6, 7, 8, 9, 0, 5, 10]);
  });

    it('can express itself as phenotype properly', () => {
      let nnChromosome = new NeuralNetChromosome([1, 2, 3]);
      let network = new LinearNetwork([1, 2, 3]);
      nnChromosome = nnChromosome.fromPhenotype(network);

      let networkClone = nnChromosome.toPhenotype();

      expect(networkClone.getParams()).toStrictEqual(network.getParams());
    });
});
