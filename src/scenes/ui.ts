import { GameObjects, Scene } from 'phaser';

import {
  Label,
  Chart,
} from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';
import { ColorPicker } from 'phaser3-rex-plugins/templates/ui/ui-components.js';

import { SliderBar } from '../classes/ui/slider';
import { EVENTS_NAME } from '../consts';

const textDefaults = {
  fontSize: '30px',
  color: '#000',
  fontFamily: 'Helvetica',
  align: 'center',
  wordWrap: { width: 600 },
};

export class UIScene extends Scene {
  private timeScale: GameObjects.Text;
  private count: number = 0;
  private worldAgeText: GameObjects.Text;
  private worldAge: number = 0;
  public size: number = 50;
  private sizeText: GameObjects.Text;

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
      datasets: [
        {
          label: 'Speed = 100, Size = 25',
          data: [],
          fill: false,
          borderColor: '#FF0000',
          pointRadius: 0,
        },
      ],
    };

    this.chart = new Chart(this, 1450, 600, 500, 500, {
      type: 'line',
      data: this.chartData,
      options: {
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: 'Organism Count',
          },
        },
        animation: false,
        scales: {
          y: {
            beginAtZero: true,
          },
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

    this.time.addEvent({
      delay: 500,
      callback: this.updateChart,
      callbackScope: this,
      loop: true,
    });

    this.initTexts();
    this.initListeners();
    this.initInteractiveElements();
  }

  private updateChart(): void {
    this.chartData.labels.push(this.worldAge);
    this.chartData.datasets[0].data.push(this.count);
    this.chart.chart.update('none');
  }

  private resetScene(): void {
    let envScene = this.scene.get('environment-scene');
    envScene.scene.restart();
    this.count = 0;
    this.worldAge = 0;

    this.chartData.labels = Array();
    this.chartData.datasets[0].data = Array();
  }

  private initInteractiveElements(): void {
    // RESET button
    let rec = new RoundRectangleCanvas(this, 0, 0, 0, 0, 10, 0x333333);
    this.add.existing(rec);
    let btn = new Label(this, {
      background: rec,
      text: this.add.text(0, 0, 'Reset'),
      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
      },
    })
      .setPosition(50, 350)
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
      {
        x1: 15,
        y1: 100,
        x2: 140,
        y2: 100,
      }
    );

    // Size of blob
    new SliderBar(
      this,
      (value) => {
        this.size = value * 100;
        this.sizeText.setText(
          'Size: ' +
            (value * 100).toLocaleString('en-us', { maximumFractionDigits: 0 })
        );
      },
      this,
      {
        x1: 15,
        y1: 500,
        x2: 140,
        y2: 500,
      }
    );

    // Colour of blob
    let colourPicker = new ColorPicker(this, {
      x: 50,
      y: 700,

      svPalette: {
        width: 128,
        height: 128,
      },
      hPalette: {
        size: 32,
      },

      space: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
        item: 10,
      },

      valuechangeCallback: (value) => {
        this.registry.set('color', value);
      },

      valuechangeCallbackScope: this,

      value: 0xFF0000,
    }).layout();
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);

    this.timeScale = this.add.text(0, 120, 'Speed: 5.0', textDefaults);
    this.worldAgeText = this.add.text(0, 180, 'World Age: 0', textDefaults);

    this.sizeText = this.add.text(0, 520, 'Size: 50', textDefaults);
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

    this.game.events.on(EVENTS_NAME.increaseCount, (amount: number) => {
      this.count += amount;
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
