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

    return gene.substring(0, posToMutate) + newChar + gene.substring(posToMutate + 1);
  }
}
