import { Chromosome } from './chromosome';

class NumberChromosome extends Chromosome<number> {
  public getRandomGene(): number {
    throw new Error('Method not implemented.');
  }
  public toPhenotype() {
    throw new Error('Method not implemented.');
  }
  public fromPhenotype(phenotype: any): Chromosome<number> {
    throw new Error('Method not implemented.');
  }
  protected getCopy(): Chromosome<number> {
    throw new Error('Method not implemented.');
  }
}
