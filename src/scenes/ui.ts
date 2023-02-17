import { GameObjects, Scene } from 'phaser';

import {
  Label,
  Chart,
  Sizer,
  RoundRectangle,
  Slider,
} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';
import { ColorPicker } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

import { SliderBar } from '../classes/ui/slider';
import { EVENTS_NAME } from '../consts';

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
  private timeScale: GameObjects.Text;
  private count: number = 0;
  private worldAgeText: GameObjects.Text;
  private worldAge: number = 0;
  public size: number = 50;
  private sizeText: GameObjects.Text;
  private speedText: GameObjects.Text;
  private builderPreview: Phaser.GameObjects.Arc;

  private chartData: any;
  private chart: Chart;

  constructor() {
    super('ui-scene');
  }

  preload(): void {
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
  }

  create(): void {
    this.chartData = {
      labels: [],
      datasets: [],
    };

    this.chart = new Chart(this, 1450, 600, 500, 500, {
      type: 'line',
      data: this.chartData,
      options: {
        plugins: {
          legend: { display: false },
        },
        animation: false,
        scales: {
          y: { beginAtZero: true },
          x: {
            type: 'linear',
            ticks: {
              display: false,
            },
          },
        },
      },
    });
    this.add.existing(this.chart);
    this.registry.set('chartDataset', []);

    this.time.addEvent({
      delay: 500,
      callback: this.updateChart,
      callbackScope: this,
      loop: true,
    });

    this.initTexts();
    this.initInteractiveElements();
    this.initListeners();
  }

  public newChartData(color: number) {
    // Add new entry to chartDataset in registry, this is used to
    // track the number of organisms for that species
    let chartDataset = this.registry.get('chartDataset');
    chartDataset.push({count: 0});

    this.chartData.datasets.push({
      data: [],
      fill: false,
      borderColor: '#' + color.toString(16), // convert to string hex value
      pointRadius: 0,
    });
  }

  private updateChart(): void {
    this.chartData.labels.push(this.worldAge);
    let chartDataset = this.registry.get('chartDataset');
    for (var [index, data] of chartDataset.entries()) {
      this.chartData.datasets[index].data.push(data.count);
    }
    this.chart.chart.update('none'); // Update chart without animation
  }

  private resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();
    this.count = 0;
    this.worldAge = 0;

    this.chartData.labels = Array();
    this.chartData.datasets = Array();
    this.registry.set('chartDataset', []);
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
      .on('pointerdown', this.resetScene, this);

    // Simulation speed control
    new SliderBar(
      this,
      (value) => {
        this.game.events.emit(EVENTS_NAME.updateTimeScale, value * 10);
      },
      this,
      { x1: 15, y1: 100, x2: 140, y2: 100 }
    );

    // Organism builder
    let background: RoundRectangle = new RoundRectangle(this, {
      width: 1,
      height: 1,
      radius: 10,
      color: 0xe9e9ed,
      strokeColor: 0x8f8f9c,
    }).setDepth(-1);
    this.add.existing(background);

    this.sizeText = this.add.text(0, 0, '50', smallerText);
    this.speedText = this.add.text(0, 0, '50', smallerText);
    this.builderPreview = this.add.circle(0, 0, 12, 0xff0000);

    // Colour of organism
    let colorPicker = this.rexUI.add
      .colorPicker({
        x: 50,
        y: 700,
        svPalette: { width: 128, height: 128 },
        hPalette: { size: 32 },
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 10 },
        valuechangeCallback: (value) => {
          this.registry.set('color', value);
          this.builderPreview.fillColor = value;
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
          this.size = value * 100;
          this.builderPreview.setScale(value * 5);
          this.sizeText.setText(
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
        this.registry.set('speed', value * 100)
        this.speedText.setText(
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

    this.rexUI.add
      .sizer({
        x: 140,
        y: 600,
        width: 270,
        orientation: 'y',
        space: { left: 10, right: 10, top: 10, bottom: 10, item: 20 },
      })
      .add(this.add.text(0, 0, 'Organism Preview', smallerText))
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.builderPreview)
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(this.add.zone(0, 0, 0, 0), 10, 'center')
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Size', smallerText))
          .add(sizeSlider)
          .add(this.sizeText)
      )
      .add(
        this.rexUI.add
          .sizer({ orientation: 'x', space: { item: 30 } })
          .add(this.add.text(0, 0, 'Speed', smallerText))
          .add(speedSlider)
          .add(this.speedText)
      )
      .add(this.rexUI.add
        .sizer({ orientation: 'x', space: { item: 30 } })
        .add(this.add.text(0, 0, 'Colour', smallerText))
        .add(colorPicker))
      .addBackground(background)
      .layout()
      .setDepth(-1);
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);

    this.timeScale = this.add.text(0, 120, 'Speed: 5.0', textDefaults);
    this.worldAgeText = this.add.text(0, 180, 'World Age: 0', textDefaults);
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.updateTimeScale, (value: number) => {
      this.timeScale.setText(
        'Speed: ' +
          value.toLocaleString('en-us', {
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          })
      );
    });

    this.game.events.on(EVENTS_NAME.increaseCount, (value: number, speciesCount: number) => {
       let chartDataset = this.registry.get('chartDataset');
       chartDataset[speciesCount].count += value;
    });

    this.game.events.on(EVENTS_NAME.updateWorldAge, (age: number) => {
      this.worldAge += age;
      this.worldAgeText.setText(
        'World Age: ' +
          this.worldAge.toLocaleString('en-us', { maximumFractionDigits: 0 })
      );
    });
  }
}
