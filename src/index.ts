import 'phaser';
import { EnvironmentScene } from './scenes';
import { LoadingScene } from './scenes';
import { UIScene } from './scenes/ui';

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
      debug: true,
    },
  },
  backgroundColor: '#FFFFFF',
  scene: [LoadingScene, UIScene, EnvironmentScene],
};

new Phaser.Game(configObject);
