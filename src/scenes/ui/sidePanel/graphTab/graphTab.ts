import { UIScene } from '../../mainUI';
import { TabComponent } from '../tabComponent';
import PopulationChart from './populationChart';

export class GraphTab extends TabComponent {
  private populationChart: PopulationChart;

  constructor(scene: UIScene) {
    super(scene, {
      orientation: 'y',
      space: { left: 20, right: 20, top: 20, bottom: 20, item: 30 },
    });

    this.populationChart = new PopulationChart(scene);

    this.add(this.populationChart).layout().setDepth(1);
  }

  reset(): void {
    this.populationChart.reset();
  }
}
