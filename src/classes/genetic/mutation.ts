import { Chromosome } from './chromosomes';

export class Mutation {
  /**
   * Mutates a single character of a genetic string.
   *
   * @param gene - The genetic string to be mutated
   * @param base - Numeric base of the string (e.g. 16 = hexadecimal)
   * @returns The new genetic string
   */
  public static inversionMutation(gene: string, base: number): string {
    let posToMutate: number = Math.floor(Math.random() * gene.length);

    let charToMutate: number = parseInt(gene[posToMutate], base); // Hexadecimal
    charToMutate = charToMutate + (Math.random() < 0.5 ? -1 : 1); // Either adds or subtracts one
    let newChar: string = ((charToMutate + base) % base).toString(base)[0]; // Ensure it stays within range

    return (
      gene.substring(0, posToMutate) + newChar + gene.substring(posToMutate + 1)
    );
  }
}

export type MutationFunctions = (
  chromosomes: Chromosome<any>,
  mutationRate: number
) => Chromosome<any>;

/**
 * Performs inversion mutation on genes contained in this chromosome. Each
 * gene has an independent and random chance of being changed.
 *
 * @param chromosomes - The chromosome to mutate
 * @param mutationRate - Mutation rate of genes
 * @returns A new chromosome after (possible) mutation
 */
export function inversionWithMutationRate<T>(
  chromosomes: Chromosome<T>,
  mutationRate: number
): Chromosome<T> {
  let genes: T[] = chromosomes.getGenes();

  for (const [index, _] of genes.entries()) {
    if (Math.random() < mutationRate) {
      genes[index] = chromosomes.getRandomGene();
    }
  }

  return chromosomes.fromGenes(genes);
}
