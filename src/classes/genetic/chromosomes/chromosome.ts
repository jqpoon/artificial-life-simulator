import { MutationFunctions } from '../mutation';

/**
 * Represents the genetic makeup of a specific aspect of an organism
 */
export abstract class Chromosome<T> {
  /* Genetic makeup of a chromosome, its key information */
  private genes: T[];

  /* Returns a random gene */
  public abstract getRandomGene(): T;
  /* Express this chromosome as an attribute of an organism, e.g. size */
  public abstract toPhenotype(): any;
  /* Construct an instance of this chromosome from a given attribute */
  public abstract fromPhenotype(phenotype: any): Chromosome<T>;
  /* Returns a clone of this chromosome */
  protected abstract getCopy(): Chromosome<T>;

  /**
   * Randomly initialises this chromosome's genes from possible genes
   * @param geneLength Length of information to be stored
   */
  constructor(geneLength: number) {
    this.genes = [];
    for (let i = 0; i < geneLength; i++) {
      this.genes.push(this.getRandomGene());
    }
  }

  public getGenes(): T[] {
    return this.genes;
  }

  public setGenes(genes: T[]): void {
    this.genes = genes;
  }

  public fromGenes(genes: T[]): Chromosome<T> {
    let newChromosomes = this.getCopy();
    newChromosomes.setGenes(genes);
    return newChromosomes;
  }

  public mutateWith(f: MutationFunctions, mutationRate: number): Chromosome<T> {
    return f(this, mutationRate);
  }
}
