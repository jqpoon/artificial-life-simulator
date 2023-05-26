import { Organism } from './classes/entities/organism';
import { Chromosome } from './classes/genetic/chromosomes/chromosome';
import { ORGANISM_TYPES } from './consts';

/**
 * Defines how to construct an organism. Chromosome fields need to be expressed
 * as phenotypes, and take priority over optional fields. If none of these
 * fields are present, defaults are set instead.
 *
 * For example, if both color and colorChromosome are defined, then the
 * colorChromosome will be converted into a phenotype and be used as the
 * organism's color.
 */
export type OrganismConfigs = {
  /* Required fields */
  scene: Phaser.Scene;

  /* Optional fields */
  alpha?: number;
  color?: number;
  energyLoss?: number;
  generation?: number;
  species?: number;
  startingEnergy?: number;
  velocity?: number;
  visionDistance?: number;
  size?: number;
  x?: number;
  y?: number;

  /* Chromosome fields */
  colorChromosome?: Chromosome<string>;
  neuralNetChromosome?: Chromosome<number>;
};

export type OrganismInformation = {
  name: string;
  generation: number;
  velocity: number;
  size: number;
  energy: number;
  type: ORGANISM_TYPES;
};

export type IOrganism = {
  new (configs: OrganismConfigs): Organism;
};

export type FoodConfigs = {
  scene: Phaser.Scene;
  x?: number;
  y?: number;
  color?: number;
};

type Datapoints = { [key: number]: number }; // x:y values
type Dataset = {
  data: Datapoints;
  fill?: boolean;
  borderColor?: string;
  pointRadius?: number;
}; // Defines a single dataset
type Datasets = Dataset[];
export type ChartData = {
  datasets: Datasets;
};

export type SpeciesCounts = {
  [key: number]: number;
};

export type Entity =
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody;
