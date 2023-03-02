import { GameObjects, Scene } from 'phaser';

import {
  Chart,
  RoundRectangle,
} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { EVENTS_NAME, REGISTRY_KEYS } from '../consts';

const textDefaults = {
  fontSize: '30px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

const smallerText = {
  fontSize: '20px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

export class UIScene extends Scene {
  private rexUI: RexUIPlugin;
  private chartData: any;
  private chart: Chart;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  }

  create(): void {
    this.resetScene();

    this.time.addEvent({
      delay: 500,
      callback: this.updateChart,
      callbackScope: this,
      loop: true,
    });

    this.initTexts();
    this.initInteractiveElements();
    this.initListeners();
    this.initChart();
  }

  update(time: number, delta: number): void {}

  public newChartData(color: number) {
    // Add new entry to chartDataset in registry, this is used to
    // track the number of organisms for that species
    let chartDataset = this.registry.get(REGISTRY_KEYS.chartDataset);
    chartDataset.push({ count: 0 });

    this.chartData.datasets.push({
      data: Array(this.chartData.labels.length).fill(null), // So that graph starts at correct point in time
      fill: false,
      borderColor: '#' + color.toString(16), // convert to string hex value
      pointRadius: 0,
    });
  }

  private initChart() {
    this.chart = new Chart(this, 1450, 600, 500, 500, {
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
    this.add.existing(this.chart);
  }

  private updateChart(): void {
    this.chartData.labels.push(this.registry.get(REGISTRY_KEYS.worldAge));
    let chartDataset = this.registry.get(REGISTRY_KEYS.chartDataset);
    for (var [index, data] of chartDataset.entries()) {
      this.chartData.datasets[index].data.push(data.count);
    }
    this.chart.chart.update('none'); // Update chart without animation
  }

  private resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();

    this.chartData = {
      labels: [],
      datasets: [],
    };
    this.registry.set(REGISTRY_KEYS.chartDataset, []);
    this.registry.set(REGISTRY_KEYS.worldAge, 0);
  }

  private initInteractiveElements(): void {
    // RESET button
    let rec = new RoundRectangleCanvas(this, 0, 0, 0, 0, 10, 0x333333);
    this.add.existing(rec);
    this.rexUI.add
      .label({
        background: rec,
        text: this.add.text(0, 0, 'Reset'),
        space: { left: 20, right: 20, top: 20, bottom: 20 },
      })
      .setPosition(50, 260)
      .layout()
      .setInteractive()
      .on('pointerdown', () => {
        this.resetScene();
        this.chart.chart.data = this.chartData; // Point chart data at correct variable again, since we have reset it earlier
      }, this);

    // Organism builder
    let background: RoundRectangle = new RoundRectangle(this, {
      width: 1,
      height: 1,
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    this.add.existing(background);

    let sizeText: GameObjects.Text = this.add.text(0, 0, '50', smallerText);
    let speedText: GameObjects.Text = this.add.text(0, 0, '50', smallerText);
    let energyText: GameObjects.Text = this.add.text(0, 0, '50', smallerText);
    let builderPreview: GameObjects.Arc = this.add.circle(0, 0, 12, 0xff0000);

    // Colour of organism
    let colorPicker = this.rexUI.add
      .colorPicker({
        x: 50,
        y: 700,
        svPalette: { width: 128, height: 128 },
        hPalette: { size: 32 },
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 },
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismColour, value);
          builderPreview.fillColor = value;
        },
        valuechangeCallbackScope: this,
        value: 0x9d3857,
      })
      .layout()
      .setDepth(1);

    // Size of organism
    let sizeSlider = this.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismSize, value * 100);
          builderPreview.setScale(value * 5);
          sizeText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    // Speed of organism
    let speedSlider = this.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismSpeed, value * 100);
          speedText.setText(
            (value * 100).toLocaleString('en-us', {
              maximumFractionDigits: 0,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

      // Energy of organism
      let energySlider = this.rexUI.add
      .slider({
        width: 100,
        height: 10,
        valuechangeCallback: (value) => {
          this.registry.set(REGISTRY_KEYS.organismEnergy, value);
          energyText.setText(
            (value).toLocaleString('en-us', {
              maximumFractionDigits: 1,
            })
          );
        },
        input: 'click',
        space: { top: 4, bottom: 4 },
        value: 0.5,

        track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, 0x000000),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x8f8f9c),
      })
      .layout();

    this.rexUI.add
      .sizer({
        x: 180,
        y: 600,
        width: 270,
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(this.add.text(0, 0, 'Organism Preview', smallerText))
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(builderPreview)
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Size', smallerText))
          .add(sizeSlider)
          .add(sizeText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Speed', smallerText))
          .add(speedSlider)
          .add(speedText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Energy Loss', smallerText))
          .add(energySlider)
          .add(energyText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Colour', smallerText))
          .add(colorPicker)
      )
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);
  }

  private initListeners(): void {
    this.game.events.on(
      EVENTS_NAME.changeCount,
      (value: number, speciesCount: number) => {
        let chartDataset = this.registry.get(REGISTRY_KEYS.chartDataset);
        chartDataset[speciesCount].count += value;
      }
    );
  }
}
