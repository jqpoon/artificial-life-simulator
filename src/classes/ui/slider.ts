import { Scene } from 'phaser';
import Slider from 'phaser3-rex-plugins/plugins/slider.js';

import { SliderConfigs } from '../../typedefs';

export class SliderBar {
  constructor(
    scene: Scene,
    valuechangeCallback: (newValue: number) => void,
    valuechangeCallbackScope: any,
    config: SliderConfigs
  ) {
    let circle = scene.add.circle(0, 0, 12, 0xbbded6);
    circle.setStrokeStyle(1, 0x000000);
    circle.setDepth(1);

    let line = scene.add.line(0, 0, config.x1, config.y1, config.x2, config.y2, 0x000000);
    line.setOrigin(0, 0);

    let slider = new Slider(circle, {
      endPoints: [
        { x: config.x1, y: config.y1 },
        { x: config.x2, y: config.y2 },
      ],
      value: 0.5,
      enable: true,
      valuechangeCallback: valuechangeCallback,
      valuechangeCallbackScope: valuechangeCallbackScope,
    });
  }
}
