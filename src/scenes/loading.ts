import { Scene } from 'phaser';
import { Chart } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }

  preload(): void {
    this.load.script('chartjs', 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.js');
    this.load.script('chartjs-plugin-annotation', 'https://cdnjs.cloudflare.com/ajax/libs/chartjs-plugin-annotation/2.2.1/chartjs-plugin-annotation.min.js');
    Chart.register(annotationPlugin);
  }

  create(): void {
    this.scene.start('environment-scene');
    this.scene.start('ui-scene');
  }
}
