import { UIComponent } from '../UIComponent';
import { COLORS, textDefaultsDark } from '../UIConstants';
import { UIScene } from '../mainUI';
import { OrganismBuilder } from './organismBuilder';
import { OrganismViewer } from './organismViewer';
import PopulationChart from './populationChart';

export class SidePanel extends UIComponent {
  private populationChart: PopulationChart;
  private organismBuilder: OrganismBuilder;
  private organismViewer: OrganismViewer;

  constructor(scene: UIScene) {
    super(scene, {
      x: 1600,
      y: 599,
      height: 1220,
      width: 650,
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.populationChart = new PopulationChart(scene);
    this.organismBuilder = new OrganismBuilder(scene);
    this.organismViewer = new OrganismViewer(scene);

    let titleText = scene.add.text(
      0,
      0,
      "Jia's Life Simulator",
      textDefaultsDark
    );

    /* Organise UI elements */
    this.add(titleText)
      .add(
        scene.rexUI.add
          .sizer({ orientation: 'x', space: { item: 20 } })
          .add(this.organismBuilder)
          .add(this.organismViewer)
      )
      .add(this.populationChart)
      .addBackground(
        scene.rexUI.add
          .roundRectangle(0, 0, 0, 0, 0, COLORS.OFF_WHITE)
          .setStrokeStyle(2, COLORS.BACKGROUND_BORDER)
          .setDepth(-5)
      )
      .layout();

    this.initListeners();
  }

  reset(): void {
    this.populationChart.reset();
    this.organismBuilder.reset();
    this.organismViewer.reset();
  }

  private initListeners(): void {
    this.scene.time.addEvent({
      delay: 500,
      callback: this.populationChart.updateChart_,
      callbackScope: this.populationChart,
      loop: true,
    });
  }
}
