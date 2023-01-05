import { Scene } from 'phaser';
import Slider from 'phaser3-rex-plugins/plugins/slider.js';

export class SliderBar {
  constructor(scene: Scene, valuechangeCallback: (newValue: number) => void, valuechangeCallbackScope: any) {
    let circle = scene.add.circle(0, 0, 12, 0xbbded6);
    circle.setStrokeStyle(1, 0x000000);
    circle.setDepth(1);

    let line = scene.add.line(0, 0, 15, 100, 140, 100, 0x000000);
    line.setOrigin(0, 0);

    let slider = new Slider(circle, {
      endPoints: [
        { x: 15, y: 100 },
        { x: 140, y: 100 },
      ],
      value: 0.1,
      enable: true,
      valuechangeCallback: valuechangeCallback,
      valuechangeCallbackScope: valuechangeCallbackScope,
    });
  }
}
