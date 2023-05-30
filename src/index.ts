import 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { EnvironmentScene } from './scenes/environment';
import { LoadingScene } from './scenes/loading';
import { UIScene } from './scenes/ui/mainUI';
import './custom.scss';

let configObject: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'canvas',
    width: 1920,
    height: 1080,
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
  backgroundColor: '#FFFFFF',
  scene: [LoadingScene, UIScene, EnvironmentScene],
  dom: {
    createContainer: true,
  },
};

new Phaser.Game(configObject);
