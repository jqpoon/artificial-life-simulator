import assert from 'assert';
import { LinearNetwork } from '../../neuralNetworks/linearNetwork';
import {
  LayerBias,
  LayerWeights,
  LinearModelParams,
  Network,
} from '../../neuralNetworks/network';
import { Chromosome } from './chromosome';

export class NeuralNetChromosome extends Chromosome<number> {
  private nodes: number[];

  constructor(nodes: number[]) {
    assert(nodes.length >= 2, 'NN chromosome needs at least one layer');

    let count = 0;
    for (let i = 0; i < nodes.length - 1; i++) {
      count += nodes[i] * nodes[i + 1] + nodes[i + 1]; // weights + biases
    }

    super(count);
    this.nodes = nodes;
  }

  public getRandomGene(): number {
    return Math.random() - 0.5; // Maybe change to glorot normal?
  }

  public toPhenotype(): Network {
    assert(
      this.nodes,
      'Layer counts for NN chromosome is not defined, it is not possible to convert this into a proper phenotype'
    );

    let network = new LinearNetwork(this.nodes);
    let genes = this.getGenes().slice(); // Make a copy using slice
    let params: LinearModelParams = [];

    /* Since genes are just one super long list of weights/biases, we need to
       untangle them one layer at a time. Splice removes and returns a chunk
       of the gene list so we can just keep chopping them from the start. */
    for (let i = 0; i < this.nodes.length - 1; i++) {
      let input = this.nodes[i];
      let output = this.nodes[i + 1];

      // First obtain weights from the genes
      let weights1D = genes.splice(0, input * output);
      let weights2D = [];
      // Then build the 2D array one layer at a time
      while (weights1D.length > 0) {
        weights2D.push(weights1D.splice(0, output));
      }

      // Finally we obtain the bias
      let bias = genes.splice(0, output);

      params.push({ weights: weights2D, bias: bias });
    }

    network.setParams(params);
    return network;
  }

  public fromPhenotype(network: Network): NeuralNetChromosome {
    let genes: number[] = [];

    /* Build super long list of weights and biases */
    let params = network.getParams();
    let nodes = [];
    for (let layerParam of params) {
      let weights: LayerWeights = layerParam.weights;
      let biases: LayerBias = layerParam.bias;
      genes = [...genes, ...weights.flat(), ...biases];
      nodes.push(weights.length);
    }

    // Add output layer of last layer
    nodes.push(params[params.length - 1].weights[0].length);

    /* Set node list here so we know how to disentangle the long list of genes */
    let nnChromosome = this.fromGenes(genes) as NeuralNetChromosome;
    nnChromosome.nodes = nodes;
    return nnChromosome;
  }

  protected getCopy(): NeuralNetChromosome {
    return new NeuralNetChromosome(this.nodes);
  }
}
