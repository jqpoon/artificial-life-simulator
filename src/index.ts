import 'phaser';
import { EnvironmentScene } from './scenes';

let configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'canvas',
    width: 1600,
    height: 900,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  backgroundColor: '#FFFFFF',
  scene: EnvironmentScene,
};

new Phaser.Game(configObject);
