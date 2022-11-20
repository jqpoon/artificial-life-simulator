import { Scene } from 'phaser';

export class LoadingScene extends Scene {
  constructor() {
    super('loading-scene');
  }
  create(): void {
    this.scene.start('environment-scene');
    this.scene.start('ui-scene');
  }
}
