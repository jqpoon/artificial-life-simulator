const hexadecimalChars = '0123456789ABCDEF'.split('');
type HexadecimalChars = (typeof hexadecimalChars)[number];

/**
 * Represents the genetic makeup of a specific aspect of an organism
 */
export abstract class Chromosome<T> {
  private genes: T[];
  public getRandomGene: () => T;
  protected abstract getCopy(): Chromosome<T>;
  protected abstract toPhenotype(): any;

  constructor(getRandomGene: () => T, geneLength: number) {
    this.getRandomGene = getRandomGene;

    this.genes = [];
    for (let i = 0; i < geneLength; i++) {
      this.genes.push(this.getRandomGene());
    }
  }

  public getGenes(): T[] {
    return this.genes;
  }

  public setGenes(genes: T[]) {
    this.genes = genes;
  }

  public fromGenes(genes: T[]) {
    let newChromosomes = this.getCopy();
    newChromosomes.setGenes(genes);
    return newChromosomes;
  }
}

export class ColorChromosome extends Chromosome<HexadecimalChars> {
  constructor() {
    /* Picks a random hexadecimal value */
    let getRandomColorGene = (): HexadecimalChars => {
      return hexadecimalChars[
        Math.floor(Math.random() * hexadecimalChars.length)
      ];
    };

    /* Colors are represented with six hexadecimal digits */
    super(getRandomColorGene, 6);
  }

  protected getCopy(): ColorChromosome {
    let copy = new ColorChromosome();
    copy.setGenes(this.getGenes());
    return copy;
  }

  protected toPhenotype(): string {
    return '#' + this.getGenes().join('').toLowerCase();
  }
}

// Next steps: write mutation class that takes in chromosomes and performs the mutations on them DONE
// fill in implementation of colour chromosomes / speed chromosomes / size chromosomes / NN chromosomes
// they probably need a type T, and some kind of function to translate them into a phenotype? (express the genes)
// then use these chromosomes in organisms and mutate
