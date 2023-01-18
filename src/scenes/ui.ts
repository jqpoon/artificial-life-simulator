import { GameObjects, Scene } from 'phaser';

import { Label, Chart } from 'phaser3-rex-plugins/templates/ui/ui-components.js';
import RoundRectangleCanvas from 'phaser3-rex-plugins/plugins/roundrectanglecanvas.js';

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
  private countText: GameObjects.Text;
  private count: number = 0;
  private worldAgeText: GameObjects.Text;
  private worldAge: number = 0;

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

    this.chart = new Chart(this, 1400, 500, 500, 500, {
      type: 'line',
      data: this.chartData,
      options: {
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
      delay: 100,
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
    this.chart.chart.update();
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
      .on('pointerdown', () => {
        let envScene = this.scene.get('environment-scene');
        envScene.scene.restart();
        this.count = 0;
        this.worldAge = 0;
      });

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
  }

  private initTexts(): void {
    this.add.text(0, 0, "Jia's Life\nSimulator", textDefaults);
    this.add.text(
      1200,
      50,
      'This is an artificial life simulator!\n\nControl simulation parameters by using the controls on the left.',
      textDefaults
    );

    this.timeScale = this.add.text(0, 120, 'Speed: 5.0', textDefaults);
    this.countText = this.add.text(0, 240, 'Count: 1', textDefaults);
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

    this.game.events.on(EVENTS_NAME.increaseCount, (amount: number) => {
      this.count += amount;
      this.countText.setText('Count: ' + this.count);
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
