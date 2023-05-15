import { Scene } from 'phaser';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }

  preload(): void {
    Chart.register(annotationPlugin);
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js');
    this.load.script('chartjs-plugin-annotation', 'https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/2.2.1/chartjs-plugin-annotation.min.js');
  }

  create(): void {
    this.scene.start('environment-scene');
    this.scene.start('ui-scene');
  }
}
