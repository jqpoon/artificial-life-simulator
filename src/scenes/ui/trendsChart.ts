import { Chart } from "phaser3-rex-plugins/templates/ui/ui-components";
import { UIScene } from "./mainUI";
import { ChartComponent } from "./chartComponent";
import { REGISTRY_KEYS } from "../../consts";
import { EnvironmentScene } from "../environment";
import { Organism } from "../../classes/entities/organism";

export class TrendsChart extends ChartComponent {
  private chartData: any;
  private chart: Chart;

  constructor(scene: UIScene) {
    super(scene, {
      x: 1450,
      y: 300,
      height: 300,
      width: 400,
    });

    this.chart = new Chart(scene, 1450, 300, 500, 400, {
      type: 'line',
      data: null,
      options: {
        plugins: {
          legend: { display: false },
          annotation: {
            annotations: {
              annotation1: {
                type: 'line',
                borderColor: 'black',
                borderWidth: 3,
                label: {
                  backgroundColor: 'red',
                  content: 'Minimum Size',
                  display: true
                },
                scaleID: 'y',
                value: 10
              },
              annotation2: {
                type: 'line',
                borderColor: 'black',
                borderWidth: 3,
                label: {
                  backgroundColor: 'red',
                  content: 'Maximum Size',
                  display: true
                },
                scaleID: 'y',
                value: 100
              },
            }
          }
        },
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 120,
            title: {
              display: true,
              text: 'Average Size',
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
    scene.add.existing(this.chart);
    this.add(this.chart);
  }

  reset(): void {
    this.chartData = {
      labels: [],
      datasets: [{
        data: Array(),
        fill: false,
        borderColor: 0xffffff,
        pointRadius: 0,
      }],
    };
    this.scene.registry.set(REGISTRY_KEYS.trendsDataset, []);

    this.chart.chart.data = this.chartData; // Point chart data at correct variable again, since we have reset it earlier
  }

  public updateChart_(): void {
    this.chartData.labels.push(this.scene.registry.get(REGISTRY_KEYS.worldAge));

    let totalSize = 0;
    let count = 0;
    let environmentScene = this.scene.scene.get('environment-scene');
    let organisms = (environmentScene as EnvironmentScene).organisms;
    organisms.children.each((organism) => {
      totalSize += (organism as Organism).height;
      count += 1;
      return true; // Needed to fit the type description
    });

    this.chartData.datasets[0].data.push(totalSize / count);

    this.chart.chart.update('none'); // Update chart without animation
  }
}
