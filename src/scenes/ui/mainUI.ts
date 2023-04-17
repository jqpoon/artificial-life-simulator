import { Scene } from 'phaser';

import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { UIComponent } from './UIComponent';
import PopulationChart from './populationChart';
import { ScenarioControl } from './scenarioControl';
import { OrganismBuilder } from './organismBuilder';

import { textDefaults } from './UIConstants';
import { REGISTRY_KEYS } from '../../consts';

export class UIScene extends Scene {
  public rexUI: RexUIPlugin;
  private chartsComponent: PopulationChart;
  private scenarioControl: UIComponent;
  private organismBuilder: OrganismBuilder;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  }

  create(): void {
    this.chartsComponent = new PopulationChart(this);
    this.scenarioControl = new ScenarioControl(this);
    this.organismBuilder = new OrganismBuilder(this);

    this.resetScene();
    this.initTexts();
  }

  update(time: number, delta: number): void {}

  public resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    this.chartsComponent.reset();
    this.scenarioControl.reset();
    this.organismBuilder.reset();

    this.registry.set(REGISTRY_KEYS.worldAge, 0);
    this.registry.set(REGISTRY_KEYS.organismColour, 0xe8000b);
    this.registry.set(REGISTRY_KEYS.organismSize, 50);
    this.registry.set(REGISTRY_KEYS.organismSpeed, 50);
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);
  }
}
