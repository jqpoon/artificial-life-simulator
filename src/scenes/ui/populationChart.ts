import { Chart } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { EVENTS_NAME, REGISTRY_KEYS } from '../../consts';
import { ChartData, SpeciesCounts } from '../../typedefs';
import { UIScene } from './mainUI';
import { Conversion } from '../../classes/utils/conversion';
import { ChartComponent } from './chartComponent';
import { speciesInfo } from './UIConstants';

export default class PopulationChart extends ChartComponent {
  private chartData: ChartData;
  private chart: Chart;

  constructor(scene: UIScene) {
    super(scene);

    this.chart = new Chart(scene, 1450, 700, 500, 400, {
      type: 'line',
      data: null,
      options: {
        plugins: {
          legend: { display: false },
        },
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'No. of Organisms',
              font: { size: 20 },
            },
            ticks: { font: { size: 20 } },
          },
          x: {
            type: 'linear',
            title: { display: true, text: 'World Age', font: { size: 20 } },
            ticks: { font: { size: 20 } },
          },
        },
      },
    });

    scene.add.existing(this);
    scene.add.existing(this.chart);
    this.add(this.chart);

    this.initListeners();

    scene.time.addEvent({
      delay: 500,
      callback: this.updateChart_,
      callbackScope: this,
      loop: true,
    });

  }

  reset(): void {
    let counts: SpeciesCounts = {};
    this.chartData = { datasets: [] };
    for (var species of Object.values(speciesInfo)) {
      this.chartData.datasets.push({
        data: {},
        fill: false,
        borderColor: Conversion.numberColorToStringColour(species.color),
        pointRadius: 0,
      });

      counts[species.id] = 0;
    }

    this.scene.registry.set(REGISTRY_KEYS.speciesCounts, counts);

    this.chart.chart.data = this.chartData; // Point chart data at correct variable again, since we have reset it earlier
  }

  public updateChart_(): void {
    let worldAge = this.scene.registry.get(REGISTRY_KEYS.worldAge);
    let speciesCounts: SpeciesCounts = this.scene.registry.get(REGISTRY_KEYS.speciesCounts);

    for (var [speciesID, count] of Object.entries(speciesCounts)) {
      let speciesDataset = this.chartData.datasets[parseInt(speciesID)];
      speciesDataset.data[worldAge] = count;
    }

    this.chart.chart.update('none'); // Update chart without animation
  }

  private initListeners(): void {
    this.scene.game.events.on(
      EVENTS_NAME.changeCount,
      (value: number, speciesID: number) => {
        let speciesCounts: SpeciesCounts = this.scene.registry.get(REGISTRY_KEYS.speciesCounts)
        speciesCounts[speciesID] += value;
      }
    );
  }
}
