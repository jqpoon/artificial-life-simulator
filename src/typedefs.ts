import { Organism } from './classes/entities/organism';
import { Chromosome } from './classes/genetic/chromosomes/chromosome';
import { ORGANISM_TYPES } from './consts';

/**
 * Defines how to construct an organism.
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
};

export type OrganismInformation = {
  name: string;
  generation: number;
  velocity: number;
  size: number;
  energy: number;
  type: ORGANISM_TYPES;
  color: number;
  brainDirectionInfo: number[]; // 8 values, corresponding to where this organism will move if it encounters food in the 8 directions
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
