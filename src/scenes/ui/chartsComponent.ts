import { Chart } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from './UIComponent';
import { EVENTS_NAME, REGISTRY_KEYS } from '../../consts';
import { OrganismConfigs } from '../../typedefs';

export class ChartsComponent extends Chart implements UIComponent {
  private chartData: any;

  constructor(scene: Phaser.Scene) {
    super(scene, 1450, 600, 500, 500, {
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
              text: 'Number of Organisms',
              font: { size: 30 },
            },
            ticks: { font: { size: 20 } },
          },
          x: {
            type: 'linear',
            title: { display: true, text: 'World Age', font: { size: 30 } },
            ticks: { font: { size: 20 } },
          },
        },
      },
    });

    scene.add.existing(this);

    this.scene.time.addEvent({
      delay: 500,
      callback: this.updateChart_,
      callbackScope: this,
      loop: true,
    });

    this.scene.game.events.on(
      EVENTS_NAME.createNewSpecies,
      (configs: OrganismConfigs) => {
        this.newChartData(configs.color ?? 0);
      }
    );
  }

  reset(): void {
    this.chartData = {
      labels: [],
      datasets: [],
    };
    this.scene.registry.set(REGISTRY_KEYS.chartDataset, []);

    this.chart.data = this.chartData; // Point chart data at correct variable again, since we have reset it earlier
  }

  public newChartData(color: number) {
    // Add new entry to chartDataset in registry, this is used to
    // track the number of organisms for that species
    let chartDataset = this.scene.registry.get(REGISTRY_KEYS.chartDataset);
    chartDataset.push({ count: 0 });

    this.chartData.datasets.push({
      data: Array(this.chartData.labels.length).fill(null), // So that graph starts at correct point in time
      fill: false,
      borderColor: '#' + color.toString(16).padStart(6, '0'), // convert to string hex value, ensuring 0 padding
      pointRadius: 0,
    });
  }

  private updateChart_(): void {
    this.chartData.labels.push(this.scene.registry.get(REGISTRY_KEYS.worldAge));
    let chartDataset = this.scene.registry.get(REGISTRY_KEYS.chartDataset);
    for (var [index, data] of chartDataset.entries()) {
      this.chartData.datasets[index].data.push(data.count);
    }
    this.chart.update('none'); // Update chart without animation
  }
}
