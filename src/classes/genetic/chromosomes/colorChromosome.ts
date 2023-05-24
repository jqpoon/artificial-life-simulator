import { Conversion } from '../../utils/conversion';
import { Chromosome } from './chromosome';

/* Used to restrict color type */
const hexadecimalChars = '0123456789ABCDEF'.split('');
type HexadecimalChars = (typeof hexadecimalChars)[number];

export class ColorChromosome extends Chromosome<HexadecimalChars> {
  constructor() {
    /* Colors are represented with six hexadecimal digits */
    super(6);
  }

  /**
   * Picks a random hexadecimal value in [0-F]
   * @returns A single hexadecimal string
   */
  public getRandomGene(): HexadecimalChars {
    return hexadecimalChars[
      Math.floor(Math.random() * hexadecimalChars.length)
    ];
  }

  public toPhenotype(): number {
    return Conversion.stringColorToNumberColour(
      '#' + this.getGenes().join('').toLowerCase()
    );
  }

  public fromPhenotype(phenotype: number): ColorChromosome {
    /* Convert to a string before removing '#' and splitting into a list */
    let stringColor = Conversion.numberColorToStringColor(phenotype);
    let genes = stringColor.substring(1).split('');
    return this.fromGenes(genes) as ColorChromosome;
  }

  protected getCopy(): ColorChromosome {
    let copy = new ColorChromosome();
    copy.setGenes(this.getGenes());
    return copy;
  }
}
