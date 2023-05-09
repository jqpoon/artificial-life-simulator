export enum EVENTS_NAME {
  createNewSpecies = 'create-new-species', // Adds a new species
  reproduceOrganism = 'reproduce-organism', // Adds a new organism
  changeCount = 'change-count', // Updates graph in UI
  loadScenario = 'load-scenario', // Load a pre-defined scenario
  updateTimeScale = 'update-timescale', // Used to pause and start the simulation
  selectOrganism = 'select-organism', // When user clicks on an organism
}

export enum REGISTRY_KEYS {
  organismColour = 'organism-colour',
  organismSpeed = 'organism-speed',
  organismSize = 'organism-size',
  organismSpecies = 'organism-species',
  speciesCounts = 'species-counts',
  timeScale = 'timescale',
  trendsDataset = 'trends-dataset',
  worldAge = 'world-age',
}
