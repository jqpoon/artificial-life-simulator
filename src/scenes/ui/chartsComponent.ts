import { Chart } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { UIComponent } from './UIComponent';
import { REGISTRY_KEYS } from '../../consts';

export class ChartsComponent implements UIComponent {
  private scene: Phaser.Scene;
  private chartData: any;
  private chart: Chart;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  preload(): void {
    this.scene.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  }

  create(): void {
    this.initChart();
    this.scene.time.addEvent({
      delay: 500,
      callback: this.updateChart,
      callbackScope: this,
      loop: true,
    });
  }

  reset(): void {
    this.chartData = {
      labels: [],
      datasets: [],
    };
    this.scene.registry.set(REGISTRY_KEYS.chartDataset, []);

    this.chart.chart.data = this.chartData; // Point chart data at correct variable again, since we have reset it earlier
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

  private initChart() {
    this.chart = new Chart(this.scene, 1450, 600, 500, 500, {
      type: 'line',
      data: this.chartData,
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
    this.scene.add.existing(this.chart);
  }

  private updateChart(): void {
    this.chartData.labels.push(this.scene.registry.get(REGISTRY_KEYS.worldAge));
    let chartDataset = this.scene.registry.get(REGISTRY_KEYS.chartDataset);
    for (var [index, data] of chartDataset.entries()) {
      this.chartData.datasets[index].data.push(data.count);
    }
    this.chart.chart.update('none'); // Update chart without animation
  }
}
