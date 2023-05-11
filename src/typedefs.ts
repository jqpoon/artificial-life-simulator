export interface SliderConfigs {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export interface OrganismConfigs {
  scene: Phaser.Scene;
  velocity?: number;
  size?: number;
  x?: number;
  y?: number;
  color?: number;
  alpha?: number;
  species?: number;
  energyLoss?: number;
  startingEnergy?: number;
  energySplitParentRatio?: number;
  generation?: number;
};

export interface OrganismInformation {
  name: string,
  generation: number,
  velocity: number,
  size: number,
  energy: number,
};

export interface FoodConfigs {
  scene: Phaser.Scene;
  x?: number;
  y?: number;
  color?: number;
};

type Datapoints = { [key: number]: number }; // x:y values
type Dataset = { data: Datapoints, fill?: boolean, borderColor?: string, pointRadius?: number }; // Defines a single dataset
type Datasets = Dataset[];
export type ChartData = {
  datasets: Datasets,
};

export type SpeciesCounts = {
  [key: number]: number
}

export type Entity = Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody;
