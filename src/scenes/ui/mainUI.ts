import { Scene } from 'phaser';

import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { UIComponent } from './UIComponent';
import PopulationChart from './populationChart';
import { ScenarioControl } from './scenarioControl';
import { OrganismBuilder } from './organismBuilder';

import { COLORS, textDefaultsDark } from './UIConstants';
import { REGISTRY_KEYS } from '../../consts';
import { TrendsChart } from './trendsChart';
import { SpeedControls } from './speedControls';
import { OrganismViewer } from './organismViewer';
import { RandomOrganism } from '../../classes/entities/randomOrganism';
import { NeuralNetworkOrganism } from '../../classes/entities/neuralNetworkOrganism';

export class UIScene extends Scene {
  public rexUI: RexUIPlugin;
  private populationChart: PopulationChart;
  // private trendsChart: TrendsChart;
  private scenarioControl: UIComponent;
  private organismBuilder: OrganismBuilder;
  private organismViewer: OrganismViewer;
  private speedControls: SpeedControls;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.image('pause', 'assets/pause.png');
    this.load.image('speed1', 'assets/speed1.png');
    this.load.image('speed2', 'assets/speed2.png');
    this.load.image('speed3', 'assets/speed3.png');
  }

  create(): void {
    this.populationChart = new PopulationChart(this);
    // this.trendsChart = new TrendsChart(this);
    this.scenarioControl = new ScenarioControl(this);
    this.organismBuilder = new OrganismBuilder(this);
    this.speedControls = new SpeedControls(this);
    this.organismViewer = new OrganismViewer(this);

    let titleText = this.add.text(
      0,
      0,
      "Jia's Life Simulator",
      textDefaultsDark
    );

    /* Organise UI elements */
    this.rexUI.add
      .sizer({
        x: 1600,
        y: 599,
        height: 1220,
        width: 650,
        orientation: 'y',
        space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
      })
      .add(titleText)
      .add(this.scenarioControl)
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(this.organismBuilder)
          .add(this.organismViewer)
      )
      .add(this.populationChart)
      .addBackground(
        this.rexUI.add
          .roundRectangle(0, 0, 0, 0, 0, COLORS.OFF_WHITE)
          .setStrokeStyle(2, COLORS.BACKGROUND_BORDER)
          .setDepth(-5)
      )
      .layout();

    this.resetScene();
    this.initListeners();
    this.cameras.main.setBackgroundColor(COLORS.BACKGROUND_COLOR);
  }

  update(time: number, delta: number): void {}

  public resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    // this.trendsChart.reset();
    this.populationChart.reset();
    this.scenarioControl.reset();
    this.organismBuilder.reset();
    this.speedControls.reset();
    this.organismViewer.reset();

    this.registry.set(REGISTRY_KEYS.worldAge, 0);
    this.registry.set(REGISTRY_KEYS.organismSpecies, 0);
    this.registry.set(REGISTRY_KEYS.organismColour, 0xe8000b);
    this.registry.set(REGISTRY_KEYS.organismSize, 50);
    this.registry.set(REGISTRY_KEYS.organismSpeed, 50);
    this.registry.set(REGISTRY_KEYS.organismType, NeuralNetworkOrganism);
  }

  private initListeners(): void {
    this.time.addEvent({
      delay: 500,
      callback: this.populationChart.updateChart_,
      callbackScope: this.populationChart,
      loop: true,
    });
    // this.time.addEvent({
    //   delay: 500,
    //   callback: this.trendsChart.updateChart_,
    //   callbackScope: this.trendsChart,
    //   loop: true,
    // });
  }
}
