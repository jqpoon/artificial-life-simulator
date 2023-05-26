import { LinearNetwork } from '../../neuralNetworks/linearNetwork';
import { LayerBias, LayerWeights, Network } from '../../neuralNetworks/network';
import { Chromosome } from './chromosome';

export class NeuralNetChromosome extends Chromosome<number> {
  private input: number;
  private output: number;

  constructor(input: number, output: number) {
    super(input * output + output); // No hidden layers so just weights + bias
    this.input = input;
    this.output = output;
  }

  public getRandomGene(): number {
    return Math.random() - 0.5; // Maybe change to glorot normal?
  }

  public toPhenotype(): Network {
    let network = new LinearNetwork(this.input, this.output);
    let genes = this.getGenes();

    /* Assume that there are no hidden layers, then look at how genes was initialised */
    let weights1D = genes.slice(0, this.input * this.output);
    let weights2D = [];
    // Builds the 2D array one layer at a time
    while (weights1D.length > 0) {
      weights2D.push(weights1D.splice(0, this.output));
    }
    let bias = genes.slice(this.input * this.output);

    network.setParams([{ weights: weights2D, bias: bias }]);
    return network;
  }

  public fromPhenotype(network: Network): NeuralNetChromosome {
    let genes: number[] = [];

    let params = network.getParams();
    for (let layerParam of params) {
      let weights: LayerWeights = layerParam.weights;
      let biases: LayerBias = layerParam.bias;
      genes = [...genes, ...weights.flat(), ...biases];
    }

    return this.fromGenes(genes) as NeuralNetChromosome;
  }

  protected getCopy(): NeuralNetChromosome {
    return new NeuralNetChromosome(this.input, this.output);
  }
}
