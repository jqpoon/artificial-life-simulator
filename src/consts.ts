export enum EVENTS_NAME {
  createNewSpecies = 'create-new-species', // Adds a new species
  reproduceOrganism = 'reproduce-organism', // Adds a new organism
  changeCount = 'change-count', // Updates graph in UI
}

export enum REGISTRY_KEYS {
  organismColour = 'organism-colour',
  organismSpeed = 'organism-speed',
  organismSize = 'organism-size',
  organismEnergyLoss = 'organism-energy-loss', // Normally calculated, can be manually overridden
  worldAge = 'world-age',
  chartDataset = 'chart-dataset',
}
