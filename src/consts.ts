export enum GAME_CONSTANTS {
  worldX = 20,
  worldY = 40,
  worldWidth = 1200,
  worldHeight = 900,
}

export enum EVENTS_NAME {
  createNewSpecies = 'create-new-species', // Adds a new species
  reproduceOrganism = 'reproduce-organism', // Adds a new organism
  changeCount = 'change-count', // Updates graph in UI
  loadScenario = 'load-scenario', // Load a pre-defined scenario
  updateTimeScale = 'update-timescale', // Used to pause and start the simulation
  selectOrganism = 'select-organism', // When user clicks on an organism
  killSelectedOrganism ='kill-selected-organism', // To kill a selected organism
}

export enum REGISTRY_KEYS {
  energyLoss = 'energy-loss', // Global energy loss
  organismColour = 'organism-colour',
  organismSpeed = 'organism-speed',
  organismSize = 'organism-size',
  organismSpecies = 'organism-species',
  organismStartingEnergy = 'organism-starting-energy',
  organismType = 'organism-type',
  mutationRate = 'mutation-rate',
  speciesCounts = 'species-counts',
  timeScale = 'timescale',
  trendsDataset = 'trends-dataset',
  worldAge = 'world-age',
}

export enum ORGANISM_TYPES {
  controllableOrganism = 'Controllable',
  neuralNetworkOrganism = 'Neural\nNetwork',
  randomOrganism = 'Random',
  visionOrganism = 'Vision',
  reinforcementLearningOrganism = 'reinforcement-learning',
}
